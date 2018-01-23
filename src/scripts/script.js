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

			'pipes': {
				title: 'Трубки',
				menu: 'gallery'
			},

			'sculpts': {
				title: 'Скульптуры',
				menu: 'gallery'
			},

			'tables': {
				title: 'Столовые пренадлежности',
				menu: 'gallery'
			},

			'other': {
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
			}
		})

		window.onpopstate = _popState;
	}

	// initialisation
	function init(){
		var page = document.location.pathname.substr(1) || config.mainPage
		_loadPage(page)
		_bindHandlers()
	}

	// 
	function _navigate(e){
		var page = e.target.getAttribute('href')
		l('_navigate page :', page)
		_loadPage(page)
		history.pushState({page: page}, null, page);
	}

	function _popState(e){
		var page = (e.state && e.state.page) || config.mainPage;
		_loadPage(page)
	}

	function _loadPage(page){
		var promise = new Promise((resolve, reject) => {
			var url = 'pages/' + page
			var pageTitle = config.pages[page].title
			var menu = config.pages[page].menu

			l('_loadPage page : ', page)
			l('url : ', url)

			var xhr = new XMLHttpRequest()
			xhr.open('GET', url)
			xhr.send()
			xhr.onload = function(){
				if(this.status == 200){
					l('ok')
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
				ui.content.innerHTML = html
			},
			error => l(error)
		)
		
	}

	return {
		init: init
	}
})()


document.addEventListener('DOMContentLoaded', app.init)