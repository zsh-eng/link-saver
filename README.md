# 🔗 Link Saver

## Description

Link Saver is a simple web application that allows users to effortlessly save article links for later reading. What's more? You can access your saved articles through Telegram's "Instant View" feature.

## Usage

1. 🚀 Go to [Link Saver](https://t.me/link_saver_zsh_bot) and start the bot.
2. ✉️ Send any article link to the bot.
3. 📚 The bot will save the link and provide you with a direct link to view the article using Telegram's "Instant View".

## How it works

The bot fetches the article using the provided link and parses the HTML using Mozilla's Readability library to extract the article content.
I've used a [fork](https://github.com/rtrigoso/readenobility) of the library with Deno support.

The article content is then transformed into a Telegraph `Node` object and sent to the Telegraph API to generate a page.

Finally, the bot sends the Telegraph page link to the user, appearing as an "Instant View" article.

## Screenshot

<img src="/docs/bot-screenshot.png" width="400" alt="Link Saver Screenshot">

## Self-hosting

1. 📦 Clone the repository.
2. 🤖 Create a new Telegram bot using the [BotFather](https://t.me/botfather) and obtain the bot token.
3. 📝 Create a new Telegraph Account by sending the following request:

```shell
curl -X POST https://api.telegra.ph/createAccount -d short_name=<short_name> -d author_name=<author_name>
```

4. 🔐 Create a `.env` file in the root directory with the following content:

```env
BOT_TOKEN=<your_bot_token>
TELEGRAPH_TOKEN=<your_telegraph_token>
```

5. ⚙️ Run the bot with the following command:

```shell
deno task bot
```

6. 🚀 Deploy the bot to [Deno Deploy](https://deno.com/deploy) using:

```shell
deployctl deploy --entry-point mod.ts
```

7. 🛠️ Set the environment variables in the Deno Deploy dashboard.
