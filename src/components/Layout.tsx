//React
import type { ReactNode } from "react";
//NextJS
import Head from "next/head";
//MV
import Header from "./Header";
import Footer from "./Footer";

const Layout = (props: { children: ReactNode; title: string }) => {
  const { title, children } = props;
  return (
    <div className=" max-w- w-screen bg-[#10161f]">
      <Head>
        <title>{title}</title>
      </Head>
      <Header price={100000000} />
      <main className=" bg-[#10161f]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
