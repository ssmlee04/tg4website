import express from 'express';
import path from 'path';
import compression from 'compression';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import createStore, { initializeSession } from './reduxStore';
import { ChunkExtractor } from '@loadable/server'
import TelegramWidget from './Telegram/TelegramWidget';

var fs = require('fs');
var http = require('http');
const app = express();

app.use( compression() );
app.use( express.static( path.resolve( __dirname, '../dist' ) ) );

app.get( '/*', ( req, res ) => {
  const context = { };
  const store = createStore( );

  Promise.all([]).then( ( ) => {
    res.writeHead( 200, { 'Content-Type': 'text/html' } );
    res.end( htmlTemplate() );
  } );
} );

var httpServer = http.createServer(app);

httpServer.listen(3000);

httpServer.on( 'upgrade', ( req, socket, head ) => {
  apiProxy.ws( req, socket, head );
} );

process.on('uncaughtException', function(e){
    console.log(e);
});

const host = process.env.REACT_APP_MEDIA_HOST || '';

function htmlTemplate() {
  return `
        <!DOCTYPE html>
        <html lang="en-US">
        <head>
            <link rel="stylesheet" type="text/css" href="${host}/app.css" />
        </head>

        <body>
            <script data-cfasync="false" src="${host}/app.bundle.js"></script>
            <script data-cfasync="false" src="${host}/vendors.bundle.js"></script>
            <script type="text/javascript">
               Tg4Web.init('earningsfly', '17349', '344583e45741c457fe1862106095a5eb');
            </script>
        </body>
        </html>
    `;
}
