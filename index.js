const { Client, Intents, Collection } = require('discord.js');
const { TOKEN } = require('./config.js');
const { loadCommands, loadEvents, loadBatch, loadReactionGroup, loadSlashCommands, loadRoleGiver, loadReactionMsg } = require('./util/loader');
// const axios = require('axios');
const winston = require("winston");
global.logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'silly',
      format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
              
      )
          
    })]});
require('date.format');


const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING, Intents.FLAGS.DIRECT_MESSAGES)

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

client.login(TOKEN).then(c => {
    //loadBatch(client);
    //loadReactionGroup(client);
})

client.on('ready', async () => {
  loadSlashCommands(client);
    console.log(`
  oooooooo8 ooooooooo    oooooooo8       oooooooooo    ooooooo   ooooooooooo 
o888     88  888    88o 888               888    888 o888   888o 88  888  88 
888          888    888  888oooooo        888oooo88  888     888     888     
888o     oo  888    888         888       888    888 888o   o888     888     
 888oooo88  o888ooo88   o88oooo888       o888ooo888    88ooo88      o888o    
    `);
    loadBatch(client);
    
    logger.info(`Chargement des messages 'events' ..`)
    await loadReactionGroup(client);
    logger.info(`.. terminé`)
    
    logger.info(`Chargement des reactions hall héros/zéros ..`)
    await loadReactionMsg(client);
    logger.info(`.. terminé`)

    loadRoleGiver(client);
});

// init serveur
/* Import dependencies */
const Express = require('express'); // Import express
const { URLSearchParams } = require('url'); // import URLSearchParams from url. You can also use form-data (in that case, this line would be const FormData = require('form-data');). If you do, be sure to adjust your variable names.
const axios = require('axios'); // Import Axios
const path = require('path') // Import path
const bodyParser = require('body-parser') // Import body-parser
const fetch = require('node-fetch') // Import node-fetch

/* Client Variables */
const client_id = '921348025241174016'; // Paste your bot's ID here
const client_secret = 'kBHCJf08UMt05j8zT8UrVF9qsawrSivM'; // Paste your bot's secret here

/* Define app variables */
const app = Express(); // Create a web app
const port = 7100; // Port to host on

/* Make a function to give us configuration for the Discord API */
function make_config(authorization_token) { // Define the function
    data = { // Define "data"
        headers: { // Define "headers" of "data"
            "authorization": `Bearer ${authorization_token}` // Define the authorization
        }
    };
    return data; // Return the created object
}

/* Configure the app */
app.use(Express.urlencoded({ extended: false })); // configure the app to parse requests with urlencoded payloads
app.use(Express.json()); // configure the app to parse requests with JSON payloads
app.use(bodyParser.text()); // configure the app to be able to read text

/* Handle GET Requests */
app.get('/', (req, res) => { // Handle incoming GET requests to http://localhost:(port)/
    res.sendFile(path.join(__dirname + '/index.html')); // Send the index.html file
});

/* Handle POST Requests */
app.post('/user', (req, res) => { // Will run when there are any incoming POST requests to http://localhost:(port)/user. Note that a POST request is different from a GET request, so this won't exactly work when you actually visit http://localhost:(port)/user
    /* Create our Form Data */
    const data_1 = new URLSearchParams(); // Create a new formData object with the constructor
    
    data_1.append('client_id', client_id); // Append the client_id variable to the data
    data_1.append('client_secret', client_secret); // Append the client_secret variable to the data
    data_1.append('grant_type', 'authorization_code'); // This field will tell the Discord API what you are wanting in your initial request.
    data_1.append('redirect_uri', `http://localhost:${port}/`); // This is the redirect URL where the user will be redirected when they finish the Discord login
    data_1.append('scope', 'identify'); // This tells the Discord API what info you would like to retrieve. You can change this to include guilds, connections, email, etc.
    data_1.append('code', req.body) // This is a key parameter in our upcoming request. It is the code the user got from logging in. This will help us retrieve a token which we can use to get the user's info.

    fetch('https://discord.com/api/oauth2/token', { method: "POST", body: data_1 }).then(response => response.json()).then(data => { // Make a request to the Discord API with the form data, convert the response to JSON, then take it and run the following code.
        axios.get("https://discord.com/api/users/@me", make_config(data.access_token)).then(response => { // Make a request yet again to the Discord API with the token from previously.
            res.status(200).send(response.data.username); // Send the username with a status code 200.
        }).catch(err => { // Handle any errors in the request (such as 401 errors).
            //console.log(err); // Log the error in the console
            res.sendStatus(500); // Send a 500 error.
        });
    });
});
app.listen(port, function() { // Configure the app to "listen" on the specified port.
    console.log(`App listening! Link: http://localhost:${port}/`); // Log the fact our app is ready to the console.
});