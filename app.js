module.exports = (req, res) => {
    const express = require('express');
    const bodyParser = require('body-parser');
    const axios = require('axios');

    const app = express();
    app.use(bodyParser.urlencoded({ extended: false }));

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.CHAT_ID;
if (req.url === '/') {
    // Serve the index.html file
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
} else if (req.url === '/send' && req.method === 'POST') {
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            const message = decodeURIComponent(body);
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
};
