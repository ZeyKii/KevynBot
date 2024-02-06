const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lol_patchnote')
    .setDescription('iuii '),

  async execute(interaction) {
    await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(response => response.json())
      .then(data => {
        interaction.reply(`Latest patch: ${data[0]}`);
      })
  },
};
