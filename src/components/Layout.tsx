//React
import type { ReactNode } from "react";
//NextJS
import Head from "next/head";
//MV
import Header from "./Header";
import Footer from "./Footer";

/// @TODO add props to select a simple Footer
/// @TODO add props for whitelabel

const Layout = (props: { children: ReactNode; title: string }) => {
  const { title, children } = props;
  return (
    <div className=" max-w- w-screen bg-bg_dark_m">
      <Head>
        <title>{title}</title>
      </Head>
      <Header price={100000000} />
      <main className=" bg-bg_dark_m">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
