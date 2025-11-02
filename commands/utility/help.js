// Help command
const {SlashCommandBuilder} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder().setName('help').setDescription('List what each command does'),
	async execute(interaction) {
		await interaction.reply(`# Server Bot (If you got better names lmk)
Currently Supported commands:
**/hello:** It says. Source: Trust me bro
**/help:** List this thing
**/ip:** List all the server details
**/online:** List how many players are online
**/players:** List player names`);
	},
};
