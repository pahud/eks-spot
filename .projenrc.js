const {
  JsiiProject,
  Semver
} = require('projen');

const project = new JsiiProject({
  name: 'eks-spot-blocks',
  jsiiVersion: Semver.caret('1.5.0'),
  description: 'eks spot blocks constructs for awscdk',
  repository: 'https://github.com/pahud/eks-spot-blocks.git',
  authorName: 'Pahud Hsieh',
  authorEmail: 'hunhsieh@amazon.com',
  stability: 'experimental',
  devDependencies: {
    '@aws-cdk/assert': Semver.caret('1.44.0'),
  },
  peerDependencies: {
    constructs: Semver.caret('3.0.2'),
    '@aws-cdk/core': Semver.caret('1.44.0'),
    '@aws-cdk/aws-ec2': Semver.caret('1.44.0'),
    '@aws-cdk/aws-eks': Semver.caret('1.44.0'),
    '@aws-cdk/aws-iam': Semver.caret('1.44.0'),
    '@aws-cdk/aws-ssm': Semver.caret('1.44.0'),
  },
  python: {
    distName: 'eks-spot-blocks',
    module: 'eks_spot_blocks'
  }
});

project.synth();
