'use client';

import { AirTableResponse, UserFields } from '@/types/api';
import type { User } from '@/types/user';
import axios, { AxiosResponse } from 'axios';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}



export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  username: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { username, password } = params;

    // Make API request

    // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.
    // TODO: Use logic to check if the credentials are correct.
    const BASE_ID = 'appEQcT7KVwO2DwLF';
    const API_KEY = 'patMNm1Xx8ST36DVz.e09ada4ea673bb5e9ab352efd17bda71179a735a43c2e56d53fe83fda0c4e4b0';
    const userTable = 'tblFZAvuMK8sLh6jf';
    const SEARCH = `SEARCH('${username}'%2C+%7BUsername%7D)`;
    const URL_AIRTABLE = `https://api.airtable.com/v0/${BASE_ID}`;
    const USER_ENDPOINT =`/${userTable}?filterByFormula=${SEARCH}`
    axios.defaults.baseURL = URL_AIRTABLE;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers['Authorization'] = `Bearer ${API_KEY}`;
   
    const {data: {records}} = await axios.get<AxiosResponse<AirTableResponse<UserFields>>,{data:AirTableResponse<UserFields>}>(USER_ENDPOINT)
  
    if (username !== records[0].fields.username || password !==  records[0].fields.password) {
      return { error: 'Invalid credentials' };
    }  
    const user = {
      id: records[0].id,
      name: records[0].fields.username,
      avatar: records[0].fields.avatar,
      email: records[0].fields.email,
    }
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');
    const user = localStorage.getItem('user');
    if (!token) {
      return { data: null };
    }

    return { data: user ? JSON.parse(user) : null};
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
