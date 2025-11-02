// Use gamedip to see players alive
const {SlashCommandBuilder} = require('discord.js')
const { GameDig } = require('gamedig')

module.exports = {
	data: new SlashCommandBuilder().setName('online').setDescription('See how many players are online'),
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

// const { SlashCommandBuilder } = require('discord.js');
// const Gamedig = require('gamedig');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('online')
//         .setDescription('See how many players are online'),
    
//     async execute(interaction) {
//         await interaction.deferReply(); // prevent timeout while querying

//         try {
//             const state = await Gamedig.query({
//                 type: "minecraft",
//                 host: "192.168.59.136"
//             });

//             await interaction.editReply(
//                 `✅ **Server is Online!**\n**Players:** ${state.players.length}/${state.maxplayers}`
//             );
//         } catch (error) {
//             console.error("Server is offline or unreachable.");
//             console.error(error);

//             await interaction.editReply(
//                 `❌ **Server is offline or unreachable.**\n🧩 Error: ${error.error || error.message}`
//             );
//         }
//     },
// };

