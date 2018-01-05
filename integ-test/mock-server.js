/* eslint-env node */
const express = require('express');

const app = express();

const mainResponse = {test: 'response'};

app.get('/testEndpoint', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9876');
  res.json(mainResponse);
});

app.listen(8000);
