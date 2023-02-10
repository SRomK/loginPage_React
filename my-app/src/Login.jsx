import React from "react";

//CSS
import styles from "./styles/Login.module.css";

//React
import {
  Checkbox,
  FormControl,
  TextField,
  InputAdornment,
} from "@mui/material";

//Components
import LoadingButton from "./Material/LoadingButton";
import LocalizedStrings from "react-localization";

const LoginLang = require("./LoginPageLang.json");
let lang = new LocalizedStrings(LoginLang[0]);

export default class Login extends React.Component {
  state = {
    email: "",
    emailError: false,
    password: "",
    passwordError: null,
    name: "",
    rememberMe: false,
    showPassword: false,
  };

  /*
	emailValidation = (e) => {
		//const regex = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
	
		let email = e.value;
		let status = true;

		if (email.length === 0) {
			status = false;
		}


		this.setState({email});

		if (email.match(regex)){
			console.log(true);
		}
		else {
			console.log(false);
		}
	};	
*/

  // Check if its a correct email TODO
  /*
        if(!this.state.email || regex.test(this.state.email) === false){
            this.setState({
                emailError: "Email is not valid"
            });
            return false;
        }
        return true;*/
  // Save the value
  //let email = e.value;
  //this.setState({email});
   
  handleCheckboxChange = (e) => {
		let rememberMe = e.target.checked;
		this.setState({ rememberMe });

    if (rememberMe){
      return true
    }
    else {
      return false
    }
    console.log(e);
	}
  
  getEyeIconClassname() {
    let cls = "mdi mdi-eye";
    if (this.state.showPassword) cls += "-off";
    return cls;
  }

  changedEmail = (e) => {
    let email = e.value;
    console.log(e);
    this.setState({ email });
  };
  handleClickShowPassword = (e) => {
    let showPassword = this.state.showPassword;
    this.setState({ showPassword: !showPassword });
  };

  render() {
    const { email, emailError, password, rememberMe, showPassword } =
      this.state;
    return (
      <div id="loginContainer" className={styles.container}>
        <div className={styles.login}>
          <div className={styles.logo}></div>
          <div className={styles.subtitle}>Back Office</div>
          <FormControl onSubmit={this.onSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              error={emailError}
              className={styles.loginUser}
              label="Username/email"
              variant="outlined"
              value={email}
              onChange={this.changedEmail}
            />
            <TextField
              id="component-outlined"
              name="password"
              type={showPassword ? "text" : "password"}
              error={emailError}
              className={styles.loginPwd}
              variant="outlined"
              label="Password"
              value={password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <div className={styles.viewPasswordIcon}>
                      <span
                        id={styles.pointer}
                        className={this.getEyeIconClassname()}
                        onClick={this.handleClickShowPassword}
                      />
                    </div>
                  </InputAdornment>
                ),
                //missing onChange with handleChange function
                //missing onKeyUp with handleKeyUp function
              }}
            />
            <label>
              <Checkbox
                color="primary"
                name="rememberMe"
                value={rememberMe}
                checked={rememberMe}
                onChange={this.handleCheckboxChange}
                //missing onChange with handleCheckboxChange function
              />
              <span>{lang.rememberMe}</span>
            </label>
            <LoadingButton
              className={styles.loginBtn}
              label={lang.signin}
              // missing isLoading and onClick functions
            />
          </FormControl>
        </div>
      </div>
    );
  }
}
