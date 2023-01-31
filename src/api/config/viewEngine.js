import express from 'express';
import expressLayouts from 'express-ejs-layouts';

let configViewEngine = app => {
	app.use(express.static('./src/public'));
	app.set('view engine', 'ejs');
	app.set('views', './src/views');
	app.use(expressLayouts);
	app.set('layout', './layouts/master');
};

module.exports = configViewEngine;
