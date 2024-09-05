import { AuthenticatedProviders } from "@/features/globals/providers";
import { MainMenu } from "@/features/main-menu/main-menu";
import { AI_NAME } from "@/features/theme/theme-config";
import { cn } from "@/ui/lib";
import AuthProvider from "../../auth/AuthProvider";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../../auth/MsalConfig";
import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [msalInstance, setMsalInstance] =
  //   useState<PublicClientApplication | null>(null);

  // useEffect(() => {
  //   const instance = new PublicClientApplication(msalConfig);
  //   setMsalInstance(instance);
  // }, []);

  // if (!msalInstance) {
  //   return null; // or a loading spinner
  // }
  // const msalInstance = new PublicClientApplication(msalConfig);
  return (
    <AuthenticatedProviders>
      {/* <AuthProvider pca={msalInstance} interactionType={InteractionType.Silent}> */}
      <div className={cn("flex flex-1 items-stretch")}>
        <MainMenu />
        <div className="flex-1 flex">{children}</div>
      </div>
      {/* </AuthProvider> */}
    </AuthenticatedProviders>
  );
}
