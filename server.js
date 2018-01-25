global.l = console.log
const express 		= require('express')
const app 			= express()
const reload 		= require('reload')
const bodyParser 	= require('body-parser')
const routePages 	= require('./routePages')
const routeImages 	= require('./routeImages')
const routeJSON 	= require('./routeJSON')

reload(app)



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use((req, res, next) => {
	l(req.method,'req.url : ', req.url)
	next()
})

var staticOptions = {
	/*dotfiles: 'ignore',
	etag: false,
	extensions: ['htm', 'html'],
	index: false,
	maxAge: '1d',
	redirect: false,
	setHeaders: function (res, path, stat) {
		res.set('x-timestamp', Date.now())
	}*/
}

app.use(express.static(__dirname + '/src/', staticOptions))

app.use('/pages', routePages)

app.use('/images', routeImages)

app.use('/getJSON', routeJSON)

app.get('/*', (req, res) => {
	//l('send index.html')
	res.sendFile(__dirname + '/src/index.html')
	//res.redirect('/')
})

app.post('/*', (req, res) => {
	l('def app.post')
})


app.listen(3000)
