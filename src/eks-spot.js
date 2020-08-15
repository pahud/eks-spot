"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotFleet = exports.EksSpotCluster = exports.InstanceInterruptionBehavior = exports.BlockDuration = void 0;
const core_1 = require("@aws-cdk/core");
const eks = require("@aws-cdk/aws-eks");
const user_data_1 = require("./user-data");
const iam = require("@aws-cdk/aws-iam");
const ec2 = require("@aws-cdk/aws-ec2");
const launch_template_1 = require("./launch-template");
const DEFAULT_INSTANCE_TYPE = 't3.large';
var BlockDuration;
(function (BlockDuration) {
    BlockDuration[BlockDuration["ONE_HOUR"] = 60] = "ONE_HOUR";
    BlockDuration[BlockDuration["TWO_HOURS"] = 120] = "TWO_HOURS";
    BlockDuration[BlockDuration["THREE_HOURS"] = 180] = "THREE_HOURS";
    BlockDuration[BlockDuration["FOUR_HOURS"] = 240] = "FOUR_HOURS";
    BlockDuration[BlockDuration["FIVE_HOURS"] = 300] = "FIVE_HOURS";
    BlockDuration[BlockDuration["SIX_HOURS"] = 360] = "SIX_HOURS";
})(BlockDuration = exports.BlockDuration || (exports.BlockDuration = {}));
var InstanceInterruptionBehavior;
(function (InstanceInterruptionBehavior) {
    InstanceInterruptionBehavior["HIBERNATE"] = "hibernate";
    InstanceInterruptionBehavior["STOP"] = "stop";
    InstanceInterruptionBehavior["TERMINATE"] = "terminate";
})(InstanceInterruptionBehavior = exports.InstanceInterruptionBehavior || (exports.InstanceInterruptionBehavior = {}));
class EksSpotCluster extends core_1.Resource {
    constructor(scope, id, props) {
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
        this.cluster = new eks.Cluster(this, 'Cluster', {
            vpc: this.vpc,
            mastersRole: clusterAdmin,
            defaultCapacity: 0,
            version: this.clusterVersion,
        });
    }
    addSpotFleet(id, props) {
        new SpotFleet(this, id, {
            cluster: this,
            ...props,
        });
    }
    addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    addHours(date, hours) {
        date.setHours(date.getHours() + hours);
        return date;
    }
    addMinutes(date, minutes) {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }
}
exports.EksSpotCluster = EksSpotCluster;
class SpotFleet extends core_1.Resource {
    constructor(scope, id, props) {
        var _a, _b, _c, _d, _e, _f, _g;
        super(scope, id, props);
        this.spotFleetId = id;
        this.clusterStack = props.cluster;
        this.launchTemplate = (_a = props.launchTemplate) !== null && _a !== void 0 ? _a : new launch_template_1.LaunchTemplate();
        this.targetCapacity = props.targetCapacity;
        this.defaultInstanceType = (_b = props.defaultInstanceType) !== null && _b !== void 0 ? _b : new ec2.InstanceType(DEFAULT_INSTANCE_TYPE);
        // isntance role
        this.instanceRole = props.instanceRole || new iam.Role(this, 'InstanceRole', {
            roleName: core_1.PhysicalName.GENERATE_IF_NEEDED,
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
        userData.addCommands(...user_data_1.renderAmazonLinuxUserData(core_1.Stack.of(this), this.clusterStack.cluster.clusterName, config.spotfleet));
        this.defaultInstanceType = (_c = props.defaultInstanceType) !== null && _c !== void 0 ? _c : new ec2.InstanceType(DEFAULT_INSTANCE_TYPE);
        const imageId = (_d = props.customAmiId) !== null && _d !== void 0 ? _d : new eks.EksOptimizedImage({
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
                                value: `${core_1.Stack.of(this).stackName}/Cluster/${this.spotFleetId}`,
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
                        blockDurationMinutes: (_e = props.blockDuration) !== null && _e !== void 0 ? _e : BlockDuration.ONE_HOUR,
                        instanceInterruptionBehavior: (_f = props.instanceInterruptionBehavior) !== null && _f !== void 0 ? _f : InstanceInterruptionBehavior.TERMINATE,
                    },
                },
                // userData: cdk.Fn.base64(capacityAsg.userData.render()),
                userData: core_1.Fn.base64(userData.render()),
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
                targetCapacity: (_g = props.targetCapacity) !== null && _g !== void 0 ? _g : 1,
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
exports.SpotFleet = SpotFleet;
const GPU_INSTANCETYPES = ['p2', 'p3', 'g4'];
function nodeTypeForInstanceType(instanceType) {
    return GPU_INSTANCETYPES.includes(instanceType.toString().substring(0, 2)) ? eks.NodeType.GPU : eks.NodeType.STANDARD;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWtzLXNwb3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJla3Mtc3BvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBd0c7QUFDeEcsd0NBQXdDO0FBQ3hDLDJDQUF3RDtBQUN4RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHVEQUFvRTtBQUVwRSxNQUFNLHFCQUFxQixHQUFHLFVBQVUsQ0FBQTtBQUV4QyxJQUFZLGFBT1g7QUFQRCxXQUFZLGFBQWE7SUFDdkIsMERBQWEsQ0FBQTtJQUNiLDZEQUFlLENBQUE7SUFDZixpRUFBaUIsQ0FBQTtJQUNqQiwrREFBZ0IsQ0FBQTtJQUNoQiwrREFBZ0IsQ0FBQTtJQUNoQiw2REFBZSxDQUFBO0FBQ2pCLENBQUMsRUFQVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQU94QjtBQUVELElBQVksNEJBSVg7QUFKRCxXQUFZLDRCQUE0QjtJQUN0Qyx1REFBdUIsQ0FBQTtJQUN2Qiw2Q0FBYSxDQUFBO0lBQ2IsdURBQXVCLENBQUE7QUFDekIsQ0FBQyxFQUpXLDRCQUE0QixHQUE1QixvQ0FBNEIsS0FBNUIsb0NBQTRCLFFBSXZDO0FBaUJELE1BQWEsY0FBZSxTQUFRLGVBQVE7SUFPMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLGdDQUFnQztRQUNoQyxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7UUFFM0MsMENBQTBDO1FBQzFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUM3RCxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0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RUFBRTtnQkFDTixzQkFBc0I7Z0JBQ3RCLGNBQWM7YUFDZjtTQUNGLENBQUMsQ0FBQztJQUVMLENBQUM7Q0FDRjtBQTVJRCw4QkE0SUM7QUFFRCxNQUFNLGlCQUFpQixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUU3QyxTQUFTLHVCQUF1QixDQUFDLFlBQThCO0lBQzdELE9BQU8saUJBQWlCLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUN4SCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3RhY2ssIFN0YWNrUHJvcHMsIENvbnN0cnVjdCwgUmVzb3VyY2UsIFJlc291cmNlUHJvcHMsIFBoeXNpY2FsTmFtZSwgRm4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICdAYXdzLWNkay9hd3MtZWtzJztcbmltcG9ydCB7IHJlbmRlckFtYXpvbkxpbnV4VXNlckRhdGEgfSBmcm9tICcuL3VzZXItZGF0YSc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyBMYXVuY2hUZW1wbGF0ZSwgSUxhdW5jaHRlbXBsYXRlIH0gZnJvbSAnLi9sYXVuY2gtdGVtcGxhdGUnO1xuXG5jb25zdCBERUZBVUxUX0lOU1RBTkNFX1RZUEUgPSAndDMubGFyZ2UnXG5cbmV4cG9ydCBlbnVtIEJsb2NrRHVyYXRpb24ge1xuICBPTkVfSE9VUiA9IDYwLFxuICBUV09fSE9VUlMgPSAxMjAsXG4gIFRIUkVFX0hPVVJTID0gMTgwLFxuICBGT1VSX0hPVVJTID0gMjQwLFxuICBGSVZFX0hPVVJTID0gMzAwLFxuICBTSVhfSE9VUlMgPSAzNjBcbn1cblxuZXhwb3J0IGVudW0gSW5zdGFuY2VJbnRlcnJ1cHRpb25CZWhhdmlvciB7XG4gIEhJQkVSTkFURSA9ICdoaWJlcm5hdGUnLFxuICBTVE9QID0gJ3N0b3AnLFxuICBURVJNSU5BVEUgPSAndGVybWluYXRlJ1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVrc1Nwb3RDbHVzdGVyUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgY2x1c3RlckF0dHJpYnV0ZXM/OiBla3MuQ2x1c3RlckF0dHJpYnV0ZXM7XG4gIHJlYWRvbmx5IGNsdXN0ZXJWZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb247XG4gIHJlYWRvbmx5IGluc3RhbmNlUm9sZT86IGlhbS5JUm9sZTtcbiAgcmVhZG9ubHkgaW5zdGFuY2VJbnRlcnJ1cHRpb25CZWhhdmlvcj86IEluc3RhbmNlSW50ZXJydXB0aW9uQmVoYXZpb3I7XG4gIHJlYWRvbmx5IGt1YmVjdGxFbmFibGVkPzogYm9vbGVhbjtcbiAgLyoqXG4gICAgICogU3BlY2lmeSBhIGN1c3RvbSBBTUkgSUQgZm9yIHlvdXIgc3BvdCBmbGVldC4gQnkgZGVmYXVsdCB0aGUgQW1hem9uIEVLUy1vcHRpbWl6ZWRcbiAgICAgKiBBTUkgd2lsbCBiZSBzZWxlY3RlZC5cbiAgICAgKiBcbiAgICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICAgKi9cbiAgcmVhZG9ubHkgY3VzdG9tQW1pSWQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBFa3NTcG90Q2x1c3RlciBleHRlbmRzIFJlc291cmNlIHtcbiAgcmVhZG9ubHkgY2x1c3RlcjogZWtzLkNsdXN0ZXI7XG4gIHJlYWRvbmx5IGNsdXN0ZXJWZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb247XG4gIC8vIHJlYWRvbmx5IGluc3RhbmNlUm9sZTogaWFtLklSb2xlO1xuICAvLyByZWFkb25seSBpbnN0YW5jZVByb2ZpbGU6IGlhbS5DZm5JbnN0YW5jZVByb2ZpbGU7XG4gIHJlYWRvbmx5IHZwYzogZWMyLklWcGM7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEVrc1Nwb3RDbHVzdGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gdGhpcy5jbHVzdGVyID0gcHJvcHMuY2x1c3RlcjtcbiAgICB0aGlzLmNsdXN0ZXJWZXJzaW9uID0gcHJvcHMuY2x1c3RlclZlcnNpb247XG5cbiAgICAvLyB1c2UgYW4gZXhpc3RpbmcgdnBjIG9yIGNyZWF0ZSBhIG5ldyBvbmVcbiAgICB0aGlzLnZwYyA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCd1c2VfZGVmYXVsdF92cGMnKSA9PT0gJzEnID9cbiAgICAgIGVjMi5WcGMuZnJvbUxvb2t1cCh0aGlzLCAnVnBjJywgeyBpc0RlZmF1bHQ6IHRydWUgfSkgOlxuICAgICAgdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ3VzZV92cGNfaWQnKSA/XG4gICAgICAgIGVjMi5WcGMuZnJvbUxvb2t1cCh0aGlzLCAnVnBjJywgeyB2cGNJZDogdGhpcy5ub2RlLnRyeUdldENvbnRleHQoJ3VzZV92cGNfaWQnKSB9KSA6XG4gICAgICAgIG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMywgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyQWRtaW4gPSBuZXcgaWFtLlJvbGUodGhpcywgJ0FkbWluUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50Um9vdFByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5jbHVzdGVyPSBuZXcgZWtzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgbWFzdGVyc1JvbGU6IGNsdXN0ZXJBZG1pbixcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMCxcbiAgICAgIHZlcnNpb246IHRoaXMuY2x1c3RlclZlcnNpb24sXG4gICAgfSlcbiAgfVxuXG4gIHB1YmxpYyBhZGRTcG90RmxlZXQoaWQ6IHN0cmluZywgcHJvcHM6IEJhc2VTcG90RmxlZXRQcm9wcykge1xuICAgIG5ldyBTcG90RmxlZXQodGhpcywgaWQsIHtcbiAgICAgIGNsdXN0ZXI6IHRoaXMsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KVxuICB9XG5cbiAgcHVibGljIGFkZERheXMoZGF0ZTogRGF0ZSwgZGF5czogbnVtYmVyKTogRGF0ZSB7XG4gICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgZGF5cyk7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cblxuICBwdWJsaWMgYWRkSG91cnMoZGF0ZTogRGF0ZSwgaG91cnM6IG51bWJlcik6IERhdGUge1xuICAgIGRhdGUuc2V0SG91cnMoZGF0ZS5nZXRIb3VycygpICsgaG91cnMpO1xuICAgIHJldHVybiBkYXRlO1xuICB9XG5cbiAgcHVibGljIGFkZE1pbnV0ZXMoZGF0ZTogRGF0ZSwgbWludXRlczogbnVtYmVyKTogRGF0ZSB7XG4gICAgZGF0ZS5zZXRNaW51dGVzKGRhdGUuZ2V0TWludXRlcygpICsgbWludXRlcyk7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSBCYXNlU3BvdEZsZWV0UHJvcHMgZXh0ZW5kcyBSZXNvdXJjZVByb3BzIHtcbiAgcmVhZG9ubHkgZGVmYXVsdEluc3RhbmNlVHlwZT86IGVjMi5JbnN0YW5jZVR5cGU7XG4gIHJlYWRvbmx5IGJsb2NrRHVyYXRpb24/OiBCbG9ja0R1cmF0aW9uO1xuICByZWFkb25seSBpbnN0YW5jZUludGVycnVwdGlvbkJlaGF2aW9yID86IEluc3RhbmNlSW50ZXJydXB0aW9uQmVoYXZpb3I7XG4gIHJlYWRvbmx5IGluc3RhbmNlUm9sZT86IGlhbS5Sb2xlO1xuICByZWFkb25seSB0YXJnZXRDYXBhY2l0eT86IG51bWJlcjtcbiAgcmVhZG9ubHkgbWFwUm9sZT86IGJvb2xlYW47XG4gIHJlYWRvbmx5IGJvb3RzdHJhcEVuYWJsZWQ/OiBib29sZWFuO1xuICByZWFkb25seSB2YWxpZEZyb20/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHZhbGlkVW50aWw/OiBzdHJpbmc7XG4gIHJlYWRvbmx5IHRlcm1pbmF0ZUluc3RhbmNlc1dpdGhFeHBpcmF0aW9uPzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgY3VzdG9tQW1pSWQ/OiBzdHJpbmc7XG59XG5cblxuZXhwb3J0IGludGVyZmFjZSBTcG90RmxlZXRQcm9wcyBleHRlbmRzIEJhc2VTcG90RmxlZXRQcm9wcyB7XG4gIHJlYWRvbmx5IGNsdXN0ZXI6IEVrc1Nwb3RDbHVzdGVyO1xuICByZWFkb25seSBsYXVuY2hUZW1wbGF0ZT86IElMYXVuY2h0ZW1wbGF0ZTtcbn1cblxuZXhwb3J0IGNsYXNzIFNwb3RGbGVldCBleHRlbmRzIFJlc291cmNlIHtcbiAgcmVhZG9ubHkgaW5zdGFuY2VSb2xlOiBpYW0uSVJvbGU7XG4gIHJlYWRvbmx5IGNsdXN0ZXJTdGFjazogRWtzU3BvdENsdXN0ZXI7XG4gIHJlYWRvbmx5IGRlZmF1bHRJbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGU7XG4gIHJlYWRvbmx5IHRhcmdldENhcGFjaXR5PzogbnVtYmVyO1xuICByZWFkb25seSBzcG90RmxlZXRJZDogc3RyaW5nO1xuICByZWFkb25seSBsYXVuY2hUZW1wbGF0ZTogSUxhdW5jaHRlbXBsYXRlO1xuXG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFNwb3RGbGVldFByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcylcblxuICAgIHRoaXMuc3BvdEZsZWV0SWQgPSBpZFxuICAgIHRoaXMuY2x1c3RlclN0YWNrID0gcHJvcHMuY2x1c3RlclxuICAgIHRoaXMubGF1bmNoVGVtcGxhdGUgPSBwcm9wcy5sYXVuY2hUZW1wbGF0ZSA/PyBuZXcgTGF1bmNoVGVtcGxhdGUoKVxuICAgIHRoaXMudGFyZ2V0Q2FwYWNpdHkgPSBwcm9wcy50YXJnZXRDYXBhY2l0eVxuICAgIHRoaXMuZGVmYXVsdEluc3RhbmNlVHlwZSA9IHByb3BzLmRlZmF1bHRJbnN0YW5jZVR5cGUgPz8gbmV3IGVjMi5JbnN0YW5jZVR5cGUoREVGQVVMVF9JTlNUQU5DRV9UWVBFKVxuXG4gICAgLy8gaXNudGFuY2Ugcm9sZVxuICAgIHRoaXMuaW5zdGFuY2VSb2xlID0gcHJvcHMuaW5zdGFuY2VSb2xlIHx8IG5ldyBpYW0uUm9sZSh0aGlzLCAnSW5zdGFuY2VSb2xlJywge1xuICAgICAgcm9sZU5hbWU6IFBoeXNpY2FsTmFtZS5HRU5FUkFURV9JRl9ORUVERUQsXG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIHRoaXMuaW5zdGFuY2VSb2xlLmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FS1NXb3JrZXJOb2RlUG9saWN5JykpO1xuICAgIHRoaXMuaW5zdGFuY2VSb2xlLmFkZE1hbmFnZWRQb2xpY3koaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbWF6b25FS1NfQ05JX1BvbGljeScpKTtcbiAgICB0aGlzLmluc3RhbmNlUm9sZS5hZGRNYW5hZ2VkUG9saWN5KGlhbS5NYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnQW1hem9uRUMyQ29udGFpbmVyUmVnaXN0cnlSZWFkT25seScpKTtcblxuICAgIGNvbnN0IGluc3RhbmNlUHJvZmlsZSA9IG5ldyBpYW0uQ2ZuSW5zdGFuY2VQcm9maWxlKHRoaXMsICdJbnN0YW5jZVByb2ZpbGUnLCB7XG4gICAgICByb2xlczogW3RoaXMuaW5zdGFuY2VSb2xlLnJvbGVOYW1lXSxcbiAgICB9KVxuXG4gICAgY29uc3Qgc2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAodGhpcywgJ1Nwb3RGbGVldFNnJywge1xuICAgICAgdnBjOiB0aGlzLmNsdXN0ZXJTdGFjay5jbHVzdGVyLnZwYyxcbiAgICB9KVxuXG4gICAgLy8gc2VsZiBydWxlc1xuICAgIHNnLmNvbm5lY3Rpb25zLmFsbG93SW50ZXJuYWxseShlYzIuUG9ydC5hbGxUcmFmZmljKCkpO1xuXG4gICAgLy8gQ2x1c3RlciB0bzpub2RlcyBydWxlc1xuICAgIHNnLmNvbm5lY3Rpb25zLmFsbG93RnJvbSh0aGlzLmNsdXN0ZXJTdGFjay5jbHVzdGVyLCBlYzIuUG9ydC50Y3AoNDQzKSk7XG4gICAgc2cuY29ubmVjdGlvbnMuYWxsb3dGcm9tKHRoaXMuY2x1c3RlclN0YWNrLmNsdXN0ZXIsIGVjMi5Qb3J0LnRjcFJhbmdlKDEwMjUsIDY1NTM1KSk7XG5cbiAgICAvLyBBbGxvdyBIVFRQUyBmcm9tIE5vZGVzIHRvIENsdXN0ZXJcbiAgICBzZy5jb25uZWN0aW9ucy5hbGxvd1RvKHRoaXMuY2x1c3RlclN0YWNrLmNsdXN0ZXIsIGVjMi5Qb3J0LnRjcCg0NDMpKTtcblxuICAgIC8vIEFsbG93IGFsbCBub2RlIG91dGJvdW5kIHRyYWZmaWNcbiAgICBzZy5jb25uZWN0aW9ucy5hbGxvd1RvQW55SXB2NChlYzIuUG9ydC5hbGxUY3AoKSk7XG4gICAgc2cuY29ubmVjdGlvbnMuYWxsb3dUb0FueUlwdjQoZWMyLlBvcnQuYWxsVWRwKCkpO1xuICAgIHNnLmNvbm5lY3Rpb25zLmFsbG93VG9BbnlJcHY0KGVjMi5Qb3J0LmFsbEljbXAoKSk7XG5cbiAgICBjb25zdCBjb25maWcgPSB0aGlzLmxhdW5jaFRlbXBsYXRlLmJpbmQodGhpcylcblxuICAgIC8vIGNvbnN0IHVzZXJEYXRhID0gcmVuZGVyQW1hem9uTGludXhVc2VyRGF0YShjZGsuU3RhY2sub2YodGhpcyksIHRoaXMuY2x1c3Rlci5jbHVzdGVyTmFtZSwgY29uZmlnLnNwb3RmbGVldCk7XG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKVxuICAgIHVzZXJEYXRhLmFkZENvbW1hbmRzKC4uLnJlbmRlckFtYXpvbkxpbnV4VXNlckRhdGEoU3RhY2sub2YodGhpcyksIHRoaXMuY2x1c3RlclN0YWNrLmNsdXN0ZXIuY2x1c3Rlck5hbWUsIGNvbmZpZy5zcG90ZmxlZXQpKTtcblxuICAgIHRoaXMuZGVmYXVsdEluc3RhbmNlVHlwZSA9IHByb3BzLmRlZmF1bHRJbnN0YW5jZVR5cGUgPz8gbmV3IGVjMi5JbnN0YW5jZVR5cGUoREVGQVVMVF9JTlNUQU5DRV9UWVBFKVxuXG4gICAgY29uc3QgaW1hZ2VJZCA9IHByb3BzLmN1c3RvbUFtaUlkID8/IG5ldyBla3MuRWtzT3B0aW1pemVkSW1hZ2Uoe1xuICAgICAgbm9kZVR5cGU6IG5vZGVUeXBlRm9ySW5zdGFuY2VUeXBlKHRoaXMuZGVmYXVsdEluc3RhbmNlVHlwZSksXG4gICAgICBrdWJlcm5ldGVzVmVyc2lvbjogcHJvcHMuY2x1c3Rlci5jbHVzdGVyVmVyc2lvbi52ZXJzaW9uLFxuICAgIH0pLmdldEltYWdlKHRoaXMpLmltYWdlSWRcblxuICAgIGNvbnN0IGx0ID0gbmV3IGVjMi5DZm5MYXVuY2hUZW1wbGF0ZSh0aGlzLCAnTGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgaW1hZ2VJZCxcbiAgICAgICAgaW5zdGFuY2VUeXBlOiB0aGlzLmRlZmF1bHRJbnN0YW5jZVR5cGUudG9TdHJpbmcoKSxcbiAgICAgICAgdGFnU3BlY2lmaWNhdGlvbnM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICByZXNvdXJjZVR5cGU6ICdpbnN0YW5jZScsXG4gICAgICAgICAgICB0YWdzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBrZXk6ICdOYW1lJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogYCR7U3RhY2sub2YodGhpcykuc3RhY2tOYW1lfS9DbHVzdGVyLyR7dGhpcy5zcG90RmxlZXRJZH1gLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAga2V5OiBga3ViZXJuZXRlcy5pby9jbHVzdGVyLyR7dGhpcy5jbHVzdGVyU3RhY2suY2x1c3Rlci5jbHVzdGVyTmFtZX1gLFxuICAgICAgICAgICAgICAgIHZhbHVlOiAnb3duZWQnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGluc3RhbmNlTWFya2V0T3B0aW9uczoge1xuICAgICAgICAgIG1hcmtldFR5cGU6ICdzcG90JyxcbiAgICAgICAgICBzcG90T3B0aW9uczoge1xuICAgICAgICAgICAgYmxvY2tEdXJhdGlvbk1pbnV0ZXM6IHByb3BzLmJsb2NrRHVyYXRpb24gPz8gQmxvY2tEdXJhdGlvbi5PTkVfSE9VUixcbiAgICAgICAgICAgIGluc3RhbmNlSW50ZXJydXB0aW9uQmVoYXZpb3I6IHByb3BzLmluc3RhbmNlSW50ZXJydXB0aW9uQmVoYXZpb3IgPz8gSW5zdGFuY2VJbnRlcnJ1cHRpb25CZWhhdmlvci5URVJNSU5BVEUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgLy8gdXNlckRhdGE6IGNkay5Gbi5iYXNlNjQoY2FwYWNpdHlBc2cudXNlckRhdGEucmVuZGVyKCkpLFxuICAgICAgICB1c2VyRGF0YTogRm4uYmFzZTY0KHVzZXJEYXRhLnJlbmRlcigpKSxcbiAgICAgICAgc2VjdXJpdHlHcm91cElkczogc2cuY29ubmVjdGlvbnMuc2VjdXJpdHlHcm91cHMubWFwKG0gPT4gbS5zZWN1cml0eUdyb3VwSWQpLFxuICAgICAgICBpYW1JbnN0YW5jZVByb2ZpbGU6IHtcbiAgICAgICAgICBhcm46IGluc3RhbmNlUHJvZmlsZS5hdHRyQXJuLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgY29uc3Qgc3BvdEZsZWV0Um9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnRmxlZXRSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3Nwb3RmbGVldC5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQW1hem9uRUMyU3BvdEZsZWV0VGFnZ2luZ1JvbGUnKSxcbiAgICAgIF0sXG4gICAgfSlcblxuXG4gICAgY29uc3Qgb3ZlcnJpZGVzID0gW11cbiAgICBmb3IgKGNvbnN0IHMgb2YgdGhpcy5jbHVzdGVyU3RhY2suY2x1c3Rlci52cGMucHJpdmF0ZVN1Ym5ldHMpIHtcbiAgICAgIG92ZXJyaWRlcy5wdXNoKHsgc3VibmV0SWQ6IHMuc3VibmV0SWQgfSlcbiAgICB9XG4gICAgbmV3IGVjMi5DZm5TcG90RmxlZXQodGhpcywgaWQsIHtcbiAgICAgIHNwb3RGbGVldFJlcXVlc3RDb25maWdEYXRhOiB7XG4gICAgICAgIGxhdW5jaFRlbXBsYXRlQ29uZmlnczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhdW5jaFRlbXBsYXRlU3BlY2lmaWNhdGlvbjoge1xuICAgICAgICAgICAgICBsYXVuY2hUZW1wbGF0ZUlkOiBsdC5yZWYsXG4gICAgICAgICAgICAgIHZlcnNpb246IGx0LmF0dHJMYXRlc3RWZXJzaW9uTnVtYmVyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG92ZXJyaWRlcyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBpYW1GbGVldFJvbGU6IHNwb3RGbGVldFJvbGUucm9sZUFybixcbiAgICAgICAgdGFyZ2V0Q2FwYWNpdHk6IHByb3BzLnRhcmdldENhcGFjaXR5ID8/IDEsXG4gICAgICAgIHZhbGlkRnJvbTogcHJvcHMudmFsaWRGcm9tLFxuICAgICAgICB2YWxpZFVudGlsOiBwcm9wcy52YWxpZFVudGlsLFxuICAgICAgICB0ZXJtaW5hdGVJbnN0YW5jZXNXaXRoRXhwaXJhdGlvbjogcHJvcHMudGVybWluYXRlSW5zdGFuY2VzV2l0aEV4cGlyYXRpb24sXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICB0aGlzLmNsdXN0ZXJTdGFjay5jbHVzdGVyLmF3c0F1dGguYWRkUm9sZU1hcHBpbmcodGhpcy5pbnN0YW5jZVJvbGUsIHtcbiAgICAgIHVzZXJuYW1lOiAnc3lzdGVtOm5vZGU6e3tFQzJQcml2YXRlRE5TTmFtZX19JyxcbiAgICAgIGdyb3VwczogW1xuICAgICAgICAnc3lzdGVtOmJvb3RzdHJhcHBlcnMnLFxuICAgICAgICAnc3lzdGVtOm5vZGVzJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgXG4gIH1cbn1cblxuY29uc3QgR1BVX0lOU1RBTkNFVFlQRVMgPSBbJ3AyJywgJ3AzJywgJ2c0J107XG5cbmZ1bmN0aW9uIG5vZGVUeXBlRm9ySW5zdGFuY2VUeXBlKGluc3RhbmNlVHlwZTogZWMyLkluc3RhbmNlVHlwZSkge1xuICByZXR1cm4gR1BVX0lOU1RBTkNFVFlQRVMuaW5jbHVkZXMoaW5zdGFuY2VUeXBlLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDIpKSA/IGVrcy5Ob2RlVHlwZS5HUFUgOiBla3MuTm9kZVR5cGUuU1RBTkRBUkQ7XG59XG4iXX0=