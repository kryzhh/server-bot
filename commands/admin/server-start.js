const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-start')
    .setDescription('Starts the Minecraft server (authorized users only)'),

  async execute(interaction) {
    const allowedUsers = process.env.ALLOWED_USERS.split(',');
    const userId = interaction.user.id;

    if (!allowedUsers.includes(userId)) {
      return interaction.reply({
        content: 'You are not authorized to start the server.',
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: 'Starting Minecraft server...',
      ephemeral: true,
    });

    exec('tmux has-session -t minecraft 2>/dev/null', (error) => {
      if (!error) {
        return interaction.followUp({
          content: 'Minecraft server is already running!',
          ephemeral: true,
        });
      }

      // Start the server inside tmux session
      exec(
        'tmux new-session -d -s minecraft "cd ~/minecraft && java -Xmx4G -Xms2G -jar server.jar nogui"',
        (err, stdout, stderr) => {
          if (err) {
            console.error('Start error:', stderr);
            return interaction.followUp({
              content: 'Failed to start Minecraft server.',
              ephemeral: true,
            });
          }

          interaction.followUp({
            content: 'Minecraft server started successfully!',
          });
        }
      );
    });
  },
};
