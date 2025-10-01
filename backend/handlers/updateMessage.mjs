// Update message text by id.
// Only allowed if logged-in username === message.username.

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { getUserFromAuthHeader } from "./_auth.mjs";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.MESSAGES_TABLE;

export async function handler(event) {
  try {
    const id = event?.pathParameters?.id;
    const body = safeJson(event?.body);
    const newText = (body.text || "").trim();
    if (!id) return json(400, { ok: false, error: "id is required" });
    if (!newText) return json(400, { ok: false, error: "text is required" });

    const user = getUserFromAuthHeader(event?.headers);
    if (!user) return json(401, { ok: false, error: "login required" });

    // read item to check owner (username)
    const res = await doc.send(
      new GetCommand({ TableName: TABLE, Key: { id } })
    );
    const item = res.Item;
    if (!item) return json(404, { ok: false, error: "message not found" });
    if (item.username !== user)
      return json(403, { ok: false, error: "not your message" });

    const updated = await doc.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { id },
        UpdateExpression: "SET #t = :t",
        ExpressionAttributeNames: { "#t": "text" },
        ExpressionAttributeValues: { ":t": newText },
        ReturnValues: "ALL_NEW",
      })
    );

    return json(200, { ok: true, data: updated.Attributes });
  } catch (err) {
    console.error("updateMessage error", err);
    return json(500, {
      ok: false,
      error: "Server error while updating message",
    });
  }
}

function safeJson(s) {
  try {
    return JSON.parse(s || "{}");
  } catch {
    return {};
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
