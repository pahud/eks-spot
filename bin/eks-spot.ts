#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import { EksSpotCluster, ClusterVersion, BlockDuration } from '../lib/eks-spot';


function addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}

function addHours(date: Date, hours: number): Date {
  date.setHours(date.getHours() + hours);
  return date;
}

function addMinutes(date: Date, minutes: number): Date {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
}


const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT
};

const stack = new cdk.Stack(app, 'EksSpotStack', { env });

const clusterStack = new EksSpotCluster(stack, 'Cluster', { 
  clusterVersion: ClusterVersion.KUBERNETES_116,
});

clusterStack.addSpotFleet('OneHourFleet', {
  blockDuration: BlockDuration.ONE_HOUR,
  targetCapacity: 1,
  defaultInstanceType: new ec2.InstanceType('p3.2xlarge'),
  validUntil: addHours(new Date(), 1).toISOString(),
  terminateInstancesWithExpiration: true
})

clusterStack.addSpotFleet('TwoHourFleet', {
  blockDuration: BlockDuration.ONE_HOUR,
  targetCapacity: 2,
  defaultInstanceType: new ec2.InstanceType('c5.large'),
  validUntil: addHours(new Date(), 1).toISOString(),
  terminateInstancesWithExpiration: true
})
