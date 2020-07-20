const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`Hello World!`);
});

const port = 8080;
const host = '0.0.0.0'
app.listen(port, host, () => {
  console.log('Hello world listening on port', port);
});