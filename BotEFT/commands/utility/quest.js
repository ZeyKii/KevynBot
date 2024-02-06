const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quest')
        .setDescription('Get information about a quest')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the quest')
                .setRequired(true)),
    async execute(interaction) {
        const questName = interaction.options.getString('name');

        try {
            const apiUrl = `https://api.tarkov.dev/graphql?query={tasks(name: "${encodeURIComponent(questName)}") {name trader { name } map { name } wikiLink objectives { description } finishRewards { traderStanding { trader { name } standing } items { item { name iconLink } quantity } }}}`;
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.tasks && data.tasks.length > 0) {
                const quest = data.tasks[0];

                // Construire l'embed avec les données de la quête
                const resultEmbed = new Discord.MessageEmbed()
                    .setTitle(quest.name)
                    .setColor('#00ff00')
                    .addField('Trader', quest.trader.name, false)
                    .addField('Map', quest.map.name, false)
                    .addField('Wiki Link', quest.wikiLink || 'Wiki link not available', false)
                    // Ajouter d'autres champs comme nécessaire
                    .setTimestamp();

                await interaction.reply({ embeds: [resultEmbed] });
            } else {
                await interaction.reply('Quest not found.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while fetching the quest information.');
        }
    },
};
