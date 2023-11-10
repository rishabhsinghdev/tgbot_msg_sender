const http = require('http');
const url = require('url');
const querystring = require('querystring');
const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
// ... (existing code)

const WELCOME_MESSAGE = "Welcome to the Bot! Please join our channel.";
const CHANNEL_LINK = "https://t.me/cashback42";

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url);
    const params = querystring.parse(query);

    if (pathname === '/') {
        // Serve the HTML form
        const welcomeMarkup = JSON.stringify({
            inline_keyboard: [
                [
                    {
                        text: 'Join Channel',
                        url: CHANNEL_LINK,
                    },
                ],
            ],
        });

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<!DOCTYPE html>
<html>
<head>
    <title>Telegram Bot Message Sender</title>
</head>
<body>
    <form method="post" action="/send">
        <label for="message">Message:</label>
        <input type="text" id="message" name="message" required>
        <button type="submit">Send</button>
    </form>
</body>
</html>`);
    } else if (pathname === '/send' && req.method === 'POST') {
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            const { message, id } = JSON.parse(decodeURIComponent(querystring.parse(body).message));
            
            // Check if the user has joined the channel
            const userJoinedChannel = /* Implement logic to check if user joined the channel based on user ID (id) */;

            if (userJoinedChannel) {
                // Send the welcome message
                const welcomeMessage = `Hello, ${id}! ${WELCOME_MESSAGE}`;
                const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
                const welcomeData = new URLSearchParams({
                    chat_id: id,
                    text: welcomeMessage,
                    reply_markup: welcomeMarkup,
                }).toString();

                axios.post(telegramApiUrl, welcomeData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then((response) => {
                    console.log(response.data);
                    res.end('Welcome message sent!');
                }).catch((error) => {
                    console.error(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error sending welcome message');
                });
            } else {
                // Send a warning message
                const warningMessage = `Hello, ${id}! Please join our channel to proceed.`;
                const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
                const warningData = new URLSearchParams({
                    chat_id: id,
                    text: warningMessage,
                }).toString();

                axios.post(telegramApiUrl, warningData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then((response) => {
                    console.log(response.data);
                    res.end('Warning message sent!');
                }).catch((error) => {
                    console.error(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error sending warning message');
                });
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// ... (existing code)


server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
});
