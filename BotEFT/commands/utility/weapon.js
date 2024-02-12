const { request, gql } = require('graphql-request');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weapon')
        .setDescription('Get information about compatible ammo for a weapon')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the weapon to search for')
                .setRequired(true)),
    async execute(interaction) {
        let weaponName = interaction.options.getString('name');

        try {
            const weaponResponse = await fetch(`https://api.tarkov.dev/graphql?query={items(types: gun) {name wikiLink properties { ...on ItemPropertiesWeapon { allowedAmmo { id name low24hPrice avg24hPrice } } }}}`);
            const weaponData = await weaponResponse.json();

            const ammoResponse = await fetch(`https://api.tarkov.dev/graphql?query={ammo { item { name } penetrationPower } }`);

            const ammoData = await ammoResponse.json();

            if (weaponData.data.items && weaponData.data.items.length > 0) {
                const weapon = weaponData.data.items.find(item => item.name.toLowerCase().includes(weaponName.toLowerCase()));

                if (weapon) {
                    if (weapon.properties && weapon.properties.allowedAmmo && weapon.properties.allowedAmmo.length > 0) {
                        const sortedAmmo = weapon.properties.allowedAmmo.sort((a, b) => {
                            const penetrationPowerA = ammoData.data.ammo.find(data => data.item.name === a.name)?.penetrationPower || 0;
                            const penetrationPowerB = ammoData.data.ammo.find(data => data.item.name === b.name)?.penetrationPower || 0;
                            return penetrationPowerA - penetrationPowerB; // Tri par ordre croissant
                        });

                        let ammoList = '';
                        sortedAmmo.forEach(ammo => {
                            const penetrationPower = ammoData.data.ammo.find(data => data.item.name === ammo.name)?.penetrationPower;
                            ammoList += `**${ammo.name}**\n` +
                                `Average 24h Price: ${ammo.avg24hPrice || 'N/A'} ₽\n` +
                                `Lowest 24h Price: ${ammo.low24hPrice || 'N/A'} ₽\n` +
                                `Penetration Power: ${penetrationPower || 'N/A'}\n\n`;
                        });
                        
                        const embed = new EmbedBuilder()
                            .setColor('#e77c21')
                            .setTitle(`${weapon.name}`)
                            .setURL(weapon.wikiLink)
                            .setDescription(ammoList)
                            .setTimestamp()
                            .setFooter({ text: 'Escape From Tarkov', iconURL: 'https://www.picng.com/upload/escape_from_tarkov/png_escape_from_tarkov_68702.png' });
                        
                        await interaction.reply({ embeds: [embed] });                        
                        
                    } else {
                        await interaction.reply(`No compatible ammo found for the weapon **${weapon.name}**`);
                    }
                } else {
                    await interaction.reply(`No weapon found with the name **${weaponName}**.`);
                }
            } else {
                await interaction.reply('No weapons found.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply('An error occurred while fetching the weapon information.');
        }
    },
};
