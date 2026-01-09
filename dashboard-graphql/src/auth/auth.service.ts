import { gql } from '@apollo/client';
import { apolloClient } from '../apollo/client';
import type { AuthResponse, LoginInput, SignupInput } from '../types/user';
import { saveToken, removeToken } from '../utils/token';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      variables: input,
    });
    
    if (data.login.token) {
      saveToken(data.login.token);
    }
    
    return data.login;
  },

  async signup(input: SignupInput): Promise<AuthResponse> {
    const { data } = await apolloClient.mutate({
      mutation: SIGNUP_MUTATION,
      variables: input,
    });
    
    if (data.signup.token) {
      saveToken(data.signup.token);
    }
    
    return data.signup;
  },

  logout(): void {
    removeToken();
    apolloClient.clearStore();
  },
};
