//React
import type { ReactNode } from "react";
//NextJS
import Head from "next/head";
//MV
import Header from "./Header";
import Footer from "./Footer";
import SimpleFooter from "./SimpleFooter";
import { useAtomValue } from "jotai";
import { raiseBasic } from "data/atoms";
import classNames from "classnames";
import TxContainer from "./TxContainer";

/// @TODO add props to select a simple Footer
/// @TODO add props for whitelabel

const Layout = (props: {
  children: ReactNode;
  title: string;
  hideHeader?: boolean;
  simpleFooter?: boolean;
}) => {
  const { title, children, hideHeader, simpleFooter } = props;
  const raiseStyles = useAtomValue(raiseBasic);
  return (
    <div
      className={classNames(
        raiseStyles.bg_dark,
        raiseStyles.text,
        hideHeader ? "pt-10" : "pt-0"
      )}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <Header price={100000000} hideHeader={hideHeader} />
      <main>
        <TxContainer />
        {children}
      </main>
      {simpleFooter ? <SimpleFooter /> : <Footer />}
    </div>
  );
};

export default Layout;
