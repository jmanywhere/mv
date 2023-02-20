// Custom components
import Input from "components/generic/FormInputV2";
import SingleMultipleChoice from "components/generic/SingleMultipleChoice";
import RaiseActions, {
  type RaiseActionsHandle,
} from "components/raises/RaiseActions";
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
import { raiseCreateAtom, type RaiseFormType } from "data/raiseAtoms";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRef } from "react";

type SocialList =
  | "twitter"
  | "medium"
  | "telegram"
  | "docs"
  | "website"
  | "youtube";

type FormValues = {
  projectName: string;
  raiseDescription: string;
  raiseType: RaiseFormType["type"];
  referrer: string;
  socials: { [key in SocialList]: string };
};

const RaiseBasic = () => {
  const [raiseData, setRaiseData] = useImmerAtom(raiseCreateAtom);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      projectName: raiseData.name,
      raiseDescription: raiseData.description,
      raiseType: raiseData.type,
      referrer: raiseData.referral,
      socials: raiseData.socials,
    },
  });

  const actionRef = useRef<RaiseActionsHandle>(null);

  const submit: SubmitHandler<FormValues> = (v) => {
    setRaiseData((draft) => {
      draft.name = v.projectName;
      draft.description = v.raiseDescription;
      draft.type = v.raiseType;
      draft.referral = v.referrer;
      draft.socials = v.socials;
    });
    actionRef.current?.next();
  };

  register("raiseType", { required: "Please provide a raise type." });
  register("socials", {
    required: true,
    validate: {
      moreThan2: (value) => {
        const socials = Object.keys(value) as SocialList[];
        let socialCount = 0;
        socials.forEach((s) => {
          if (value[s]) socialCount++;
        });
        return socialCount >= 2 ? true : "Please provide at least 2 socials";
      },
      // website: (value) => {
      //   if (watch("raiseType") !== "charity" && !value.website)
      //     return "Please provide a website";
      //   return true;
      // },
      checkValidSocials: (value) => {
        const socials = Object.keys(value) as SocialList[];
        let url: URL | undefined;
        socials.forEach((s) => {
          if (value[s]) {
            try {
              url = new URL(value[s]);
              if (url.protocol !== "https:")
                return `${s} - URL must be secure https`;
              if (s !== "website") {
                if (url.host.split(".")[0] !== s)
                  return `${s} - Invalid host URL`;
                if (url.pathname.length < 2) return `${s} - Invalid path URL`;
              }
            } catch (e) {
              return `${s} - Please provide a valid URL`;
            }
          }
        });
        return true;
      },
    },
  });

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="flex flex-col gap-y-4">
        <Input
          name="projectName"
          label="Project Name"
          helperText="The name of your project"
          rules={{
            required: true,
            minLength: {
              value: 8,
              message: "Project name must be at least 8 characters",
            },
          }}
          control={control}
        />
        <Input
          name="raiseDescription"
          label="Raise Description"
          helperText="Brief introduction to what this raise is about"
          multiline
          className="min-h-[74px]"
          rules={{
            required: true,
            minLength: {
              value: 100,
              message: "Raise description must be at least 100 characters",
            },
          }}
          control={control}
        />
        <SingleMultipleChoice
          label="Select your raise type"
          type="single"
          className="ml-2"
          defaultValue={raiseData.type}
          onChange={(v) => {
            setValue("raiseType", v as RaiseFormType["type"]);
            trigger("raiseType");
            trigger("socials");
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
              description: "Raise funds in exchange of royalties to investors",
            },
          ]}
        />
        <Collapse open={!!errors.raiseType}>
          <div className="text-red-500">{errors.raiseType?.message}</div>
        </Collapse>
        <Input
          name="referrer"
          label="Referrer"
          helperText="Referrer's address (?): Enter the address of the person who referred you to this platform"
          control={control}
          rules={{
            required: false,
            validate: (value) => {
              if (value && !isAddress(value)) {
                return "Invalid address";
              }
            },
          }}
        />
        <legend className="ml-3">
          <h3
            className={classNames(
              " text-lg font-semibold",
              errors.socials ? "text-red-500" : "text-white"
            )}
          >
            Socials <span className="text-red-500">*</span>
          </h3>
          <h4
            className={classNames(
              "text-sm",
              errors.socials ? "text-red-300" : "text-t_dark"
            )}
          >
            <>
              {!errors.socials && "At least 2 are required"}{" "}
              {errors.socials?.message}
            </>
          </h4>
        </legend>
        <div className="flex max-w-full flex-col gap-y-2 md:max-w-[80%]">
          <div className="flex w-full flex-row items-start gap-x-4">
            <Input
              placeholder="Website"
              containerClassName="flex-grow"
              name="socials.website"
              rules={{
                validate: {
                  required: (v) =>
                    watch("raiseType") !== "charity" ? !!v || "Required" : true,
                },
              }}
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
            />
            <BsYoutube size="36px" className=" text-red-500" />
          </div>
          <div className="flex w-full flex-row items-start gap-x-4">
            <Input
              placeholder="Docs"
              containerClassName="flex-grow"
              name="socials.docs"
              control={control}
            />
            <SiGitbook size="36px" className=" text-[rgb(169,194,255)]" />
          </div>
        </div>
      </div>
      <RaiseActions
        disableNext={!isValid}
        loading={isSubmitting}
        ref={actionRef}
      />
    </form>
  );
};

export default RaiseBasic;
