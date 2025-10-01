// Login: body { username, password } -> returns { token, username }

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { checkPassword, signToken } from "./_auth.mjs";

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

    const res = await doc.send(
      new GetCommand({ TableName: TABLE, Key: { username } })
    );
    const user = res.Item;
    if (!user)
      return json(401, { ok: false, error: "invalid username or password" });

    const ok = await checkPassword(password, user.passwordHash);
    if (!ok)
      return json(401, { ok: false, error: "invalid username or password" });

    const token = signToken(username);
    return json(200, { ok: true, data: { token, username } });
  } catch (err) {
    console.error("login error", err);
    return json(500, { ok: false, error: "Server error while logging in" });
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
