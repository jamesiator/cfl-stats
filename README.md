# CFL Football Stats Page

A simple webpage for displaying data from the Canadian Football League's official API, originally created as a school project.

To run this yourself, you will first need to [request your own API key](http://api.cfl.ca/key-request) and then create a .env file in the top-level of the **backend** directory with the following:

```
key=<your API key>
port=3000
```

You will also need to run `npm install` in both the backend and frontend directories. 

You can then run the proxy server by running `node server.js` in the backend directory.