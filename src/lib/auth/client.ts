/* eslint-disable @typescript-eslint/no-unsafe-assignment -- For deploy*/
'use client';
import axiosInstance from '@/api/axiosConfig';
import { ENDPOINTS_AIRTABLE } from '@/api/endpoints';
import { AirTableResponse, UserFields } from '@/types/api';
import type { User } from '@/types/user';
import { AxiosResponse } from 'axios';

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

    const {data: {records}} = await axiosInstance.get<AxiosResponse<AirTableResponse<UserFields>>,{data:AirTableResponse<UserFields>}>(ENDPOINTS_AIRTABLE.login({username, password}));
  
    if (records.length === 0) {
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
