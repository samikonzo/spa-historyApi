var l = console.log

var app = (function(){

	var ui = {
		body: document.body,
		nav: document.body.querySelector('.nav'),
		pageTitle: document.body.querySelector('.page-title'),
		content: document.body.querySelector('.content'),
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
		var page = (e.state && e.state.page) || config.mainPage;
		_loadPage(page)
	}

	function _loadPage(page, init=false){
		// prevent reload page by clicking on current link
		if(!init && page == location.pathname.substr(1)){
			l(`from ${page} to ${page}`)
			return
		} else if(!init && page == config.mainPage && location.pathname.substr(1) == ''){
			l('from mainPage to mainPage')
			return
		}

		// promise
		var promise = new Promise((resolve, reject) => {
			var url = 'pages/' + page

			//l('_loadPage page : ', page)
			//l('url : ', url)

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
			html => {
				//deploy new html
				ui.content.innerHTML = html
				//check for apps
				_refreshApps()
			},
			error => l(error)
		)
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

