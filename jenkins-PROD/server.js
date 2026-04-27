const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Настройка Middleware
app.use(express.json());
app.use('/api', express.static(path.join(__dirname, 'public')));

// Инициализация БД в оперативной памяти (для демонстрации)
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (username TEXT, password TEXT)");
    // Создание тестового пользователя
    db.run("INSERT INTO users (username, password) VALUES ('admin', 'admin123')");
});

// API авторизации
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.get(query, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Ошибка сервера' });
        }
        if (row) {
            res.json({ success: true, message: 'Авторизация успешна!' });
        } else {
            res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
