// Delete message by id.
// Only allowed if logged-in username === message.username.

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { getUserFromAuthHeader } from "./_auth.mjs";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.MESSAGES_TABLE;

export async function handler(event) {
  try {
    const id = event?.pathParameters?.id;
    if (!id) return json(400, { ok: false, error: "id is required" });

    const user = getUserFromAuthHeader(event?.headers);
    if (!user) return json(401, { ok: false, error: "login required" });

    const res = await doc.send(
      new GetCommand({ TableName: TABLE, Key: { id } })
    );
    const item = res.Item;
    if (!item) return json(404, { ok: false, error: "message not found" });
    if (item.username !== user)
      return json(403, { ok: false, error: "not your message" });

    await doc.send(new DeleteCommand({ TableName: TABLE, Key: { id } }));
    return json(200, { ok: true, data: { id } });
  } catch (err) {
    console.error("deleteMessage error", err);
    return json(500, {
      ok: false,
      error: "Server error while deleting message",
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
