import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import FileUpload from "components/generic/FileUpload";
import FormInput from "components/generic/FormInputV2";
import RaiseActions, {
  type RaiseActionsHandle,
} from "components/raises/RaiseActions";
import { raiseCreateAtom } from "data/raiseAtoms";
import { useImmerAtom } from "jotai-immer";
import { useForm, type SubmitHandler } from "react-hook-form";
import { trpc } from "utils/trpc";
import { txQueue } from "data/atoms";
import { useSetAtom } from "jotai";
import { fileToBase64 } from "utils/files";

type FormValues = {
  background: string;
  primary: string;
  secondary: string;
  logo: File | null;
  banner: File | null;
  whitelabel: boolean;
  customPath: string;
  footerOnly: boolean;
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
  const setTxQueue = useSetAtom(txQueue);

  const actionsRef = useRef<RaiseActionsHandle>(null);

  const {
    register,
    handleSubmit,
    setValue,
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
    },
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
    if (bannerBase64 || logoBase64) {
      setTxQueue((draft) => {
        draft["up1"] = {
          status: "pending",
          description: "Uploading images",
          chainId: 0,
        };
      });
      uploadImages(imageData);
    }
    setRaise((draft) => {
      draft.backgroundColor = values.background;
      draft.primaryColor = values.primary;
      draft.secondaryColor = values.secondary;
    });
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

      <RaiseActions
        disableNext={!isValid}
        loading={isSubmitting || isLoading}
        ref={actionsRef}
      />
    </form>
  );
};

export default RaiseCustomization;
