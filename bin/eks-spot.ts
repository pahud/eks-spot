#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EksSpotStack } from '../lib/eks-spot-stack';

const app = new cdk.App();
new EksSpotStack(app, 'EksSpotStack');
