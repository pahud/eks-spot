import * as ec2 from '@aws-cdk/aws-ec2';
import * as eks from '@aws-cdk/aws-eks';
import { App, Stack } from '@aws-cdk/core';
import * as eksspot from './';

export class IntegTesting {
  readonly stack: Stack[];

  constructor() {

    const app = new App();

    const env = {
      region: process.env.CDK_DEFAULT_REGION,
      account: process.env.CDK_DEFAULT_ACCOUNT,
    };

    const stack = new Stack(app, 'testing-stack', { env });

    const eksSpotCluter = new eksspot.EksSpotCluster(stack, 'Cluster', {
      env,
      clusterVersion: eks.KubernetesVersion.V1_18,
    });

    eksSpotCluter.addSpotFleet('FirstFleet', {
      blockDuration: eksspot.BlockDuration.SIX_HOURS,
      targetCapacity: 1,
      defaultInstanceType: new ec2.InstanceType('p3.2xlarge'),
      validUntil: eksSpotCluter.addHours(new Date(), 6).toISOString(),
      terminateInstancesWithExpiration: true,
    });

    eksSpotCluter.addSpotFleet('SecondFleet', {
      blockDuration: eksspot.BlockDuration.ONE_HOUR,
      targetCapacity: 2,
      defaultInstanceType: new ec2.InstanceType('c5.large'),
      validUntil: eksSpotCluter.addHours(new Date(), 1).toISOString(),
      terminateInstancesWithExpiration: true,
    });

    this.stack = [stack];
  };
}

// run the integ testing
new IntegTesting();