"use client";

import { AccountInfo } from "@azure/msal-browser";
import { createContext, useEffect, useMemo, useState } from "react";

import { loginRequest } from "./MsalConfig";
import { AuthContextType, AuthStateType } from "./types";
import { useAccount, useMsal } from "@azure/msal-react";
import axiosInstance from "./axiosInstance";

export type AuthProviderProps = {
  children: React.ReactNode;
};

// CONTEXT
// ----------------------------------------------------------------------

export const AuthContext = createContext<AuthContextType | null>(null);

// MSAL
// ----------------------------------------------------------------------

export const MsalAuth = ({ children }: AuthProviderProps) => {
  const { instance, inProgress, accounts } = useMsal();

  const account = useAccount(accounts[0] || {});

  const [accessToken, setAccessToken] = useState<string | null>(null);

  const initialState: AuthStateType = {
    isAuthenticated: false,
    account: undefined,
  };

  const [state, setState] = useState(initialState);

  axiosInstance.interceptors.request.use(async (config) => {
    if (!account) {
      return config;
    }
    const token = await instance
      .acquireTokenSilent({ ...loginRequest, account })
      .then((response) => {
        return response.accessToken;
      });
    if (token) {
      // Set http client authorization header
    }
    config.headers.Authorization = `Bearer ${token}`;
    setAccessToken(token);
    return config;
  });

  useEffect(() => {
    setState({
      isAuthenticated: !!accessToken,
      account: account ?? undefined,
    });
  }, [accessToken, account, inProgress]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
    }),
    [state]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
};
