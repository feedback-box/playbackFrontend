import "@rainbow-me/rainbowkit/styles.css";
import { PlayNetworkAppWithProviders } from "~~/components/PlaybackNetworkApp";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Playback Network App",
  description: "Playback Network demo app using Scaffold-ETH",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body className="">
        <PlayNetworkAppWithProviders>{children}</PlayNetworkAppWithProviders>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
