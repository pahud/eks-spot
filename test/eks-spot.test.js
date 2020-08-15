"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const cdk = require("@aws-cdk/core");
const EksSpot = require("../lib");
const eks = require("@aws-cdk/aws-eks");
test('create cluster only', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'EksSpotStack');
    // WHEN
    new EksSpot.EksSpotCluster(stack, 'MyTestStack', {
        clusterVersion: eks.KubernetesVersion.V1_16,
    });
    // THEN
    assert_1.expect(stack).to(assert_1.haveResource('Custom::AWSCDK-EKS-Cluster'));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWtzLXNwb3QudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVrcy1zcG90LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBb0U7QUFDcEUscUNBQXFDO0FBQ3JDLGtDQUFrQztBQUNsQyx3Q0FBd0M7QUFFeEMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUMvQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBRWpELE9BQU87SUFDUCxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtRQUMvQyxjQUFjLEVBQUUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUs7S0FDNUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTztJQUNQLGVBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMscUJBQVksQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHBlY3QgYXMgZXhwZWN0Q0RLLCBoYXZlUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9hc3NlcnQnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgRWtzU3BvdCBmcm9tICcuLi9saWInO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJ0Bhd3MtY2RrL2F3cy1la3MnO1xuXG50ZXN0KCdjcmVhdGUgY2x1c3RlciBvbmx5JywgKCkgPT4ge1xuICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnRWtzU3BvdFN0YWNrJyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgRWtzU3BvdC5Fa3NTcG90Q2x1c3RlcihzdGFjaywgJ015VGVzdFN0YWNrJywge1xuICAgIGNsdXN0ZXJWZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMTYsXG4gIH0pO1xuICAvLyBUSEVOXG4gIGV4cGVjdENESyhzdGFjaykudG8oaGF2ZVJlc291cmNlKCdDdXN0b206OkFXU0NESy1FS1MtQ2x1c3RlcicpKTtcbn0pO1xuIl19