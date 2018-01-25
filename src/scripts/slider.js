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
	var images
	var distance
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
		var slideDirection
		var targetImgBlock
		var distanceForChange = 150
		slider.dragged = false

		if(target == sliderArrowLeft || target == sliderArrowRight || target == e.currentTarget) return

		targetImgBlock = target.closest('.slider-imageBlock')
		startX -= +getComputedStyle(targetImgBlock).left.match(/-?\d+/)[0]

		document.body.addEventListener('mousemove', moveImageBlock)
		document.body.addEventListener('mouseup', stopMoveImageBlock)
		

		//add left and right elements ??



		function moveImageBlock(e){
			if(!slider.dragged && Math.abs(e.clientX - startX) > 3){
				slider.dragged = true
				targetImgBlock.style.transition = '0s'
			}
			if(!slider.dragged) return


			if(e.clientX > startX && slideDirection != false){
				slideDirection = false

				 // cuz direction changed
				startPosition = e.clientX

			} else if(e.clientX < startX && slideDirection != true){
				slideDirection = true

				 // cuz direction changed
				startPosition = e.clientX
			}


			distance = startPosition - e.clientX
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

			targetImgBlock.style.left = Math.floor(e.clientX  - startX) + 'px' 
		}

		function stopMoveImageBlock(e){
			document.body.removeEventListener('mousemove', moveImageBlock)
			document.body.removeEventListener('mouseup', stopMoveImageBlock)

			targetImgBlock.style.transition = '';
			slider.dragged = false

			distance = Math.abs(startPosition - e.clientX)
			if(distance > distanceForChange){
				showImage(slideDirection)
			}
			else {
				targetImgBlock.style.left = '0px';
			}

			sliderArrowRight.classList.remove('slider__right-arrow--highlight')
			sliderArrowLeft.classList.remove('slider__left-arrow--highlight')
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

		//slide to new slide
		setTimeout(() => {
			if(direction){
				imgBlock.classList.remove('slider-imageBlock--right');

				[].forEach.call(currentBlocks, block => {
					block.style.left = ''
					block.style.transition = ''

					setTimeout(()=>{
						block.classList.add('slider-imageBlock--left')
						block.addEventListener('transitionend', function(e){
							if(e.propertyName == 'left'){
								this.remove()
							}
						})
					}, 10)
				})

			} else {
				imgBlock.classList.remove('slider-imageBlock--left');

				[].forEach.call(currentBlocks, block => {
					block.style.left = ''
					block.style.transition = ''

					setTimeout(()=>{
						block.classList.add('slider-imageBlock--right')
						block.addEventListener('transitionend', function(e){
							if(e.propertyName == 'left'){
								this.remove()
							}
						})
					}, 10)
				})

			}
		}, 50)
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
