const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quest')
        .setDescription('Get information about a quest')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Name of the quest')
                .setRequired(true)),
    async execute(interaction) {
        let questName = interaction.options.getString('name');
        
        try {
            // Effectuer une requête GraphQL pour obtenir tous les ID et noms des quêtes
            const response = await fetch(`https://api.tarkov.dev/graphql?query={ tasks { id name kappaRequired } }`);
            const data = await response.json();
            const tasks = data.data.tasks;

            // Rechercher l'identifiant de la quête correspondant au nom fourni par l'utilisateur
            let questId;
            let kappaRequired;
            for (const task of tasks) {
                if (task.name.toLowerCase() === questName.toLowerCase()) {
                    questId = task.id;
                    kappaRequired = task.kappaRequired;
                    break;
                }
            }

            if (!questId) {
                await interaction.reply('Quête non trouvée.');
                return;
            }

            // Effectuer une deuxième requête GraphQL pour récupérer les détails de la quête
            const questResponse = await fetch(`https://api.tarkov.dev/graphql?query={ task(id: "${questId}") { id name trader { name } map { name } wikiLink objectives { description } finishRewards { traderStanding { trader { name } standing } items { item { name iconLink } quantity } } } }`);
            const questData = await questResponse.json();
            const quest = questData.data.task;

            // Construire un message ou une embed avec les détails de la quête
            const resultEmbed = new EmbedBuilder()
                .setColor('#e77c21')
                .setTitle('Quest Information')
                .setURL(quest.wikiLink)
                .addFields(
                    { name: 'Name', value: quest.name },
                    { name: 'Trader', value: quest.trader && quest.trader.name ? quest.trader.name : 'Not specified' },
                    { name: 'Map', value: quest.map && quest.map.name ? quest.map.name : 'Not specified' },
                    { name: 'Kappa Required', value: kappaRequired ? '✅' : '❌' },
                    { name: ' ', value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n━━━━━━━━━━━━━━━━━━━━━━━━━❓Objectives❓━━━━━━━━━━━━━━━━━━━━━━━'}
                )
                .setTimestamp()
                .setFooter({ text: 'Escape From Tarkov', iconURL: 'https://www.picng.com/upload/escape_from_tarkov/png_escape_from_tarkov_68702.png' });

                // Ajouter les objectifs de la quête s'ils existent
                if (quest.objectives && quest.objectives.length > 0) {
                    quest.objectives.forEach((objective, index) => {
                        resultEmbed.addFields(
                            { name: `Objective ${index + 1}`, value: objective.description });
                    });
                }

                // Ajouter la séparation après les objectifs
                resultEmbed.addFields(
                    { name: ' ', value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n━━━━━━━━━━━━━━━━━━━━━━━━━🎁Rewards🎁━━━━━━━━━━━━━━━━━━━━━━━━━'}
                )

                // Ajouter les récompenses de fin de quête s'ils existent
                if (quest.finishRewards && quest.finishRewards.items.length > 0) {
                    quest.finishRewards.items.forEach(reward => {
                        resultEmbed.addFields(
                            { name: reward.item.name, value: `Quantity: ${reward.quantity}`});
                    });
                }

                // Ajouter la séparation après les rewards
                resultEmbed.addFields(
                    { name: ' ', value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n━━━━━━━━━━━━━━━━━━━━━━━━━⭐Reputation⭐━━━━━━━━━━━━━━━━━━━━━━━'}
                )

                // Ajouter les informations de standing du trader
                if (quest.finishRewards && quest.finishRewards.traderStanding && quest.finishRewards.traderStanding.length > 0) {
                    quest.finishRewards.traderStanding.forEach(traderStand => {
                        resultEmbed.addFields(
                            { name: `${traderStand.trader.name}`, value: `+ ${traderStand.standing}` }
                        );
                    });
                }

            // Répondre à l'interaction avec le message ou l'embed construit
            await interaction.reply({ embeds: [resultEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('Une erreur est survenue lors de la recherche de la quête.');
        }
    },
};
