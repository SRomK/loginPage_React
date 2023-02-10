//logic
  /*
  componentDidMount() {
		// Language
		let language = "en";
		switch (navigator.language) {
			case 'es':
				language = 'es';
				break;
			case 'fr':
				language = 'fr';
				break;
			default:
				language = 'en';
		}

		// Translate
		lang.setLanguage(language);

		// if we're localhost:XXX, react development => jquery = false
		if (window.location.href.indexOf('localhost:') !== -1)
			JQUERY = false

		// If there is a valid token, we redirect to the FSMS page
		this.checkRedirectToFsms();
	}

	async checkRedirectToFsms() {
		// console.log('[LOGIN] checkRedirectToFsms')

		// For LAT: check if we have a token in the URL
		let mfa = await this.checkAzureMfa();
		if (mfa)
			return;

		// Check if there is a token in the URL

		// If there is a token in the URL, we've been redirected to a custom web
		if (this.isTokenInUrl()) {
			console.log('[LOGIN] token in URL')
			this.saveTokenFromUrl();
		}

		// Check if there is a token; if it is valid then we redirect to the FSMS
		let token = Services.getToken();

		// There's a token: check that it is valid
		if (token) {
			console.log('[LOGIN] check token', token)
			let res = await Services.postAsync('login/check_token',  { info: "user" });

			// Redirect to FSMS
			if (res.status === 'success') {
				res.token = token; // We need to add it to the res as it's not in the result of check_token
				this.saveToken(res);
				this.redirectToFsms();
				return;
			}
		}

		// Not redirected: if we're on LAT, we redirect to Azure MFA immediately
		if (this.isLat()) 
			this.redirectToAzureLat();
	}
	saveTokenFromUrl() {
		// Get the token
		const search = "#token=";
		const idx = window.location.href.indexOf(search);
		if (idx === -1)
			return;

		let token = window.location.href.substring(idx + search.length);
		console.log('[LOGIN] token in URL', token)

		// Check remember
		let remember = false;
		if (token.indexOf('&remember') !== -1) {
			remember = true;
			token = token.replace('&remember', '');
		}
	
		Services.setToken(token, remember);
	}

	isTokenInUrl() {
		return window.location.href.indexOf("#token=") !== -1;
// 		if (idx == -1) {
// console.log('[LOGIN] getTokenFromUrl NO token')
// 			return null;
// 		}

// 		const token = window.location.href.substring(idx + search.length);
// 		console.log('[LOGIN] getTokenFromUrl token found', token)
// 		return token;
	}

	async checkAzureMfa() {
// console.log('[LOGIN] checkAzureMfa')

		let url = window.location.href;
		const search = "#id_token=";
		const idx = url.indexOf(search);
		if (idx === -1) {
// console.log('[LOGIN] checkAzureMfa NO token')
			return false;
		}

		// Get the token
		let azureToken = url.substring(idx + search.length);

		// Check the token
		let res = await Services.postAsync('login/checkAzureToken',  { azureToken });

		// Error
		if (res.status !== 'success') {
			Tools.setError(this, res.error);
// console.log('[LOGIN] checkAzureMfa ERROR', res);
			return false;
		}

		// Success
// console.log('[LOGIN] checkAzureMfa SUCCESS', res);
		this.saveToken(res);
		this.redirectToFsms();
		return true;
	}

	redirectToCustomWeb(customWeb, token) {
console.log('redirectToCustomWeb =>', customWeb)

		// No redirection on localhost
		let url = window.location.href; 
		if(url.indexOf('localhost') !== -1)
			return false;

		// No custom web 
		if (!customWeb || customWeb === '') {
			// If we are on user it's ok, otherwise we redirect to user
			if (url.indexOf('https://user.private-radar.com') === 0)
				return false;

			// we're not on user => we need to redirect to user (done in getCustomUrl)
		}

		// We're already on the custom web
		if (this.isAlreadyOnCustomWeb(customWeb))
			return false;

		// Redirection takes some => redisplay loading
		this.setState({buttonLoading: true});

		// Redirect except on Localhost (dev mode)
		url = this.getCustomUrl(customWeb);

		// Add token and remember me
		url += `#token=${token}`;
		if(this.state.rememberMe)
			url+= '&remember';

console.log('[LOGIN] redirectToCustomWeb', url)
		window.location.assign(url);
		return true;
	}
	isAlreadyOnCustomWeb(customWeb) {
		if (!customWeb || customWeb === '')
			return false;

		// There can be several custom webs
		let customWebs = customWeb.split(',');

		const href = window.location.href;
		for (const cw of customWebs) {
			let url = `://${cw}.private-radar.com`;
			if (href.indexOf(url) !== -1)
				return true;
		}

		return false;
	}
	getCustomUrl(customWeb) {
		// If Localhost we dont change id (dev mode) => this is not working (the page does not reload)
		let url = window.location.href;
		if (url.indexOf('localhost') !== -1)
			return url;

		// No custom web => redirect to user
		if (!customWeb || customWeb === '')
			return `https://user.private-radar.com`;
	
		// we might have several custom webs => get the first one
		let customWebs = customWeb.split(',');
		return `https://${customWebs[0]}.private-radar.com`;
	}

	redirectToFsms() {
		// Remove the token from the url (except dev)
		if (window.location.href.indexOf('localhost') === -1)
			window.history.pushState('', '', '/');

		if (JQUERY)
			window.dispatchEvent(new CustomEvent("loginSuccess"));
		else
			this.setState({ redirect: true });  
	}

	isEmailOrPasswordError(email, password) {
		let emailError = email === '';
		let passwordError = password === '';

		// Localhost (DEBUG): dont need password
		if (window.location.href.indexOf('localhost') !== -1)
			passwordError = false;

		this.setState({emailError, passwordError});

		return emailError || passwordError;
	}

	getEyeIconClassname() {
		let cls = 'mdi mdi-eye';
		if (this.state.showPassword)
			cls += '-off';
		return cls;
	}

	// LAT: AZURE MFA
	isLat() {
		let list = ["efa.training", "efa.private-radar.com"]; // add "localhost" for debug
		for(const str of list) {
			if (window.location.href.indexOf(str) !== -1) {
				return true;
			}
		}
		return false;
	}
	redirectToAzureLat() {
// console.log('[LOGIN] redirectToAzureLat')
		window.location.assign(URL_AZURE_LAT);
	}

	saveToken(res) {
// console.log('[LOGIN] saveToken', res)
		Services.setToken(res.token, this.state.rememberMe);

		// It's a company
		if (res.company) {
			Services.setCompany(res.company);
			Services.setSettings(res.company.settings);
			localStorage.removeItem("user"); // FIXME Do it in Services
			localStorage.removeItem("rights");// FIXME Do it in Services
			return;
		}

		// It's a user
		localStorage.removeItem("comp");// FIXME Do it in Services
		Services.setUser(res.user);
		Services.setSettings(res.user.settings);
		Services.setRights(res.user.roles[0]);
	}
	
	// HANDLES

	handleKeyUp = (e) => {
		// User has press save and is not inside a input
        if (e.keyCode !== KeyCodes.Enter || !e.target.value) 
			return;

		this.handleSignIn(e);
    }
	handleSignIn = async (e) => {
		const { email, password } = this.state;

		// Check email
		if (this.isEmailOrPasswordError(email, password))
			return;

		// Remove error and disable button
		this.setState({error: null, buttonLoading: true});

		// Post
		let res = await Services.postAsync('login/login', { email, password });

		// Enable button
		this.setState({buttonLoading: false});

		// Error
		if (res.status !== 'success') {
			// Case LAT: redirect to 
			if (res.error === 'WS_ERROR_LAT_MFA') {
				this.redirectToAzureLat();
				return;
			}

			Tools.setError(this, res.error);
			return;
		}

		// If there is a custom web we need to redirect
		if (this.redirectToCustomWeb(res.customWeb, res.token))
			return;
	
		// Success => save token
		this.saveToken(res);

		// Reload the rights important!
		Rights.loadRights(true);

		// Remove email / password
		this.setState({email:'', password:''});

		// Redirect to FSMS
		this.redirectToFsms();
		return;
	}

	handleChange = (e) => {
		let state = {...this.state};
		state[e.target.name] = e.target.value;
		this.setState(state);
		this.isEmailOrPasswordError(state.email, state.password);
	}

	handleCheckboxChange = (e) => {
		let rememberMe = e.target.checked;
		this.setState({ rememberMe });
	}

	handleClickShowPassword = (e) => {
		let showPassword = this.state.showPassword;
		this.setState({ showPassword: !showPassword });
	}

	handleMouseDownPassword = (e) => {
		e.preventDefault();
	}

	handleClose = (e) => {
		this.setState({ openForgotPassword: false });
	}

	handleLinkClick = (e) => {
		this.setState({ openForgotPassword: true })
	}
  */