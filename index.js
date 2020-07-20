const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send(`Hello World!`);
});

const port = 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});