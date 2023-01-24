import FileUpload from "components/generic/FileUpload";
import FormInput from "components/generic/FormInput";
import RaiseActions from "components/raises/RaiseActions";
import { raiseCreateAtom } from "data/raiseAtoms";
import { Formik, Form } from "formik";
import { useImmerAtom } from "jotai-immer";

type FormValues = {
  background: string;
  primary: string;
  secondary: string;
  logo: File | null;
  banner: File | null;
};

const RaiseCustomization = () => {
  const [raise, setRaise] = useImmerAtom(raiseCreateAtom);
  return (
    <Formik
      initialValues={
        {
          background: "#151d29",
          primary: "#2192dd",
          secondary: "#56e19a",
          logo: null,
          banner: null,
        } as FormValues
      }
      validate={(values) => {
        const errors: any = {};
        console.log(values.logo);
        // if (!values.background) {
        //   errors.background = "Required";
        // }
        // if (!values.primary) {
        //   errors.primary = "Required";
        // }
        // if (!values.secondary) {
        //   errors.secondary = "Required";
        // }
        if (!raise.logo) {
          if (!values.logo) {
            errors.logo = "Required";
          } else if (values.logo.size > 3_000_000) errors.logo = "File > 3 MB";
        }
        if (!raise.banner) {
          if (!values.banner) {
            errors.banner = "Required";
          } else if (values.banner.size > 3_000_000)
            errors.banner = "File > 3 MB";
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        // We get the file paths from the formik values
        // and then we can upload them to the server
        // using the paths
        setSubmitting(true);
        let logoUrl = "";
        let bannerUrl = "";
        if (values.logo) {
          const fileName = `logo.${values.logo?.name.split(".")[1]}`;

          // Upload file using fetch
          const resp = await fetch("/api/media/upload", {
            method: "POST",
            headers: {
              "x-filename": fileName,
              "x-project-name": raise.name,
            },
            body: values.logo,
          });
          const data = await resp.json();
          logoUrl = data.url.split("?")[0];
        }
        if (values.banner) {
          const fileName = `banner.${values.banner?.name.split(".")[1]}`;

          // Upload file using fetch
          const resp = await fetch("/api/media/upload", {
            method: "POST",
            headers: {
              "x-filename": fileName,
              "x-project-name": raise.name,
            },
            body: values.banner,
          });
          const data = await resp.json();
          bannerUrl = data.url.split("?")[0];
        }
        setRaise((draft) => {
          if (logoUrl) draft.logo = logoUrl;
          if (bannerUrl) draft.banner = bannerUrl;
          draft.backgroundColor = values.background;
          draft.primaryColor = values.primary;
          draft.secondaryColor = values.secondary;
        });
        setSubmitting(false);
      }}
    >
      {({ submitForm, errors, isSubmitting, setFieldValue }) => {
        const anyErrors = !!(errors.banner || errors.logo);
        return (
          <Form>
            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-3">
              <FormInput
                name="background"
                label="Background Color"
                type="color"
                disableBottomMargin
              />
              <FormInput
                label="Primary Color"
                name="primary"
                type="color"
                disableBottomMargin
              />
              <FormInput
                label="Secondary Color"
                name="secondary"
                type="color"
                disableBottomMargin
              />
            </div>
            <div className="flex flex-col items-center gap-x-4 md:flex-row">
              <div className="max-w-32 md:max-w-40">
                <label className="ml-3" htmlFor="logo">
                  <span className="text-lg font-semibold text-white">Logo</span>
                  <span className="text-lg text-red-500">*</span>
                </label>
                <FileUpload
                  name="logo"
                  defaultValue={raise.logo}
                  className=" mt-2 mb-2 h-32 w-32 md:h-40 md:w-40"
                  onChange={(img, file) => {
                    setFieldValue("logo", file);
                  }}
                />
                <div className="text-xs text-t_dark">Square Image</div>
              </div>
              <div>
                <label className="ml-3" htmlFor="banner">
                  <span className="text-lg font-semibold text-white">
                    Banner
                  </span>
                  <span className="text-lg text-red-500">*</span>
                </label>
                <FileUpload
                  defaultValue={raise.banner}
                  name="banner"
                  className=" mt-2 mb-2 h-36 w-full md:h-40 md:w-[375px]"
                  onChange={(img, file) => {
                    setFieldValue("banner", file);
                  }}
                />
                <div>
                  <div className="text-xs text-t_dark">
                    830x340 px (Recommended)
                  </div>
                </div>
              </div>
            </div>

            <RaiseActions
              disableNext={anyErrors}
              action={submitForm}
              loading={isSubmitting}
            />
          </Form>
        );
      }}
    </Formik>
  );
};

export default RaiseCustomization;
