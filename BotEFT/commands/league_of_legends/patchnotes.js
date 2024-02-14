const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lol_patchnote')
    .setDescription('Get the latest patch notes for League of Legends'),

  async execute(interaction) {

    let version = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      .then(response => response.json())
      .then(data => {
        let parts = data[0].split('.');
        let resultString = parts[0] + '-' + (parseInt(parts[1]));
        return resultString;
      })

    const PatchNoteImage = await fetch(`https://www.leagueoflegends.com/fr-fr/news/game-updates/patch-${version.replace('2', '1')}-notes/`)
      .then(response => response.text())
      .then(data => {
        const patterns = /https:\/\/[^\s]*Patch-Highlights_TW_1920x1080_FR\.jpg/gm;
        return data.match(patterns)[0];
      })

    const resultEmbed = new EmbedBuilder()
      .setColor('Aqua')
      .setTitle('v' + version.replace('-', '.') + ' Patch Notes')
      .setURL(`https://www.leagueoflegends.com/fr-fr/news/game-updates/patch-${version.replace('2', '1')}-notes/`)
      .setImage(PatchNoteImage)
      .setTimestamp()
      .setFooter({ text: 'League of Legends', iconURL: 'https://www.picng.com/upload/escape_from_tarkov/png_escape_from_tarkov_68702.png' });


    interaction.reply({ embeds: [resultEmbed] })
  },


};
