module.exports = {
    TOKEN: "token_discord",
    STEAM_API_KEY: "steam_api_key", // https://steamcommunity.com/dev/apikey
    PREFIX: "$",
    VERSION: "0.1.0",
    DBCONNECTION: "mongodb://localhost:27017/test",
    GUILD_ID: "id_serveur", // id du serveur (clic droit sur l'icone du serveur > copier l'identifiant)
    MONEY: 'Points CDS',
    DEV: [
        { name: "name1", id: "idDiscord1" },
        { name: "name2", id: "idDiscord2" },
        { name: "name3", id: "idDiscord3" }
    ],
    DEFAULTSETTINGS: { // a modifier/enlever ?
        logChannel: "logs",
        welcomeMessage: "welcome"
    },
    CHANNEL: {
        WELCOME: 'id_channel', // channel de bienvenue, affiche les nouveaux arrivants
        ROLE: 'role_channel', // channel où l'on peut choisir ses rôles, ne doit contenir qu'un seul message : celui du bot qui est créé automatiquement
        LIST_GROUP: 'id_channel', // channel qui affichera tous les groupes
        LOGS: 'id_channel' // channel de logs (discord: join, leave, modification surnom,...)
    }
}