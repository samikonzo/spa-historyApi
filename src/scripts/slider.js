var l = console.log

/*
slider
slider__wrapper
slider__left-arrow
slider__right-arrow
slider__image
*/

/*
var options = {
	elem: elem,
	autoslide: true, 
	autoslideTiem: 2000, //ms
}
*/


document.addEventListener('DOMContentLoaded', () => {
	app.add(findSlider)
})

function findSlider(){
	var sliders = document.querySelectorAll('.slider')

	sliders.forEach(slider => {
		new Slider({
			elem: slider
		})
	})
}

function Slider(options){
	var slider = options.elem
	var sliderWrapper = slider.parentElement
	var sliderArrowLeft = slider.querySelector('.slider__left-arrow')
	var sliderArrowRight = slider.querySelector('.slider__right-arrow')
	var images;
	var currentImageNumber = -1;
	//var lastImageBlock;

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
		var startPosition = startX
		var startTime = performance.now()
		var slideDirection
		var targetImgBlock
		slider.dragged = false

		if(target == sliderArrowLeft || target == sliderArrowRight || target == e.currentTarget) return

		targetImgBlock = target.closest('.slider-imageBlock')
		startX -= +getComputedStyle(targetImgBlock).left.match(/-?\d+/)[0]

		document.body.addEventListener('mousemove', slideImageBlock)
		document.body.addEventListener('mouseup', stopSlideImageBlock)
		

		//add left and right elements



		function slideImageBlock(e){
			if(!slider.dragged && Math.abs(e.clientX - startX) > 3){
				slider.dragged = true
				targetImgBlock.style.transition = '0s'
			}
			if(!slider.dragged) return


			if(e.clientX > startX && slideDirection != false){
				slideDirection = false

				 // cuz direction changed
				startTime = performance.now()
				startPosition = e.clientX

			} else if(e.clientX < startX && slideDirection != true){
				slideDirection = true

				 // cuz direction changed
				startTime = performance.now()
				startPosition = e.clientX
			}


			targetImgBlock.style.left = Math.floor(e.clientX  - startX) + 'px' 
		}

		function stopSlideImageBlock(e){
			document.body.removeEventListener('mousemove', slideImageBlock)
			document.body.removeEventListener('mouseup', stopSlideImageBlock)

			//targetImgBlock.style.transition = '';
			slider.dragged = false
			var distance = Math.abs(startPosition - e.clientX)
			if(distance > 50)	showImage(slideDirection)
			else {}// return to old position
			/*var distance = Math.abs(startPosition - e.clientX) //px
			var time = (performance.now() - startTime) / 1000 //s
			var speed = distance / (time*2)
			var transitionTime = targetImgBlock.offsetWidth / speed;
			l('speed :', speed, 'px/s')
			l('transition time :', transitionTime, 's')

			targetImgBlock.style.transition = transitionTime.toFixed(1) + 's' 
			targetImgBlock.style.transitionTimingFunction = 'linear'

			setTimeout(()=>{
				targetImgBlock.style.left = slideDirection 	? -targetImgBlock.offsetWidth + 'px' 
															: targetImgBlock.offsetWidth + 'px'
			}, 0)*/

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
		img.classList = ['slider-imageBlock__image slider-imageBlock__image--hidden']
		imgTitle.classList.add('slider-imageBlock__image-title')

		//load img
		if(direction){
			currentImageNumber++
		} else {
			currentImageNumber--
		}


		if(currentImageNumber > images.length - 1){
			currentImageNumber = 0
		} else if(currentImageNumber < 0){
			currentImageNumber = images.length - 1
		}
		
		var currentImage = images[currentImageNumber]

		img.src = currentImage.src
		img.setAttribute('href', currentImage.href)
		img.onload = function(){
			img.classList.remove('slider-imageBlock__image--hidden')

			setTimeout(() => {
				if(direction){
					imgBlock.classList.remove('slider-imageBlock--right');

					[].forEach.call(currentBlocks, block => {
						block.style.left = ''
						block.style.transition = ''

						setTimeout(()=>{
							block.classList.add('slider-imageBlock--left')
							block.addEventListener('transitionend', function(){
								this.remove()
							})
						}, 10)
					})
					//lastImageBlock && lastImageBlock.classList.add('slider-imageBlock--left')
				} else {
					imgBlock.classList.remove('slider-imageBlock--left');

					[].forEach.call(currentBlocks, block => {
						block.style.left = ''
						block.style.transition = ''

						setTimeout(()=>{
							block.classList.add('slider-imageBlock--right')
							block.addEventListener('transitionend', function(){
								this.remove()
							})
						}, 10)
					})
					//lastImageBlock && lastImageBlock.classList.add('slider-imageBlock--right')
				}
			}, 50)
		}
		imgTitle.innerHTML = currentImage.title

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
	}


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


}

function getData(path){
	return new Promise( (resolve, reject) => {
		var xhr = new XMLHttpRequest()
		//xhr.responseType = 'json'
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
