const fs = require("fs");
const path = require("path");

const parser = (client, req) => {
  function createMessage(data) {
    const dataBuffer = Buffer.from(data);
    let contentType = req.headers.accept;
    if (contentType.indexOf("text/html") > -1) contentType = "text/html";
    client.write(`HTTP/1.1 200 OK 
Connection: Close
Content-Type: ${contentType}; charset=UTF-8
Content-Length: ${dataBuffer.length}

${dataBuffer.toString()}`);
  }
  return {
    send: (data) => {
      const messgae = createMessage(data);
      client.write(messgae);
    },
    sendFile(fileName) {
      const target = path.join(__dirname, "../public", fileName);
      const readLine = fs.readFileSync(target, "utf-8");
      const messgae = createMessage(readLine);
      client.write(messgae);
    },
  };
};

module.exports = parser;