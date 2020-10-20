import '@aws-cdk/assert/jest';
import * as eks from '@aws-cdk/aws-eks';
import * as cdk from '@aws-cdk/core';
import * as EksSpot from '../src';

test('create cluster only', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'EksSpotStack');

  // WHEN
  new EksSpot.EksSpotCluster(stack, 'MyTestStack', {
    clusterVersion: eks.KubernetesVersion.V1_16,
  });
  // THEN
  expect(stack).toHaveResource('Custom::AWSCDK-EKS-Cluster');
});
