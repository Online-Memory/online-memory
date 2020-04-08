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
