import { Injectable } from "@nestjs/common";
import AWS from "aws-sdk";
import { ENV } from "~/config/configuration";
import { v4 } from "uuid";

@Injectable()
export class DynamoService {
  private readonly dynamoDB: AWS.DynamoDB;
  private readonly TABLE_NAME = "mytable1";

  constructor() {
    const ep = new AWS.Endpoint("localhost:8000");
    if (!ENV.isProduction) ep.protocol = "http";
    this.dynamoDB = new AWS.DynamoDB({ endpoint: ep });
    this.dynamoDB.config.update({
      accessKeyId: "DUMMYIDEXAMPLE",
      secretAccessKey: "DUMMYEXAMPLEKEY",
      region: "us-west-2",
    });
  }

  async getSession(sessionId: string) {
    const response = await this.dynamoDB.getItem({
      TableName: process.env.TABLE_NAME,
      Key: {
        "SessionId": { "S": sessionId }
      }
    }).promise()
    if (typeof response.Item === 'undefined') {
      return {
        error: 'Session does not exist.'
      }
    }
    return {
      username: response.Item.Username.S
    }
  }

  async createSession({ username, createdAt = new Date() }: any) {
    const EXPIRATION = 7 * 86400000

    const sessionId = v4()
    const expiresAt = new Date(createdAt.setTime(createdAt.getDate() + EXPIRATION))
    try {
      await this.dynamoDB.putItem({
        TableName: this.TABLE_NAME,
        Item: {
          "SessionId": { "S": sessionId },
          "Username": { "S": username },
          "CreatedAt": { "S": createdAt.toISOString() },
          "ExpiresAt": { "S": expiresAt.toISOString() },
          "TTL": { 'N': (expiresAt.getTime() / 1000).toString() }
        },
        ConditionExpression: 'attribute_not_exists(SessionId)'
      }).promise()
      return {
        sessionId
      }
    } catch(error) {
      if (error.code === 'ConditionalCheckFailedException') {
        // This is where you would put error handling logic on a condition expression failure
        console.log('Holy moley -- a UUID collision!')
      }
      return {
        message: error.message,
        error: 'Could not create session token'
      }
    }
  }
}
