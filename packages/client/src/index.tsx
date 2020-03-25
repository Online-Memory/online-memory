import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { ApolloProvider } from '@apollo/react-hooks';
import dotenv from 'dotenv';
import Amplify from 'aws-amplify';
import { theme } from './theme';
import { AMPLIFY } from './config';
import { client } from './apolloClient';
import { App } from './App/App';
import * as serviceWorker from './serviceWorker';
import './index.css';

dotenv.config();
Amplify.configure(AMPLIFY);

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ApolloProvider client={client}>
      <CssBaseline />
      <App />
    </ApolloProvider>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
