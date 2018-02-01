var l = console.log
var changeTime = 500 // auto change img ms
var changeTimeMin = 3000
var changeTimeMax = 10000

l('gallery connected')
findGallery()

function findGallery(){
	var gallerys = document.querySelectorAll('.gallery')

	gallerys.forEach(gallery => {
		new Gallery({
			elem: gallery,
			autoslide: true
		})
	})
}

function Gallery(options){
	l('new gallery')
	var gallery = options.elem
	var galleryWrapper = gallery.parentElement
	var goods 
	var path


	// change page activity
	gallery.status = {
		active : true,
		href : location.pathname.substr(1),
		timer : {}
	}
	gallery.status.timer.timerId = setTimeout(function f(){
		
		if(gallery.status.timer.last == undefined){
			gallery.status.timer.last = performance.now()
		} else {
			var timeDifference = performance.now() - gallery.status.timer.last - 1000
			gallery.status.timer.last = performance.now()

			if(timeDifference > 100){
				gallery.status.active = false
			} else {
				gallery.status.active = true
			}
		}

		//if page changed stop loading and checking activity
		if(location.pathname.substr(1) != gallery.status.href){
			//remove all timeouts
			goods.forEach(good => {
				clearTimeout(good.timer)
			})

			// deactivate 
			gallery.status.active = false

		} else {
			gallery.status.timer.timerId = setTimeout(f, 1000)
		}
	}, 1000)


	// get data	
	// if url = /:path => location.pathname.substr(1)
	// else url = / => getMainPage()
	path = 'getJSON/'  + (location.pathname.substr(1) || app.getMainPage())
	getData(path).then(
		json => {
			goods = JSON.parse(json).goods
			goods.forEach(good => {
				placeGood(good)
			})
		}, 
		err => {
			l(err)
		}
	)

	function placeGood(good){
		//l(good)

		// create new block
		// template, didnt hear bout?
		var goodBlock = document.createElement('div')
		var img = document.createElement('img')
		var imgTitle = document.createElement('div')

		goodBlock.classList.add('gallery-goodBlock')
		img.classList ='gallery-goodBlock__image gallery-goodBlock__image--hidden'
		imgTitle.classList.add('gallery-goodBlock__image-title')

		goodBlock.setAttribute('href', good.href)
		goodBlock.href = good.href
		goodBlock.imgNum = 0
		goodBlock.img = img
		img.src = good.images[0]
		img.onload = function(){
			img.classList.remove('gallery-goodBlock__image--hidden')
			app.resize()
		}
		imgTitle.innerHTML = good.title

		goodBlock.appendChild(img)
		goodBlock.appendChild(imgTitle)
		gallery.appendChild(goodBlock)


		//auto change img
		goodBlock.nextImg = function(){
			goodBlock.imgNum++
			if(goodBlock.imgNum > good.images.length-1) goodBlock.imgNum = 0

			var tempImg = document.createElement('img')
			tempImg.src = good.images[goodBlock.imgNum]
			tempImg.onload = function(){
				hideCurrent()
					.then(showNext)
			}

			function hideCurrent(){
				return new Promise((resolve, reject) => {
					goodBlock.img.style.transition = changeTime/1000 + 's'
					setTimeout(() => {
						goodBlock.img.style.opacity = 0;

						setTimeout(() => {
							resolve()
						}, changeTime)
					}, 50)
				})
			}

			//show next and load next next
			function showNext(){
				goodBlock.img.src = good.images[goodBlock.imgNum]
				goodBlock.img.style.opacity = 1;

				setTimeout(()=>{
					goodBlock.img.style.transition = ''

					// if no active => > no loading
					good.timer = setTimeout(function f(){
						if(gallery.status.active){
							l('gallery.status.active : ', gallery.status.active)
							goodBlock.nextImg()
						} else {
							l(' NO ACTIVE!!')
							good.timer = setTimeout(f, randomTime(changeTimeMin, changeTimeMax))
						}

					}, randomTime(changeTimeMin, changeTimeMax))
				}, changeTime)
			}
		}
		// start nextimg
		good.timer = setTimeout(goodBlock.nextImg, randomTime(changeTimeMin, changeTimeMax))

		function randomTime(min, max){
			return min + Math.round(Math.random() * (max - min))
		}

		//bind change page
		goodBlock.onclick = function(){
			l(this.href)
		}

	}	
}