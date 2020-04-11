import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
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

// Pre-cache templates using service workers
import './assets/game_templates/001.png';
import './assets/game_templates/002.png';
import './assets/game_templates/003.png';
import './assets/game_templates/004.png';
import './assets/game_templates/005.png';
import './assets/game_templates/006.png';

dotenv.config();
Amplify.configure(AMPLIFY);

const RootComponent = () => {
  const { theme, darkTheme, toggleDarkTheme } = useTheme();

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <CssBaseline />
          <AppComponent darkTheme={darkTheme} toggleDarkTheme={toggleDarkTheme} />
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
};

ReactDOM.render(<RootComponent />, document.getElementById('root'));
