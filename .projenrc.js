const {
  ConstructLibraryAws,
  Semver,
} = require('projen');

const AWS_CDK_LATEST_RELEASE = '1.61.1';
const PROJEN_PINNED_VERSION = '0.3.50';
const PROJECT_NAME = 'eks-spot-blocks';
const PROJECT_DESCRIPTION = 'A sample JSII construct lib for AWS CDK';

const project = new ConstructLibraryAws({
  name: PROJECT_NAME,
  description: PROJECT_DESCRIPTION,
  repository: 'https://github.com/pahud/cdk-eks-spotblocks.git',
  authorName: 'Pahud Hsieh',
  authorEmail: 'pahudnet@gmail.com',
  stability: 'experimental',

  keywords: [
    'cdk',
    'aws',
    'eks',
    'spot',
    'spot-blocks'
  ],

  catalog: {
    twitter: 'pahudnet',
    announce: false,
  },

  // creates PRs for projen upgrades
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',


  cdkVersion: AWS_CDK_LATEST_RELEASE,
  cdkDependencies: [
    '@aws-cdk/core',
    '@aws-cdk/aws-ec2',
    '@aws-cdk/aws-eks',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-ssm',
  ],


  python: {
    distName: 'eks-spot-blocks',
    module: 'eks_spot_blocks'
  }
});

if (PROJEN_PINNED_VERSION) {
  project.devDependencies.projen = PROJEN_PINNED_VERSION;
}

const common_exclude = ['cdk.out', 'cdk.context.json', 'images', 'yarn-error.log'];
project.npmignore.exclude(...common_exclude);
project.gitignore.exclude(...common_exclude);


project.synth();
