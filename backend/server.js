/* TODO: implement caching
  - timeout of 5 mins? 10 mins?
  - add dev param to ignore cache?
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

const PORT = process.env.port;
const KEY = process.env.key;
const CFL_DOMAIN = 'api.cfl.ca';

const dataMap = {};

/**
 * Automatically get teams on server start, replace cfl domain with this server addr
 * - localhost:3000 if local development
 */
// async function getTeams() {
//   const { data } = await axios.get(`http://${CFL_DOMAIN}/v1/teams?key=${KEY}`);

//   data.data.forEach( team => {
//     team.images.image_logo_url.replace('api.cfl.ca', 'localhost:3000'); // local development
//     team.images.image_logo_url.replace('api.cfl.ca', 'localhost:3000');
//   });

//   dataMap.teams = data;
// }

/**
 * Default handler for all requests
 * 
 * get the path and query from the body
 * and forward the request to the CFL API 
 * with the API key appended
 */
app.post('/api', async (req, res) => {

  const path = req.body.path;
  const query = req.body.query;

  // if (path === 'teams') {
  //   res.send(dataMap.teams);

  // } else {
    try {
      const url = `http://${CFL_DOMAIN}/v1/${path}?${query}&key=${KEY}`;
      console.log(url);
      
      const response = await axios.get(url);
      console.log(response.status);
      
      res.send(response.data);
      
    } catch (error) {
      console.log(error);
      res.status(500);
      res.send('an error occurred :(');
    }
  // }
});

app.get('/images*', async (req, res) => {

  const path = req.path;

  try {
    const url = `http://${CFL_DOMAIN}${path}`;
    console.log(url);

    const response = await axios.get(url);
    console.log(response.status);

    res.header('Content-Type','image/svg+xml');
    res.send(response.data);

  } catch (error) {
    console.log(error);
    res.status(500);
    res.send('an error occurred :(');
  }
});

// getTeams();

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
