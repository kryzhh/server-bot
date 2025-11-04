// Use gamedig to see who is online
const {SlashCommandBuilder} = require('discord.js')
const { GameDig } = require('gamedig')

module.exports = {
	data: new SlashCommandBuilder().setName('players').setDescription('See who is online'),
	async execute(interaction) {
		await interaction.deferReply();
		try {
			const state = await GameDig.query({
				type: "minecraft",
				host: "127.0.0.1"
			});
            const names = state.players.length
            ? state.players.map(p => p.name).join(', ')
            : 'No players online';

			await interaction.editReply(`**Online Players:** ${names}`)
		}
        catch(error){
            console.log(error)
            await interaction.editReply(`An error occured:
${error.error}
${error.message}`)
        }
	},
};