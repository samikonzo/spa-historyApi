;(function(){
	var l = console.log
	l('gallery connected')

	/*
	*	gallery API:
	*		run will find gallerys on page
	*		active - status of page activity
	*		
	*/
		var galleryAPI = {
			run 	: galleryRun,
			active 	: true,
			pageDownEvent : pageDownEvent,
			changePageEvent : '',
			gallerys : []
		}
		
		app.addScript('gallery', galleryAPI)
	
		function pageDownEvent(){
			galleryAPI.gallerys.forEach(gallery => {
				var widgetEvent = new CustomEvent('pageDownEvent', {
					bubbles: true,
				})

				gallery.elem.dispatchEvent(widgetEvent)
			})
		}

		function changePageEvent(){
			galleryAPI.gallerys.forEach(gallery => {
				gallery.elem.remove()
			})
		}


	/*
	* 	Gallery run:
	*		get template if need
	*		find gallery
	*
	*/
		function galleryRun(){
			getTemplate()
				.then(
					findGallery
				)
		}


	/*
	*	Get gallery item-template
	*/
		function getTemplate(){
			return new Promise( (resolve, reject) => {
				if(!Gallery.itemTemplate){
					var tmpl = getPageHtml('gallery/template.html').then(
						(html) => { 
							Gallery.itemTemplate = html
							resolve()
						}
					)
				} else { resolve() }
			})
		}


	/*
	*	FindGallery
	*		will find gallerys on page by runing from API
	*
	*/
		function findGallery(){
			var gallerys = document.querySelectorAll('.gallery')
			gallerys.forEach(gallery => {
				gallery = new Gallery({
					elem: gallery,
					time: {
						changeTime : 500,
						holdTime : 5000
					}
				})

				galleryAPI.gallerys.push(gallery)
			})
		}



	/*
	*	
	*	Gallery constructor
	*
	*/
		function Gallery(options){
			this.elem = options.elem

			var gallery = options.elem
			var galleryWrapper = gallery.parentElement
			var path = location.pathname.substr(1) || app.getMainPage()
			var currentLast = 0
			var items 
		
			/*
			*	Main bind
			*/
				gallery.addEventListener('pageDownEvent', galleryPageDownEvent, {once : true})

				function galleryPageDownEvent(){
					loadItems()
						.then(
							json => placeItems(json),
							err => {
								//l(err)
							}
						)
						.then(
							() => {gallery.addEventListener('pageDownEvent', galleryPageDownEvent, {once : true})},
						)
				}

			/*  JSON to items
			*	get data from server and put in items
			*		by location.href
			*		maybe by elem.name
			*/
				loadItems()
					.then(
						json => placeItems(json),
						err => {l(err)}
					)


			/*
			*	Load some items (4)
			* 	
			*/
				function loadItems(){
					return app.getData('getJSON/' + path, {
						app 	: 'gallery',
						request	: 'items',
						start	: currentLast,
						end		: currentLast + 4,
					})
				}

			/*
			*	Page Down Event Bind
			*
			*/
				gallery.addEventListener('pageDownEvent', (e) => {

				})



			/*
			*	Place items
			*
			*/
				function placeItems(json){
					return new Promise( (resolve, reject) => {
						var items = JSON.parse(json)
						items.forEach( (item, i, arr) => {
							currentLast++
							
							if(i == arr.length - 1){
								//last
								placeItem(item)
									.then(resolve, reject)
							} else {
								placeItem(item)
								
							}
							

						})
					})
				}


			/*
			*
			*	Place gallery-item by tmplt
			*
			*/
				function placeItem(item){
					return new Promise( (resolve, reject) => {
						var imgPath = `/images/${path}/${item.id}/`
						var imgNum = 0
						var img

						/*
						*	create itemBlock from Gallery.itemTemplate
						*/
							var itemHTML = _.template(Gallery.itemTemplate)({
								href : item.href,
								title : 'bebebe',
								src : '',
							})
							var itemBlock = document.createElement('div')
							itemBlock.innerHTML = itemHTML
							itemBlock = itemBlock.firstElementChild
							gallery.appendChild(itemBlock)
							app.resize().then(resolve, reject)

						/*
						* bind img changing
						*/
							img = itemBlock.querySelector('.gallery-img-block__img')

							img.addEventListener('load', () => {
								img.classList.remove('gallery-img-block__img--hidden')
								itemBlock.classList.remove('gallery-item--unready')
							}, {once: true})

						

						loadNextImg(0)
					


						function loadNextImg(num){
							if(!galleryAPI.active || !checkCurrentPage()){
								setTimeout(loadNextImg, options.time.holdTime/2)
								return
							}

							if(num == undefined) num = ++imgNum
							if(num > item.images.length - 1) num = 0
							imgNum = num

							var tmpImg = document.createElement('img')
							tmpImg.src = imgPath + item.images[num]

							tmpImg.addEventListener('load', function(){
								imgHide()
									.then(() => {
										img.src = tmpImg.src
									})
									.then(imgShow)
									.then(setDefaultImgOpacity)
									.then(
										() => {
											setTimeout(loadNextImg, options.time.holdTime)
										}

									)
							})
						}

						function imgHide(){
							return new Promise(resolve => {
								if(!img.src){ 
									resolve()
									return
								}
								//setCssPropValue(el, prop, value, time)
								setCssPropValue(img, 'opacity', 0, options.time.changeTime/2/1000)
									.then(resolve)

							})
						}

						function imgShow(){
							return setCssPropValue(img, 'opacity', 1, options.time.changeTime/2/1000)
						}

						function setDefaultImgOpacity(){
							img.style.opacity = ''
					}

					})
				}


			/*
			*
			*	Extra funciton
			*
			*/
				//check current page
				function checkCurrentPage(){
					return (path == location.pathname.substr(1) || path == app.getMainPage())

				}
				
		}


	/*
	*
	*	Extra funciton
	*
	*/



})()







