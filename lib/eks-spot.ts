import { Stack, StackProps, Construct, Resource, ResourceProps, PhysicalName, Fn, CfnOutput, Tag } from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';
import { renderAmazonLinuxUserData } from './user-data';
import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';
import { LaunchTemplate } from './launch-template';


const DEFAULT_INSTANCE_TYPE = 't3.large'

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

export enum ClusterVersion {
  KUBERNETES_114 = '1.14',
  KUBERNETES_115 = '1.15',
  KUBERNETES_116 = '1.16',
}

export interface EksSpotClusterProps extends StackProps {
    // readonly cluster: eks.Cluster;
    readonly clusterAttributes?: eks.ClusterAttributes;
    readonly clusterVersion: ClusterVersion;
    readonly instanceRole?: iam.IRole;
    // readonly defaultInstanceType: ec2.InstanceType;
    // readonly minCapacity?: number;
    // readonly maxCapacity?: number;
    // readonly blockDuration?: BlockDuration;
    readonly instanceInterruptionBehavior?: InstanceInterruptionBehavior;
    readonly kubectlEnabled?: boolean;
}


export class EksSpotCluster extends Resource {
  readonly cluster: eks.Cluster;
  // readonly clusterName: string;
  readonly clusterVersion: ClusterVersion;
  readonly instanceRole: iam.IRole;
  readonly instanceProfile: iam.CfnInstanceProfile;
  readonly vpc: ec2.IVpc;
  // readonly kubectlEnabled: boolean;
  // private _awsAuth?: AwsAuth;
  /**
   * If this cluster is kubectl-enabled, returns the `ClusterResource` object
   * that manages it. If this cluster is not kubectl-enabled (i.e. uses the
   * stock `CfnCluster`), this is `undefined`.
   */

  constructor(scope: Construct, id: string, props: EksSpotClusterProps) {
    super(scope, id);

    // this.kubectlEnabled = props.kubectlEnabled === undefined ? true : props.kubectlEnabled;

    // this.cluster = props.cluster;
    this.clusterVersion = props.clusterVersion;

    // use an existing vpc or create a new one
    this.vpc = this.node.tryGetContext('use_default_vpc') === '1' ?
      ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true }) :
      this.node.tryGetContext('use_vpc_id') ?
        ec2.Vpc.fromLookup(this, 'Vpc', { vpcId: this.node.tryGetContext('use_vpc_id') }) :
        new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    // this.vpc = ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true })
    const clusterAdmin = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal()
    });

    // this.cluster = props.clusterAttributes ? 
    //   eks.Cluster.fromClusterAttributes(this, 'Cluster', props.clusterAttributes) : 
    //   new eks.Cluster(this, 'Cluster', {
    //     vpc: this.vpc,
    //     mastersRole: clusterAdmin,
    //     defaultCapacity: 0,
    //     version: this.clusterVersion
    //   })

    this.cluster= new eks.Cluster(this, 'Cluster', {
        vpc: this.vpc,
        mastersRole: clusterAdmin,
        defaultCapacity: 0,
        version: this.clusterVersion,
      })

    // this.cluster.addCapacity('NG', {
    //   minCapacity:1,
    //   instanceType: new ec2.InstanceType('t3.micro'),
    // })

    // super(scope, id, {
    //   vpc: ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true }),
    //   mastersRole: clusterAdmin,
    //   defaultCapacity: 0,
    //   version: props.clusterVersion
    // })



    // this.clusterName = this.cluster.clusterName

    // const capacityAsg =  this.cluster.addCapacity('SpotCapacity', {
    //   instanceType: props.defaultInstanceType,
    //   minCapacity: props.minCapacity ?? 2,
    //   maxCapacity: props.maxCapacity,
    //   // placeholder
    //   spotPrice: '0.01'
    // })

    // const cfnInstanceProfile = capacityAsg.node.tryFindChild('InstanceProfile') as iam.CfnInstanceProfile



    // const cfnAsg = capacityAsg.node.tryFindChild('ASG') as autoscaling.CfnAutoScalingGroup
    // cfnAsg.addPropertyOverride('LaunchTemplate', {
    //   'LaunchTemplateId': lt.ref,
    //   'Version': lt.attrLatestVersionNumber.toString()
    // })
    
    // remote the LaunchConfigurationName
    // cfnAsg.addPropertyDeletionOverride('LaunchConfigurationName')
  }


  public addSpotFleet(id: string, props: BaseSpotFleetProps) {
    new SpotFleet(this, id, {
      cluster: this,
      ...props
      // blockDuration: props.blockDuration,
      // clusterVersion: this.clusterVersion,
      // defaultInstanceType: new ec2.InstanceType(DEFAULT_INSTANCE_TYPE),
      // launchTemplate: new LaunchTemplate(),
    })
  }
}

export interface BaseSpotFleetProps extends ResourceProps {
  // readonly launchTemplate: LaunchTemplate;
  readonly defaultInstanceType?: ec2.InstanceType;
  // readonly clusterVersion: ClusterVersion;
  readonly blockDuration?: BlockDuration;
  readonly instanceInterruptionBehavior ?: InstanceInterruptionBehavior;
  readonly instanceRole?: iam.Role;
  readonly targetCapacity?: number;
  readonly mapRole?: boolean;
  readonly bootstrapEnabled?: boolean;
  readonly validFrom?: string;
  readonly validUntil?: string;
  readonly terminateInstancesWithExpiration?: boolean;
}


export interface SpotFleetProps extends BaseSpotFleetProps {
  readonly cluster: EksSpotCluster;
  readonly launchTemplate?: LaunchTemplate;
}

export class SpotFleet extends Resource {
  readonly instanceRole: iam.IRole;
  readonly clusterStack: EksSpotCluster;
  readonly defaultInstanceType: ec2.InstanceType;
  readonly launchTemplate: LaunchTemplate;
  readonly targetCapacity?: number;
  readonly spotFleetId: string;


  constructor(scope: Construct, id: string, props: SpotFleetProps) {
    super(scope, id, props)

    this.spotFleetId = id
    this.clusterStack = props.cluster
    this.launchTemplate = props.launchTemplate ?? new LaunchTemplate()
    this.targetCapacity = props.targetCapacity
    this.defaultInstanceType = props.defaultInstanceType ?? new ec2.InstanceType(DEFAULT_INSTANCE_TYPE)

    // isntance role
    this.instanceRole = props.instanceRole || new iam.Role(this, 'InstanceRole', {
      roleName: PhysicalName.GENERATE_IF_NEEDED,
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    this.instanceRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKSWorkerNodePolicy'));
    this.instanceRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEKS_CNI_Policy'));
    this.instanceRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryReadOnly'));



    const instanceProfile = new iam.CfnInstanceProfile(this, 'InstanceProfile', {
      roles: [this.instanceRole.roleName]
    })

    const sg = new ec2.SecurityGroup(this, 'SpotFleetSg', {
      vpc: this.clusterStack.cluster.vpc
    })

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

    const config = this.launchTemplate.bind(this)

    // const userData = renderAmazonLinuxUserData(cdk.Stack.of(this), this.cluster.clusterName, config.spotfleet);
    const userData = ec2.UserData.forLinux()
    userData.addCommands(...renderAmazonLinuxUserData(Stack.of(this), this.clusterStack.cluster.clusterName, config.spotfleet));

    this.defaultInstanceType = props.defaultInstanceType ?? new ec2.InstanceType(DEFAULT_INSTANCE_TYPE)

    const lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
      launchTemplateData: {
        imageId: new eks.EksOptimizedImage({
          nodeType: nodeTypeForInstanceType(this.defaultInstanceType),
          kubernetesVersion: props.cluster.clusterVersion,
        }).getImage(this).imageId,
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
              }
            
            ]
          }
        ],
        instanceMarketOptions: {
          marketType: 'spot',
          spotOptions: {
            blockDurationMinutes: props.blockDuration ?? BlockDuration.ONE_HOUR,
            instanceInterruptionBehavior: props.instanceInterruptionBehavior ?? InstanceInterruptionBehavior.TERMINATE
          }
        },
        // userData: cdk.Fn.base64(capacityAsg.userData.render()),
        userData: Fn.base64(userData.render()),
        securityGroupIds: sg.connections.securityGroups.map(m => m.securityGroupId),
        iamInstanceProfile: {
          arn: instanceProfile.attrArn
        }
      }
    })

    // // EKS Required Tags
    // Tag.add(lt, `kubernetes.io/cluster/${this.clusterStack.cluster.clusterName}`, 'owned', {
    //   applyToLaunchedInstances: true,
    // });

    // Tag.add(lt, 'Name', `${Stack.of(this).stackName}/Cluster/${this.spotFleetId}`, {
    //   applyToLaunchedInstances: true,
    // })


    const spotFleetRole = new iam.Role(this, 'FleetRole', {
      assumedBy: new iam.ServicePrincipal('spotfleet.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2SpotFleetTaggingRole')
      ]
    })


    const overrides = []
    for (const s of this.clusterStack.cluster.vpc.privateSubnets) {
      overrides.push({ subnetId: s.subnetId })
    }
    const spotFleet = new ec2.CfnSpotFleet(this, id, {
      spotFleetRequestConfigData: {
        launchTemplateConfigs: [
          {
            launchTemplateSpecification: {
              launchTemplateId: lt.ref,
              version: lt.attrLatestVersionNumber
            },
            overrides,
          }
        ],
        iamFleetRole: spotFleetRole.roleArn,
        targetCapacity: props.targetCapacity ?? 1,
        validFrom: props.validFrom,
        validUntil: props.validUntil,
        terminateInstancesWithExpiration: props.terminateInstancesWithExpiration,
      }
    })

    this.clusterStack.cluster.awsAuth.addRoleMapping(this.instanceRole, {
      username: 'system:node:{{EC2PrivateDNSName}}',
      groups: [
        'system:bootstrappers',
        'system:nodes',
      ],
    });


    // do not attempt to map the role if `kubectl` is not enabled for this
    // cluster or if `mapRole` is set to false. By default this should happen.
    // const mapRole = props.mapRole === undefined ? true : props.mapRole;
    // if (mapRole && this.clusterStack.cluster.kubectlEnabled) {
    //   // see https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html
    //   this.clusterStack.cluster.awsAuth.addRoleMapping(this.instanceRole, {
    //     username: 'system:node:{{EC2PrivateDNSName}}',
    //     groups: [
    //       'system:bootstrappers',
    //       'system:nodes',
    //     ],
    //   });
    // } else {
    //   // since we are not mapping the instance role to RBAC, synthesize an
    //   // output so it can be pasted into `aws-auth-cm.yaml`
    //   new CfnOutput(this, 'InstanceRoleARN', {
    //     value: this.instanceRole.roleArn,
    //   });
    // }
    
  }
}

const GPU_INSTANCETYPES = ['p2', 'p3', 'g4'];

function nodeTypeForInstanceType(instanceType: ec2.InstanceType) {
  return GPU_INSTANCETYPES.includes(instanceType.toString().substring(0, 2)) ? eks.NodeType.GPU : eks.NodeType.STANDARD;
}