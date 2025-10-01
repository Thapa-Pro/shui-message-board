// Create one message.
// Body: { username, text }
// If Authorization token is present, username must MATCH the logged-in user.

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { ulid } from "ulid";
import { getUserFromAuthHeader } from "./_auth.mjs";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.MESSAGES_TABLE;

export async function handler(event) {
  try {
    const body = safeJson(event?.body);
    const username = (body.username || "").trim();
    const text = (body.text || "").trim();
    if (!username || !text)
      return json(400, { ok: false, error: "username and text are required" });

    const loggedIn = getUserFromAuthHeader(event?.headers);
    if (loggedIn && loggedIn !== username) {
      // simple rule so a logged-in user can't post as someone else
      return json(403, {
        ok: false,
        error: "username must match logged-in user",
      });
    }

    const item = { id: ulid(), username, text, createdAt: Date.now() };
    await doc.send(new PutCommand({ TableName: TABLE, Item: item }));

    return json(201, { ok: true, data: item });
  } catch (err) {
    console.error("createMessage error", err);
    return json(500, {
      ok: false,
      error: "Server error while creating message",
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
