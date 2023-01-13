import type { NextPage } from "next";
// components
import Layout from "components/Layout";

const Create: NextPage = () => {
  return (
    <Layout title="Create your Raise">
      <div className="flex w-full items-center justify-center py-8 px-6 text-white">
        {/* CARD CONTAINER */}
        <div className=" w-full max-w-[830px] rounded-3xl bg-bg_f_light px-7 pt-6 pb-5 md:px-12 md:pt-12 md:pb-9">
          <h1 className="text-xl font-bold md:text-3xl">Create a Raise</h1>
        </div>
      </div>
    </Layout>
  );
};

export default Create;
