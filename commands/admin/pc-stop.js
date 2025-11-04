// Shutdown command, only people in ALLOWED_USERS in env file can use it
const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process'); // for tmux control
const dbus = require('dbus-next');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pc-shutdown')
    .setDescription('Shuts down the server (authorized users only)'),

  async execute(interaction) {
    const allowedUsers = process.env.ALLOWED_USERS.split(',');
    const userId = interaction.user.id;

    if (!allowedUsers.includes(userId)) {
      return interaction.reply({
        content: 'You are not authorized to shut down this server.',
        ephemeral: true,
      });
    }

    await interaction.reply({
      content: 'Authorized. Stopping Minecraft server before shutdown...',
      ephemeral: true,
    });

    try {
      await new Promise((resolve, reject) => {
        exec(
          `tmux send-keys -t minecraft "say Server shutting down in 10 seconds..." C-m && sleep 3 && tmux send-keys -t minecraft "stop" C-m`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Error stopping Minecraft server: ${stderr}`);
              return reject(error);
            }
            resolve();
          }
        );
      });

      await new Promise((r) => setTimeout(r, 7000));

      await interaction.followUp({
        content: 'Minecraft server stopped. Initiating system shutdown...',
      });
    } catch (error) {
      console.error('Minecraft stop error:', error);
      await interaction.followUp({
        content: 'Could not stop Minecraft server. Proceeding with system shutdown anyway...',
        ephemeral: true,
      });
    }

    try {
      const bus = dbus.systemBus();
      const proxy = await bus.getProxyObject(
        'org.freedesktop.login1',
        '/org/freedesktop/login1'
      );

      const manager = proxy.getInterface('org.freedesktop.login1.Manager');

      await manager.PowerOff(true); 

      await interaction.followUp({
        content: 'System is shutting down now...',
      });
    } catch (err) {
      console.error('DBus error:', err);
      await interaction.followUp({
        content: 'Failed to initiate system shutdown.',
        ephemeral: true,
      });
    }
  },
};
