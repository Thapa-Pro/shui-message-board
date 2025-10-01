// List all messages.
// Simple and clear:
// 1) read everything with Scan (ok for exam-size data)
// 2) sort by createdAt using ?order=newest|oldest

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.MESSAGES_TABLE;

export async function handler(event) {
  try {
    const order = (
      event?.queryStringParameters?.order || "newest"
    ).toLowerCase();

    const result = await doc.send(new ScanCommand({ TableName: TABLE }));
    const items = result.Items || [];

    items.sort((a, b) => {
      if (order === "oldest") return (a.createdAt || 0) - (b.createdAt || 0);
      return (b.createdAt || 0) - (a.createdAt || 0); // newest first
    });

    return json(200, { ok: true, data: items });
  } catch (err) {
    console.error("listMessages error", err);
    return json(500, {
      ok: false,
      error: "Server error while listing messages",
    });
  }
}

// tiny helper
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
