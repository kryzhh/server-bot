// Since this a test, just copied entire thing from docs
const {SlashCommandBuilder} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder().setName('ip').setDescription('Server details'),
	async execute(interaction) {
		await interaction.reply(`**IP:** placeholder text
**Port:** placeholder text
**NOTE:** If these credentials don't work, contact you know who`);
	},
};
