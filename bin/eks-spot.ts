#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
// import { EksSpotCluster, ClusterVersion, BlockDuration } from '../lib';
import * as eksspot from '../lib';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT
};

const stack = new cdk.Stack(app, 'EksSpotStack', { env });

const clusterStack = new eksspot.EksSpotCluster(stack, 'Cluster', { 
  clusterVersion: eksspot.ClusterVersion.KUBERNETES_116,
});

clusterStack.addSpotFleet('FirstFleet', {
  blockDuration: eksspot.BlockDuration.SIX_HOURS,
  targetCapacity: 1,
  defaultInstanceType: new ec2.InstanceType('p3.2xlarge'),
  validUntil: clusterStack.addHours(new Date(), 6).toISOString(),
  terminateInstancesWithExpiration: true
})

clusterStack.addSpotFleet('SecondFleet', {
  blockDuration: eksspot.BlockDuration.ONE_HOUR,
  targetCapacity: 2,
  defaultInstanceType: new ec2.InstanceType('c5.large'),
  validUntil: clusterStack.addHours(new Date(), 1).toISOString(),
  terminateInstancesWithExpiration: true
})
