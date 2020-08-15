import { SpotFleet } from './eks-spot';
export interface SpotFleetLaunchTemplateConfig {
    readonly spotfleet: SpotFleet;
    readonly launchTemplate: ILaunchtemplate;
}
export interface ILaunchtemplate {
    bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig;
}
export declare class LaunchTemplate implements ILaunchtemplate {
    bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig;
}
