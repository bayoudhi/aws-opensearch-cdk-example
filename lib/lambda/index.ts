var AWS = require('aws-sdk');
import * as path from "path";

console.log("Loading function");

var openSearchDomain = {
  endpoint: process.env.DOMAIN_ENDPOINT as string,
  region: process.env.AWS_REGION as string,
  index: "records",
  doctype: "movie",
};

var creds = new AWS.EnvironmentCredentials("AWS");
var endpoint = new AWS.Endpoint(openSearchDomain.endpoint);

function postDocumentToOpenSearch(doc: any, context: any) {
  var req = new AWS.HttpRequest(endpoint, openSearchDomain.region);

  req.method = "POST";
  req.path = path.join("/", openSearchDomain.index, openSearchDomain.doctype);
//   req.region = openSearchDomain.region;
  req.body = doc;
  req.headers["presigned-expires"] = 'false';
  req.headers["Host"] = openSearchDomain.endpoint;
  req.headers["Content-Type"] = "application/json";

  // Sign the request (Sigv4)
  var signer = new AWS.Signers.V4(req, "es");
  signer.addAuthorization(creds, new Date());

  // Post document to the OpenSearch Service
  var send = new AWS.NodeHttpClient();

  send.handleRequest(
    req,
    null,
    (httpResp: any) => {
      var body = "";
      httpResp.on("data", (chunk: any) => {
        body += chunk;
      });
      httpResp.on("end", () => {
        console.log("All movie records added to the OpenSearch Service.");
        context.succeed();
      });
    },
    (err: any) => {
      console.log("Error: " + err);
      context.fail();
    }
  );
}

export const handler = (event: any, context: any) => {
  console.log("Received event:", JSON.stringify(event, null, 2));
  postDocumentToOpenSearch('{ "title": "Moby Dick" }', context);
  postDocumentToOpenSearch('{ "title": "A Tale of Two Cities" }', context);
  postDocumentToOpenSearch('{ "title": "The Phantom of the Opera" }', context);

  return {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: `Hello from AWS Solutions Constructs!\n`,
  };
};
