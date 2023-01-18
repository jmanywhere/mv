import { useRef } from "react";
import type { ReactNode } from "react";

const Collapse = (props: { open?: boolean; children?: ReactNode }) => {
  const { open, children } = props;
  const collapsable = useRef<HTMLDivElement>(null);
  const height = (open ? collapsable.current?.clientHeight || 0 : 0) + "px";
  return (
    <div
      style={{ height: height }}
      className="collapse-transition w-full overflow-hidden"
    >
      <div ref={collapsable}>{children}</div>
    </div>
  );
};

export default Collapse;
