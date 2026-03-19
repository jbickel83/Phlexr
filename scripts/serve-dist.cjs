const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "dist");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const safePath = requestPath === "/" ? "/index.html" : requestPath;
  let filePath = path.normalize(path.join(root, safePath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      sendFile(filePath, res);
      return;
    }

    filePath = path.join(root, "index.html");
    sendFile(filePath, res);
  });
});

server.listen(port, () => {
  console.log(`Serving dist at http://localhost:${port}`);
});
