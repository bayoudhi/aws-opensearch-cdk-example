import * as cdk from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Domain } from "aws-cdk-lib/aws-opensearchservice";
import { Construct } from "constructs";

interface SecondStackProps extends cdk.StackProps {
  domain: Domain;
}

export class SecondStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SecondStackProps) {
    super(scope, id, props);

    const { domain } = props;

    const fn = new Function(this, "MyFunction", {
      runtime: Runtime.NODEJS_16_X,
      handler: "index.handler",
      code: Code.fromAsset(`lib/lambda`),
      environment: {
        DOMAIN: domain.domainEndpoint,
      },
    });

    domain.grantReadWrite(fn);
  }
}
