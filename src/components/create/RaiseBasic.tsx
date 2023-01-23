// Formik
import { Formik, Form, Field, FieldArray } from "formik";
// Custom components
import Input from "components/generic/FormInput";
import SingleMultipleChoice from "components/generic/SingleMultipleChoice";
import RaiseActions from "components/raises/RaiseActions";
// icons
import { AiFillMediumCircle, AiFillTwitterCircle } from "react-icons/ai";
import { BiWorld } from "react-icons/bi";
import { BsYoutube } from "react-icons/bs";
import { BsTelegram } from "react-icons/bs";
import { SiGitbook } from "react-icons/si";
import { isAddress } from "ethers/lib/utils";
import Collapse from "components/generic/Collapse";
import classNames from "classnames";
import { useImmerAtom } from "jotai-immer";
import { raiseCreateAtom } from "data/raiseAtoms";

type SocialList =
  | "twitter"
  | "medium"
  | "telegram"
  | "docs"
  | "website"
  | "youtube";

const RaiseBasic = () => {
  const [raiseData, setRaiseData] = useImmerAtom(raiseCreateAtom);

  return (
    <Formik
      initialValues={{
        projectName: raiseData.name,
        raiseDescription: raiseData.description,
        raiseType: raiseData.type,
        referrer: raiseData.referral,
        socials: raiseData.socials,
      }}
      validate={(values) => {
        const errors: { [key: string]: string } = {};
        if (values.projectName.length < 8)
          errors.projectName = "Project name must be at least 8 characters";
        if (values.raiseDescription.length < 100)
          errors.raiseDescription =
            "Raise description must be at least 100 characters";
        if (!values.raiseType) errors.raiseType = "Please select a raise type";
        if (values.referrer.length > 0 && !isAddress(values.referrer))
          errors.referrer = "Invalid address";
        const socials = Object.keys(values.socials) as SocialList[];
        let socialCount = 0;
        socials.forEach((s) => {
          let url;
          const social = values.socials[s];
          if (values.raiseType !== "charity" && s === "website") {
            try {
              if (values.socials[s]) url = new URL(social || "");
              else throw Error("No website");
            } catch (err) {
              errors.socials = "Required Website URL, Check URL is valid. ";
              return;
            }
          }
          if (social) {
            if (social.length > 0) {
              try {
                url = new URL(social);
                if (url.protocol !== "https:")
                  errors.socials =
                    (errors.socials ? errors.socials + " " : "") +
                    s +
                    " URL must be secure https. ";
                else {
                  if (s !== "website") {
                    if (url.host.split(".")[0] !== s)
                      errors.socials =
                        (errors.socials ? errors.socials + " " : "") +
                        s +
                        " Invalid host URL. ";
                    if (url.pathname.length < 2)
                      errors.socials =
                        (errors.socials ? errors.socials + " " : "") +
                        s +
                        " Invalid path URL. ";
                  }
                }
              } catch (err) {
                errors.socials =
                  (errors.socials ? errors.socials + " " : "") +
                  s +
                  " Check URL is valid. ";
                return;
              }
              socialCount++;
            }
          }
        });
        if (socialCount < 2)
          errors.socials =
            (errors.socials ? errors.socials + " " : "") +
            "At least 2 socials are required";
        return errors;
      }}
      onSubmit={(values) => {
        setRaiseData((draft) => {
          draft.name = values.projectName;
          draft.description = values.raiseDescription;
          draft.type = values.raiseType;
          draft.referral = values.referrer;
          draft.socials = values.socials;
        });
      }}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        submitForm,
      }) => {
        const anyErrors =
          (Object.values(touched).filter((x) => x).length - 1 < 1 &&
            Object.values(values).filter((v) => !!v).length <= 2) ||
          Object.keys(errors).length > 0;
        return (
          <Form>
            <div className="flex flex-col gap-y-4">
              <Input
                name="projectName"
                label="Project Name"
                helperText="The name of your project"
                required
              />
              <Input
                required
                name="raiseDescription"
                label="Raise Description"
                helperText="Brief introduction to what this raise is about"
                multiline
                className="min-h-[74px]"
              />
              <SingleMultipleChoice
                label="Select your raise type"
                type="single"
                className="ml-2"
                onChange={(v) => {
                  setFieldValue("raiseType", v);
                  setFieldTouched("raiseType", true, true);
                }}
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
                    description:
                      "Raise funds in exchange of royalties to investors",
                  },
                ]}
              />
              <Collapse open={!!errors.raiseType}>
                <div
                  className={classNames(
                    touched.raiseType ? "text-red-500" : "text-red-200"
                  )}
                >
                  {errors.raiseType}
                </div>
              </Collapse>
              <Input
                name="referrer"
                label="Referrer"
                helperText="Referrer's address (?): Enter the address of the person who referred you to this platform"
              />
              <legend className="ml-3">
                <h3
                  className={classNames(
                    " text-lg font-semibold",
                    touched.socials && errors.socials
                      ? "text-red-500"
                      : "text-white"
                  )}
                >
                  Socials <span className="text-red-500">*</span>
                </h3>
                <h4
                  className={classNames(
                    "text-sm",
                    touched.socials && errors.socials
                      ? "text-red-300"
                      : "text-t_dark"
                  )}
                >
                  <>
                    {!errors.socials && "At least 2 are required"}{" "}
                    {errors.socials}
                  </>
                </h4>
              </legend>
              <div className="flex max-w-full flex-col gap-y-2 md:max-w-[80%]">
                <div className="flex w-full flex-row items-start gap-x-4">
                  <Input
                    placeholder="Website"
                    containerClassName="flex-grow"
                    name="socials.website"
                  />
                  <BiWorld
                    size="36px"
                    className="rounded-full bg-transparent text-white"
                  />
                </div>
                <div className="flex w-full flex-row items-start gap-x-4">
                  <Input
                    placeholder="Medium"
                    containerClassName="flex-grow"
                    name="socials.medium"
                  />
                  <AiFillMediumCircle
                    size="36px"
                    className="rounded-full bg-white text-black"
                  />
                </div>
                <div className="flex w-full flex-row items-start gap-x-4">
                  <Input
                    placeholder="Telegram"
                    containerClassName="flex-grow"
                    name="socials.telegram"
                  />
                  <BsTelegram
                    size="36px"
                    className="rounded-full bg-white text-primary"
                  />
                </div>
                <div className="flex w-full flex-row items-start gap-x-4">
                  <Input
                    placeholder="Twitter"
                    containerClassName="flex-grow"
                    name="socials.twitter"
                  />
                  <AiFillTwitterCircle
                    size="36px"
                    className="rounded-full bg-white text-primary"
                  />
                </div>
                <div className="flex w-full flex-row items-start gap-x-4">
                  <Input
                    placeholder="Youtube"
                    containerClassName="flex-grow"
                    name="socials.youtube"
                  />
                  <BsYoutube size="36px" className=" text-red-500" />
                </div>
                <div className="flex w-full flex-row items-start gap-x-4">
                  <Input
                    placeholder="Docs"
                    containerClassName="flex-grow"
                    name="socials.docs"
                  />
                  <SiGitbook size="36px" className=" text-[rgb(169,194,255)]" />
                </div>
              </div>
            </div>
            <RaiseActions disableNext={anyErrors} action={submitForm} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default RaiseBasic;
