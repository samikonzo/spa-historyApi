const express 	= require('express')
const route 	= express.Router()
const fs 		= require('fs')

route.post('/:path', (req, res, next) => {
	l('routeJSON : ', req.params.path)
	l('req.body :', req.body)

	var fullPath = __dirname  + '/src/jsons/' + req.params.path + '.json'
	l('fullPath : ', fullPath)

	var body = req.body
	if(!Object.keys(body).length){
		l('no body')
		var readable = fs.createReadStream(fullPath)
		readable.pipe(res)
		return
	} else {
		var json = fs.readFile(fullPath, "utf8", (err, data) => {

			switch(req.body.app){
				case 'gallery'	: galleryInteraction(); break;
				case 'slider'	: sliderInteraction(); break;
			}
			//var items = JSON.parse(data)[req.body.app][req.body.request]
			//var items = JSON.parse(data).gallery.items
			//var start = req.body.last
			//res.send(JSON.stringify(items.splice(start, 4)))


			function galleryInteraction(){
				l('galleryInteraction')
				switch(req.body.request){
					case 'items'	: 	var items = JSON.parse(data)[req.body.app][req.body.request]
										var start = req.body.start || 0
										var end = req.body.end || items.length
										var result = items && items.splice(start, (end-start))

										if(!result || !result.length){
											res.status(204)
											res.send()
											return
										} 

										res.send(JSON.stringify(result))
										break;
				}

			}
			function sliderInteraction(){

			}
		})

	}


	
	


	//var readable = fs.createReadStream(fullPath)
	//readable.pipe(res)
})

module.exports = route