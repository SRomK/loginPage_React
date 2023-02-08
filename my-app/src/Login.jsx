import React from "react";
import styles from "./styles/Login.module.css";
import { FormControl, InputAdornment, TextField } from '@mui/material';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false
    };
  }

  onSubmit = (e) => {

  };

  render() {
    const { email, emailError, password, rememberMe, showPassword } = this.state;
    return (
      <div id="loginContainer" className={styles.container}>
        <div className={styles.login}>
            <div className={styles.logo}></div>
            <FormControl onSubmit={this.onSubmit}>
            <TextField
              id='email'
              name='email' 
              type='email' 
              error={emailError}
              className={styles.loginUser} 
              variant='outlined'
              value={email}   
            />
            <TextField
              id='component-outlined'
              name='password' 
              type={showPassword ? 'text' : 'password'} 
              error={emailError}
              className={styles.loginUser} 
              variant='outlined'
              value={email}   
            />
          <h3 className={styles.titleh3}>Login Component</h3>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />

            <p className={styles.text}>hola</p>
          </div>
        </FormControl>
        </div>
      </div>
    );
  }
}
