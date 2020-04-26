import React, { useEffect, useState, useCallback, memo } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Container,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Grid,
  Button,
  Checkbox,
  CircularProgress,
  Link,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useForm } from '../useForm';
import { useAppState } from '../../AppState';
import { useStyles } from './styles';

const LogInComponent: React.FC = () => {
  const initialData = { username: '', password: '' };
  const history = useHistory();
  const classes = useStyles();
  const { formData, setFormField, resetForm } = useForm(initialData);
  const { logIn, forgottenPassword, authLoading } = useAppState();
  const [error, setErrorState] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const _isFormValid = Object.values(formData).reduce((acc, curr) => Boolean(acc && curr), true);
    setIsFormValid(_isFormValid);
  }, [formData]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { username, password } = formData;

      setErrorState('');
      const res = await logIn(username, password);

      if (res && res.confirmEmail) {
        history.push('/verify-email');
        return;
      }

      if (res && res.error) {
        setErrorState(res.error);
        resetForm();
        return;
      }
    },
    [formData, history, logIn, resetForm]
  );

  const handleForgottenPassword = useCallback(
    async (event: any) => {
      event.preventDefault();
      resetForm();
      setErrorState('');
      const { username } = formData;

      if (!username) {
        setErrorState('Enter a valid email address first');
        return;
      }

      const res = await forgottenPassword(username);

      if (res && res.error) {
        setErrorState(res.error);
      }

      resetForm();
      history.push('/forgot-password');
    },
    [forgottenPassword, formData, history, resetForm]
  );

  return (
    <Container component="main" maxWidth="xs" className={`${classes.root} Login`}>
      <Grid container direction="column" alignItems="center">
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h2" variant="h4">
          Log In
        </Typography>
      </Grid>

      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            id="username"
            name="username"
            label="Email"
            placeholder="Your email address"
            autoComplete="username"
            value={formData.username}
            onChange={setFormField}
            required
            fullWidth
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="password"
            label="Password"
            type="password"
            id="password"
            placeholder="Your password"
            autoComplete="current-password"
            value={formData.password}
            onChange={setFormField}
            required
            fullWidth
          />
          <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
          {error ? (
            <Typography color="error" paragraph>
              {error}
            </Typography>
          ) : null}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={authLoading || !isFormValid}
          >
            {authLoading && <CircularProgress size={24} className={classes.loader} />}
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link variant="caption" color="textSecondary" component="button" onClick={handleForgottenPassword}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register">
                <Typography component="span" color="textSecondary" variant="caption">
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export const LogIn = memo(LogInComponent);
