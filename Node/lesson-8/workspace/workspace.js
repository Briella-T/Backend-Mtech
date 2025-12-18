const http = require("http");
const fs = require("fs");
const path = require("path");

http
  .createServer((request, response) => {
    console.log(`${request.method} request for ${request.url}`);

    if (request.url === "/") {
      fs.readFile("./public/index.html", "utf-8", (err, html) => {
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(html);
      });
    } else if (request.url.match(/.jpg$/)) {
      const cssPath = path.join(__dirname, "public", request.url);
      const fileStream = fs.createReadStream(imgPath, "utf8");
      response.writeHead(200, { "Content-Type": "text/jpeg" });

      fileStream.pipe(response);
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("404 File Not Found");
    }
  })
  .listen(3000);
