"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { WagmiProvider } from "wagmi";
import { BlockieAvatar, FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { ProgressBar } from "~~/components/scaffold-eth/ProgressBar";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const PlayNetworkApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className="connect">
        <div className=" flex lg:static top-0 min-h-0 flex-shrink-0 z-20 px-4 sm:px-2 pt-4">
          <RainbowKitCustomConnectButton />
          <FaucetButton />
        </div>
      </div>
      <main className="relative flex flex-col flex-1">{children}</main>
    </div>
  );
};
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const PlayNetworkAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProgressBar />
        <RainbowKitProvider
          avatar={BlockieAvatar}
          theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
        >
          <PlayNetworkApp>{children}</PlayNetworkApp>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
