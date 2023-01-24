import classNames from "classnames";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BiImageAdd } from "react-icons/bi";

const FileUpload = (props: {
  name?: string;
  className?: string;
  defaultValue?: string;
  onChange?: (base64: string, file: any) => void;
}) => {
  const { className, onChange, defaultValue, name } = props;
  const [imgUrl, setImgUrl] = useState<string | null>(defaultValue || null);
  const [imgSize, setImgSize] = useState<number | null>(null);
  const [imgLoad, setImgLoad] = useState<{
    progress: number;
    total: number;
  } | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      acceptedFiles.forEach((file: any) => {
        setImgUrl(null);
        const reader = new FileReader();
        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onprogress = (e) => {
          console.log(e);
          if (e.lengthComputable) {
            setImgLoad({ progress: e.loaded, total: e.total });
          }
        };
        reader.onload = () => {
          const binaryStr = reader.result;
          onChange && onChange(binaryStr as string, file);
          setImgUrl(binaryStr as string);
          setImgSize(file.size);
        };
        reader.readAsDataURL(file);
      });
    },
    [onChange, setImgLoad, setImgSize, setImgUrl]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div>
      <div
        {...getRootProps({
          className: classNames(
            "border-2 rounded-2xl w-full bg-bg_darkest border-slate-500",
            "flex flex-col items-center justify-center",
            "text-slate-500 text-sm text-center cursor-pointer",
            "group hover:border-primary overflow-hidden",
            className
          ),
        })}
      >
        <input {...getInputProps({ accept: "image/*", name })} />
        {!imgUrl ? (
          !imgLoad ? (
            <>
              <BiImageAdd className="text-4xl group-hover:text-primary" />
              {isDragActive ? (
                <p className="px-4">Drop image here ...</p>
              ) : (
                <p className="px-4">Drop image or click to upload</p>
              )}
            </>
          ) : (
            <p className="px-4">
              Loading...{((imgLoad.progress * 100) / imgLoad.total).toFixed(0)}%
            </p>
          )
        ) : (
          <img
            src={imgUrl || defaultValue}
            className="w-full"
            alt="upload_img_preview"
          />
        )}
      </div>
      <div className="ml-3 text-sm">
        {imgSize &&
          (imgSize > 1000000
            ? `${(imgSize / 1_000_000).toFixed(2)} MB`
            : `${(imgSize / 1_000).toFixed(2)} KB`)}
      </div>
    </div>
  );
};

export default FileUpload;
