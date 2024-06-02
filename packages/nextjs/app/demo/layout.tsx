import "@rainbow-me/rainbowkit/styles.css";
import { PlayNetworkAppWithProviders } from "~~/components/PlaybackNetworkApp";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Demo Scaffold-ETH 2 App",
  description: "Demo Built with 🏗 Scaffold-ETH 2",
});

const DemoScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PlayNetworkAppWithProviders>{children}</PlayNetworkAppWithProviders>
    </>
  );
};

export default DemoScaffoldEthApp;
