import "@rainbow-me/rainbowkit/styles.css";
import { PlayNetworkAppWithProviders } from "~~/components/PlaybackNetworkApp";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Scaffold-ETH 2 App",
  description: "Built with 🏗 Scaffold-ETH 2",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body className="background">
        <PlayNetworkAppWithProviders>{children}</PlayNetworkAppWithProviders>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
