var l = console.log

var app = (function(){

	var ui = {
		body: document.body.querySelector('body'),
		nav: document.body.querySelector('.nav'),
		pageTitle: document.body.querySelector('.page-title'),
		content: document.body.querySelector('.content'),
	};

	var config = {
		
	};

	//main handlers
	function _bindHandlers(){}

	//initialisation
	function init(){
		l('lol...its inited')
		_bindHandlers()
	}


	return {
		init: init
	}
})()


document.addEventListener('DOMContentLoaded', app.init)