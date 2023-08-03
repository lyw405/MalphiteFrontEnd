import {
  useEvent as useEventHub,
  dispatchEvent as dispatchEventHub,
} from "simple-react-event-hub";

type Tlistener<T> = (payload: T) => void;

/**
 * 订阅事件
 * @param name 订阅事件的名称
 * @param listener 订阅事件触发的函数
 */
export default function useEvent<T>(name: string, listener: Tlistener<T>) {
  useEventHub(name, listener);
}

/**
 *
 * @param name 发布事件
 * @param payload 事件携带的报文，回调函数的参数。
 */
export function dispatchEvent<T>(name: string, payload?: T) {
  dispatchEventHub(name, payload);
}
