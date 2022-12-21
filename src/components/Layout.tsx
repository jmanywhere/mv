//React
import React from "react";
//NextJS
import Head from "next/head";
//MV
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, title }) => {
  return (
    <div className="w-screen bg-[#10161f]">
      <Head>
        <title>{title}</title>
      </Head>
      <Header price={100000000}></Header>
      <main className="m-auto flex max-w-[1200px] flex-col items-center bg-[#10161f]">
        {children}
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Layout;
