import classNames from "classnames";
import { raiseBasic } from "data/atoms";
import { useAtomValue } from "jotai";
import Image from "next/image";
import Logo from "../../../public/logo/logo_icon_primary.svg";

const RaiseBanner = (props: { bannerImage?: string }) => {
  const { bannerImage } = props;
  const raiseInfo = useAtomValue(raiseBasic);
  return (
    <div
      className={classNames(
        "relative h-[338px] w-full rounded-3xl rounded-tr-sm",
        bannerImage || "bg-black"
      )}
    >
      <div
        className={classNames(
          "w-42 absolute left-[calc(50%-86px)] -top-[86px] rounded-full border-4 border-bg_f_light p-8",
          raiseInfo.bg_dark
        )}
      >
        <Image
          src={raiseInfo.icon_logo || Logo}
          alt="Logo main"
          height={100}
          width={100}
        />
      </div>
    </div>
  );
};

export default RaiseBanner;
