var express = require('express')
var router = express.Router()
var rootPath = __dirname + '/src/pages'

router.get('/*', (req, res) => {
	l('routePages')
	res.send('Pages : ' + req.url)
})

module.exports = router