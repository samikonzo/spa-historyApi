const express 	= require('express')
const route 	= express.Router()
const fs 		= require('fs')

route.post('/:path', (req, res, next) => {
	l('routeJSON : ', req.params.path)
	var fullPath = __dirname  + '/src/jsons/' + req.params.path + '.json'
	l('fullPath : ', fullPath)

	var readable = fs.createReadStream(fullPath)
	readable.pipe(res)
})

module.exports = route