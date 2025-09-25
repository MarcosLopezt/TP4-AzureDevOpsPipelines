const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;

app.get("/health", (_req, res) =>
  res.json({ ok: true, ts: new Date().toISOString() })
);
app.listen(PORT, () => console.log(`Back escuchando en ${PORT}`));
