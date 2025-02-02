const { MESSAGES } = require("../../util/constants");
const { CORNFLOWER_BLUE} = require('../../data/colors.json');
const { STREAMING, AMONGUS_RUNNING } = require("../../data/emojis.json");
const { MessageEmbed } = require("discord.js");

module.exports.run = async (interaction) => {
    let customMsg = [
        `*Ma latence est suffisament faible pour jouer à Among Us ${AMONGUS_RUNNING}*`,
        `*Ma latence est suffisament faible pour jouer à TF2*`,
        `*Je n'ai pas de lag, je peux regarder mon stream ${STREAMING}*`
    ];
    let customMsgNumber = Math.floor(Math.random() * customMsg.length);
    const createdTime = Date.now();

    const embed = new MessageEmbed()
        .setDescription('Pong: --ms')
        .setColor(CORNFLOWER_BLUE);

    await interaction.reply({ embeds: [embed] });
    const ping = Date.now() - createdTime;

    if (ping < 750)
        embed.setDescription(`Pong: **${ping}** ms. ${customMsg[customMsgNumber]}`);
    else
        embed.setDescription(`Pong! ${ping} ms. Mon ping est mauvais :cry:`);
    
    await interaction.editReply({ embeds: [embed] });
}

module.exports.help = MESSAGES.COMMANDS.MISC.PING;