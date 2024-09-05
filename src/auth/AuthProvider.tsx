"use client";

import { InteractionType, IPublicClientApplication } from "@azure/msal-browser";
import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";

import { MsalAuth } from "./AuthContext";
import { loginRequest } from "./MsalConfig";

export type AuthProviderProps = {
  pca: IPublicClientApplication;
  interactionType: InteractionType;
  children: React.ReactNode;
};

const AuthProvider = ({
  pca,
  interactionType,
  children,
}: AuthProviderProps) => {
  return (
    <MsalProvider instance={pca}>
      <MsalAuthenticationTemplate
        interactionType={interactionType}
        authenticationRequest={loginRequest}
      >
        <MsalAuth>{children}</MsalAuth>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
};
export default AuthProvider;
