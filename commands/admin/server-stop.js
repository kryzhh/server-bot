// Since this a test, just copied entire thing from docs
const {SlashCommandBuilder} = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder().setName('server-stop').setDescription('Stop the server.'),
	async execute(interaction) {
		await interaction.reply('You thought it was a normal Hello? BUT IT WAS ME! DIOOOOOOO');
	},
};
