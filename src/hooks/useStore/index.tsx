/**
 * 全局的状态管理
 * @module useStore
 *
 * @see 基于useState和useEffect封装，组件mount时，根据key订阅变更消息，unmount时取消订阅消息。
 *
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface IStoreItem {
  value: any;
  setFuncs: React.Dispatch<any>[];
}

type TStore = Record<string, IStoreItem>;

const store: TStore = {};

function getItemByKey<T>(key: string, defaultValue: T) {
  let storeItem = store[key];
  if (!storeItem) {
    storeItem = {
      value: defaultValue,
      setFuncs: [],
    };
  }
  return storeItem;
}

// 订阅
function subScribe(key: string, setFuncs: React.Dispatch<any>) {
  const storeItem = store[key];
  if (!storeItem) return;
  storeItem.setFuncs.push(setFuncs);
}
// 发布
function publish(key: string, newValue: any) {
  const storeItem = store[key];
  if (!storeItem) return;
  storeItem.value = newValue;
  storeItem.setFuncs.forEach((sf) => sf(newValue));
}

// 取消订阅
function unSubScribe(key: string, setFuncs: React.Dispatch<any>) {
  const storeItem = store[key];
  if (!storeItem) return;
  storeItem.setFuncs = storeItem.setFuncs.filter((sf) => sf === setFuncs);
  if (!storeItem.setFuncs.length) {
    delete store[key];
  }
}

/**
 *  组件外设置Store的值
 * @param {string} key  store的key，必填
 */

export function getStoreValue(key: string) {
  return store[key]?.value;
}

export default function useStore<T>(key: string, defaultValue?: T) {
  const keyRef = useRef(key);
  const storeItem = getItemByKey(keyRef.current, defaultValue || {});
  const [state, setState] = useState(storeItem.value);

  useEffect(() => {
    const k = keyRef.current;
    subScribe(k, setState);
    return () => unSubScribe(k, setState);
  }, []);

  const setAndPublish = useCallback((data: T) => {
    publish(keyRef.current, data);
  }, []);
  return [state, setAndPublish];
}
