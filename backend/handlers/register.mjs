// Register a new user: body { username, password }
// Returns { ok, data: { token, username } }

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { hashPassword, signToken } from "./_auth.mjs";

const doc = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE = process.env.USERS_TABLE;

export async function handler(event) {
  try {
    const body = safeJson(event?.body);
    const username = (body.username || "").trim();
    const password = String(body.password || "");

    if (!username || !password) {
      return json(400, {
        ok: false,
        error: "username and password are required",
      });
    }

    const passwordHash = await hashPassword(password);

    // simple "no duplicates" using a condition
    await doc.send(
      new PutCommand({
        TableName: TABLE,
        Item: { username, passwordHash },
        ConditionExpression: "attribute_not_exists(username)",
      })
    );

    const token = signToken(username);
    return json(201, { ok: true, data: { token, username } });
  } catch (err) {
    // if username already exists, DynamoDB throws a ConditionalCheckFailedException
    if (String(err?.name).includes("ConditionalCheckFailed")) {
      return json(409, { ok: false, error: "username already exists" });
    }
    console.error("register error", err);
    return json(500, { ok: false, error: "Server error while registering" });
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
