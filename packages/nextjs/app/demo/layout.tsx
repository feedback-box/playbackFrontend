import outputs from "../../amplify_outputs.json";
import "@rainbow-me/rainbowkit/styles.css";
import { Amplify } from "aws-amplify";
import { PlayNetworkAppWithProviders } from "~~/components/PlaybackNetworkApp";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Playback Network App",
  description: "Playback Network demo app using Scaffold-ETH",
});

const DemoScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  Amplify.configure(outputs);

  return (
    <>
      <PlayNetworkAppWithProviders>{children}</PlayNetworkAppWithProviders>
    </>
  );
};

export default DemoScaffoldEthApp;
