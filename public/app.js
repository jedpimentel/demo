const ws = new WebSocket('ws://localhost:8080');

// todo: backend should handle ID generation
const playerId = Math.random().toString(36).substring(2, 15);
const videoEl = document.getElementById('playerVideo');

// todo: not all devices will have video, and even ones with video won't always have it on.
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
        videoEl.srcObject = stream;
        videoEl.play();
    })
    .catch((err) => {
        console.error("Error accessing webcam:", err);
    });

const playerEl = document.createElement('a-box');
playerEl.setAttribute('id', playerId);
playerEl.setAttribute('color', 'blue');
playerEl.setAttribute('src', '#playerVideo');
// playerEl.setAttribute('position', '0 1 -3');

document.querySelector('a-camera').appendChild(playerEl);

// Script:
// Hello!
// this, is a presentation!


ws.addEventListener("open", (event) => {
    console.log('walalalalla')
    console.log('walalalalla')
    console.log('walalalalla')
    console.log('walalalalla')
    console.log('walalalalla')
    console.log('walalalalla')
    console.log('walalalalla')
});

const MESSAGE_TYPES = {
    NEW_USER: 'newUser', //  I am connecting for the first time
    // RETURNING_USER: 'returningUser', //  I've connected before, maybe my session is still valid
    // UPDATE_POS_ROT: 'updatePosRot'
}
ws.onopen = () => {
    console.log('websocket openes!')
    ws.send(JSON.stringify({
        type: MESSAGE_TYPES.NEW_USER,
        id: playerId,
        // position: playerEl.getAttribute('position'),
        // rotation: playerEl.getAttribute('position')
    }));

    // what's the strain caused by sending in each tick?
    console.log(document.querySelector('a-scene'))
    document.querySelector('a-scene').addEventListener('click', () => {
        // I don't think this'll Worker, due to the position not being flushed to DOM by default
        // we don't want to flush to DOM if that's just a sidestep anyways
        const position = playerEl.getAttribute('position');
        const rotation = playerEl.getAttribute('rotation');

        console.log('deeb')
        // debugger;

        ws.send(JSON.stringify({
            type: 'updatePosRot', 
            id: playerId,
            position: position,
            rotation: rotation,
        }))
    })
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if(data.type === 'update') {
        for(let id in data.players) {
            if(document.querySelector(`#${id}`)) continue;

            const player = document.createElement('a-box');
            player.setAttribute('id', id);
            player.setAttribute('color', 'red');
            player.setAttribute('position', data.players[id]);
            document.querySelector('a-scene').appendChild(player);
        }
    }
};
