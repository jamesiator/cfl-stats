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
const CFL_DOMAIN = 'http://api.cfl.ca';

const dataMap = {};

/**
 * Automatically get teams on server start,
 * replace cfl domain in image urls with this server addr
 * 
 * - localhost:3000 if local development
 * - cfl.jamesiator.com in production
 */
async function getTeams() {
  
  const response = await axios.get(`${CFL_DOMAIN}/v1/teams?key=${KEY}`);

  response.data.data.forEach( ({ images }) => {
    Object.entries(images).forEach( ([key, value]) => {
      // images[key] = value.replace(CFL_DOMAIN, `http://localhost:${PORT}`); // local development
      images[key] = value.replace(CFL_DOMAIN, `https://cfl.jamesiator.com`);
    });
  });

  dataMap.teams = response.data;
  console.log('loaded teams data');
}

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
  
  // serve cached data if possible
  if (dataMap[path] !== undefined) {
    console.log(`POST /${path} -> cached`);
    res.send(dataMap[path]);
    
  } else {
    try {
      const url = `${CFL_DOMAIN}/v1/${path}?${query}&key=${KEY}`;
      console.log(url);
      
      const response = await axios.get(url);
      console.log(`POST /${path}`);
      console.log(response.status);
      
      res.send(response.data);
      
    } catch (error) {
      console.log(`POST /${path}`);
      console.log(error);
      res.status(500);
      res.send('an error occurred :(');
    }
  }
});

/**
 * Handler for rerouting images
 * 
 * Important note: all logos except for the one we use are .png, while the
 * other is .svg. If someone were to request one of the .png logos via this
 * server it would cause a rendering error on the frontend because we set the 
 * 'Content-Type' header to 'image/svg+xml' 
 */
app.get('/images*', async (req, res) => {

  const path = req.path;
  
  try {
    const url = `${CFL_DOMAIN}${path}`;
    console.log(url);
    
    const response = await axios.get(url);
    console.log(`GET ${path}`);
    console.log(response.status);
    
    // set content-type to correct value for frontend rendering
    res.header('Content-Type','image/svg+xml');
    res.send(response.data);
    
  } catch (error) {
    console.log(`GET ${path}`);
    console.log(error);
    res.status(500);
    res.send('an error occurred :(');
  }
});

getTeams();

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
