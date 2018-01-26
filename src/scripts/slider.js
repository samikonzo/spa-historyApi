var l = console.log


document.addEventListener('DOMContentLoaded', () => {
	app.add(findSlider)
})

function findSlider(){
	var sliders = document.querySelectorAll('.slider')

	sliders.forEach(slider => {
		new Slider({
			elem: slider,
			autoslide: true
		})
	})
}

function Slider(options){
	var slider = options.elem
	var sliderWrapper = slider.parentElement
	var sliderArrowLeft = slider.querySelector('.slider__left-arrow')
	var sliderArrowRight = slider.querySelector('.slider__right-arrow')
	var images
	var distance
	var currentImageNumber = -1;

	// get data and show first img
	var path = 'getJSON/' + (location.pathname.substr(1) || app.getMainPage())// change for something
	getData(path)
		.then(
			json => {
				images = JSON.parse(json).images
				showImage();
			},
			err => {
				l(err)
			}
		)



	// main binds
	sliderArrowRight && sliderArrowRight.addEventListener('click', e => {
		showImage(true)
	})	

	sliderArrowLeft && sliderArrowLeft.addEventListener('click', e => {
		showImage(false)
	})

	slider.addEventListener('mousedown', e => {
		e.preventDefault()
		var target = e.target
		var startX = e.clientX
		var slideDirection
		var distance = 0
		var distanceForChange = 100
		var imgBlocks = slider.querySelectorAll('.slider-imageBlock')
		var imgBlock = imgBlocks[imgBlocks.length-1];
		var startImgBlockLeft = getComputedStyle(imgBlock).left.match(/-?\d+/)[0]


		// main listeners
		document.body.addEventListener('mousemove', moveImageBlock)
		document.body.addEventListener('mouseout', checkForWindowLeave)
		document.body.addEventListener('mouseup', stopMoveImageBlock)


		function moveImageBlock(e){
			// drag slide
			if(!slider.dragged && Math.abs(e.clientX - startX) > 3){
				slider.dragged = true
				imgBlock.style.transition = '0s'
				imgBlock.style.cursor = 'default'
			}
			if(!slider.dragged) return


			// tuning slideDirection
			if(e.clientX > startX && slideDirection != false){
				slideDirection = false
			} else if(e.clientX < startX && slideDirection != true){
				slideDirection = true
			}

			/*
				//highlighting arrow
				if(distance > distanceForChange){
					sliderArrowRight.classList.add('slider__right-arrow--highlight')
					sliderArrowLeft.classList.remove('slider__left-arrow--highlight')
				} else if(distance < -distanceForChange){
					sliderArrowLeft.classList.add('slider__left-arrow--highlight')
					sliderArrowRight.classList.remove('slider__right-arrow--highlight')
				} else {
					sliderArrowRight.classList.remove('slider__right-arrow--highlight')
					sliderArrowLeft.classList.remove('slider__left-arrow--highlight')
				}
			*/


			// move imgBlock
			var newLeft = +startImgBlockLeft + e.clientX - startX
			imgBlock.style.left = newLeft + 'px';
		}

		function checkForWindowLeave(e){
			if(e.relatedTarget == null || e.relatedTarget == document.documentElement){
				stopMoveImageBlock(e)
			}
		}

		function stopMoveImageBlock(e){
			document.body.removeEventListener('mousemove', moveImageBlock)
			document.body.removeEventListener('mouseout', checkForWindowLeave)
			document.body.removeEventListener('mouseup', stopMoveImageBlock)

			imgBlock.style.transition = ''
			imgBlock.style.cursor = ''
			slider.dragged = false

			distance = Math.abs(startX - e.clientX)
			
			if(distance < 2 && e.target != sliderArrowLeft && e.target != sliderArrowRight){
				l(imgBlock.href)
				app.navigate(imgBlock.href)
				return
			}

			if(distance > distanceForChange){
				if(slideDirection !== undefined) showImage(slideDirection)
			} else {
				imgBlock.style.left = '0px';
			}
		}
		
	})


	function showImage(direction = true){
		var currentBlocks = [].slice.call(slider.getElementsByClassName('slider-imageBlock'))

		// create new block
		// template, didnt hear bout?
		var imgBlock = document.createElement('div')
		var img = document.createElement('img')
		var imgTitle = document.createElement('div')
		
		imgBlock.classList.add('slider-imageBlock')
		img.classList = 'slider-imageBlock__image slider-imageBlock__image--hidden'
		imgTitle.classList.add('slider-imageBlock__image-title')

		//load img
		if(direction){
			currentImageNumber++
		} else {
			currentImageNumber--
		}

		// change number
		if(currentImageNumber > images.length - 1){
			currentImageNumber = 0
		} else if(currentImageNumber < 0){
			currentImageNumber = images.length - 1
		}
		
		// current = last of images
		var currentImage = images[currentImageNumber]

		// img parameters
		img.src = currentImage.src
		img.setAttribute('href', currentImage.href)
		imgBlock.href = currentImage.href
		img.onload = function(){
			img.classList.remove('slider-imageBlock__image--hidden')
		}
		imgTitle.innerHTML = currentImage.title

		//add img & imgTitle to imgBlock
		imgBlock.appendChild(img)
		imgBlock.appendChild(imgTitle)

		// define start position
		if(direction){
			imgBlock.classList.add('slider-imageBlock--right')
		} else {
			imgBlock.classList.add('slider-imageBlock--left')
		}

		//deploy imgBlock
		slider.appendChild(imgBlock)


		//slide to new slide
		var sideForOldImgBlock
		setTimeout(() => {
			if(direction){
				sideForOldImgBlock = 'left'

			} else {
				sideForOldImgBlock = 'right'
			}

			imgBlock.classList.remove('slider-imageBlock--right');
			imgBlock.classList.remove('slider-imageBlock--left');
			[].forEach.call(currentBlocks, block => {
					if(!block.directed){
						block.directed = true
						block.style.left = ''
						block.style.transition = ''

						setTimeout(()=>{
							block.classList.add('slider-imageBlock--' + sideForOldImgBlock)
							block.style.opacity = 0;
							block.addEventListener('transitionend', function(e){
								if(e.propertyName == 'left'){
									this.remove()
								}
							})
						}, 10)
					}
				})

		}, 50)
	}

}

function getData(path){
	return new Promise( (resolve, reject) => {
		var xhr = new XMLHttpRequest()
		xhr.open('POST', path)
		xhr.send()
		xhr.onload = function(){
			if(this.status == 200){
				resolve(this.response)
			} else {
				var err = new Error(this.statusText)
				err.code = this.status
				reject(err)
			}
		}
	})
}

