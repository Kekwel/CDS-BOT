const { MessageEmbed, Permissions } = require('discord.js');

const { MESSAGES } = require("../../util/constants");
const { cross_mark } = require('../../data/emojis.json');
const { dark_red} = require("../../data/colors.json");
const { deleteMsgHubGroup } = require('../../util/msg/group');

module.exports.run = async (client, message, args) => {
    // TODO similaire a searchgroup dissolve, a voir si possible de refactor ?
    const grpName = args[0];

    try {
        // -- test si user a le droit de gérer les messages
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) 
            throw `Interdiction.`;

        if (!grpName) 
            throw `Il manque le nom du groupe !`;

        // recup le groupe
        let grp = await client.findGroupByName(grpName);
        if (!grp) 
            throw `Le groupe ${grpName} n'existe pas !`;
        
        // suppr groupe
        // TODO mettre juste un temoin suppr si l'on veut avoir une trace ? un groupHisto ?
        await client.deleteGroup(grp);
        console.log(`\x1b[34m[INFO]\x1b[0m ADMIN ${message.author.tag} a dissout le groupe ${grpName}`);

        let mentionsUsers = '';
        for (const member of grp.members)
            mentionsUsers += `<@${member.userId}> `
        
        mentionsUsers += ` : le groupe ${grpName} a été dissout.`
        // TODO en MP ?
        message.channel.send(mentionsUsers);

        // update msg
        await deleteMsgHubGroup(client, grp);
    } catch (err) {
        const embedError = new MessageEmbed()
            .setColor(dark_red)
            .setTitle(`${cross_mark} ${err}`);
        console.log(`\x1b[31m[ERROR] \x1b[0mErreur dissolvegroup ${args[0]} : ${err}`);
        return message.channel.send({ embeds: [embedError] });
    }
}

module.exports.help = MESSAGES.COMMANDS.ADMIN.DISSOLVEGROUP;