import { useRef } from "react";
import RaiseActions, {
  type RaiseActionsHandle,
} from "components/raises/RaiseActions";
import { raiseCreateAtom } from "data/raiseAtoms";
import { useImmerAtom } from "jotai-immer";
import { prettyBN } from "utils/bn";
import { chains } from "data/chainData";
import format from "date-fns/format";

const Checkout = () => {
  const actionsRef = useRef<RaiseActionsHandle>(null);
  const [raise, setRaise] = useImmerAtom(raiseCreateAtom);

  const chain = chains[raise.chainId];

  return (
    <div>
      <div>
        <h6 className="pb-4 text-center text-xl font-semibold">
          {raise.name} Raise
        </h6>
        <div className="flex w-full flex-col items-center pb-8">
          <table className="w-[70%] table-auto overflow-hidden rounded-t-xl">
            <thead>
              <tr className="bg-bg_darkest">
                <th className="py-4">Item</th>
                <th className="py-4">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5 font-bold text-primary">Type</td>
                <td className="py-2 pr-5 text-right font-bold capitalize text-primary">
                  {raise.type}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Raise Chain</td>
                <td className="py-2 pr-5 text-right">
                  {raise.chainId} - {chain?.name}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Raise Token</td>
                <td className="py-2 pr-5 text-right">
                  {chain?.allowedTokens
                    .find((x) => x.address === raise.tokenToReceive)
                    ?.symbol.toUpperCase()}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Hardcap</td>
                <td className="py-2 pr-5 text-right">
                  {prettyBN(raise.hardcap)}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Softcap</td>
                <td className="py-2 pr-5 text-right">
                  {raise.softcap ? prettyBN(raise.softcap) : "No softcap"}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Min. Contribution</td>
                <td className="py-2 pr-5 text-right">
                  {raise.minContribution
                    ? prettyBN(raise.minContribution)
                    : "-"}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Max. Contribution</td>
                <td className="py-2 pr-5 text-right">
                  {raise.maxContribution
                    ? prettyBN(raise.maxContribution)
                    : "-"}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Step Contribution</td>
                <td className="py-2 pr-5 text-right">
                  {raise.minContributionStep
                    ? prettyBN(raise.minContributionStep)
                    : "-"}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Start Date</td>
                <td className="py-2 pr-5 text-right">
                  {raise.raiseStart
                    ? format(
                        new Date(raise.raiseStart * 1000),
                        "dd - MMM - yyyy HH:mm zzz"
                      )
                    : "-"}
                </td>
              </tr>
              <tr className="border-t-2 border-b-2 border-slate-400/50 hover:bg-bg_darkest hover:text-primary">
                <td className="py-2 pl-5">Raise Duration</td>
                <td className="py-2 pr-5 text-right">
                  {raise.raiseDuration
                    ? raise.raiseDuration / (24 * 3600) + " days"
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <form>
        <div>
          Show a table of all the information the user has entered so far. and
          select Tier option
        </div>
        <div>Show upsells and other options to the user.</div>
        <RaiseActions disableNext loading={false} ref={actionsRef} />
      </form>
    </div>
  );
};

export default Checkout;
