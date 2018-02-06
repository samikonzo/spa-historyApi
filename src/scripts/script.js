var l = console.log

var app = (function(){

	var ui = {
		body: document.body,
		nav: document.body.querySelector('.nav'),
		pageTitle: document.body.querySelector('.page-title'),
		content: document.body.querySelector('.content'),
		contentWrapper: document.body.querySelector('.content-wrapper'),
		footer: document.body.querySelector('footer')
	};

	var config = {
		siteTitle: 'Tube-pipes SPA',
		mainPage: 'main',
		pages: {
			main: {
				title : 'Главная',
				menu : 'main'
			},

			contacts: {
				title: 'Контакты',
				menu: 'contacts'
			},

			gallery : {
				title: 'Галерея',
				menu: 'gallery'
			},

			pipes: {
				title: 'Трубки',
				menu: 'gallery'
			},

			sculpts: {
				title: 'Скульптуры',
				menu: 'gallery'
			},

			tables: {
				title: 'Столовые пренадлежности',
				menu: 'gallery'
			},

			other: {
				title: 'Разное',
				menu: 'gallery'
			},
		}
	};


	// main handlers
	function _bindHandlers(){
		ui.body.addEventListener('click', e=>{
			var target = e.target
			if(target.nodeName == 'LI' && target.dataset.link == 'ajax'){
				_navigate(e)
				return
			}

		})

		window.onpopstate = _popState;

		window.addEventListener('resize', e => {
			l('resize')
			trottledResizeContentWrapper()
		})

		document.documentElement.addEventListener('mousewheel', e => {
			checkFooterVisibilityAndDispatchEvent()
		}, {passive: true})
	}

	function checkFooterVisibilityAndDispatchEvent(){
		// less of 100px to footer
		var footerClose = ui.footer.getBoundingClientRect().top - document.documentElement.clientHeight < 100 
		if(!footerClose) return

		for(script in app.scripts){
			// trigger pageDownEvent
			app.scripts[script].pageDownEvent && app.scripts[script].pageDownEvent()
		}
	}

	// initialisation
	function init(){
		app.scripts = {}
		var page = document.location.pathname.substr(1) || config.mainPage
		_loadPage(page, true)
		_bindHandlers()
	}

	// 
	function _navigate(e){
		var page = e.target.getAttribute('href')
		l('_navigate page :', page)
		_loadPage(page)

		history.pushState({page: page}, null, page);
	}

	function navigateFromOuterSpace(href){
		_loadPage(href)

		history.pushState({page: href}, null, href);
	}

	function _popState(e){
		l('_popState')
		var page = (e.state && e.state.page) || config.mainPage;
		_loadPage(page, true)
	}

	function _loadPage(page, init=false){
		// init means that page loaded from init function

		// prevent reload page by clicking on current link
		if(!init && page == location.pathname.substr(1)){
			l(`from ${page} to ${page}`)
			l('page : ', page)
			l('location.pathname.substr(1) : ', location.pathname.substr(1))
			return
		} else if(!init && page == config.mainPage && location.pathname.substr(1) == ''){
			l('from mainPage to mainPage')
			return
		}

		// XHR
		getPageHtml(page)
		//
		// replace html
		//
			.then( 
				html => {
					return replaceContent(html)
				}

				,err => {l(err)}
			)
		//
		// change size and search scripts on page
		//
			.then( 
				() => {
					//l('lets find')
					resizeContentWrapper()
					return findAndLoadScripts()
				}

				,err => {l(err)}
			)
		//
		// rerun scripts 
		//
			.then(
				rerunArr => {
					l(rerunArr)
					rerunArr.forEach(scriptName => {
						app.scripts[scriptName]
							&& app.scripts[scriptName].run 
							&& app.scripts[scriptName].run()

						//l(app.scripts[scriptName])	
					})
				}

				,err => {l(err)}
			)

		function replaceContent(html){
			//l('replace content')
			//l(html)

			return new Promise((resolve, reject) => {
				var content = ui.content

				setCssPropValue(content, 'opacity', 0, +content.innerHTML)
					.then(
						() => {	
							content.innerHTML = html 
							return setCssPropValue(content, 'opacity', 1, 1)
						}
					).then(
						() => {
							//l('replace content end')
							resolve()
						}
					)
			})
		}

		function findAndLoadScripts(){
			return new Promise( resolve => {
				var scripts = ui.content.querySelectorAll('script')
				var rerunArr = []

				// filter templates
				scripts = [].filter.call(scripts, script => {
					if(script.getAttribute('type') == 'text/template') return false
					return true
				})
				
				// find src
				scripts = [].map.call(scripts, script => script.getAttribute('src'))

				//l(scripts)

				loadScripts(scripts)
					.then(
						() => {
							//l('all scripts loaded')
							resolve(rerunArr)
						}
					)

				function loadScripts(scripts){
					var i = 0;
					//l(scripts)					

					return new Promise( resolve => {
						loadNextScript()
						
						function loadNextScript(){
							if(!scripts[i]){
								resolve()
								return
							}

							//scripts for reruning
							//l('scripts[' + i + '] :')
							//l(scripts[i])
							var scriptName = scripts[i].match(/\/(\w+-?\w+).js/)[1]
							rerunArr.push(scriptName)

							if(app.scripts[scriptName]){ 
								//l('script allready loaded')
								i++
								loadNextScript()
								return
							}

							var el = document.createElement('script')
							el.setAttribute('src', scripts[i++])
							el.onload = function(){
								loadNextScript()
							}

							document.body.appendChild(el)
						}
					})
				}

			})
		}
	}

	//resizing function
	function resizeContentWrapper(){
		return new Promise( (resolve, reject) => {
			//l('height : ',ui.content.offsetHeight)

			setCssPropValue(ui.contentWrapper, 'height', ui.content.offsetHeight + 'px', 1)
				.then(checkFooterVisibilityAndDispatchEvent)
				.then(resolve, reject)
			
		})
	}	

	//trottled resize wrapper by resize window
	var trottledResizeContentWrapper = trottle(resizeContentWrapper, 400)	

	// add script fo refreshing
	function addScript(scriptName, statusObj){
		if(app.scripts[scriptName] 
			&& app.scripts[scriptName].statusObj 
			&& app.scripts[scriptName].statusObj.run){
				return
		}

		app.scripts[scriptName] = statusObj
		//l(' : ' + scriptName + ' added')
		//l(app.scripts[scriptName])
	}

	// return mainPage
	function getMainPage(){
		return config.mainPage
	}

	// XHR request for data
	function getData(path, body){
		return new Promise( (resolve, reject) => {
			var xhr = new XMLHttpRequest()
			xhr.open('POST', path)

			if(body){
				body = JSON.stringify(body)
				xhr.setRequestHeader("Content-type", "application/json");
			}


			xhr.send(body)
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

	return {
		init		: init,
		addScript 	: addScript,
		getMainPage : getMainPage,
		navigate 	: navigateFromOuterSpace,
		resize 		: resizeContentWrapper,
		getData		: getData
	}
})()




function showHeader(){
	var header = document.getElementsByTagName('header')[0]
	header.classList.remove('header--hidden')
}



//trottle function 
function trottle(f, time){
	function trottled(){
		if(trottled.busy){
			trottled.savedContext = this;
			trottled.savedArgs = arguments;
		} else {
			trottled.busy = true;
			setTimeout(function(){
				trottled.busy = false;

				if(trottled.savedArgs){
					trottled.apply(trottled.savedContext, trottled.savedArgs);
					delete trottled.savedArgs;
				}
			} ,time)

			f.apply(this,arguments);
		}
	}

	return trottled
}

// get pages
function getPageHtml(page){
	return new Promise((resolve, reject) => {
		var url = 'pages/' + page
		var xhr = new XMLHttpRequest()
		xhr.open('GET', url)
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
		xhr.onerror = function(){
			var err = new Error(this.statusText)
			err.code = this.status
			reject(err)
		}
	})	
}

// change css props
function setCssPropValue(el, prop, value, time){
	var promise = new Promise((resolve, reject) => {
		if(!time) time = 0.01

		el.style.transition = time + 's'
		setTimeout(function f(){

			setTimeout(() => {
				resolve()
				//l(prop, value)
			}, time*1000)

			el.style[prop] = value

		}, 50)
	})

	return promise
}



document.addEventListener('DOMContentLoaded', () => {
	app.init()

	setTimeout(showHeader, 1000)
})
