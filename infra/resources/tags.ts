import * as pulumi from '@pulumi/pulumi';

const awsConfig = new pulumi.Config('aws');
const projectArea = awsConfig.require('projectArea');
const projectRepository = awsConfig.require('projectRepository');
const projectSource = awsConfig.require('projectSource');
const projectTeam = awsConfig.require('projectTeam');

const stack = pulumi.getStack();
const project = pulumi.getProject();

let tags: { [key: string]: string };

export function getTags(): { [key: string]: string } {
  if (tags) return tags;

  tags = {
    Area: projectArea,
    Environment: stack.charAt(0).toUpperCase() + stack.slice(1),
    Project: project.charAt(0).toUpperCase() + project.slice(1),
    Team: projectTeam,
    Repository: projectRepository,
    Source: projectSource,
  };

  return tags;
}
