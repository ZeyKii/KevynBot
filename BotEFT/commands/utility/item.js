const { request, gql } = require('graphql-request');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('item')
		.addStringOption(option => option.setName('objet').setDescription('The user to add to the whitelist').setRequired(true)),
	async execute(interaction) {

		let value = interaction.options.getString('objet');
        
		const query = gql`
		{
			items(name: "${value}") {
				id
				name
				shortName
			}
		}
		`
		request('https://api.tarkov.dev/graphql', query).then((data) => console.log(data))
		await interaction.reply('CHEH');
	},
};
