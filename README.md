# Link Saver

## Description

This is a simple web application that allows users to save links to articles.
Articles saved can be viewed using Telegram's "Instant View".

## Usage

1. Go to [Link Saver](https://t.me/link_saver_zsh_bot) and start the bot.
2. Send any article link to the bot.
3. The bot will save the link and provide you with a link to view the article using Telegram's "Instant View".

## How it works

The bot fetches the article using the link provided and parses the HTML using
Mozilla's Readability library to extract the article content.
I used a [fork](https://github.com/rtrigoso/readenobility) of the library that works with
Deno.

The article content is then converted to a Telegraph `Node` object and sent to the
Telegraph API to create a page.

The bot sends the Telegraph page link to the user, which appears as an "Instant View" article.

## Screenshot

![Screenshot](/docs/bot-screenshot.png)

## Self-hosting

1. Clone the repository.
2. Create a new Telegram but using the [BotFather](https://t.me/botfather) and get the bot token.
3. Create a new Telegraph Account by making the following request:

```shell
curl -X POST https://api.telegra.ph/createAccount -d short_name=<short_name> -d author_name=<author_name>
```

4. Create a `.env` file in the root directory with the following content:

```env
BOT_TOKEN=<your
TELEGRAPH_TOKEN=<your_telegraph_token>
```

5. Run the bot using the following command:

```shell
deno task bot
```

6. Deploy the bot to Deno Deploy using the following command:

```shell
deployctl deploy --entry-point mod.ts
```

7. Set the environment variables in the Deno Deploy dashboard.
