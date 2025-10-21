import * as pulumi from '@pulumi/pulumi';

export default class Constants {
  private static config: { [key: string]: pulumi.Config } = {};

  private static getConfig(configName: string): pulumi.Config {
    if (!this.config[configName]) {
      this.config[configName] = new pulumi.Config(configName);
    }

    return this.config[configName];
  }

  static get project(): string {
    return pulumi.getProject();
  }
  static get stack(): string {
    return pulumi.getStack();
  }
  static get useCustomDomain(): boolean {
    return this.getConfig('app').requireBoolean('useCustomDomain');
  }
  static get customDomain(): string {
    return this.getConfig('app').require('customDomain');
  }
  static get customSubDomain(): string {
    return this.getConfig('app').require('customSubDomain');
  }
  static get domainAssumeRole(): string {
    return this.getConfig('aws').require('domainAssumeRole');
  }
}
