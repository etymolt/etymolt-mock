#!/usr/bin/env node
// Local mock EVP/1 server. Drop-in replacement for api.etymolt.com when
// developing SDKs or integrations offline.

import { createServer } from "node:http";
import { verdictFor } from "./index.js";

const PORT = parseInt(process.env.PORT ?? "4242", 10);

const server = createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/v1/verify") {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    let body = {};
    try {
      body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "invalid_json" }));
      return;
    }
    if (!body.name) {
      res.writeHead(400, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "missing_name" }));
      return;
    }
    const verdict = verdictFor(body.name);
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(verdict));
    return;
  }

  if (req.url === "/.well-known/evp-keys.json") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({
      keys: [{ kid: "mock-key-1", kty: "OKP", crv: "Ed25519", x: "AAA…mock" }],
    }));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "not_found" }));
});

server.listen(PORT, () => {
  console.log(`etymolt-mock listening on http://localhost:${PORT}`);
  console.log(`set ETYMOLT_BASE_URL=http://localhost:${PORT} in your SDK to use it.`);
});
