import { BootstrapOptions } from '@aws-cdk/aws-eks/lib/cluster';
import { Stack } from '@aws-cdk/core';
import { SpotFleet } from './eks-spot';

// tslint:disable-next-line:max-line-length
export function renderAmazonLinuxUserData(scope: Stack, clusterName: string, spotFleet: SpotFleet, options: BootstrapOptions = {}): string[] {

  const stack = Stack.of(scope);

  // determine logical id of ASG so we can signal cloudformation
  // const cfn = spotFleet.node.defaultChild as autoscaling.CfnAutoScalingGroup;
  // const asgLogicalId = cfn.logicalId;
  const spotFleetLogicalId = spotFleet.node.id;

  const extraArgs = new Array<string>();

  extraArgs.push(`--use-max-pods ${options.useMaxPods === undefined ? true : options.useMaxPods}`);

  if (options.awsApiRetryAttempts) {
    extraArgs.push(`--aws-api-retry-attempts ${options.awsApiRetryAttempts}`);
  }

  if (options.enableDockerBridge) {
    extraArgs.push('--enable-docker-bridge');
  }

  if (options.dockerConfigJson) {
    extraArgs.push(`--docker-config-json '${options.dockerConfigJson}'`);
  }

  if (options.additionalArgs) {
    extraArgs.push(options.additionalArgs);
  }

  const commandLineSuffix = extraArgs.join(' ');
  const kubeletExtraArgsSuffix = options.kubeletExtraArgs || '';

  // determine lifecycle label based on whether the ASG has a spot price.
  // const lifecycleLabel = autoScalingGroup.spotPrice ? LifecycleLabel.SPOT : LifecycleLabel.ON_DEMAND;
  const lifecycleLabel = LifecycleLabel.SPOT;
  // const withTaints = autoScalingGroup.spotPrice ? '--register-with-taints=spotInstance=true:PreferNoSchedule' : '';
  const withTaints = '--register-with-taints=spotInstance=true:PreferNoSchedule';
  const kubeletExtraArgs = `--node-labels lifecycle=${lifecycleLabel} ${withTaints} ${kubeletExtraArgsSuffix}`.trim();

  return [
    'set -o xtrace',
    `/etc/eks/bootstrap.sh ${clusterName} --kubelet-extra-args "${kubeletExtraArgs}" ${commandLineSuffix}`.trim(),
    `/opt/aws/bin/cfn-signal --exit-code $? --stack ${stack.stackName} --resource ${spotFleetLogicalId} --region ${stack.region}`,
  ];
}

/**
 * The lifecycle label for node selector
 */
export enum LifecycleLabel {
  /**
   * on-demand instances
   */
  ON_DEMAND = 'OnDemand',
  /**
   * spot instances
   */
  SPOT = 'Ec2Spot'
}