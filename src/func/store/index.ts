/**
 * localStorage管理
 * @module store
 */
import Store from "store";
const prefix = "da_";
const prefixLen = prefix.length;

/**
 * 获取存储的值
 * @param {string} key 存储值的key
 * @returns {any} 当前使用的语言对象
 * @example
 */

export function getItem<T = string>(key: string, defaultVal?: T): T {
  return Store.get(prefix + key) || defaultVal;
}
/**
 *
 * @param key 存储值的key
 * @param val
 * @returns
 */
export function setItem(key: string, val: any) {
  return Store.set(prefix + key, val);
}

export function removeItem(key: string) {
  return Store.remove(prefix + key);
}

export function clear() {
  Store.each((k: string) => {
    if (k.substr(0, prefixLen) === prefix) Store.remove(k);
  });
}
