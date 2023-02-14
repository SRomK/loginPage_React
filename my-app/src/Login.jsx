//CSS Styles
import styles from "./Login.module.css";

//React
import React, { Component } from "react";

//Material MUI components
import { Checkbox, FormControl, TextField, InputAdornment } from "@mui/material";

// Inner code Components
import LoadingButton from "../Material/LoadingButton/LoadingButton";

//Constants global scope
const EMAIL_REGEX = /[\w.-]+@[\w\.-]+.\w{2,4}/;


export default class Login extends React.Component {
	
	// State object with property values used along the code
	state = {
		email: "",
		emailError: null, // Text of the error
		password: "",
		passwordError: null,
		rememberMe: false,
		showPassword: false,
		isLoading: false
	};

	// Functions
	isFormOk() {
		// Make sure that the email and the password are filled TODO
		const { email, password } = this.state;
		this.setState({ emailError: null });
		this.setState({ passwordError: null });

		// Check Email
		let formIsOkay = true;
		if (!email.length){
			this.setState({ emailError: "You must input email"})
			formIsOkay = false;
		}

		// Check Password
		if (!password.length){
			this.setState({ passwordError: "You must input password"})
			formIsOkay = false;
		}

		return formIsOkay;
	}


	isEmailOk(email) {

		if (email.match(EMAIL_REGEX)) {
			return true;
		}
		//return email.match(EMAIL_REGEX);
	}

	async areCredentialsOk(e) {
		const { email, password } = this.state;
		// Checks that the email and password are correct
		if (this.formIsOkay())
			return true;
		// Loading

		// Post CALL ME
		//let res = await Services.postAsync('/login', { email, password });

		// End loading

		// Error

		// Success
		return true;

		/*

		//// Post
		let res = await Services.postAsync("user2/getUserExerciseAverages",{id: idUser, id_program:1}); 
	
		// Error
		if (res.status !== 'success')
			return console.error(res.error);
		
		// Success
		console.log(res)

		*/
	}

	getEyeIconClassname() {
		let cls = 'mdi mdi-eye';
		if (this.state.showPassword)
			cls += '-off';
		return cls;
	}

	// HANDLES

	/*
	handleChangeEmail = (e) => {
		// Validate email
		const email = e.target.value;
		if (!isEmailOk(email)) {
		// TODO: write the error "Please enter a correct email"
			this.setState("Please enter a correct email");  
     	return false;  
		}
		// Save the value
		this.setState({ email });
	};*/

	handleChangePassword = (e) => {
		// Save the value
		let password = e.value;
		this.setState({ password });
	};

	handleCheckboxChange = (e) => {
		let rememberMe = e.target.checked;
		this.setState({ rememberMe });
	}

	handleClickShowPassword = (e) => {
		let showPassword = this.state.showPassword;
		this.setState({ showPassword: !showPassword });
	}

	handleLogin = () => {
		// Check the form
		if (!this.isFormOk()) {
			// AlertMessage TODO NOT NOW 
			return;
		}

		// Check password => call the webservice
		this.areCredentialsOk();
	}

	render() {
		const { isLoading, emailError, password, rememberMe, showPassword, passwordError } = this.state;

		return (
			<div id="loginContainer" className={styles.container}>
				<div className={styles.login}>
				<div className={styles.logo}></div>
				<div className={styles.subtitle}>Back Office</div>
				<FormControl className={styles.form} onSubmit={this.onSubmit}>
					<TextField
						id="email"
						name="email"
						type="email"
						error={emailError !== null}
						helperText={emailError}
						className={styles.loginUser}
						label="Username/email"
						variant="outlined"
						onChange={this.handleChangeEmail}
						/>
					<TextField
						id="component-outlined"
						name="password"
						type={showPassword ? "text" : "password"}
						error={passwordError !== null}
						helperText={passwordError}
						className={styles.loginPwd}
						label="Password"
						variant="outlined"
						value={password}
						InputProps={{
										endAdornment: 
											<InputAdornment position="end">
											<div className={styles.viewPasswordIcon}>
												<span id={styles.pointer} className={this.getEyeIconClassname()} onClick={this.handleClickShowPassword}/>
											</div>
										</InputAdornment> 
						//missing onChange with handleChange function
					//missing onKeyUp with handleKeyUp function                               
									}}/>
					
					
					<label>
						<Checkbox
							color="primary"
							name="rememberMe"
							value={rememberMe}
							checked={rememberMe}
							onChange={this.handleCheckboxChange}
							//missing onChange with handleCheckboxChange function
						/>
						<span>Remember me</span>
					</label>
					<LoadingButton
						className={styles.loginBtn}
						label="Sign in"
						isLoading={isLoading}
						onClick={this.handleLogin}
					/>
				</FormControl>
				</div>
			</div>
		);
	}
}