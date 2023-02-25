import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import Image from "next/image";
// Libraries / utils
import { useSetAtom } from "jotai";
import { useImmerAtom } from "jotai-immer";
import { useForm, type SubmitHandler } from "react-hook-form";
import { trpc } from "utils/trpc";
import { fileToBase64 } from "utils/files";
// Components
import FileUpload from "components/generic/FileUpload";
import FormInput from "components/generic/FormInputV2";
import RaiseActions, {
  type RaiseActionsHandle,
} from "components/raises/RaiseActions";
import Collapse from "components/generic/Collapse";
// data
import { raiseCreateAtom } from "data/raiseAtoms";
import { txQueue } from "data/atoms";
import { chains } from "data/chainData";
// icons
import { MdOutlineError } from "react-icons/md";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

type FormValues = {
  background: string;
  primary: string;
  secondary: string;
  logo: File | null;
  banner: File | null;
  whitelabel: boolean;
  customPath: string;
  removeFooter: boolean;
};

const RaiseCustomization = () => {
  const {
    mutate: uploadImages,
    data,
    error,
    isLoading,
    reset,
  } = trpc.media.uploadImages.useMutation();

  const [raise, setRaise] = useImmerAtom(raiseCreateAtom);

  const chain = chains[raise.chainId];

  const setTxQueue = useSetAtom(txQueue);

  const actionsRef = useRef<RaiseActionsHandle>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    trigger,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      background: raise.backgroundColor || "#151d29",
      primary: raise.primaryColor || "#2192dd",
      secondary: raise.secondaryColor || "#56e19a",
      logo: null,
      banner: null,
      whitelabel: false,
      customPath: "",
      removeFooter: false,
    },
  });

  const [validatePath, setValidatePath] = useState(false);

  const {
    data: exists,
    error: pathCheckError,
    isLoading: checking,
    fetchStatus,
  } = trpc.raise.customPathCheck.useQuery(watch("customPath"), {
    enabled: validatePath,
  });

  register("logo", {
    required: !raise.logo,
    validate: {
      size: (value) => {
        return value && value.size > 3_000_000 ? "File > 3 MB" : true;
      },
    },
  });

  register("banner", {
    required: !raise.banner,
    validate: {
      size: (value) => {
        return value && value.size > 3_000_000 ? "File > 3 MB" : true;
      },
    },
  });

  useEffect(() => {
    if (error) {
      setTxQueue((draft) => {
        draft["up1"] = {
          status: "error",
          description: "Error uploading images",
          chainId: 0,
        };
      });
    }
    if (data) {
      setTxQueue((draft) => {
        draft["up1"] = {
          status: "complete",
          description: "Images uploaded",
          chainId: 0,
        };
      });
      setRaise((draft) => {
        if (data.logoUrl) draft.logo = data.logoUrl;
        if (data.bannerUrl) draft.banner = data.bannerUrl;
      });
      reset();
      actionsRef.current?.next();
    }
  }, [data, error, reset, setRaise, setTxQueue, actionsRef]);

  useEffect(() => {
    if (exists) {
      setError("customPath", {
        type: "manual",
        message: "Path already exists",
      });
    }

    if (exists === false) {
      clearErrors("customPath");
    }
    setValidatePath(false);
  }, [exists, setError, clearErrors]);

  const submit: SubmitHandler<FormValues> = async (values) => {
    const bannerBase64 = values.banner
      ? await fileToBase64(values.banner)
      : null;
    const logoBase64 = values.logo ? await fileToBase64(values.logo) : null;

    const imageData = {
      projectName: raise.name,
      banner:
        bannerBase64 && values.banner
          ? {
              image: bannerBase64,
              fileType: values.banner.type,
              fileName: values.banner.name,
            }
          : undefined,
      logo:
        logoBase64 && values.logo
          ? {
              image: logoBase64,
              fileType: values.logo.type,
              fileName: values.logo.name,
            }
          : undefined,
    };

    setRaise((draft) => {
      draft.backgroundColor = values.background;
      draft.primaryColor = values.primary;
      draft.secondaryColor = values.secondary;
      draft.extras.whitelabelFooter = values.whitelabel
        ? values.removeFooter
        : false;
      draft.extras.whitelabelURL = values.whitelabel
        ? values.customPath
        : undefined;
    });
    if (bannerBase64 || logoBase64) {
      setTxQueue((draft) => {
        draft["up1"] = {
          status: "pending",
          description: "Uploading images",
          chainId: 0,
        };
      });
      uploadImages(imageData);
    } else {
      actionsRef.current?.next();
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
        <FormInput
          name="background"
          label="Background Color"
          type="color"
          disableBottomMargin
          control={control}
          rules={{ required: true }}
        />
        <FormInput
          label="Primary Color"
          name="primary"
          type="color"
          disableBottomMargin
          control={control}
          rules={{ required: true }}
        />
        <FormInput
          label="Secondary Color"
          name="secondary"
          type="color"
          disableBottomMargin
          control={control}
          rules={{ required: true }}
        />
      </div>
      <div className="flex flex-col items-center gap-x-4 md:flex-row">
        <div className="max-w-32 md:max-w-40">
          <label className="ml-3" htmlFor="logo">
            <span className="text-lg font-semibold text-white">Logo</span>
            <span className="text-lg text-red-500">&nbsp;*</span>
          </label>
          <FileUpload
            name="logo"
            defaultValue={raise.logo}
            className=" mt-2 mb-2 h-32 w-32 md:h-40 md:w-40"
            onChange={(img, file) => {
              setValue("logo", file);
              trigger("logo");
            }}
          />
          <div
            className={classNames(
              "text-xs text-t_dark",
              errors.logo && "text-red-500"
            )}
          >
            Square Image {errors.logo?.message || ""}
          </div>
        </div>
        <div>
          <label className="ml-3" htmlFor="banner">
            <span className="text-lg font-semibold text-white">Banner</span>
            <span className="text-lg text-red-500">&nbsp;*</span>
          </label>
          <FileUpload
            defaultValue={raise.banner}
            name="banner"
            className=" mt-2 mb-2 h-36 w-full md:h-40 md:w-[375px]"
            onChange={(img, file) => {
              setValue("banner", file);
              trigger("banner");
            }}
          />
          <div>
            <div
              className={classNames(
                "text-xs text-t_dark",
                errors.banner && "text-red-500"
              )}
            >
              830x340 px (Recommended) {errors.banner?.message || ""}
            </div>
          </div>
        </div>
      </div>
      <div className="divider" />
      <div className="flex flex-row items-center gap-x-4">
        <label htmlFor="whitelabel" className=" text-xl font-semibold">
          Whitelabel
        </label>
        <input
          className="toggle-primary toggle"
          type="checkbox"
          {...register("whitelabel")}
        />
      </div>
      <div className="pt-2 text-xs text-t_dark">
        Whitelabel your project and remove the footer, add a custom path or do
        both.
      </div>
      <Collapse open={watch("whitelabel")}>
        <div className="flex flex-col pt-6">
          <div className="flex flex-row items-start gap-x-4 ">
            <label className="ml-3 whitespace-pre-line" htmlFor="removeFooter">
              Remove large footer{"\n"}
              <span
                className={classNames(
                  "text-xs",
                  watch("removeFooter")
                    ? "font-semibold text-green_accent"
                    : "text-t_dark"
                )}
              >
                (+50 {chain?.defaultStable?.toUpperCase() || ""})
              </span>
            </label>
            <input
              type="checkbox"
              className="checkbox-primary checkbox"
              {...register("removeFooter", {
                required: watch("whitelabel") && !watch("customPath"),
              })}
            />
          </div>
          <div className="w-full py-4 lg:w-[70%]">
            <FormInput
              label={
                <label htmlFor="customPath" className="pb-2 pl-2">
                  Custom Path{" "}
                  <span
                    className={classNames(
                      watch("customPath").length > 0
                        ? "font-semibold text-green_accent"
                        : "text-t_dark",
                      "text-xs"
                    )}
                  >
                    (+100 {chain?.defaultStable?.toUpperCase() || ""})
                  </span>
                  <span
                    className={classNames(
                      "text-sm",
                      watch("customPath").length > 0
                        ? !!pathCheckError
                          ? "text-red-500"
                          : "text-secondary"
                        : "text-t_dark"
                    )}
                  >
                    &nbsp;&nbsp;Path: /raise/
                    {watch("customPath")}
                  </span>
                  {watch("customPath").length > 3 &&
                    fetchStatus == "fetching" &&
                    checking && (
                      <Image
                        className="ml-4 inline-block"
                        src="/tail-spin.svg"
                        height={24}
                        width={24}
                        alt="Loading Test"
                      />
                    )}
                  {!!pathCheckError && !checking && (
                    <span className="ml-4 inline-block text-lg text-red-500">
                      <div className="tooltip" data-tip="Name Taken">
                        <MdOutlineError />
                      </div>
                    </span>
                  )}
                  {watch("customPath").length > 3 &&
                    !!pathCheckError &&
                    !exists &&
                    !errors.customPath && (
                      <span className="ml-4 inline-block text-lg text-accent">
                        <div className="tooltip" data-tip="OK!">
                          <IoCheckmarkCircleSharp />
                        </div>
                      </span>
                    )}
                </label>
              }
              name="customPath"
              type="text"
              control={control}
              rules={{
                onBlur: async (e) => {
                  if (e.target.value.length >= 3) setValidatePath(true);
                  else setValidatePath(false);
                },
                required: watch("whitelabel") && !watch("removeFooter"),
                pattern: {
                  value: /^[A-Za-z0-9]+$/,
                  message: "No special characters",
                },
                minLength: {
                  value: 3,
                  message: "3 chars min.",
                },
                maxLength: {
                  value: 20,
                  message: "20 chars max.",
                },
              }}
            />
          </div>
          {(!!errors.customPath || !!errors.removeFooter) && (
            <div className="text-base text-red-500">
              Choose one or both options
            </div>
          )}
        </div>
      </Collapse>

      <RaiseActions
        disableNext={!isValid}
        loading={
          isSubmitting ||
          isLoading ||
          (watch("customPath").length > 3 && checking) ||
          !!pathCheckError
        }
        ref={actionsRef}
      />
    </form>
  );
};

export default RaiseCustomization;
