import * as AWS from "aws-sdk";
import * as AWS_MOCK from "aws-sdk-mock";

import { Mock } from "moq.ts";
import sinon from "ts-sinon";

import { APIGatewayProxyEvent, Context, Callback } from "aws-lambda";

import { handler } from "../src/index";

import { userFixture } from "./fixtures/userFixture";
import { userSettings as userSettingsFixture } from "./fixtures/userSettingsFixture";

describe("tests for multiple get calls in one handler", () => {
  let mockEvent = new Mock<APIGatewayProxyEvent>()
    .setup((instance) => instance.requestContext.authorizer)
    .returns({ principalId: "1" });
  let mockContext = new Mock<Context>();
  let mockCallback = new Mock<Callback>();

  it("Should return expected response", async () => {
    AWS_MOCK.setSDKInstance(AWS);

    // How to mock multiple GET calls to DynamoDB in a unit test
    // by returning different fixtures with each call
    const stub = sinon.stub();
    // first GET will return a fixture for user object
    stub.onCall(0).returns(userFixture);
    // second GET will return a fixture for user settings object
    stub.onCall(1).returns(userSettingsFixture);
    AWS_MOCK.mock(
      "DynamoDB.DocumentClient",
      "get",
      (params: AWS.DynamoDB.DocumentClient.GetItemInput, callback: Function) => {
        callback(null, stub());
      }
    );

    expect(await handler(mockEvent.object(), mockContext.object(), mockCallback.object())).toEqual({
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        data: { ...userFixture, ...userSettingsFixture },
      }),
    });

    AWS_MOCK.restore("DynamoDB.DocumentClient");
  });
});
