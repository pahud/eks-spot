import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EksSpot from '../lib';

test('create cluster only', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'EksSpotStack');

  // WHEN
  new EksSpot.EksSpotCluster(stack, 'MyTestStack', {
    clusterVersion: EksSpot.ClusterVersion.KUBERNETES_116,
  });
  // THEN
  expectCDK(stack).to(haveResource('Custom::AWSCDK-EKS-Cluster'));
});
