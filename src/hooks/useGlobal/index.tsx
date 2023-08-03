import { getType } from "dbc/untils/getType";
import { createContext, useContext, useMemo, useReducer } from "react";

type TUserSecurity = {
  loginTimeOut: string;
  useVerify: string;
  adminDeny: string;
  pwdErrorTimes: string;
  pwdLockTime: string;
  pwdErrorReset: string;
  pwdStrong: string;
  pwdLifeTime: string;
  qrcodeTime: 0;
};

type TModelInfo = {
  name: string;
  version: string;
};

export interface IGlobal {
  ipsname: string;
  model: string;
  sysmodel: string;
  serialNumber: string;
  product: string;
  version: string;
  customer: string;
  licType: string;
  expireTime: string;
  warrantyTime: string;
  hasLoad: boolean;
  userSecurity: TUserSecurity;
  models: TModelInfo[];
  license: any;
  oemConfig: any;
  isCsrfAttact: boolean;
}

export interface IGlobalCtx {
  global: IGlobal;
  loadGlobal: () => void;
}

const defaultState: IGlobal = {
  ipsname: "",
  model: "",
  sysmodel: "",
  serialNumber: "",
  product: "",
  version: "",
  customer: "",
  licType: "",
  expireTime: "",
  warrantyTime: "",
  hasLoad: false,
  userSecurity: {
    loginTimeOut: "5",
    useVerify: "0",
    adminDeny: "0",
    pwdErrorTimes: "5",
    pwdLockTime: "30",
    pwdErrorReset: "5",
    pwdStrong: "0",
    pwdLifeTime: "0",
    qrcodeTime: 0,
  },
  models: [],
  license: null,
  oemConfig: {},
  isCsrfAttact: false,
};

const GlobalCtx = createContext<IGlobalCtx>({
  global: defaultState,
  loadGlobal: () => {},
});

function reducer(state: IGlobal, nextState: any) {
  const ns: any = { ...state };
  let data = nextState;
  if (data === null) data = defaultState;
  if (data) {
    Object.keys(defaultState).forEach((k) => {
      if (getType(data[k]) !== "Undefined") ns[k] = data[k];
    });
  }
  ns.hasLoad = true;
  return ns;
}

export const globalStore = {
  global: {},
  loadGlobal(): void {
    throw new Error("Function not implemented");
  },
};

export const Provider4Global: React.FunctionComponent<any> = ({ children }) => {
  const [global, setGlobal] = useReducer(reducer, defaultState);

  const { call } = { call: () => {} };

  const value = useMemo(
    () => ({
      global,
      loadGlobal: call,
    }),
    [global, call]
  );

  return <GlobalCtx.Provider value={value}>{children}</GlobalCtx.Provider>;
};

export default function useGlobal(): [IGlobal, (nextState?: any) => void] {
  const { global, loadGlobal } = useContext(GlobalCtx);
  return [global, loadGlobal];
}
