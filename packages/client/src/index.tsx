import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { ApolloProvider } from '@apollo/react-hooks';
import dotenv from 'dotenv';
import Amplify from 'aws-amplify';
import { client } from './apolloClient';
import { useTheme } from './App/useTheme';
import { AppComponent } from './App';
import { AMPLIFY } from './config';
import * as serviceWorker from './serviceWorker';
import './index.css';

dotenv.config();
Amplify.configure(AMPLIFY);

const RootComponent = () => {
  const { theme, darkTheme, toggleDarkTheme } = useTheme();

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppComponent darkTheme={darkTheme} toggleDarkTheme={toggleDarkTheme} />
      </ThemeProvider>
    </ApolloProvider>
  );
};

ReactDOM.render(<RootComponent />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
