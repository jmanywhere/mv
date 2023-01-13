import { type NextPage } from "next";

//MV
import Layout from "../components/Layout";
import Banner from "../components/Banner";
import InfoBanner from "../components/InfoBanner";

const Home: NextPage = () => {
  return (
    <>
      <Layout
        title="Moon Vector - Crowdfunding made easy"
        meta={{
          url: "https://moonvector.io/",
          description: `Moon Vector is a new decentralized Private Sale, Public Sale, and
          Crowd Funding platform that allows projects to seamlessly raise funds,
          with or without having a token, allowing you the option of Crypto, or
          traditional non-crypto, crowdfunding and fundraising.`,
        }}
      >
        <Banner />
        <InfoBanner />
      </Layout>
    </>
  );
};

export default Home;
