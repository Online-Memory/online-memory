import { useCallback, useState } from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/lightBlue';
import grey from '@material-ui/core/colors/grey';
import purple from '@material-ui/core/colors/purple';

const KEY = 'darkTheme';

export const useTheme = (initialValue = true) => {
  const [darkTheme, setDarkTheme] = useState<boolean>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(KEY);
      // Parse stored json or if none return initialValue
      return item ? Boolean(JSON.parse(item)) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: any) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(darkTheme) : value;
        // Save state
        setDarkTheme(valueToStore);
        // Save to local storage
        window.localStorage.setItem(KEY, JSON.stringify(valueToStore));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    },
    [darkTheme]
  );

  const toggleDarkTheme = useCallback(() => {
    return setValue(!darkTheme);
  }, [darkTheme, setValue]);

  const theme = createMuiTheme({
    palette: {
      type: darkTheme ? 'dark' : 'light',
      primary: {
        main: darkTheme ? blue[600] : purple[500],
      },
      secondary: grey,
      background: {
        default: darkTheme ? grey[900] : grey[200],
      },
    },
  });

  return {
    darkTheme,
    toggleDarkTheme,
    theme,
  };
};
