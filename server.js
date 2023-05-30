/* TODO: implement caching
  - timeout of 5 mins? 10 mins?
  - add param to ignore cache?
*/

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios').default;
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());

const KEY = process.env.key;

/**
 * Default handler for all requests
 * 
 * get the path and query from the body
 * and forward the request to the CFL API 
 * with the API key appended
 */
app.post('', async (req, res) => {

  const path = req.body.path;
  const query = req.body.query;

  try {
    const url = `http://api.cfl.ca/v1/${path}?${query}&key=${KEY}`;
    console.log(url);

    const response = await axios.get(url);
    console.log(response.status);
    res.send(response.data);

  } catch (error) {
    console.log(error);
    res.status(500);
    res.send('an error occurred :(');
  }
});

app.listen('3000', () => console.log('listening on port 3000'));
