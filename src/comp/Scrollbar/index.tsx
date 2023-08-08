/**
 * 滚动条组件
 */

import { memo, useMemo, useRef } from "react";
import debounce from "lodash/debounce";
import useResize from "dbc/hooks/useResize";
import RcScrollbar from "react-scrollbar/dist/no-css";
import classnames from "classnames";
import styles from "./index.less";

type IScrollbar = {
  refresh: () => void;
};

interface IScrollbarProps {
  /** CSS样式类 */
  className?: string;
  /** C */
  style?: React.CSSProperties;
  /** CSS样式类 */
  children: (sb: IScrollbar) => React.ReactNode;
}
const Scrollbar = ({ calssName, children, ...props }: IScrollbarProps) => {
  const ref = useRef<any>(undefined);
  const arg = useMemo<IScrollbar>(() => {
    return {
      refresh: debounce(() => {
        if (ref.current?.handleWindowResize) {
          ref.current?.handleWindowResize();
        }
      }, 300),
    };
  }, []);
  useResize(arg.refresh);

  return (
    <RcScrollbar
      className={classnames(styles.rcsc, calssName)}
      {...props}
      contentWindow={false}
      ref={ref}
    >
      {children(arg)}
    </RcScrollbar>
  );
};

export default memo(Scrollbar);
