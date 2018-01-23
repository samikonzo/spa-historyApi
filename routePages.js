var l = console.log
var express = require('express')
var router = express.Router()
var rootPath = __dirname + '/src/pages'

router.get('/*', (req, res) => {
	l('PAGES :')
	l('url : ', req.url)
	res.send('bebebe : ' + req.url)
	//res.sendFile(rootPath + req.url)
})

/*router.get('/contacts', (req, res) => {
	res.send('CONTACTS PAGE')
})

router.get('/gallery', (req, res) => {
	res.send('GALLERY PAGE')
})

router.get('/pipes', (req, res) => {
	res.send('PIPES PAGE')
})

router.get('/sculpts', (req, res) => {
	res.send('SCULPTS PAGE')
})

router.get('/tables', (req, res) => {
	res.send('TABLES PAGE')
})

router.get('/other', (req, res) => {
	res.send('OTHER PAGE')
})*/

module.exports = router