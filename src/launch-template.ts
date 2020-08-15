import { SpotFleet } from './eks-spot';

export interface SpotFleetLaunchTemplateConfig {
  readonly spotfleet: SpotFleet
  readonly launchTemplate: ILaunchtemplate;
}

export interface ILaunchtemplate {
  bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig;
}

export class LaunchTemplate implements ILaunchtemplate {
  public bind(spotfleet: SpotFleet): SpotFleetLaunchTemplateConfig {
    return {
      spotfleet,
      launchTemplate: this,
    }
  }
}
