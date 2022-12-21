import { type NextPage } from "next";

//MV
import Layout from "../components/Layout";
import Banner from "../components/Banner";
import InfoBanner from "../components/InfoBanner";

const Home: NextPage = () => {
  return (
    <>
      <Layout title="LandingPage">
        <Banner />
        <InfoBanner />
      </Layout>
    </>
  );
};

export default Home;
