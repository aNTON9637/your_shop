#!/bin/bash

# Установка зависимостей
npm install

# Запуск деплоя через Node.js
node -e "
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();
const config = require('./ftp-config.json');

ftpDeploy
    .deploy(config)
    .then(res => console.log('Деплой завершен:', res))
    .catch(err => console.log('Ошибка деплоя:', err));
" 