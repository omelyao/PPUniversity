const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../database.sqlite');

// Создаем директорию для базы данных, если она не существует
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
  define: {
    // Отключаем автоматическое создание timestamp полей
    timestamps: true,
    // Используем snake_case вместо camelCase для полей
    underscored: true
  }
});

module.exports = sequelize; 