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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = __importStar(require("aws-sdk"));
const AWS_MOCK = __importStar(require("aws-sdk-mock"));
const moq_ts_1 = require("moq.ts");
const ts_sinon_1 = __importDefault(require("ts-sinon"));
const index_1 = require("../src/index");
const userFixture_1 = require("./fixtures/userFixture");
const userSettingsFixture_1 = require("./fixtures/userSettingsFixture");
describe("tests for double dynamodb", () => {
    let mockEvent;
    let mockContext;
    let mockCallback;
    beforeEach(() => {
        mockEvent = new moq_ts_1.Mock()
            .setup((instance) => instance.requestContext.authorizer)
            .returns({ principalId: "1" });
        mockContext = new moq_ts_1.Mock();
        mockCallback = new moq_ts_1.Mock();
    });
    it("Should return correct object", async () => {
        AWS_MOCK.setSDKInstance(AWS);
        // return different fixtures on different calls
        const stub = ts_sinon_1.default.stub();
        stub.onCall(0).returns(userFixture_1.userFixture);
        stub.onCall(1).returns(userSettingsFixture_1.userSettings);
        AWS_MOCK.mock("DynamoDB.DocumentClient", "get", (params, callback) => {
            callback(null, stub());
        });
        expect(await index_1.handler(mockEvent.object(), mockContext.object(), mockCallback.object())).toEqual({
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ data: { ...userFixture_1.userFixture, ...userSettingsFixture_1.userSettings } }),
        });
        AWS_MOCK.restore("DynamoDB.DocumentClient");
    });
});
