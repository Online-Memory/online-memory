import React, { useEffect, useState, useCallback, memo } from 'react';
import { Container, Avatar, Typography, TextField, Grid, Button, CircularProgress, Link } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useHistory } from 'react-router-dom';
import { useForm } from '../useForm';
import { useAppState } from '../../AppState';
import { useStyles } from './styles';

const VerifyEmailComponent: React.FC = () => {
  const initialData = { username: '', code: '' };
  const history = useHistory();
  const classes = useStyles();
  const { formData, setFormField, resetForm } = useForm(initialData);
  const { verifyEmail, resendCode, loading } = useAppState();
  const [error, setErrorState] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const _isFormValid = Object.values(formData).reduce((acc, curr) => Boolean(acc && curr), true);
    setIsFormValid(_isFormValid);
  }, [formData]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { username, code } = formData;
      setErrorState('');
      const res = await verifyEmail(username, code);

      if (res && res.error) {
        setErrorState(res.error);
        resetForm();
        return;
      }

      history.push('/login');
    },
    [formData, history, resetForm, verifyEmail]
  );

  const resendCodeHandler = useCallback(
    async (event: any) => {
      event.preventDefault();
      resetForm();
      const { username } = formData;

      if (!username) {
        setErrorState('Enter a valid email address first');
        return;
      }

      const res = await resendCode(username);

      if (res && res.error) {
        setErrorState(res.error);
      }

      resetForm();
    },
    [formData, resendCode, resetForm]
  );

  return (
    <Container component="main" maxWidth="xs" className={`${classes.root} Login`}>
      <Grid container direction="column" alignItems="center">
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h2" variant="h4">
          Verify Email
        </Typography>
      </Grid>

      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            label="Email"
            placeholder="Your email address"
            id="username"
            name="username"
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
            id="code"
            label="Verification Code"
            placeholder="Enter your verification code"
            name="code"
            value={formData.code}
            onChange={setFormField}
            required
            fullWidth
          />
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
            disabled={loading || !isFormValid}
          >
            {loading && <CircularProgress size={24} className={classes.loader} />}
            Verify Code
          </Button>
          <Grid container>
            <Grid item xs>
              <Link variant="caption" color="textSecondary" component="button" onClick={resendCodeHandler}>
                Send another code
              </Link>
            </Grid>
            <Grid item>
              <Link variant="caption" color="textSecondary" href="/login">
                Back to Log In
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export const VerifyEmail = memo(VerifyEmailComponent);
