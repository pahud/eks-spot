# Welcome to `eks-spot` project!

This project aims to help you provison Amazon EKS cluster with `EC2 Spot Blocks` for defined duration workloads.


## Features

- Extending the upstream AWS CDK `aws-eks` construct libraries
- `addSpotFleet()` to create your spot fleet for your cluster
- define your `blockDuration`, `validFrom` and `validUntil` for fine-graned control


## Usage

Make sure you have installed `aws-cdk`

```bash
$ cdk --version
```

```bash
# git clone this project
git clone https://github.com/pahud/aws/eks-spot.git
# cd into the cdk directory
cd eks-spot/cdk
# bootstrap your region for the first time
cdk bootstrap
# cdk diff to see what's going to be created
cdk diff
# deploy it
cdk deploy
```

## To deploy into existing VPC or other AWS_REGION

Use `-c use_default_vpc=1` to deploy into your default VPC 

```bash
# to deploy into the default vpc
$ cdk diff -c use_default_vpc=1
```

Use `-c use_vpc_id=vpc-xxxxxx` to deploy into any existing VPC

```bash
# to deploy into vpc-xxxxxx
$ cdk diff -c use_vpc_id=vpc-xxxxxx
```

Use `AWS_REGION` to override the default region

To deploy in to `ap-northeast-1`

```bash
$ AWS_REGION=ap-norteast-1 cdk diff -c use_vpc_id=vpc-xxxxxx
```

Use `--profile` to specify different `AWS_PROFILE`

```bash
# deploy in to AWS China Ningxia region
$ AWS_REGION=cn-northwest-1 cdk --profile cn cdk diff 
# deploy in to AWS China Beijing region
$ AWS_REGION=cn-north-1 cdk --profile cn cdk diff 
```

## Destroy and clean up

```bash
$ cdk destroy
```