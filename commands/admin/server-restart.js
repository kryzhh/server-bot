const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverrestart')
    .setDescription('Restarts the Minecraft server (authorized users only)'),

  async execute(interaction) {
    const allowedUsers = process.env.ALLOWED_USERS.split(',');
    const userId = interaction.user.id;

    if (!allowedUsers.includes(userId)) {
      return interaction.reply({
        content: 'You are not authorized to restart the server.',
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: 'Restarting Minecraft server...',
      ephemeral: true,
    });

    // Step 1: Stop server if running
    exec('tmux has-session -t minecraft 2>/dev/null', (error) => {
      if (error) {
        // Not running — just start fresh
        exec(
          'tmux new-session -d -s minecraft "cd ~/minecraft && java -Xmx4G -Xms2G -jar server.jar nogui"',
          (err) => {
            if (err) {
              console.error('Start error:', err);
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
        return;
      }

      // If running, stop first
      exec(
        'tmux send-keys -t minecraft "say Server restarting..." C-m && sleep 3 && tmux send-keys -t minecraft "stop" C-m',
        (err) => {
          if (err) {
            console.error('Stop error:', err);
            return interaction.followUp({
              content: 'Failed to stop Minecraft server.',
              ephemeral: true,
            });
          }

          // Wait a bit before restarting
          setTimeout(() => {
            exec(
              'tmux new-session -d -s minecraft "cd ~/minecraft && java -Xmx4G -Xms2G -jar server.jar nogui"',
              (err2) => {
                if (err2) {
                  console.error('Start error:', err2);
                  return interaction.followUp({
                    content: 'Failed to restart Minecraft server.',
                    ephemeral: true,
                  });
                }
                interaction.followUp({
                  content: 'Minecraft server restarted successfully!',
                });
              }
            );
          }, 7000);
        }
      );
    });
  },
};
