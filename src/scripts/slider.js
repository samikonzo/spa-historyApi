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
	var currentImageNumber = 0;
	//var lastImageBlock;

	sliderArrowRight && sliderArrowRight.addEventListener('click', e => {
		currentImageNumber++
		showImage(true)
	})	

	sliderArrowLeft && sliderArrowLeft.addEventListener('click', e => {
		currentImageNumber--
		showImage(false)
	})

	function showImage(direction = true){
		// create new block
		// template, didnt hear bout?
		var imgBlock = document.createElement('div')
		var img = document.createElement('img')
		var imgTitle = document.createElement('div')
		

		imgBlock.classList.add('slider-imageBlock')
		img.classList = ['slider-imageBlock__image slider-imageBlock__image--hidden']
		imgTitle.classList.add('slider-imageBlock__image-title')

		//load img
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
					imgBlock.classList.remove('slider-imageBlock--right')
					//lastImageBlock && lastImageBlock.classList.add('slider-imageBlock--left')
				} else {
					imgBlock.classList.remove('slider-imageBlock--left')
					//lastImageBlock && lastImageBlock.classList.add('slider-imageBlock--right')
				}
			}, 100)
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
