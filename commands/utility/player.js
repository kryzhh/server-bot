// Use gamedig to see players alive
const {SlashCommandBuilder} = require('discord.js')
const { GameDig } = require('gamedig')

module.exports = {
	data: new SlashCommandBuilder().setName('players').setDescription('See who is online right now'),
	async execute(interaction) {
		await interaction.deferReply();
		try {
			const state = await GameDig.query({
				type: "minecraft",
				host: "192.168.59.136"
			});
			await interaction.editReply(`**Total Online Players:** ${state.players.length}/${state.maxplayers}`)
		}
        catch(error){
            console.log(error)
            await interaction.editReply(`An error occured:
${error.error}
${error.message}`)
        }
	},
};