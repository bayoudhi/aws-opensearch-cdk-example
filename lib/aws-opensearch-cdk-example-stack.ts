import { LambdaToOpenSearch } from "@aws-solutions-constructs/aws-lambda-opensearch";
import * as cdk from "aws-cdk-lib";
import { Aws } from "aws-cdk-lib";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class AwsOpensearchCdkExampleStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new LambdaToOpenSearch(this, "LambdaToOpenSearch", {
      lambdaFunctionProps: {
        code: Code.fromAsset(`lib/lambdas/os-client`),
        runtime: Runtime.NODEJS_16_X,
        handler: "index.handler",
      },
      openSearchDomainName: "opensearch",
      cognitoDomainName: "globallyuniquedomain" + Aws.ACCOUNT_ID,
      openSearchDomainProps: {
        clusterConfig: {
          dedicatedMasterEnabled: false,
          instanceCount: 1,
          instanceType: "t3.small.search",
        },
      },
    });
  }
}
