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
  meta?: {
    url?: string;
    description?: string;
    image?: string;
  };
}) => {
  const { title, children, hideHeader, simpleFooter, meta } = props;
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
        <meta property="twitter:title" content={title} />
        <meta name="og:title" content={title} />
        {meta && (
          <>
            {meta.url && <meta name="og:url" content={meta.url} />}
            {meta.description && (
              <meta name="description" content={meta.description} />
            )}
            {meta.description && (
              <meta property="og:description" content={meta.description} />
            )}
            {meta.description && (
              <meta property="twitter:description" content={meta.description} />
            )}
            <meta
              property="og:image"
              content={meta.image || "https://moonvector.io/logo/mainLogo.png"}
            />
            <meta
              property="twitter:image"
              content={meta.image || "https://moonvector.io/logo/mainLogo.png"}
            />
            <meta property="twitter:card" content="summary" />
            <meta property="twitter:site" content="@MoonVector_" />
          </>
        )}
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
