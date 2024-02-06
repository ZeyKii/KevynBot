const { request, gql } = require('graphql-request');
const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('item')
        .setDescription('Get information about an item')
        .addStringOption(option =>
            option.setName('objet')
                .setDescription('The name of the item to search for')
                .setRequired(true)),
    async execute(interaction) {
        let itemName = interaction.options.getString('objet');

        try {
            const response = await fetch(`https://api.tarkov.dev/graphql?query={items(name: "${itemName}") {name description wikiLink inspectImageLink avg24hPrice usedInTasks { id name wikiLink trader { name } map { name } kappaRequired }}}`);
            const data = await response.json();

            if (data.data.items.length > 0) {
                const item = data.data.items[0];

                const tasks = item.usedInTasks.map(task => {
                    const traderName = task.trader ? task.trader.name : 'Not specified';
                    const mapName = task.map ? task.map.name : 'Not specified';
                    const wikiLink = task.wikiLink ? `[${task.name}](${task.wikiLink})` : 'Wiki link not available';
                    let emojikappa = "";

                    if (task.kappaRequired) {
                        emojikappa = "✅";
                    } else {
                        emojikappa = "❌";
                    }

                    return {
                        name: `**Task Name:**`,
                        value: `${wikiLink}\n**Trader:** ${traderName}\n**Map:** ${mapName}\n**Kappa Required:** ${emojikappa}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`, // Ajout d'une ligne vide avec une séparation visuelle
                        inline: false // Set to true if you want the fields to be displayed in a single row
                    };
                });

                const resultEmbed = new EmbedBuilder()
                    .setColor('#e77c21')
                    .setTitle('Item Information')
                    .setURL(item.wikiLink)
                    .addFields(
                        { name: 'Name', value: item.name },
                        { name: 'Description', value: item.description || 'Description not available' }
                    )
                    .addFields(...tasks) // Spread the tasks array to add multiple fields
                    .setImage(item.inspectImageLink)
                    .addFields({ name: 'Average 24h Price', value: `${item.avg24hPrice || 'Price not available'} ₽` })
                    
                    .setTimestamp()
                    .setFooter({ text: 'Escape From Tarkov', iconURL: 'https://www.picng.com/upload/escape_from_tarkov/png_escape_from_tarkov_68702.png' });

                await interaction.reply({ embeds: [resultEmbed] });
            } else {
                await interaction.reply('No item found with that name.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while fetching the item information.');
        }
    },
};
