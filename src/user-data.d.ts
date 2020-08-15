import { Stack } from '@aws-cdk/core';
import { BootstrapOptions } from '@aws-cdk/aws-eks/lib/cluster';
import { SpotFleet } from './eks-spot';
export declare function renderAmazonLinuxUserData(scope: Stack, clusterName: string, spotFleet: SpotFleet, options?: BootstrapOptions): string[];
/**
 * The lifecycle label for node selector
 */
export declare enum LifecycleLabel {
    /**
     * on-demand instances
     */
    ON_DEMAND = "OnDemand",
    /**
     * spot instances
     */
    SPOT = "Ec2Spot"
}
