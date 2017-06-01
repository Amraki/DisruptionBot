const Discord = require('discord.js');
const client = new Discord.Client();
const serverStatus = require('steam-server-status');
const config = require('./config.json');

client.login(config.token);

client.on('ready', () => {
    console.log('Bot Online!');
});

client.on('error', (e) => console.error(e));
// client.on('warn', (e) => console.warn(e));
// client.on('debug', (e) => console.info(e));

function steamServer(client, message, ip) {
    serverStatus.getServerStatus(ip, 27015, function(serverInfo) {
            if (serverInfo.error) {
                console.log(serverInfo.error);
            } else {
                message.channel.send({embed: {
                    color: 3447003,
                    fields: [
                        {
                            name: 'Ark Server Info',
                            value: serverInfo.serverName
                        },
                        {
                            name: serverInfo.map,
                            value: 'Connect: steam://connect/' + serverInfo.hostname + ':' + serverInfo.port + '\n' +
                                    'Players: ' + serverInfo.numberOfPlayers + "/" + serverInfo.maxNumberOfPlayers
                        }
                    ],
                    timestamp: new Date()
                }});
            }
    });
}

function steamServer2(ip) {
    serverStatus.getServerStatus(ip, 27015, function(serverInfo) {
            if (serverInfo.error) {
                console.log(serverInfo.error);
            } else {
                return serverInfo;
            }
    });
};

function getServerStatus(message) {
    let server1 = steamServer2('172.93.106.219').then(function() {
            let server2 = steamServer2('172.93.106.218').then(function() {
                let server3 = steamServer2('172.93.106.220');
            })
    })

    message.channel.send({embed: {
        color: 3447003,
        fields: [
            {
                name: 'Ark Server Info',
                value: server1.serverName
            },
            {
                name: server1.map,
                value: 'Connect: steam://connect/' + server1.hostname + ':' + server1.port + '\n' +
                        'Players: ' + server1.numberOfPlayers + "/" + server1.maxNumberOfPlayers
            }
        ],
        timestamp: new Date()
    }});
};

client.on('message', (message) => {
    // define command prefix
    let prefix = config.prefix;

    // ignore message if not a command from a user
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // command checks
    if (message.content.startsWith(prefix + 'ping')) {
        message.reply('pong');
    }

    if (message.content.startsWith(prefix + 'servers')) {
        getServerStatus(message);
    }

    if (message.content.startsWith(prefix + 'island')) {
        steamServer(client, message, '172.93.106.219');
        console.log('test: ' + steamServer2('172.93.106.219'));
    }

    if (message.content.startsWith(prefix + 'center')) {
        steamServer(client, message, '172.93.106.218');
    }

    if (message.content.startsWith(prefix + 'scorched earth')) {
        steamServer(client, message, '172.93.106.220');
    }
});
