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
            const { message } = JSON.parse(decodeURIComponent(querystring.parse(body).message));

            // Extract user ID from the message object
            const userId = message.from.id;

            // Placeholder logic: You need to implement the actual logic to check if the user joined the channel
            const userJoinedChannel = true; // Replace this with your actual logic

            // Rest of the code remains the same...
        } 
} catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Error processing the request: ${error.message}`);
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
