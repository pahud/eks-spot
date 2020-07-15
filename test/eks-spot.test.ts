import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EksSpot from '../lib';
import * as eks from '@aws-cdk/aws-eks';

test('create cluster only', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'EksSpotStack');

  // WHEN
  new EksSpot.EksSpotCluster(stack, 'MyTestStack', {
    clusterVersion: eks.KubernetesVersion.V1_16,
  });
  // THEN
  expectCDK(stack).to(haveResource('Custom::AWSCDK-EKS-Cluster'));
});
