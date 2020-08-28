# API Reference

**Classes**

Name|Description
----|-----------
[EksSpotCluster](#cdk-serverless-api-eksspotcluster)|*No description*
[LaunchTemplate](#cdk-serverless-api-launchtemplate)|*No description*
[SpotFleet](#cdk-serverless-api-spotfleet)|*No description*


**Structs**

Name|Description
----|-----------
[BaseSpotFleetProps](#cdk-serverless-api-basespotfleetprops)|*No description*
[EksSpotClusterProps](#cdk-serverless-api-eksspotclusterprops)|*No description*
[SpotFleetLaunchTemplateConfig](#cdk-serverless-api-spotfleetlaunchtemplateconfig)|*No description*
[SpotFleetProps](#cdk-serverless-api-spotfleetprops)|*No description*


**Interfaces**

Name|Description
----|-----------
[ILaunchtemplate](#cdk-serverless-api-ilaunchtemplate)|*No description*


**Enums**

Name|Description
----|-----------
[BlockDuration](#cdk-serverless-api-blockduration)|*No description*
[InstanceInterruptionBehavior](#cdk-serverless-api-instanceinterruptionbehavior)|*No description*



## class EksSpotCluster 🔹 <a id="cdk-serverless-api-eksspotcluster"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IResource](#aws-cdk-core-iresource), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IConstruct](#aws-cdk-core-iconstruct)
__Extends__: [Resource](#aws-cdk-core-resource)

### Initializer




```ts
new EksSpotCluster(scope: Construct, id: string, props: EksSpotClusterProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[EksSpotClusterProps](#cdk-serverless-api-eksspotclusterprops)</code>)  *No description*
  * **description** (<code>string</code>)  A description of the stack. __*Default*__: No description.
  * **env** (<code>[Environment](#aws-cdk-core-environment)</code>)  The AWS environment (account/region) where this stack will be deployed. __*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
  * **stackName** (<code>string</code>)  Name to deploy the stack with. __*Default*__: Derived from construct path.
  * **synthesizer** (<code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code>)  Synthesis method to use while deploying this stack. __*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
  * **tags** (<code>Map<string, string></code>)  Stack tags that will be applied to all the taggable resources and the stack itself. __*Default*__: {}
  * **terminationProtection** (<code>boolean</code>)  Whether to enable termination protection for this stack. __*Default*__: false
  * **clusterVersion** (<code>[KubernetesVersion](#aws-cdk-aws-eks-kubernetesversion)</code>)  *No description* 
  * **clusterAttributes** (<code>[ClusterAttributes](#aws-cdk-aws-eks-clusterattributes)</code>)  *No description* __*Optional*__
  * **customAmiId** (<code>string</code>)  Specify a custom AMI ID for your spot fleet. __*Default*__: none
  * **instanceInterruptionBehavior** (<code>[InstanceInterruptionBehavior](#cdk-serverless-api-instanceinterruptionbehavior)</code>)  *No description* __*Optional*__
  * **instanceRole** (<code>[IRole](#aws-cdk-aws-iam-irole)</code>)  *No description* __*Optional*__
  * **kubectlEnabled** (<code>boolean</code>)  *No description* __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**cluster**🔹 | <code>[Cluster](#aws-cdk-aws-eks-cluster)</code> | <span></span>
**clusterVersion**🔹 | <code>[KubernetesVersion](#aws-cdk-aws-eks-kubernetesversion)</code> | <span></span>
**vpc**🔹 | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | <span></span>

### Methods


#### addDays(date, days)🔹 <a id="cdk-serverless-api-eksspotcluster-adddays"></a>



```ts
addDays(date: date, days: number): date
```

* **date** (<code>date</code>)  *No description*
* **days** (<code>number</code>)  *No description*

__Returns__:
* <code>date</code>

#### addHours(date, hours)🔹 <a id="cdk-serverless-api-eksspotcluster-addhours"></a>



```ts
addHours(date: date, hours: number): date
```

* **date** (<code>date</code>)  *No description*
* **hours** (<code>number</code>)  *No description*

__Returns__:
* <code>date</code>

#### addMinutes(date, minutes)🔹 <a id="cdk-serverless-api-eksspotcluster-addminutes"></a>



```ts
addMinutes(date: date, minutes: number): date
```

* **date** (<code>date</code>)  *No description*
* **minutes** (<code>number</code>)  *No description*

__Returns__:
* <code>date</code>

#### addSpotFleet(id, props)🔹 <a id="cdk-serverless-api-eksspotcluster-addspotfleet"></a>



```ts
addSpotFleet(id: string, props: BaseSpotFleetProps): void
```

* **id** (<code>string</code>)  *No description*
* **props** (<code>[BaseSpotFleetProps](#cdk-serverless-api-basespotfleetprops)</code>)  *No description*
  * **account** (<code>string</code>)  The AWS account ID this resource belongs to. __*Default*__: the resource is in the same account as the stack it belongs to
  * **physicalName** (<code>string</code>)  The value passed in by users to the physical name prop of the resource. __*Default*__: The physical name will be allocated by CloudFormation at deployment time
  * **region** (<code>string</code>)  The AWS region this resource belongs to. __*Default*__: the resource is in the same region as the stack it belongs to
  * **blockDuration** (<code>[BlockDuration](#cdk-serverless-api-blockduration)</code>)  *No description* __*Optional*__
  * **bootstrapEnabled** (<code>boolean</code>)  *No description* __*Optional*__
  * **customAmiId** (<code>string</code>)  *No description* __*Optional*__
  * **defaultInstanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  *No description* __*Optional*__
  * **instanceInterruptionBehavior** (<code>[InstanceInterruptionBehavior](#cdk-serverless-api-instanceinterruptionbehavior)</code>)  *No description* __*Optional*__
  * **instanceRole** (<code>[Role](#aws-cdk-aws-iam-role)</code>)  *No description* __*Optional*__
  * **mapRole** (<code>boolean</code>)  *No description* __*Optional*__
  * **targetCapacity** (<code>number</code>)  *No description* __*Optional*__
  * **terminateInstancesWithExpiration** (<code>boolean</code>)  *No description* __*Optional*__
  * **validFrom** (<code>string</code>)  *No description* __*Optional*__
  * **validUntil** (<code>string</code>)  *No description* __*Optional*__






## class LaunchTemplate 🔹 <a id="cdk-serverless-api-launchtemplate"></a>



__Implements__: [ILaunchtemplate](#cdk-serverless-api-ilaunchtemplate)

### Initializer




```ts
new LaunchTemplate()
```



### Methods


#### bind(spotfleet)🔹 <a id="cdk-serverless-api-launchtemplate-bind"></a>



```ts
bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig
```

* **spotfleet** (<code>[SpotFleet](#cdk-serverless-api-spotfleet)</code>)  *No description*

__Returns__:
* <code>[SpotFleetLaunchTemplateConfig](#cdk-serverless-api-spotfleetlaunchtemplateconfig)</code>



## class SpotFleet 🔹 <a id="cdk-serverless-api-spotfleet"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IResource](#aws-cdk-core-iresource), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IConstruct](#aws-cdk-core-iconstruct)
__Extends__: [Resource](#aws-cdk-core-resource)

### Initializer




```ts
new SpotFleet(scope: Construct, id: string, props: SpotFleetProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SpotFleetProps](#cdk-serverless-api-spotfleetprops)</code>)  *No description*
  * **account** (<code>string</code>)  The AWS account ID this resource belongs to. __*Default*__: the resource is in the same account as the stack it belongs to
  * **physicalName** (<code>string</code>)  The value passed in by users to the physical name prop of the resource. __*Default*__: The physical name will be allocated by CloudFormation at deployment time
  * **region** (<code>string</code>)  The AWS region this resource belongs to. __*Default*__: the resource is in the same region as the stack it belongs to
  * **blockDuration** (<code>[BlockDuration](#cdk-serverless-api-blockduration)</code>)  *No description* __*Optional*__
  * **bootstrapEnabled** (<code>boolean</code>)  *No description* __*Optional*__
  * **customAmiId** (<code>string</code>)  *No description* __*Optional*__
  * **defaultInstanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  *No description* __*Optional*__
  * **instanceInterruptionBehavior** (<code>[InstanceInterruptionBehavior](#cdk-serverless-api-instanceinterruptionbehavior)</code>)  *No description* __*Optional*__
  * **instanceRole** (<code>[Role](#aws-cdk-aws-iam-role)</code>)  *No description* __*Optional*__
  * **mapRole** (<code>boolean</code>)  *No description* __*Optional*__
  * **targetCapacity** (<code>number</code>)  *No description* __*Optional*__
  * **terminateInstancesWithExpiration** (<code>boolean</code>)  *No description* __*Optional*__
  * **validFrom** (<code>string</code>)  *No description* __*Optional*__
  * **validUntil** (<code>string</code>)  *No description* __*Optional*__
  * **cluster** (<code>[EksSpotCluster](#cdk-serverless-api-eksspotcluster)</code>)  *No description* 
  * **launchTemplate** (<code>[ILaunchtemplate](#cdk-serverless-api-ilaunchtemplate)</code>)  *No description* __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**clusterStack**🔹 | <code>[EksSpotCluster](#cdk-serverless-api-eksspotcluster)</code> | <span></span>
**defaultInstanceType**🔹 | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | <span></span>
**instanceRole**🔹 | <code>[IRole](#aws-cdk-aws-iam-irole)</code> | <span></span>
**launchTemplate**🔹 | <code>[ILaunchtemplate](#cdk-serverless-api-ilaunchtemplate)</code> | <span></span>
**spotFleetId**🔹 | <code>string</code> | <span></span>
**targetCapacity**?🔹 | <code>number</code> | __*Optional*__



## struct BaseSpotFleetProps 🔹 <a id="cdk-serverless-api-basespotfleetprops"></a>






Name | Type | Description 
-----|------|-------------
**account**?🔹 | <code>string</code> | The AWS account ID this resource belongs to.<br/>__*Default*__: the resource is in the same account as the stack it belongs to
**blockDuration**?🔹 | <code>[BlockDuration](#cdk-serverless-api-blockduration)</code> | __*Optional*__
**bootstrapEnabled**?🔹 | <code>boolean</code> | __*Optional*__
**customAmiId**?🔹 | <code>string</code> | __*Optional*__
**defaultInstanceType**?🔹 | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | __*Optional*__
**instanceInterruptionBehavior**?🔹 | <code>[InstanceInterruptionBehavior](#cdk-serverless-api-instanceinterruptionbehavior)</code> | __*Optional*__
**instanceRole**?🔹 | <code>[Role](#aws-cdk-aws-iam-role)</code> | __*Optional*__
**mapRole**?🔹 | <code>boolean</code> | __*Optional*__
**physicalName**?🔹 | <code>string</code> | The value passed in by users to the physical name prop of the resource.<br/>__*Default*__: The physical name will be allocated by CloudFormation at deployment time
**region**?🔹 | <code>string</code> | The AWS region this resource belongs to.<br/>__*Default*__: the resource is in the same region as the stack it belongs to
**targetCapacity**?🔹 | <code>number</code> | __*Optional*__
**terminateInstancesWithExpiration**?🔹 | <code>boolean</code> | __*Optional*__
**validFrom**?🔹 | <code>string</code> | __*Optional*__
**validUntil**?🔹 | <code>string</code> | __*Optional*__



## struct EksSpotClusterProps 🔹 <a id="cdk-serverless-api-eksspotclusterprops"></a>






Name | Type | Description 
-----|------|-------------
**clusterVersion**🔹 | <code>[KubernetesVersion](#aws-cdk-aws-eks-kubernetesversion)</code> | <span></span>
**clusterAttributes**?🔹 | <code>[ClusterAttributes](#aws-cdk-aws-eks-clusterattributes)</code> | __*Optional*__
**customAmiId**?🔹 | <code>string</code> | Specify a custom AMI ID for your spot fleet.<br/>__*Default*__: none
**description**?🔹 | <code>string</code> | A description of the stack.<br/>__*Default*__: No description.
**env**?🔹 | <code>[Environment](#aws-cdk-core-environment)</code> | The AWS environment (account/region) where this stack will be deployed.<br/>__*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
**instanceInterruptionBehavior**?🔹 | <code>[InstanceInterruptionBehavior](#cdk-serverless-api-instanceinterruptionbehavior)</code> | __*Optional*__
**instanceRole**?🔹 | <code>[IRole](#aws-cdk-aws-iam-irole)</code> | __*Optional*__
**kubectlEnabled**?🔹 | <code>boolean</code> | __*Optional*__
**stackName**?🔹 | <code>string</code> | Name to deploy the stack with.<br/>__*Default*__: Derived from construct path.
**synthesizer**?🔹 | <code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code> | Synthesis method to use while deploying this stack.<br/>__*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
**tags**?🔹 | <code>Map<string, string></code> | Stack tags that will be applied to all the taggable resources and the stack itself.<br/>__*Default*__: {}
**terminationProtection**?🔹 | <code>boolean</code> | Whether to enable termination protection for this stack.<br/>__*Default*__: false



## interface ILaunchtemplate 🔹 <a id="cdk-serverless-api-ilaunchtemplate"></a>

__Implemented by__: [LaunchTemplate](#cdk-serverless-api-launchtemplate)


### Methods


#### bind(spotfleet)🔹 <a id="cdk-serverless-api-ilaunchtemplate-bind"></a>



```ts
bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig
```

* **spotfleet** (<code>[SpotFleet](#cdk-serverless-api-spotfleet)</code>)  *No description*

__Returns__:
* <code>[SpotFleetLaunchTemplateConfig](#cdk-serverless-api-spotfleetlaunchtemplateconfig)</code>



## struct SpotFleetLaunchTemplateConfig 🔹 <a id="cdk-serverless-api-spotfleetlaunchtemplateconfig"></a>

__Obtainable from__: [LaunchTemplate](#cdk-serverless-api-launchtemplate).[bind](#cdk-serverless-api-launchtemplate#cdk-serverless-api-launchtemplate-bind)()





Name | Type | Description 
-----|------|-------------
**launchTemplate**🔹 | <code>[ILaunchtemplate](#cdk-serverless-api-ilaunchtemplate)</code> | <span></span>
**spotfleet**🔹 | <code>[SpotFleet](#cdk-serverless-api-spotfleet)</code> | <span></span>



## struct SpotFleetProps 🔹 <a id="cdk-serverless-api-spotfleetprops"></a>






Name | Type | Description 
-----|------|-------------
**cluster**🔹 | <code>[EksSpotCluster](#cdk-serverless-api-eksspotcluster)</code> | <span></span>
**account**?🔹 | <code>string</code> | The AWS account ID this resource belongs to.<br/>__*Default*__: the resource is in the same account as the stack it belongs to
**blockDuration**?🔹 | <code>[BlockDuration](#cdk-serverless-api-blockduration)</code> | __*Optional*__
**bootstrapEnabled**?🔹 | <code>boolean</code> | __*Optional*__
**customAmiId**?🔹 | <code>string</code> | __*Optional*__
**defaultInstanceType**?🔹 | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | __*Optional*__
**instanceInterruptionBehavior**?🔹 | <code>[InstanceInterruptionBehavior](#cdk-serverless-api-instanceinterruptionbehavior)</code> | __*Optional*__
**instanceRole**?🔹 | <code>[Role](#aws-cdk-aws-iam-role)</code> | __*Optional*__
**launchTemplate**?🔹 | <code>[ILaunchtemplate](#cdk-serverless-api-ilaunchtemplate)</code> | __*Optional*__
**mapRole**?🔹 | <code>boolean</code> | __*Optional*__
**physicalName**?🔹 | <code>string</code> | The value passed in by users to the physical name prop of the resource.<br/>__*Default*__: The physical name will be allocated by CloudFormation at deployment time
**region**?🔹 | <code>string</code> | The AWS region this resource belongs to.<br/>__*Default*__: the resource is in the same region as the stack it belongs to
**targetCapacity**?🔹 | <code>number</code> | __*Optional*__
**terminateInstancesWithExpiration**?🔹 | <code>boolean</code> | __*Optional*__
**validFrom**?🔹 | <code>string</code> | __*Optional*__
**validUntil**?🔹 | <code>string</code> | __*Optional*__



## enum BlockDuration 🔹 <a id="cdk-serverless-api-blockduration"></a>



Name | Description
-----|-----
**ONE_HOUR** 🔹|
**TWO_HOURS** 🔹|
**THREE_HOURS** 🔹|
**FOUR_HOURS** 🔹|
**FIVE_HOURS** 🔹|
**SIX_HOURS** 🔹|


## enum InstanceInterruptionBehavior 🔹 <a id="cdk-serverless-api-instanceinterruptionbehavior"></a>



Name | Description
-----|-----
**HIBERNATE** 🔹|
**STOP** 🔹|
**TERMINATE** 🔹|


