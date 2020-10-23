const mix = require('laravel-mix');

mix.disableSuccessNotifications().react('src/index.js', 'public').sass('src/index.scss', 'public');
