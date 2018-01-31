var l = console.log

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

	// get data	
	// if url = /:path => location.pathname.substr(1)
	// else url = / => getMainPage()
	var path = 'getJSON/'  + (location.pathname.substr(1) || app.getMainPage())
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
		l(good)

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
					goodBlock.img.style.transition = '1s'
					setTimeout(() => {
						goodBlock.img.style.opacity = 0;

						setTimeout(() => {
							resolve()
						}, 1000)
					}, 50)
				})
			}

			function showNext(){
				goodBlock.img.src = good.images[goodBlock.imgNum]
				goodBlock.img.style.opacity = 1;

				setTimeout(()=>{
					goodBlock.img.style.transition = ''

					setTimeout(()=>{
						goodBlock.nextImg()
					}, 3000)
				}, 1000)
			}
		}
		setTimeout(goodBlock.nextImg, 3000)

		//bind change page
		goodBlock.onclick = function(){
			l(this.href)
		}

	}	
}