import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import dotenv from 'dotenv';
import { theme } from './theme';
import { Router } from './router';
import Amplify from 'aws-amplify';
import { AMPLIFY } from './config';
import * as serviceWorker from './serviceWorker';
import './index.css';

dotenv.config();
Amplify.configure(AMPLIFY);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
