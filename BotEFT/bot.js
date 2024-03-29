const { Client, Partials, Collection, Events, GatewayIntentBits, EmbedBuilder, Guild, GuildMember, ActivityType } = require("discord.js");
const fs = require('node:fs');

const path = require('node:path');

require("dotenv").config();


const client = new Client({
	partials: [Partials.Message, Partials.Reaction],
	intents: [
	  GatewayIntentBits.Guilds,
	  GatewayIntentBits.GuildMessages,
	  GatewayIntentBits.GuildMessageReactions,
	],
});

client.once(Events.ClientReady, () => {
	//reload every commands at startup
	const { exec } = require('child_process');
	exec('node commands_deployment.js', (err, stdout, stderr) => {
		if (err) {
			return;
		}
		console.log(`stdout: ${stdout}`);
		console.log(`stderr: ${stderr}`);
	});

	client.user.setPresence({
		activities: [{ name: `Spam 1v1 Tagilla 🔨`, type: ActivityType.Custom }],
		status: 'dnd',
	  });

	console.log("Kevyn est connecté !");
});


client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
		} else {
			await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	}
});



// Commands Handler 
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ("data" in command && "execute" in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.login(process.env.DISCORD_TOKEN);