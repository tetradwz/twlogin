const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const math = require('mathjs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

const users = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect('/index.html?error=emptyfields');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });
    res.redirect('/index.html?registered=true');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.redirect('/index.html?error=invalidcredentials');
    }

    req.session.user = { username };
    res.redirect('/calculator.html');
});

app.post('/calculate', (req, res) => {
    const { expression } = req.body;

    try {
        const formattedExpression = expression.replace(/√/g, 'sqrt');
        const result = math.evaluate(formattedExpression);
        res.json({ result: result.toString() });
    } catch (e) {
        res.json({ result: 'Hatalı ifade' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/index.html');
});

app.get('*', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'public', 'calculator.html'));
    } else {
        res.redirect('/index.html');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.redirect('/index.html?error=emptyfields');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ username, password: hashedPassword });

    // Kayıt işlemi sonrası başarılı kayıt mesajı ve sayfada kalma
    res.send(`
        <html>
        <head>
            <title>Başarılı Kayıt</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f4f4f4;
                    margin: 0;
                }
                .message {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                button {
                    padding: 10px;
                    background-color: #28a745;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #218838;
                }
            </style>
        </head>
        <body>
            <div class="message">
                <h2>Başarılı kayıt oldunuz!</h2>
                <p>Kayıt işlemi tamamlandı. Giriş sayfasına yönlendirileceksiniz.</p>
                <button onclick="window.location.href='/index.html';">Tamam</button>
            </div>
        </body>
        </html>
    `);
});

