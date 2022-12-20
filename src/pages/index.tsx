import { type NextPage } from "next";

//MV
import Layout from "../components/Layout";
import Banner from "../components/Banner";

const Home: NextPage = () => {
  return (
    <>
      <Layout title="LandingPage">
        <Banner
          img={""}
          Title={"Every Moon has start Somewhere"}
          subTitle={"Crowd funding made Easy"}
        ></Banner>
      </Layout>
    </>
  );
};

export default Home;
