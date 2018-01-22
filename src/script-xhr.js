var l = console.log

/*
for redirect from unavailable/unexist path '/images' to '/hiddenPath/
	app.use('/images', express.static(__dirname + '/src/hiddenPath/'))
*/


document.onclick = function(e){
	var promise = new Promise((resolve, reject) =>{
		var xhr = new XMLHttpRequest()
		xhr.open('POST', 'simple', true)
		xhr.setRequestHeader('X-Test-Header2', 'what the fuck is it?')
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send('body=25&tail=22')

		var start = performance.now()

		xhr.onload = function(){
			if(this.status == 200){
				resolve({
					response : this.response,
					time : (performance.now() - start).toFixed(0) + 'ms'
				})
			} else {
				var err = new Error(this.statusText)
				err.code = this.status
				reject(err)
			}
		}
	})

	promise.then(
		response => {
			l(response.time, ':', response.response)
		},
		err =>{
			l(err)
		}
	).then(
		function(){
			var img = document.querySelector('img')
			if(!img) img = document.createElement('img');
			img.src = 'images/birds.jpg';
			//img.style.opacity = '1'
			img.style.transition = '1s';
			img.onload = function(){ setTimeout(function(){
				img.style.opacity = 0;
				setTimeout(()=>{
					img.remove()
					document.body.click()
				},1000)
			}, 1000)}
			document.body.appendChild(img)
		}
	)

}