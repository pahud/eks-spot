# API Reference

**Classes**

Name|Description
----|-----------
[EksSpotCluster](#eks-spot-blocks-eksspotcluster)|*No description*
[LaunchTemplate](#eks-spot-blocks-launchtemplate)|*No description*
[SpotFleet](#eks-spot-blocks-spotfleet)|*No description*


**Structs**

Name|Description
----|-----------
[BaseSpotFleetProps](#eks-spot-blocks-basespotfleetprops)|*No description*
[EksSpotClusterProps](#eks-spot-blocks-eksspotclusterprops)|*No description*
[SpotFleetLaunchTemplateConfig](#eks-spot-blocks-spotfleetlaunchtemplateconfig)|*No description*
[SpotFleetProps](#eks-spot-blocks-spotfleetprops)|*No description*


**Interfaces**

Name|Description
----|-----------
[ILaunchtemplate](#eks-spot-blocks-ilaunchtemplate)|*No description*


**Enums**

Name|Description
----|-----------
[BlockDuration](#eks-spot-blocks-blockduration)|*No description*
[InstanceInterruptionBehavior](#eks-spot-blocks-instanceinterruptionbehavior)|*No description*



## class EksSpotCluster 🔹 <a id="eks-spot-blocks-eksspotcluster"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IResource](#aws-cdk-core-iresource), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IConstruct](#aws-cdk-core-iconstruct)
__Extends__: [Resource](#aws-cdk-core-resource)

### Initializer




```ts
new EksSpotCluster(scope: Construct, id: string, props: EksSpotClusterProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[EksSpotClusterProps](#eks-spot-blocks-eksspotclusterprops)</code>)  *No description*
  * **description** (<code>string</code>)  A description of the stack. __*Default*__: No description.
  * **env** (<code>[Environment](#aws-cdk-core-environment)</code>)  The AWS environment (account/region) where this stack will be deployed. __*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
  * **stackName** (<code>string</code>)  Name to deploy the stack with. __*Default*__: Derived from construct path.
  * **synthesizer** (<code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code>)  Synthesis method to use while deploying this stack. __*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
  * **tags** (<code>Map<string, string></code>)  Stack tags that will be applied to all the taggable resources and the stack itself. __*Default*__: {}
  * **terminationProtection** (<code>boolean</code>)  Whether to enable termination protection for this stack. __*Default*__: false
  * **clusterVersion** (<code>[KubernetesVersion](#aws-cdk-aws-eks-kubernetesversion)</code>)  *No description* 
  * **clusterAttributes** (<code>[ClusterAttributes](#aws-cdk-aws-eks-clusterattributes)</code>)  *No description* __*Optional*__
  * **customAmiId** (<code>string</code>)  Specify a custom AMI ID for your spot fleet. __*Default*__: none
  * **instanceInterruptionBehavior** (<code>[InstanceInterruptionBehavior](#eks-spot-blocks-instanceinterruptionbehavior)</code>)  *No description* __*Optional*__
  * **instanceRole** (<code>[IRole](#aws-cdk-aws-iam-irole)</code>)  *No description* __*Optional*__
  * **kubectlEnabled** (<code>boolean</code>)  *No description* __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**cluster**🔹 | <code>[Cluster](#aws-cdk-aws-eks-cluster)</code> | <span></span>
**clusterVersion**🔹 | <code>[KubernetesVersion](#aws-cdk-aws-eks-kubernetesversion)</code> | <span></span>
**vpc**🔹 | <code>[IVpc](#aws-cdk-aws-ec2-ivpc)</code> | <span></span>

### Methods


#### addDays(date, days)🔹 <a id="eks-spot-blocks-eksspotcluster-adddays"></a>



```ts
addDays(date: date, days: number): date
```

* **date** (<code>date</code>)  *No description*
* **days** (<code>number</code>)  *No description*

__Returns__:
* <code>date</code>

#### addHours(date, hours)🔹 <a id="eks-spot-blocks-eksspotcluster-addhours"></a>



```ts
addHours(date: date, hours: number): date
```

* **date** (<code>date</code>)  *No description*
* **hours** (<code>number</code>)  *No description*

__Returns__:
* <code>date</code>

#### addMinutes(date, minutes)🔹 <a id="eks-spot-blocks-eksspotcluster-addminutes"></a>



```ts
addMinutes(date: date, minutes: number): date
```

* **date** (<code>date</code>)  *No description*
* **minutes** (<code>number</code>)  *No description*

__Returns__:
* <code>date</code>

#### addSpotFleet(id, props)🔹 <a id="eks-spot-blocks-eksspotcluster-addspotfleet"></a>



```ts
addSpotFleet(id: string, props: BaseSpotFleetProps): void
```

* **id** (<code>string</code>)  *No description*
* **props** (<code>[BaseSpotFleetProps](#eks-spot-blocks-basespotfleetprops)</code>)  *No description*
  * **account** (<code>string</code>)  The AWS account ID this resource belongs to. __*Default*__: the resource is in the same account as the stack it belongs to
  * **physicalName** (<code>string</code>)  The value passed in by users to the physical name prop of the resource. __*Default*__: The physical name will be allocated by CloudFormation at deployment time
  * **region** (<code>string</code>)  The AWS region this resource belongs to. __*Default*__: the resource is in the same region as the stack it belongs to
  * **blockDuration** (<code>[BlockDuration](#eks-spot-blocks-blockduration)</code>)  *No description* __*Optional*__
  * **bootstrapEnabled** (<code>boolean</code>)  *No description* __*Optional*__
  * **customAmiId** (<code>string</code>)  *No description* __*Optional*__
  * **defaultInstanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  *No description* __*Optional*__
  * **instanceInterruptionBehavior** (<code>[InstanceInterruptionBehavior](#eks-spot-blocks-instanceinterruptionbehavior)</code>)  *No description* __*Optional*__
  * **instanceRole** (<code>[Role](#aws-cdk-aws-iam-role)</code>)  *No description* __*Optional*__
  * **mapRole** (<code>boolean</code>)  *No description* __*Optional*__
  * **targetCapacity** (<code>number</code>)  *No description* __*Optional*__
  * **terminateInstancesWithExpiration** (<code>boolean</code>)  *No description* __*Optional*__
  * **validFrom** (<code>string</code>)  *No description* __*Optional*__
  * **validUntil** (<code>string</code>)  *No description* __*Optional*__






## class LaunchTemplate 🔹 <a id="eks-spot-blocks-launchtemplate"></a>



__Implements__: [ILaunchtemplate](#eks-spot-blocks-ilaunchtemplate)

### Initializer




```ts
new LaunchTemplate()
```



### Methods


#### bind(spotfleet)🔹 <a id="eks-spot-blocks-launchtemplate-bind"></a>



```ts
bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig
```

* **spotfleet** (<code>[SpotFleet](#eks-spot-blocks-spotfleet)</code>)  *No description*

__Returns__:
* <code>[SpotFleetLaunchTemplateConfig](#eks-spot-blocks-spotfleetlaunchtemplateconfig)</code>



## class SpotFleet 🔹 <a id="eks-spot-blocks-spotfleet"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IResource](#aws-cdk-core-iresource), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable), [IConstruct](#aws-cdk-core-iconstruct)
__Extends__: [Resource](#aws-cdk-core-resource)

### Initializer




```ts
new SpotFleet(scope: Construct, id: string, props: SpotFleetProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[SpotFleetProps](#eks-spot-blocks-spotfleetprops)</code>)  *No description*
  * **account** (<code>string</code>)  The AWS account ID this resource belongs to. __*Default*__: the resource is in the same account as the stack it belongs to
  * **physicalName** (<code>string</code>)  The value passed in by users to the physical name prop of the resource. __*Default*__: The physical name will be allocated by CloudFormation at deployment time
  * **region** (<code>string</code>)  The AWS region this resource belongs to. __*Default*__: the resource is in the same region as the stack it belongs to
  * **blockDuration** (<code>[BlockDuration](#eks-spot-blocks-blockduration)</code>)  *No description* __*Optional*__
  * **bootstrapEnabled** (<code>boolean</code>)  *No description* __*Optional*__
  * **customAmiId** (<code>string</code>)  *No description* __*Optional*__
  * **defaultInstanceType** (<code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code>)  *No description* __*Optional*__
  * **instanceInterruptionBehavior** (<code>[InstanceInterruptionBehavior](#eks-spot-blocks-instanceinterruptionbehavior)</code>)  *No description* __*Optional*__
  * **instanceRole** (<code>[Role](#aws-cdk-aws-iam-role)</code>)  *No description* __*Optional*__
  * **mapRole** (<code>boolean</code>)  *No description* __*Optional*__
  * **targetCapacity** (<code>number</code>)  *No description* __*Optional*__
  * **terminateInstancesWithExpiration** (<code>boolean</code>)  *No description* __*Optional*__
  * **validFrom** (<code>string</code>)  *No description* __*Optional*__
  * **validUntil** (<code>string</code>)  *No description* __*Optional*__
  * **cluster** (<code>[EksSpotCluster](#eks-spot-blocks-eksspotcluster)</code>)  *No description* 
  * **launchTemplate** (<code>[ILaunchtemplate](#eks-spot-blocks-ilaunchtemplate)</code>)  *No description* __*Optional*__



### Properties


Name | Type | Description 
-----|------|-------------
**clusterStack**🔹 | <code>[EksSpotCluster](#eks-spot-blocks-eksspotcluster)</code> | <span></span>
**defaultInstanceType**🔹 | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | <span></span>
**instanceRole**🔹 | <code>[IRole](#aws-cdk-aws-iam-irole)</code> | <span></span>
**launchTemplate**🔹 | <code>[ILaunchtemplate](#eks-spot-blocks-ilaunchtemplate)</code> | <span></span>
**spotFleetId**🔹 | <code>string</code> | <span></span>
**targetCapacity**?🔹 | <code>number</code> | __*Optional*__



## struct BaseSpotFleetProps 🔹 <a id="eks-spot-blocks-basespotfleetprops"></a>






Name | Type | Description 
-----|------|-------------
**account**?🔹 | <code>string</code> | The AWS account ID this resource belongs to.<br/>__*Default*__: the resource is in the same account as the stack it belongs to
**blockDuration**?🔹 | <code>[BlockDuration](#eks-spot-blocks-blockduration)</code> | __*Optional*__
**bootstrapEnabled**?🔹 | <code>boolean</code> | __*Optional*__
**customAmiId**?🔹 | <code>string</code> | __*Optional*__
**defaultInstanceType**?🔹 | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | __*Optional*__
**instanceInterruptionBehavior**?🔹 | <code>[InstanceInterruptionBehavior](#eks-spot-blocks-instanceinterruptionbehavior)</code> | __*Optional*__
**instanceRole**?🔹 | <code>[Role](#aws-cdk-aws-iam-role)</code> | __*Optional*__
**mapRole**?🔹 | <code>boolean</code> | __*Optional*__
**physicalName**?🔹 | <code>string</code> | The value passed in by users to the physical name prop of the resource.<br/>__*Default*__: The physical name will be allocated by CloudFormation at deployment time
**region**?🔹 | <code>string</code> | The AWS region this resource belongs to.<br/>__*Default*__: the resource is in the same region as the stack it belongs to
**targetCapacity**?🔹 | <code>number</code> | __*Optional*__
**terminateInstancesWithExpiration**?🔹 | <code>boolean</code> | __*Optional*__
**validFrom**?🔹 | <code>string</code> | __*Optional*__
**validUntil**?🔹 | <code>string</code> | __*Optional*__



## struct EksSpotClusterProps 🔹 <a id="eks-spot-blocks-eksspotclusterprops"></a>






Name | Type | Description 
-----|------|-------------
**clusterVersion**🔹 | <code>[KubernetesVersion](#aws-cdk-aws-eks-kubernetesversion)</code> | <span></span>
**clusterAttributes**?🔹 | <code>[ClusterAttributes](#aws-cdk-aws-eks-clusterattributes)</code> | __*Optional*__
**customAmiId**?🔹 | <code>string</code> | Specify a custom AMI ID for your spot fleet.<br/>__*Default*__: none
**description**?🔹 | <code>string</code> | A description of the stack.<br/>__*Default*__: No description.
**env**?🔹 | <code>[Environment](#aws-cdk-core-environment)</code> | The AWS environment (account/region) where this stack will be deployed.<br/>__*Default*__: The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.
**instanceInterruptionBehavior**?🔹 | <code>[InstanceInterruptionBehavior](#eks-spot-blocks-instanceinterruptionbehavior)</code> | __*Optional*__
**instanceRole**?🔹 | <code>[IRole](#aws-cdk-aws-iam-irole)</code> | __*Optional*__
**kubectlEnabled**?🔹 | <code>boolean</code> | __*Optional*__
**stackName**?🔹 | <code>string</code> | Name to deploy the stack with.<br/>__*Default*__: Derived from construct path.
**synthesizer**?🔹 | <code>[IStackSynthesizer](#aws-cdk-core-istacksynthesizer)</code> | Synthesis method to use while deploying this stack.<br/>__*Default*__: `DefaultStackSynthesizer` if the `@aws-cdk/core:newStyleStackSynthesis` feature flag is set, `LegacyStackSynthesizer` otherwise.
**tags**?🔹 | <code>Map<string, string></code> | Stack tags that will be applied to all the taggable resources and the stack itself.<br/>__*Default*__: {}
**terminationProtection**?🔹 | <code>boolean</code> | Whether to enable termination protection for this stack.<br/>__*Default*__: false



## interface ILaunchtemplate 🔹 <a id="eks-spot-blocks-ilaunchtemplate"></a>

__Implemented by__: [LaunchTemplate](#eks-spot-blocks-launchtemplate)


### Methods


#### bind(spotfleet)🔹 <a id="eks-spot-blocks-ilaunchtemplate-bind"></a>



```ts
bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig
```

* **spotfleet** (<code>[SpotFleet](#eks-spot-blocks-spotfleet)</code>)  *No description*

__Returns__:
* <code>[SpotFleetLaunchTemplateConfig](#eks-spot-blocks-spotfleetlaunchtemplateconfig)</code>



## struct SpotFleetLaunchTemplateConfig 🔹 <a id="eks-spot-blocks-spotfleetlaunchtemplateconfig"></a>

__Obtainable from__: [LaunchTemplate](#eks-spot-blocks-launchtemplate).[bind](#eks-spot-blocks-launchtemplate#eks-spot-blocks-launchtemplate-bind)()





Name | Type | Description 
-----|------|-------------
**launchTemplate**🔹 | <code>[ILaunchtemplate](#eks-spot-blocks-ilaunchtemplate)</code> | <span></span>
**spotfleet**🔹 | <code>[SpotFleet](#eks-spot-blocks-spotfleet)</code> | <span></span>



## struct SpotFleetProps 🔹 <a id="eks-spot-blocks-spotfleetprops"></a>






Name | Type | Description 
-----|------|-------------
**cluster**🔹 | <code>[EksSpotCluster](#eks-spot-blocks-eksspotcluster)</code> | <span></span>
**account**?🔹 | <code>string</code> | The AWS account ID this resource belongs to.<br/>__*Default*__: the resource is in the same account as the stack it belongs to
**blockDuration**?🔹 | <code>[BlockDuration](#eks-spot-blocks-blockduration)</code> | __*Optional*__
**bootstrapEnabled**?🔹 | <code>boolean</code> | __*Optional*__
**customAmiId**?🔹 | <code>string</code> | __*Optional*__
**defaultInstanceType**?🔹 | <code>[InstanceType](#aws-cdk-aws-ec2-instancetype)</code> | __*Optional*__
**instanceInterruptionBehavior**?🔹 | <code>[InstanceInterruptionBehavior](#eks-spot-blocks-instanceinterruptionbehavior)</code> | __*Optional*__
**instanceRole**?🔹 | <code>[Role](#aws-cdk-aws-iam-role)</code> | __*Optional*__
**launchTemplate**?🔹 | <code>[ILaunchtemplate](#eks-spot-blocks-ilaunchtemplate)</code> | __*Optional*__
**mapRole**?🔹 | <code>boolean</code> | __*Optional*__
**physicalName**?🔹 | <code>string</code> | The value passed in by users to the physical name prop of the resource.<br/>__*Default*__: The physical name will be allocated by CloudFormation at deployment time
**region**?🔹 | <code>string</code> | The AWS region this resource belongs to.<br/>__*Default*__: the resource is in the same region as the stack it belongs to
**targetCapacity**?🔹 | <code>number</code> | __*Optional*__
**terminateInstancesWithExpiration**?🔹 | <code>boolean</code> | __*Optional*__
**validFrom**?🔹 | <code>string</code> | __*Optional*__
**validUntil**?🔹 | <code>string</code> | __*Optional*__



## enum BlockDuration 🔹 <a id="eks-spot-blocks-blockduration"></a>



Name | Description
-----|-----
**ONE_HOUR** 🔹|
**TWO_HOURS** 🔹|
**THREE_HOURS** 🔹|
**FOUR_HOURS** 🔹|
**FIVE_HOURS** 🔹|
**SIX_HOURS** 🔹|


## enum InstanceInterruptionBehavior 🔹 <a id="eks-spot-blocks-instanceinterruptionbehavior"></a>



Name | Description
-----|-----
**HIBERNATE** 🔹|
**STOP** 🔹|
**TERMINATE** 🔹|


