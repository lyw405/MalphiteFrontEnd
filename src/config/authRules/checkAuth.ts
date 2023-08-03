import * as authRules from "dbc/config/authRules";
import { TAuthFn } from "dbc/config/authRules";
import { TFnOption } from "dbc/hooks/useRoute";

const rules: Record<string, TAuthFn> = authRules;

/**
 * 根据权限配置检查权限
 */

function checkAuthFn(auth: string[] | undefined, option?: TFnOption): boolean {
  if (!auth) return true;
  if (!option) return false;

  const { roleId, roleAuths = [] } = option.session || {};
  const whiteAuth = [];
  // 校验”！“开头的黑名单
  for (let i = 0; i < auth.length; i += 1) {
    const el = auth[i];
    if (el.substring(0, 1) === "!") {
      const key = el.substring(1);
      if (roleAuths.includes(key)) return false;
      const rfn = rules[key];
      if (rfn && rfn(option) === true) return false;
    } else {
      whiteAuth.push(el);
    }
  }
  if (roleId === "superAdmin") return true;
  return whiteAuth.some((el) => {
    if (roleAuths.includes(el)) return true;
    const rfn = rules[el];
    if (rfn) return rfn(option);
    return false;
  });
}

export default checkAuthFn;
