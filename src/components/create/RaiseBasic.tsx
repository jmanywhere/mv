import Input from "components/generic/Input";
import SingleMultipleChoice from "components/generic/SingleMultipleChoice";

const RaiseBasic = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Input label="Project Name" helperText="The name of your project" />
      <Input
        label="Raise Description"
        helperText="Brief introduction to what this raise is about"
        multiline
        className="min-h-[74px]"
      />
      <SingleMultipleChoice
        label="Select your raise type"
        type="single"
        className="ml-2"
        options={[
          {
            value: "token",
            title: "Token Raise",
            description: "Selling your token for the first time",
          },
          {
            value: "charity",
            title: "Charity Raise",
            description:
              "Need to raise funds for a charity without giving out tokens",
          },
          {
            value: "fund",
            title: "Fund Raise",
            description: "Raise funds in exchange of royalties to investors",
          },
        ]}
      />
    </div>
  );
};

export default RaiseBasic;
