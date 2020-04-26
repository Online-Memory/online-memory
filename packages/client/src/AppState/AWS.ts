import { Auth } from 'aws-amplify';

export interface AWSUser {
  attributes: {
    email: string;
    email_verified: boolean;
  };
  username: string;
}

export const awsSignOut = () => Auth.signOut();

export const awsLogin = async (username: string, password: string) => {
  let user;
  try {
    await Auth.signIn(username, password);
    user = await Auth.currentAuthenticatedUser();

    if (user && user.__type === 'UserNotConfirmedException') {
      return {
        confirmEmail: true,
      };
    }
  } catch (err) {
    if (err && err.code && err.code === 'UserNotConfirmedException') {
      return {
        confirmEmail: true,
      };
    }

    if (err && err.message === 'User not verified') {
      return {
        confirmEmail: true,
      };
    }

    return {
      error: err.message || err,
    };
  }

  return user;
};

export const awsRegister = async (email: string, name: string, password: string): Promise<any> => {
  let res;
  try {
    res = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        name,
      },
    });
  } catch (err) {
    if (err && err.code && err.code === 'UserNotConfirmedException') {
      return {
        confirmEmail: true,
      };
    }
    if (err && err.code && err.code === 'UsernameExistsException') {
      return {
        userExists: true,
      };
    }

    return {
      error: err.message || err,
    };
  }

  if (res && res.userConfirmed === false) {
    return {
      confirmEmail: true,
    };
  }

  return res;
};

export const awsVerifyEmail = async (username: string, code: string): Promise<any> => {
  let res;
  try {
    res = await Auth.confirmSignUp(username, code);
  } catch (err) {
    return {
      error: err.message || err,
    };
  }

  return res;
};

export const awsResendCode = (username: string) => Auth.resendSignUp(username);

export const awsForgottenPassword = (username: string) => Auth.forgotPassword(username);

export const awsResetPassword = (username: string, code: string, password: string) =>
  Auth.forgotPasswordSubmit(username, code, password);

export const currentAuthenticatedUser = () => Auth.currentAuthenticatedUser();
