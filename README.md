# KevynBOT 🎮🤖

## Description
Kevyn est un bot Discord développé en JavaScript, conçu pour fournir des informations détaillées et complémentaires sur différents jeux vidéo tels que Escape From Tarkov et League of Legends. Grâce à des commandes personnalisées, Kevyn permet aux utilisateurs d'obtenir rapidement des données précises dans ces jeux.

## Fonctionnalités

- **Escape From Tarkov** :
  - **/item** : Fournit des informations détaillées sur un objet spécifique, y compris son nom, sa description, son lien vers le wiki, son image, son prix moyen sur 24 heures et les tâches dans lesquelles il est utilisé.

  - **/quest** : Affiche des informations complètes sur une quête, y compris le nom de la quête, le trader, la carte, les objectifs, les récompenses de fin de quête, et si elle est requise pour obtenir l'objet Kappa.

  - **/weapon** : Liste les munitions compatibles pour une arme donnée, triées par puissance de pénétration, avec les prix moyens et les prix les plus bas sur 24 heures.

- **League of Legends** :
  - **/lol_patchnote** : Affiche la dernière version du patch de League of Legends.

## Installation

1. Clonez le dépôt :
    ```bash
    git clone https://github.com/ZeyKii/KevynBot.git

    cd KevynBot
    ```

2. Installez les dépendances :
    ```bash
    npm install
    ```

3. Configurez le fichier `.env` avec vos informations :
    ```plaintext
    DISCORD_TOKEN=your_discord_bot_token
    CLIENT_ID=your_client_id
    GUILD_ID=your_guild_id
    ```

4. Déployez les commandes :
    ```bash
    node commands_deployment.js
    ```

5. Lancez le bot :
    ```bash
    node index.js
    ```

## Utilisation

- Invitez Kevyn à votre serveur Discord.

- Utilisez les commandes suivantes pour interagir avec le bot :
  - `/item [nom de l'objet]`
  - `/quest [nom de la quête]`
  - `/weapon [nom de l'arme]`

  - `/lol_patchnote`

## Contributeurs

- [ZeyKii](https://github.com/ZeyKii/ZeyKii)
- [ogb4n](https://github.com/ogb4n/ogb4n)
