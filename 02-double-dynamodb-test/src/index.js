"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const AWS = __importStar(require("aws-sdk"));
exports.handler = async (event, context, callback) => {
    // document client has to be initialised inside of the handler in order to become testable
    // often some developers tend to initialise it between imports and handler
    const dynamoClient = new AWS.DynamoDB.DocumentClient();
    // Get id of the user calling this function/endpoint
    let userId = "";
    if (event.requestContext.authorizer) {
        userId = event.requestContext.authorizer.principalId;
    }
    const usersTableName = process.env["USERS_TABLE"];
    const userSettingsTableName = process.env["USER_SETTINGS_TABLE"];
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
