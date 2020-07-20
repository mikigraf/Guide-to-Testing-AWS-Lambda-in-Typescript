import * as AWS from "aws-sdk";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler,
  Context,
  APIGatewayProxyCallback,
} from "aws-lambda";

import { IUserData } from "../lib/types/userData";
import { IUserSettingsData } from "../lib/types/userSettings";

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: APIGatewayProxyCallback
): Promise<APIGatewayProxyResult> => {
  // document client has to be initialised inside of the handler in order to become testable
  // often some developers tend to initialise it between imports and handler
  const dynamoClient = new AWS.DynamoDB.DocumentClient();

  // Get id of the user calling this function/endpoint
  let userId: string = "";
  if (event.requestContext.authorizer) {
    userId = event.requestContext.authorizer.principalId;
  }
  const usersTableName = process.env["USERS_TABLE"] as string;
  const userSettingsTableName = process.env["USER_SETTINGS_TABLE"] as string;

  const userData = await dynamoClient
    .get({
      TableName: usersTableName,
      Key: {
        userId: userId,
      },
    })
    .promise();

  const userSettingsData = await dynamoClient
    .get({
      TableName: userSettingsTableName,
      Key: {
        userId: userId,
      },
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ data: { ...userData, ...userSettingsData } }),
  };
};
