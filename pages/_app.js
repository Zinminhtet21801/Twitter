import "../styles/global.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import NextNProgress from "nextjs-progressbar";
import "../styles/Home.css";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
          <NextNProgress options={{ showSpinner: false }} />
          <Component {...pageProps} />
          <Toaster position="bottom-left" reverseOrder />
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
