import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import { Stack, StackProps, Construct, Resource, ResourceProps, PhysicalName, Fn } from '@aws-cdk/core';
import { LaunchTemplate, ILaunchtemplate } from './launch-template';
import { renderAmazonLinuxUserData } from './user-data';

const DEFAULT_INSTANCE_TYPE = 't3.large';

export enum BlockDuration {
  ONE_HOUR = 60,
  TWO_HOURS = 120,
  THREE_HOURS = 180,
  FOUR_HOURS = 240,
  FIVE_HOURS = 300,
  SIX_HOURS = 360
}

export enum InstanceInterruptionBehavior {
  HIBERNATE = 'hibernate',
  STOP = 'stop',
  TERMINATE = 'terminate'
}

export interface EksSpotClusterProps extends StackProps {
  readonly clusterAttributes?: eks.ClusterAttributes;
  readonly clusterVersion: eks.KubernetesVersion;
  readonly instanceRole?: iam.IRole;
  readonly instanceInterruptionBehavior?: InstanceInterruptionBehavior;
  readonly kubectlEnabled?: boolean;
  /**
     * Specify a custom AMI ID for your spot fleet. By default the Amazon EKS-optimized
     * AMI will be selected.
     *
     * @default - none
     */
  readonly customAmiId?: string;
}

export class EksSpotCluster extends Resource {
  readonly cluster: eks.Cluster;
  readonly clusterVersion: eks.KubernetesVersion;
  // readonly instanceRole: iam.IRole;
  // readonly instanceProfile: iam.CfnInstanceProfile;
  readonly vpc: ec2.IVpc;

  constructor(scope: Construct, id: string, props: EksSpotClusterProps) {
    super(scope, id);

    // this.cluster = props.cluster;
    this.clusterVersion = props.clusterVersion;

    // use an existing vpc or create a new one
    this.vpc = this.node.tryGetContext('use_default_vpc') === '1' ?
      ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true }) :
      this.node.tryGetContext('use_vpc_id') ?
        ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: this.node.tryGetContext('use_vpc_id') }) :
        new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    const clusterAdmin = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    this.cluster= new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      mastersRole: clusterAdmin,
      defaultCapacity: 0,
      version: this.clusterVersion,
    });
  }

  public addSpotFleet(id: string, props: BaseSpotFleetProps) {
    new SpotFleet(this, id, {
      cluster: this,
      ...props,
    });
  }

  public addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  public addHours(date: Date, hours: number): Date {
    date.setHours(date.getHours() + hours);
    return date;
  }

  public addMinutes(date: Date, minutes: number): Date {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }
}

export interface BaseSpotFleetProps extends ResourceProps {
  readonly defaultInstanceType?: ec2.InstanceType;
  readonly blockDuration?: BlockDuration;
  readonly instanceInterruptionBehavior ?: InstanceInterruptionBehavior;
  readonly instanceRole?: iam.Role;
  readonly targetCapacity?: number;
  readonly mapRole?: boolean;
  readonly bootstrapEnabled?: boolean;
  readonly validFrom?: string;
  readonly validUntil?: string;
  readonly terminateInstancesWithExpiration?: boolean;
  readonly customAmiId?: string;
}


export interface SpotFleetProps extends BaseSpotFleetProps {
  readonly cluster: EksSpotCluster;
  readonly launchTemplate?: ILaunchtemplate;
}

export class SpotFleet extends Resource {
  readonly instanceRole: iam.IRole;
  readonly clusterStack: EksSpotCluster;
  readonly defaultInstanceType: ec2.InstanceType;
  readonly targetCapacity?: number;
  readonly spotFleetId: string;
  readonly launchTemplate: ILaunchtemplate;


  constructor(scope: Construct, id: string, props: SpotFleetProps) {
    super(scope, id, props);

    this.spotFleetId = id;
    this.clusterStack = props.cluster;
    this.launchTemplate = props.launchTemplate ?? new LaunchTemplate();
    this.targetCapacity = props.targetCapacity;
    this.defaultInstanceType = props.defaultInstanceType ?? new ec2.InstanceType(DEFAULT_INSTANCE_TYPE);

    // isntance role
    this.instanceRole = props.instanceRole || new iam.Role(this, 'InstanceRole', {
      roleName: PhysicalName.GENERATE_IF_NEEDED,
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    this.instanceRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
    this.instanceRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
    this.instanceRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));

    const instanceProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
      roles: [this.instanceRole.roleName],
    });

    const sg = new ec2.SecurityGroup(this, 'SpotFleetSg', {
      vpc: this.clusterStack.cluster.vpc,
    });

    // self rules
    sg.connections.allowInternally(ec2.Port.allTraffic());

    // Cluster to:nodes rules
    sg.connections.allowFrom(this.clusterStack.cluster, ec2.Port.tcp(443));
    sg.connections.allowFrom(this.clusterStack.cluster, ec2.Port.tcpRange(1025, 65535));

    // Allow HTTPS from Nodes to Cluster
    sg.connections.allowTo(this.clusterStack.cluster, ec2.Port.tcp(443));

    // Allow all node outbound traffic
    sg.connections.allowToAnyIpv4(ec2.Port.allTcp());
    sg.connections.allowToAnyIpv4(ec2.Port.allUdp());
    sg.connections.allowToAnyIpv4(ec2.Port.allIcmp());

    const config = this.launchTemplate.bind(this);

    // const userData = renderAmazonLinuxUserData(cdk.Stack.of(this), this.cluster.clusterName, config.spotfleet);
    const userData = ec2.UserData.forLinux();
    userData.addCommands(...renderAmazonLinuxUserData(Stack.of(this), this.clusterStack.cluster.clusterName, config.spotfleet));

    this.defaultInstanceType = props.defaultInstanceType ?? new ec2.InstanceType(DEFAULT_INSTANCE_TYPE);

    const imageId = props.customAmiId ?? new eks.EksOptimizedImage({
      nodeType: nodeTypeForInstanceType(this.defaultInstanceType),
      kubernetesVersion: props.cluster.clusterVersion.version,
    }).getImage(this).imageId;

    const lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
      launchTemplateData: {
        imageId,
        instanceType: this.defaultInstanceType.toString(),
        tagSpecifications: [
          {
            resourceType: 'instance',
            tags: [
              {
                key: 'Name',
                value: `${Stack.of(this).stackName}/Cluster/${this.spotFleetId}`,
              },
              {
                key: `kubernetes.io/cluster/${this.clusterStack.cluster.clusterName}`,
                value: 'owned',
              },

            ],
          },
        ],
        instanceMarketOptions: {
          marketType: 'spot',
          spotOptions: {
            blockDurationMinutes: props.blockDuration ?? BlockDuration.ONE_HOUR,
            instanceInterruptionBehavior: props.instanceInterruptionBehavior ?? InstanceInterruptionBehavior.TERMINATE,
          },
        },
        // userData: cdk.Fn.base64(capacityAsg.userData.render()),
        userData: Fn.base64(userData.render()),
        securityGroupIds: sg.connections.securityGroups.map(m => m.securityGroupId),
        iamInstanceProfile: {
          arn: instanceProfile.attrArn,
        },
      },
    });

    const spotFleetRole = new iam.Role(this, 'FleetRole', {
      assumedBy: new iam.ServicePrincipal('spotfleet.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2SpotFleetTaggingRole'),
      ],
    });


    const overrides = [];
    for (const s of this.clusterStack.cluster.vpc.privateSubnets) {
      overrides.push({ subnetId: s.subnetId });
    }
    new ec2.CfnSpotFleet(this, id, {
      spotFleetRequestConfigData: {
        launchTemplateConfigs: [
          {
            launchTemplateSpecification: {
              launchTemplateId: lt.ref,
              version: lt.attrLatestVersionNumber,
            },
            overrides,
          },
        ],
        iamFleetRole: spotFleetRole.roleArn,
        targetCapacity: props.targetCapacity ?? 1,
        validFrom: props.validFrom,
        validUntil: props.validUntil,
        terminateInstancesWithExpiration: props.terminateInstancesWithExpiration,
      },
    });

    this.clusterStack.cluster.awsAuth.addRoleMapping(this.instanceRole, {
      username: 'system:node:{{EC2PrivateDNSName}}',
      groups: [
        'system:bootstrappers',
        'system:nodes',
      ],
    });

  }
}

const GPU_INSTANCETYPES = ['p2', 'p3', 'g4'];

function nodeTypeForInstanceType(instanceType: ec2.InstanceType) {
  return GPU_INSTANCETYPES.includes(instanceType.toString().substring(0, 2)) ? eks.NodeType.GPU : eks.NodeType.STANDARD;
}
