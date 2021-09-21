function home() {
	let html;
	if (currentUser == "") {
		// logged out
		html = document.getElementById("anon-home").innerHTML;
	} else {
		// logged in
		let src = document.getElementById("home").innerHTML;
		let template = Handlebars.compile(src);
		let context = {};
		html = template(context);
	}
	render(html);
}

function register() {
	let src = document.getElementById("register").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function login() {
	// change active status to true
	let src = document.getElementById("login").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function view() {
	let src = document.getElementById("view").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function share() {
	let src = document.getElementById("share").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function edit() {
	let src = document.getElementById("edit").innerHTML;
	let template = Handlebars.compile(src);
	let context = {};
	let html = template(context);
	render(html);
}

function render(html) {
	document.getElementById("container").innerHTML = html;
}

function refreshNavBar() {
	// let nav = document.getElementById("navbar");

	let src = document.getElementById("navbar").innerHTML;
	let template = Handlebars.compile(src);
	let context = users[currentUser];

	document.getElementById("nav").innerHTML = template(context);

	let welcome = document.getElementById("nav-welcome");
	let share = document.getElementById("nav-share");
	let logout = document.getElementById("nav-logout");
	let login = document.getElementById("nav-login");
	let register = document.getElementById("nav-register");

	if (currentUser == "") {
		// let html = document.getElementById("anon-nav").innerHTML;
		// nav.innerHTML = html;

		welcome.style.display = "none";
		share.style.display = "none";
		logout.style.display = "none";
		// login.removeAttribute("style");
		// register.removeAttribute("style");
		login.style.display = "block";
		register.style.display = "block";
	} else {
		// let src = document.getElementById("active-nav").innerHTML;
		// let template = Handlebars.compile(src);
		// let context = users[currentUser];
		// console.log(context);
		// nav.innerHTML = template(context);

		welcome.removeAttribute("style");
		share.removeAttribute("style");
		logout.removeAttribute("style");
		// welcome.style.display = "block";
		// share.style.display = "block";
		// logout.style.display = "block";
		login.style.display = "none";
		register.style.display = "none";
	}
}
