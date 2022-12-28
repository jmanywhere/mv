import { type AppType } from "next/app";
import { Provider } from "jotai";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <Provider>
      <Component {...pageProps} />;
    </Provider>
  );
};

export default trpc.withTRPC(MyApp);
