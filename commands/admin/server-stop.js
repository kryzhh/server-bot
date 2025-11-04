const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-stop')
    .setDescription('Stops the Minecraft server (authorized users only)'),

  async execute(interaction) {
    const allowedUsers = process.env.ALLOWED_USERS.split(',');
    const userId = interaction.user.id;

    if (!allowedUsers.includes(userId)) {
      return interaction.reply({
        content: 'You are not authorized to stop the server.',
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: 'Stopping Minecraft server...',
      ephemeral: true,
    });

    exec('tmux has-session -t minecraft 2>/dev/null', (error) => {
      if (error) {
        return interaction.followUp({
          content: 'No Minecraft server is currently running!',
          ephemeral: true,
        });
      }

      exec(
        'tmux send-keys -t minecraft "say Server stopping..." C-m && sleep 3 && tmux send-keys -t minecraft "stop" C-m',
        (err, stdout, stderr) => {
          if (err) {
            console.error('Stop error:', stderr);
            return interaction.followUp({
              content: 'Failed to stop Minecraft server.',
              ephemeral: true,
            });
          }

          interaction.followUp({
            content: 'Minecraft server stopped successfully!',
          });
        }
      );
    });
  },
};
