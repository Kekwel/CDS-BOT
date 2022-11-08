const { Client, Intents, Collection } = require('discord.js');
//const { TOKEN } = require('./config.js');
const { loadCommands, loadEvents, loadBatch, loadReactionGroup, loadSlashCommands, loadRoleGiver, loadReactionMsg, loadVocalCreator } = require('./util/loader');
const winston = require("winston");
require('winston-daily-rotate-file');
require("dotenv").config();

var transport = new winston.transports.DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d'
});
global.logger = winston.createLogger({
  transports: [
    transport,
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
      )
    })
  ],
  format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
  )
});
require('date.format');


const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, 
  Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES,
  Intents.FLAGS.GUILD_VOICE_STATES)

const client = new Client({ intents: myIntents });
require('./util/functions')(client);
require('./util/steam')(client);
//client.commands = new Collection();
//client.aliases = new Collection();
["commands", "aliases"].forEach(x => client[x] = new Collection());
client.mongoose = require("./util/mongoose");

loadCommands(client);
loadEvents(client);
client.mongoose.init();

// A METTRE A JOUR discord.js v12 -> v13 + -> loadEvents
// client.on('raw', async e => {
//     if(e.t === 'INTERACTION_CREATE'){
//         const url = `https://discord.com/api/v8/interactions/${e.d.id}/${e.d.token}/callback`;
//         const body = {
//             "type": 4,
//             "data": {
//                 content: "test"
//             }
//         }
//         const data = await axios.post(url, body, null);
//         console.log(data);
//     }
// });

client.on('error', console.error);
client.on('warn', console.warn);

//client.login(TOKEN).then(c => {
client.login(process.env.TOKEN).then(c => {
    //loadBatch(client);
    //loadReactionGroup(client);
})

client.on('ready', async () => {
  console.log(`
  oooooooo8 ooooooooo    oooooooo8       oooooooooo    ooooooo   ooooooooooo 
o888     88  888    88o 888               888    888 o888   888o 88  888  88 
888          888    888  888oooooo        888oooo88  888     888     888     
888o     oo  888    888         888       888    888 888o   o888     888     
 888oooo88  o888ooo88   o88oooo888       o888ooo888    88ooo88      o888o    
    `);
  await loadSlashCommands(client);

  await loadBatch(client);
  
  logger.info(`Chargement des messages 'events' ..`)
  await loadReactionGroup(client);
  logger.info(`.. terminé`)
  
  logger.info(`Chargement des reactions hall héros/zéros ..`)
  await loadReactionMsg(client);
  logger.info(`.. terminé`)

  logger.info(`Chargement du chan vocal créateur ..`)
  await loadVocalCreator(client);
  logger.info(`.. terminé`)

  loadRoleGiver(client);
});