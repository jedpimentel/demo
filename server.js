const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);


const WEBSOCKET_PORT = 8080;
// const wss = new WebSocket.Server({ server });
const wss = new WebSocket.Server({
    port: WEBSOCKET_PORT,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024 // Size (in bytes) below which messages
      // should not be compressed if context takeover is disabled.
    }
});

// would set or map be better?
// todo: handle "disconnects"
const players = {};

wss.on('connection', (ws) => {
    console.log('websocket connection!')

    ws.on('message', (message) => {
        const parsed = JSON.parse(message);

        // TYPES
        // newUser
        // updatePosRot

        if(parsed.type === 'newUser') {
            // players[parsed.id] = {}
            const id = parsed.id;
            console.log(`New User: ${id}`)
            // aw dang, it's a new user!
            // who do they claim to be?
            // is this id in our registry?
            // oops, id taken, we don't have a robust acount system, so please choose another id.
            // cool, hello!
            // players[parsed.id].position = parsed.position;
            // players[parsed.id].rotation = parsed.rotation;
        }
        else if(parsed.type === 'returningUser') {
            
        }
        switch(parsed.type) {
            // case 'newPlayer':
            //     players[parsed.id] = {
            //         position: parsed.postion
            //     };
            //     break;

            case 'updatePosRot':
                if (players[parsed.id]) {
                    players[parsed.id].position = parsed.position;
                    players[parsed.id].rotation = parsed.rotation;
                }
                break;
        }

        ws.send(JSON.stringify({ type: 'update', players: players}));
    });
});

app.use(express.static('public'));

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});