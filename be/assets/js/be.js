(function(){

	// Check if user is logged in
	const SESSION_KEY = 'RTLSESSION'
	const REDUXPERSIST_KEY = 'persist:rtlroot'
	const CONST_SESSION_USER = 'SESSION_AUTH_DATA';
	const sessionData = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || '{}')
	const userAuthData = sessionData && sessionData[CONST_SESSION_USER]

	// MAKE userAuthData available for others to use
	window.rto = window.rto || {}
	window.rto.getLoggedInUserAuthData = () => userAuthData

	// console.log('userAuthData = ', userAuthData)
	if(userAuthData && userAuthData.user) {
		document.querySelector('.headerbar .greet').innerText = "Welcome " + (userAuthData.user.firstname || 'Guest') + '!';
		document.querySelector('.sidebar .loginout').classList.remove('out')
	}
	else {
		document.querySelector('.sidebar .loginout').classList.add('out')
	}

	/**
	 * When logout button is clicked, destroy the session object, 
	 * And revert the button to Login Button
	 */
	document.querySelector('.sidebar .loginout .logout')
	.addEventListener('click', (el, ev) => {
		window.sessionStorage.setItem(SESSION_KEY, '')
		window.sessionStorage.setItem(REDUXPERSIST_KEY, '')
		document.querySelector('.sidebar .loginout').classList.add('out')
		document.querySelector('.headerbar .greet').innerText = "Welcome Guest!";
	})

	/******************* SIDEBAR *********************/
	$(document).ready(function(){
		$('.sidebar').sidenav();
	});
	//////////////////////////////////////////////////
})()






