#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { AwsOpensearchCdkExampleStack } from "../lib/aws-opensearch-cdk-example-stack";
import { SecondStack } from "../lib/second-stack copy";

const app = new cdk.App();
const firstStack = new AwsOpensearchCdkExampleStack(
  app,
  "AwsOpensearchCdkExampleStack",
  {}
);

new SecondStack(app, "SecondStack", {
  domain: firstStack.domain,
});
