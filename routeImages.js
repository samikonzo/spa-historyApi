const express = require('express')
const route = express.Router()

route.get('/*', (req, res) => {
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	l('IMAGES!')
	l('req.url : ', req.url)
	l('req.href : ', fullUrl)
})

module.exports = route