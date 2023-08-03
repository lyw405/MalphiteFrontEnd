/**
 * 权限校验规则
 */

import { TFnOption } from "dbc/hooks/useRoute";

export type TAuthFn = (option: TFnOption) => boolean;

/**
 * 仅登录账号可见
 */

export const common: TAuthFn = ({ session }) => {
  return !!session.isLogin;
};

/**
 * 未登录可用
 */

export const noLogin: TAuthFn = ({ session }) => {
  return !session.isLogin;
};
