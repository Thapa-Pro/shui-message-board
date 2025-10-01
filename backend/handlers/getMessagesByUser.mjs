// Get all messages for one username using a DynamoDB GSI.
// Supports ?order=newest|oldest (ScanIndexForward true=oldest, false=newest).

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.MESSAGES_TABLE;
const INDEX = "byUsername";

export async function handler(event) {
  try {
    const username = decodeURIComponent(
      event?.pathParameters?.username || ""
    ).trim();
    if (!username)
      return json(400, { ok: false, error: "username is required" });

    const order = (
      event?.queryStringParameters?.order || "newest"
    ).toLowerCase();
    const scanForward = order === "oldest"; // ascending (oldest first)

    const result = await doc.send(
      new QueryCommand({
        TableName: TABLE,
        IndexName: INDEX,
        KeyConditionExpression: "#u = :u",
        ExpressionAttributeNames: { "#u": "username" },
        ExpressionAttributeValues: { ":u": username },
        ScanIndexForward: scanForward,
      })
    );

    return json(200, { ok: true, data: result.Items || [] });
  } catch (err) {
    console.error("getMessagesByUser error", err);
    return json(500, {
      ok: false,
      error: "Server error while fetching user messages",
    });
  }
}

function json(status, body) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
