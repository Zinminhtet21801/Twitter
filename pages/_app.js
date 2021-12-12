import "../styles/global.css";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import NextNProgress from "nextjs-progressbar";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <NextNProgress options={{ showSpinner: false }} />
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}

export default MyApp;
