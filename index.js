const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || '4000';
const server = http.createServer(app);

app.use(express.static(`${__dirname}/`));

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/`, 'index.html'));
});

server.listen(port, () => console.log(`Running on localhost:${port}`));
