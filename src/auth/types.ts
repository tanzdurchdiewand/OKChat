"use client";

import { AccountInfo } from "@azure/msal-browser";

export type AuthStateType = {
  isAuthenticated: boolean;
  account: AccountInfo | undefined;
};

// ----------------------------------------------------------------------

export type AuthContextType = {
  isAuthenticated: boolean;
  account: AccountInfo | undefined;
};
