import React, { Component } from "react";
import styles from "./styles/Login.module.css";
import {
  Checkbox,
  FormControl,
  TextField,
} from "@mui/material";
import LoadingButton from "./Material/LoadingButton";
import LocalizedStrings from "react-localization";

const LoginLang = require("./LoginPageLang.json");
let lang = new LocalizedStrings(LoginLang[0]);

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      emailError: false,
      password: "",
      passwordError: false,
      name: "",
      rememberMe: false,
      showPassword: false,
    };
  }

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
              variant="outlined"
              value={email}
            />
            <TextField
              id="component-outlined"
              name="password"
              type={showPassword ? "text" : "password"}
              error={emailError}
              className={styles.loginPwd}
              variant="outlined"
              value={password}
              //missing onChange with handleChange function
              //missing onKeyUp with handleKeyUp function
            />
            <label>
              <Checkbox
                color="primary"
                name="rememberMe"
                value={rememberMe}
                checked={rememberMe}
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
