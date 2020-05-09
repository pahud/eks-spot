import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EksSpot from '../lib/eks-spot-stack';
import { InstanceType } from '@aws-cdk/aws-ec2';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new EksSpot.EksSpotStack(app, 'MyTestStack', {
      clusterVersion: EksSpot.ClusterVersion.KUBERNETES_115,
      defaultInstanceType: new InstanceType('t3.large'),
    });
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
