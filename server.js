var mosca = require('mosca');
var path = require('path');
require('dotenv').config({ path: path.join(__dirname, './config') });

var moscaSettings = {
  port: 1883,
  http: {
    port: +process.env.MQTT_HTTP_PORT
  }
};

var server = new mosca.Server(moscaSettings);	//here we start mosca
server.on('ready', setup);	//on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
  // server.authenticate = authenticate;
  console.log('Mosca server is up and running')
}

var authenticate = function (client, username, password, callback) {
  var authorized = (username === process.env.MQTT_USER && password.toString() === process.env.MQTT_PASSWORD.toString());
  if (authorized) client.user = username;
  callback(null, authorized);
}

server.on('clientConnected', function (client) {
  console.log('Client Connected:', client.id);
});

// fired when a client disconnects
server.on('clientDisconnected', function (client) {
  console.log('Client Disconnected:', client.id);
});

server.on('published', function (packet, client) {
  console.log(packet);
  console.log('Published', packet.payload.toString());
});