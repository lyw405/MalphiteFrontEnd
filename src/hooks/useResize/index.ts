import { useEffect, useRef } from "react";
import debounce from "lodash/debounce";

export declare type TSize = {
  h: number;
  w: number;
  sh: number;
  sw: number;
  screenh: number;
  screenw: number;
};

const realTrigger = debounce(() => {
  const event = document.createEvent("HTMLEvents");
  event.initEvent("resize", true, false);
  window.dispatchEvent(event);
}, 200);

export function getSize(): TSize {
  return {
    h: Math.min(
      document.body.clientHeight,
      document.documentElement.clientHeight
    ),
    w: document.documentElement.clientWidth,
    sh: document.body.scrollHeight,
    sw: document.body.scrollWidth,
    screenh: window.screen.availHeight,
    screenw: window.screen.availWidth,
  };
}

export function triggerResizeEvent() {
  realTrigger();
}

export default function useResize(
  onResize: () => void,
  resizeOnMounted = false
) {
  const fnRef = useRef(onResize);
  useEffect(() => {
    const fn = debounce(fnRef.current, 200);
    window.addEventListener("resize", fn);
    if (resizeOnMounted) onResize();

    return () => {
      window.removeEventListener("resize", fn);
    };
  }, []);
}
