import { Sha256 } from "@aws-crypto/sha256-browser";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { randomUUID } from "crypto";

const deleteDocument = async (params: {
  domain: string;
  index: string;
  documentId: string;
}): Promise<void> => {
  const { domain, index, documentId } = params;
  const request = new HttpRequest({
    headers: {
      "Content-Type": "application/json",
      host: domain,
    },
    hostname: domain,
    method: "DELETE",
    path: `${index}/_doc/${documentId}`,
  });

  await execute(request);
};

const indexDocument = async (params: {
  domain: string;
  index: string;
  documentId: string;
  document: any;
}): Promise<void> => {
  const { domain, index, documentId, document } = params;
  const request = new HttpRequest({
    body: JSON.stringify(document),
    headers: {
      "Content-Type": "application/json",
      host: domain,
    },
    hostname: domain,
    method: "PUT",
    path: `${index}/_doc/${documentId}`,
  });

  await execute(request);
};

async function streamToString(stream: any) {
  // lets have a ReadableStream as a stream variable
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

const execute = async (request: HttpRequest): Promise<void> => {
  const awsOpenSearchSigner = new SignatureV4({
    credentials: defaultProvider(),
    region: "us-east-1",
    service: "es",
    sha256: Sha256,
  });

  try {
    const signedRequest = await awsOpenSearchSigner.sign(request);
    const awsNodeHttpClient = new NodeHttpHandler();

    const { response } = await awsNodeHttpClient.handle(
      <HttpRequest>signedRequest
    );
    if (response.statusCode === 200 || response.statusCode === 201) {
      console.log(
        "Successfully sent request to OpenSearch Domain. Response code:",
        response.statusCode
      );
    } else {
      console.error(
        "Error occurred with request to OpenSearch Domain. Response code:",
        response.statusCode
      );
      const body = await streamToString(response.body);
      console.error(body);
    }
  } catch (error) {
    console.error(
      "Error occurred trying to make request to OpenSearch Domain",
      error
    );
    throw error;
  }
};

export const handler = async (event: any) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  await indexDocument({
    document: {
      name: "hamza",
    },
    documentId: randomUUID(),
    domain: process.env.DOMAIN_ENDPOINT as string,
    index: "users",
  });
};
