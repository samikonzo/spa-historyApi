var l = console.log

var app = (function(){

	var ui = {
		body: document.body,
		nav: document.body.querySelector('.nav'),
		pageTitle: document.body.querySelector('.page-title'),
		content: document.body.querySelector('.content'),
		contentWrapper: document.body.querySelector('.content-wrapper')

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

	var apps = {}

	// main handlers
	function _bindHandlers(){
		ui.body.addEventListener('click', e=>{
			var target = e.target
			if(target.nodeName == 'LI' && target.dataset.link == 'ajax'){
				_navigate(e)
			}
		})

		window.onpopstate = _popState;
	}

	// initialisation
	function init(){
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

	function navigateFromOutSpace(href){
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

		// promise
		var promise = new Promise((resolve, reject) => {
			var url = 'pages/' + page
			var pageTitle = config.pages[page].title
			var menu = config.pages[page].menu
			

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
			xhr.onprogress = function(e){
				//l(e.loaded)
			}
		})


		promise.then(
			html => replaceContent(html),
			error => l(error)
		)
	}

	function replaceContent(html){
		if(!ui.content.innerHTML){ // no old html
			ui.content.style.opacity = 0

			setTimeout(()=>{
				ui.content.style.transition = '1s'
				setTimeout(() => {
					//deploy new html
					ui.content.innerHTML = html
					//check for apps
					_refreshApps()

					//dont work here
					//idk why, css...
					//resizeContentWrapper()

					ui.content.style.opacity = 1

					setTimeout(() => {
						ui.content.style.transition = ''
						resizeContentWrapper()												
					},1000)
				}, 100)

			}, 10)

		} else { //remove old html
			ui.content.style.transition = '1s'
			setTimeout(()=>{
				ui.content.style.opacity = 0

				setTimeout(() => {
					//deploy new html
					ui.content.innerHTML = html
					//check for apps
					_refreshApps()

					//dont work here
					//idk why, css...
					//resizeContentWrapper()

					ui.content.style.opacity = 1

					setTimeout(() => {
						ui.content.style.transition = ''	
						resizeContentWrapper()
					},1000)
				}, 1000)
			}, 10)
		}

		function resizeContentWrapper(){
			l('height : ',ui.content.offsetHeight)
			ui.contentWrapper.style.height = ui.content.offsetHeight + 'px';
		}		
	}

	// check some apps on page: sliders, and so..
	function _refreshApps(){
		Object.keys(apps).forEach(findApp => {
			apps[findApp]()
		})
	}

	// add apps fo refreshing
	function addApp(app){
		if(apps[app.name]) return
		apps[app.name] = app
	}

	// return mainPage
	function getMainPage(){
		return config.mainPage
	}

	return {
		init		: init,
		add 		: addApp,
		getMainPage : getMainPage,
		navigate 	: navigateFromOutSpace
	}
})()

function showHeader(){
	var header = document.getElementsByTagName('header')[0]
	header.classList.remove('header--hidden')
}

document.addEventListener('DOMContentLoaded', () => {
	app.init()

	setTimeout(showHeader, 1000)
})

