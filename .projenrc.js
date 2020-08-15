const {
  JsiiProject,
  Semver
} = require('projen');

const AWS_CDK_LATEST_RELEASE = '1.59.0';
const CONSTRUCTS_VERSION = '3.0.4';

const project = new JsiiProject({
  name: 'eks-spot-blocks',
  jsiiVersion: Semver.caret('1.5.0'),
  description: 'eks spot blocks constructs for awscdk',
  repository: 'https://github.com/pahud/eks-spot-blocks.git',
  authorName: 'Pahud Hsieh',
  authorEmail: 'pahudnet@gmail.com',
  stability: 'experimental',
  devDependencies: {
    '@aws-cdk/assert': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@types/jest': Semver.caret('25.2.3'),
    '@types/node': Semver.caret('14.0.11'),
    'dot-prop': Semver.caret('5.1.1'),
  },
  peerDependencies: {
    'constructs': Semver.pinned(CONSTRUCTS_VERSION),
    '@aws-cdk/core': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-ec2': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-eks': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-iam': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-ssm': Semver.pinned(AWS_CDK_LATEST_RELEASE),
  },
  dependencies: {
    'constructs': Semver.pinned(CONSTRUCTS_VERSION),
    '@aws-cdk/core': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-ec2': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-eks': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-iam': Semver.pinned(AWS_CDK_LATEST_RELEASE),
    '@aws-cdk/aws-ssm': Semver.pinned(AWS_CDK_LATEST_RELEASE),
  },
  python: {
    distName: 'eks-spot-blocks',
    module: 'eks_spot_blocks'
  }
});

project.addFields({
  'keywords': [
    'cdk',
    'aws',
    'eks',
    'spot',
    'spot-blocks'
  ]
});

project.addFields({
  awscdkio: {
    twitter: '@pahudnet',
    announce: false
  }
});

const common_exclude = ['cdk.out', 'cdk.context.json', 'docker-compose.yml', 'images', 'yarn-error.log']
project.npmignore.exclude(...common_exclude, '/codebase');
project.gitignore.exclude(...common_exclude);


project.synth();
