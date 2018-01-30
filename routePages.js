var express = require('express')
var router = express.Router()
var rootPath = __dirname + '/src/pages'
var slider = rootPath + '/slider/index.html'
var gallery = rootPath + '/gallery/index.html'

router.get('/:page', (req, res) => {
	l('routePages')

	var choosedPage
	//res.send('Pages : ' + req.url)
	l('req.params.page : ', req.params.page)
	switch (req.params.page) {
		case 'pipes' : ; 
		case 'sculpts' : ;
		case 'tables' : ;
		case 'other' : 
			choosedPage = gallery
			break;


		default:
			choosedPage = slider
			break;
	}

	res.sendFile(choosedPage)
})

module.exports = router