"use client";

export const msalConfig = {
  auth: {
    clientId: "61b56127-60e9-4498-a982-f7102423b16f",
    authority: `https://login.microsoftonline.com/d0ad5c73-02ef-443c-b087-e21b8953e0ac`,
    redirectUri: "http://localhost:3000/api/auth/callback/azure-ad",
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["api://7e38fcd1-ae6b-4ea6-ac3a-5c3648f5b800/ReadWrite"],
};
