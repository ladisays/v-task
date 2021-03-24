const WebSocket = require('ws');
const moment = require('moment');
const { v4: uuid } = require('uuid');

const { schema, formats } = require('./src/utils');

const port = process.env.PORT || 9900;
const wss = new WebSocket.Server({ port });

const toSeconds = (timestamp) => moment.duration(`00:${timestamp}`).asSeconds() || 0;
const generateMarker = (data) => {
  let endTime = '';
  const id = uuid();
  let { start, end, ...message } = data;

  // set endtime to a timestamp
  endTime =
    moment(start, formats[0], true)
    .add(moment(end, formats, true))
    .format(formats[0]);

  start = toSeconds(start);
  end = toSeconds(endTime);

  return { id, start, end, ...message };
};
const send = (client, data) => {
  if (client && data !== undefined) {
    client.send(JSON.stringify(data));
  }
};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    let data;

    try {
      data = JSON.parse(message);
    } catch {
      data = {};
    }

    if (data.type === 'marker') {
      schema.validate(data)
        .then(() => {
          const marker = generateMarker(data);
          wss.clients.forEach((client) => {
            const response = {
              type: data.type,
              marker
            };
            if (client === ws) {
              response.success = true;
            }
            send(client, response);
          });
        })
        .catch((error) => {
          console.log(error);
          send(ws, { type: 'error', error });
        });
    } else {
      send(ws, { type: 'error', message: 'Invalid request' });
    }
  });
});

wss.on('listening', () => {
  console.log('listening on %s', wss.address().port);
});