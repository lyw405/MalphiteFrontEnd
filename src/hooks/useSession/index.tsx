import { getType } from "dbc/untils/getType";
import React, {
  createContext,
  useReducer,
  type Dispatch,
  useCallback,
  useMemo,
  memo,
  useContext,
} from "react";

export interface ISession {
  userId: string;
  username: string;
  loginType: string;
  roleId: string;
  roleName: string;
  roleAuths: string;
  isFirstLogin: boolean;
  pwdExpire: boolean;
  pwdExpireTime: number;
  isLogin?: boolean;
  isCsrfAttack?: boolean;
  hasLoad?: boolean;
  viewConfig: {
    hideTopMenu?: boolean;
  };
  appConfig: {
    pdfReport?: boolean;
  };
}

export interface ISessionCtx {
  session: ISession;
  setSession: Dispatch<any>;
}

/**
 * 默认配置
 */

const defaultState: ISession = {
  userId: "",
  username: "",
  loginType: "",
  roleId: "",
  roleName: "",
  roleAuths: "",
  isFirstLogin: false,
  pwdExpire: false,
  pwdExpireTime: 0,
  isLogin: false,
  isCsrfAttack: false,
  hasLoad: false,
  viewConfig: {
    hideTopMenu: false,
  },
  appConfig: {
    pdfReport: true,
  },
};

const defaultSessStore: ISessionCtx = {
  session: defaultState,
  setSession: () => {},
};

const SessionCtx = createContext<ISessionCtx>(defaultSessStore);

export const sessStore: ISessionCtx = {
  ...defaultSessStore,
};

window.DBONEAASSession = defaultState;

const reducer = (state: ISession, nextState: any) => {
  const ns: any = { ...state };
  let data = nextState;
  if (data === null) data = defaultState;
  if (data) {
    Object.keys(defaultState).forEach((k) => {
      const vt = getType(data[k]);
      if (vt === "Object") {
        ns[k] = { ...ns[k], ...data[k] };
      } else if (vt !== "Undefined") {
        ns[k] = data[k];
      }
    });
  }
  ns.isLogin = !!ns.userId;
  ns.hasLoad = true;
  return ns;
};

const Provider4Sess: React.FunctionComponent<any> = ({ children }) => {
  const [session, setSession] = useReducer(reducer, defaultState);

  /**
   *  这里对session进行请求查询
   */

  const setFn = useCallback(
    (d: any) => {
      if (typeof d === "undefined") {
        /**
         * 对session进行查询
         */
      } else {
        setSession(d);
      }
    },
    [setSession]
  );
  const value = useMemo(
    () => ({
      session,
      setSession: setFn,
    }),
    [session, setSession]
  );

  sessStore.session = value.session;
  sessStore.setSession = value.setSession;
  window.DBONEAASSession = value.session;
  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
};

export const SessProvider = memo(
  Provider4Sess,
  (p, n) => p.children === n.children
);

/**
 * 读写session配置
 */

export default function useSession(): [
  ISession,
  (sess?: ISession | null) => void
] {
  const [session, setSession] = useContext(SessionCtx);
  return [session, setSession];
}
