global.l = console.log
var express = require('express')
var app = express()
var reload = require('reload')
var bodyParser = require('body-parser')
var routePages = require('./routePages')

reload(app)



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use((req, res, next) => {
	l('  ')
	l('req.method : ',req.method)
	l('req.url : ', req.url)
	l('req.xhr ? ', req.xhr)
	//if(req.method == 'POST') l(req.body)
	next()
})

app.use(express.static(__dirname + '/src/'))


app.use('/pages', routePages)



app.get('/*', (req, res) => {
	l('send index.html')
	res.sendFile(__dirname + '/src/index.html')
})




/*app.post('/simple', (req, res) => {
	l('simple request')
	setTimeout(()=>{
		res.send('bebebe')
	}, 1000)
})
*/




app.listen(3000)
