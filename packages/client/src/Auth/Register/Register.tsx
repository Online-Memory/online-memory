import React, { useEffect, useState, useCallback, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Avatar, Typography, TextField, Grid, Button, CircularProgress, Link } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { useForm } from '../useForm';
import { useAppState } from '../../AppState';
import { useStyles } from './styles';

const RegisterComponent: React.FC = () => {
  const initialData = { username: '', name: '', password: '' };
  const history = useHistory();
  const classes = useStyles();
  const { formData, setFormField, resetForm } = useForm(initialData);
  const { register, authLoading } = useAppState();
  const [error, setErrorState] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const _isFormValid = Object.values(formData).reduce((acc, curr) => Boolean(acc && curr), true);
    setIsFormValid(_isFormValid);
  }, [formData]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { name, username, password } = formData;
      setErrorState('');

      const res = await register(username, name, password);

      if (res && res.error) {
        setErrorState(res.error);
        resetForm();
        return;
      }

      if (res && res.confirmEmail) {
        history.push('/verify-email');
        return;
      }

      if (res && res.userExists) {
        history.push('/login');
        return;
      }

      history.push('/login');
    },
    [formData, history, register, resetForm]
  );

  return (
    <Container component="main" maxWidth="xs" className={`${classes.root} Login`}>
      <Grid container direction="column" alignItems="center">
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h2" variant="h4">
          Register
        </Typography>
      </Grid>

      <div className={classes.paper}>
        <form className={classes.form} onSubmit={handleSubmit} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            id="username"
            name="username"
            autoComplete="username"
            label="Email"
            placeholder="Your email address"
            value={formData.username}
            onChange={setFormField}
            required
            fullWidth
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            id="name"
            name="name"
            autoComplete="name"
            label="Name"
            placeholder="Choose your display name"
            value={formData.name}
            onChange={setFormField}
            required
            fullWidth
          />
          <TextField
            variant="outlined"
            margin="normal"
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="password"
            placeholder="Enter a password (min. 6 characters)"
            value={formData.password}
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
            disabled={authLoading || !isFormValid}
          >
            {authLoading && <CircularProgress size={24} className={classes.loader} />}
            Register
          </Button>
          <Grid container>
            <Grid item>
              <Link href="/login">
                <Typography component="span" color="textSecondary" variant="caption">
                  Already registered? Log In
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export const Register = memo(RegisterComponent);
