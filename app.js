const http = require('http');
const url = require('url');
const querystring = require('querystring');
const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const server = http.createServer((req, res) => {
    const { pathname, query } = url.parse(req.url);
    const params = querystring.parse(query);

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
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            const message = decodeURIComponent(querystring.parse(body).message);

            // Send the message to your Telegram bot using axios
            const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const data = new URLSearchParams({
                chat_id: CHAT_ID,
                text: message,
            }).toString();

            axios
                .post(telegramApiUrl, data, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                })
                .then((response) => {
                    console.log(response.data);
                    res.end('Message sent to Telegram bot!');
                })
                .catch((error) => {
                    console.error(error);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error sending message to Telegram bot');
                });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running');
});
