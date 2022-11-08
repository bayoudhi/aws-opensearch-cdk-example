import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { Client } from "@opensearch-project/opensearch";
const { AwsSigv4Signer } = require("@opensearch-project/opensearch/aws");

const client = new Client({
  ...AwsSigv4Signer({
    region: process.env.AWS_REGION,
    getCredentials: () => {
      // Any other method to acquire a new Credentials object can be used.
      const credentialsProvider = defaultProvider();
      return credentialsProvider();
    },
  }),
  node: `https://${process.env.DOMAIN}`,
});

export const handler = async (event: any) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const indexResult = await client.index({
    index: "users",
    body: {
      name: "Hamza",
      dateCreated: new Date().toISOString(),
    },
  });

  console.log("User created successfully: %j", indexResult);

  return client.search({
    index: "users",
  });
};
