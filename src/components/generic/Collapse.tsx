import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

const Collapse = (props: { open?: boolean; children?: ReactNode }) => {
  const { open, children } = props;
  const collapsable = useRef<HTMLDivElement>(null);
  const [currentHeight, setCurrentHeight] = useState(0);
  const height = (open ? collapsable.current?.clientHeight || 0 : 0) + "px";
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        collapsable.current?.clientHeight != currentHeight ||
        collapsable.current?.scrollHeight != currentHeight
      ) {
        setCurrentHeight(collapsable.current?.clientHeight || 0);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [collapsable, setCurrentHeight, currentHeight]);
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
