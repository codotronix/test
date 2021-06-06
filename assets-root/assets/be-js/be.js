(function(){
	const SESSION_KEY = 'RTLSESSION'
	const CONST_SESSION_USER = 'SESSION_AUTH_DATA';

	/**
	 * Get the sessionStorage value of webapp.reactale.com
	 * via iframe-postMessage method
	 */
	window.addEventListener("message", (event) => {
		// console.log('message received', event);
		const validOrigins = ['https://webapp.reactale.com', 'https://webapp.reactale.site'];
		if (validOrigins.includes(event.origin)) {
			// console.log('message from valid origin')
			// console.log(event.data)

			// Save the data in session storage
			window.sessionStorage.setItem(SESSION_KEY, event.data)
			doLoggedInAdjustments()
		}
	}, false);

	setTimeout(() => {
		doLoggedInAdjustments();	// normal flow
	}, 2000);
	

	function doLoggedInAdjustments() {
		// Check if user is logged in
		
		// const webAppWindow = document.getElementById('loginframe').contentWindow
		const sessionData = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || '{}')
		const userAuthData = sessionData && sessionData[CONST_SESSION_USER]

		// MAKE userAuthData available for others to use
		window.rto = window.rto || {}
		window.rto.getLoggedInUserAuthData = () => userAuthData

		// console.log('userAuthData = ', userAuthData)
		if(userAuthData && userAuthData.user) {
			document.querySelector('.headerbar .greet').innerText = "Welcome, " + (userAuthData.user.firstname || 'Guest') + '!';
			document.querySelector('.sidebar .loginout').classList.remove('out')
		}
		else {
			document.querySelector('.sidebar .loginout').classList.add('out')
		}
	}

	/**
	 * When logout button is clicked, destroy the session object, 
	 * And revert the button to Login Button
	 */
	document.querySelector('.sidebar .loginout .logout')
	.addEventListener('click', (el, ev) => {

		// TODO:: CALL WEBAPP TO REALLY DELETE ALL SESSIONS
		// <%= process.env.URL_WEBAPP %>/r/home?openLogin=true

		window.sessionStorage.setItem(SESSION_KEY, '')
		// window.sessionStorage.setItem(REDUXPERSIST_KEY, '')
		// document.querySelector('.sidebar .loginout').classList.add('out')
		// document.querySelector('.headerbar .greet').innerText = "Welcome, Guest!";

		// redirect to FE App, to clear the session there, as there are the main things
		const feHomeUrl = '//webapp.' + window.location.host + '/r/home?openLogout=true';
		window.location.href = feHomeUrl;
	})

	/******************* SIDEBAR *********************/
	$(function(){
		$('.sidebar').sidenav();
	});
	//////////////////////////////////////////////////

	/******************* UNI-SEARCH *********************/
	/**
	 * The Universal Search Function
	 */
	$('body').on('click', '#show-uni-search', function(){
		console.log('inside')
		$('#unisearch-container').addClass('visible')
	})
	$(document).on('click', '#hide-unisearch', function(){
		$('#unisearch-container').removeClass('visible')
	})
	$(document).on('click', '#profile-menu-toggler', function(){
		$('.headerbar .profile-link').toggleClass('visible')
	})
	//go-unisearch
	$(document).on('click', '#go-unisearch', function(){
		let val = $('#unisearch-container .search-box').val().trim()
		if(!val) return

		let key = $('#unisearch-container .select-search-field').val()
		val = encodeURIComponent(val)

		let qparams = []
		if(val) qparams.push(`${key}=${val}`)

		let newUrl = window.location.origin + '/search?' + qparams.join('&')
		window.location.href = newUrl
	})
	//////////////////////////////////////////////////

	// console.log('hellooooo')
})()






