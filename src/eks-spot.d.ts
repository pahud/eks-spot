import { StackProps, Construct, Resource, ResourceProps } from '@aws-cdk/core';
import * as eks from '@aws-cdk/aws-eks';
import * as iam from '@aws-cdk/aws-iam';
import * as ec2 from '@aws-cdk/aws-ec2';
import { ILaunchtemplate } from './launch-template';
export declare enum BlockDuration {
    ONE_HOUR = 60,
    TWO_HOURS = 120,
    THREE_HOURS = 180,
    FOUR_HOURS = 240,
    FIVE_HOURS = 300,
    SIX_HOURS = 360
}
export declare enum InstanceInterruptionBehavior {
    HIBERNATE = "hibernate",
    STOP = "stop",
    TERMINATE = "terminate"
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
export declare class EksSpotCluster extends Resource {
    readonly cluster: eks.Cluster;
    readonly clusterVersion: eks.KubernetesVersion;
    readonly vpc: ec2.IVpc;
    constructor(scope: Construct, id: string, props: EksSpotClusterProps);
    addSpotFleet(id: string, props: BaseSpotFleetProps): void;
    addDays(date: Date, days: number): Date;
    addHours(date: Date, hours: number): Date;
    addMinutes(date: Date, minutes: number): Date;
}
export interface BaseSpotFleetProps extends ResourceProps {
    readonly defaultInstanceType?: ec2.InstanceType;
    readonly blockDuration?: BlockDuration;
    readonly instanceInterruptionBehavior?: InstanceInterruptionBehavior;
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
export declare class SpotFleet extends Resource {
    readonly instanceRole: iam.IRole;
    readonly clusterStack: EksSpotCluster;
    readonly defaultInstanceType: ec2.InstanceType;
    readonly targetCapacity?: number;
    readonly spotFleetId: string;
    readonly launchTemplate: ILaunchtemplate;
    constructor(scope: Construct, id: string, props: SpotFleetProps);
}
