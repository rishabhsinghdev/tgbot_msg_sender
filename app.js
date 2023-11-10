const http = require('http');
const url = require('url');
const querystring = require('querystring');
const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const WELCOME_MESSAGE = "Welcome to the Bot! Please join our channel.";
const CHANNEL_LINK = "https://t.me/cashback42";

const server = http.createServer(async (req, res) => {
    const { pathname, query } = url.parse(req.url);

    if (pathname === '/') {
        // Serve the HTML form
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
        try {
            const body = await getRequestBody(req);
            const { message, id } = JSON.parse(decodeURIComponent(querystring.parse(body).message));

            // Check if the user has joined the channel (you need to implement this logic)
            const userJoinedChannel = /* Implement logic to check if user joined the channel based on user ID (id) */;

            // Send appropriate message based on channel verification
            const responseMessage = userJoinedChannel
                ? `Hello, ${id}! ${WELCOME_MESSAGE}`
                : `Hello, ${id}! Please join our channel to proceed.`;

            const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const responseData = new URLSearchParams({
                chat_id: id,
                text: responseMessage,
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'Join Channel', url: CHANNEL_LINK }],
                    ],
                }),
            }).toString();

            await axios.post(telegramApiUrl, responseData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            res.end('Message sent successfully!');
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error processing the request');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const getRequestBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', (error) => {
            reject(error);
        });
    });
};

server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
});
