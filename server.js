global.l = console.log
var express = require('express')
var app = express()
var reload = require('reload')
var bodyParser = require('body-parser')

reload(app)

app.use(express.static(__dirname + '/src/'))



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use((req, res, next) => {
	l('  ')
	l('req.method : ',req.method)
	l('req.url : ', req.url)
	l('req.xhr ? ', req.xhr)
	if(req.method == 'POST') l(req.body)
	next()
})

app.post('/simple', (req, res) => {
	l('simple request')
	setTimeout(()=>{
		res.send('bebebe')
	}, 1000)
})





app.listen(3000)
