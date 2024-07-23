const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch'); // Importer node-fetch

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lol_patchnote')
    .setDescription('Fetches the latest League of Legends patch notes.'),

  async execute(interaction) {
    try {
      const response = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data.length === 0) throw new Error('No patch data found');

      const latestPatch = data[0];
      await interaction.reply(`The latest League of Legends patch is: ${latestPatch}`);
    } catch (error) {
      console.error('Error fetching patch notes:', error);
      await interaction.reply({ content: 'There was an error while fetching the patch notes.', ephemeral: true });
    }
  },
};
