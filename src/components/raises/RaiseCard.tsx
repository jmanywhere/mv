import Image from "next/image";

const RaiseCard = (props: RaiseCardProps) => {
  const {
    title = "MoonVector",
    subtitle = "Crowdfunding",
    iconLogo = "/logo/logo_icon_primary.svg",
  } = props;

  // TODOs
  // connect wallet stuff
  // After wallet is connected show the wallet and balance of fund types it has.
  // Probably will need to change the button for two textfields, address button will disconnect user

  // Sale Status (whitelist, started, ended)
  // Total Raise - amount raised. Use default chain rpc to get the data.

  // Need softcap and hardcap values
  // User set goal if no hardcap(?)
  // If no softcap, use hardcap only. If no hardcap a softcap MUST be set.
  // Excess of softcap (if no hardcap) will be the new 100%, will need to change bg of progress bar
  // to make sure it reflects that raise has gone beyond expectation.

  // Reward area Data
  // Let's standardize contract call value so that both MoonVector and Regular raise data can be shown.

  return (
    <div className="rounded-3xl bg-bg_f_light px-9 py-8">
      <div className="flex flex-col items-center justify-center gap-y-6 gap-x-6 pb-6 md:flex-row">
        <div className="flex items-center justify-center rounded-full border-2 border-dividers bg-bg_darkest p-5">
          <Image
            src={iconLogo}
            height={60}
            width={60}
            alt={`${title}-Icon-Logo`}
          />
        </div>
        <div className="flex-grow text-center md:text-left">
          <div className="text-2xl font-bold">{title}</div>
          <div className="text-base font-semibold">{subtitle}</div>
        </div>
        <button className="rounded-xl bg-slate-500 px-7 py-5 hover:bg-primary">
          Connect Wallet
        </button>
      </div>
      <div className="border-t-2 border-b-2 border-dividers py-6">
        Raise Status
      </div>
      <div>Raise Actions</div>
      <div>Raise Reward</div>
    </div>
  );
};

export default RaiseCard;

type RaiseCardProps = {
  title: string;
  subtitle: string;
  iconLogo: string;
};
