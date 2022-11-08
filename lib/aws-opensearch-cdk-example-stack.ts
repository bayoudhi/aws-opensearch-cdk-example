import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Domain, EngineVersion } from "aws-cdk-lib/aws-opensearchservice";
export class AwsOpensearchCdkExampleStack extends cdk.Stack {
  public domain: Domain;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.domain = new Domain(this, "Domain", {
      version: EngineVersion.OPENSEARCH_1_3,
      capacity: {
        dataNodes: 1,
        dataNodeInstanceType: "t3.small.search",
      },
      logging: {
        appLogEnabled: true,
        slowSearchLogEnabled: true,
        slowIndexLogEnabled: true,
      },
    });
  }
}
