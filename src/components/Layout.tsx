//React
import type { ReactNode } from "react";
//NextJS
import Head from "next/head";
//MV
import Header from "./Header";
import Footer from "./Footer";
import { useAtomValue } from "jotai";
import { raiseBasic } from "data/atoms";
import classNames from "classnames";

/// @TODO add props to select a simple Footer
/// @TODO add props for whitelabel

const Layout = (props: { children: ReactNode; title: string }) => {
  const { title, children } = props;
  const raiseStyles = useAtomValue(raiseBasic);
  return (
    <div
      className={classNames(
        "max-w- w-screen",
        raiseStyles.bg_dark,
        raiseStyles.text
      )}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <Header price={100000000} />
      <main className={raiseStyles.bg_dark}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
