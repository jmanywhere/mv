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
        <button className="rounded-xl bg-t_dark px-7 py-5 hover:bg-primary">
          Connect Wallet
        </button>
      </div>
      <div className="flex flex-col gap-4 border-t-2 border-b-2 border-dividers py-6 md:flex-row">
        <div className="w-full font-semibold md:w-[35%]">
          <div className="flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-32 md:flex-none">
              Sale Status
            </span>
            <span className="flex-none text-left uppercase md:flex-grow">
              Started
            </span>
          </div>
          <div className="mt-4 flex flex-row justify-between">
            <span className="flex-grow text-t_dark md:w-32 md:flex-none">
              Raised
            </span>
            <span className="flex-none text-left md:flex-grow">XXX Tokens</span>
          </div>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-t_dark">
            Total Raised / SoftCap|HardCap
          </div>
          <progress
            value={60}
            max={100}
            className="raise-progress mt-6 w-full"
          />
        </div>
      </div>
      {/* INPUT AND ACTION */}
      <div className="flex flex-row items-end">
        {/* INPUT AND TOKENS IN WALLET */}
        {/* LABEL AND INPUT */}
        <div className="flex flex-grow flex-col">
          <label id="pledge-id" htmlFor="pledge">
            Pledge {`{token}`}
          </label>
          <div className="flex flex-row items-center">
            <input name="pledge" />
            <span>TOKENS IN WALLET</span>
          </div>
        </div>
        <div>
          <button className="bg-primary">approve/pledge</button>
        </div>
      </div>
      <div>Raise Rewards</div>
    </div>
  );
};

export default RaiseCard;

type RaiseCardProps = {
  title: string;
  subtitle: string;
  iconLogo?: string;
};
