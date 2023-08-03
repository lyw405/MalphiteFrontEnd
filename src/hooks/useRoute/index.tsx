import routes, { TUmiRoute } from "dbc/config/routes";
import { createContext, useContext, useMemo } from "react";
import useGlobal, { IGlobal } from "../useGlobal";
import useSession, { ISession } from "../useSession";
import checkAuthFn from "dbc/config/authRules/checkAuth";

export declare type TRouteItem = Omit<TUmiRoute, "routes"> & {
  parent?: TRouteItem;
  name?: React.ReactNode;
  routes?: TRouteItem[];
};

export declare type TRouteMap = Record<string, TRouteItem>;
export declare type TAuthMap = Record<string, boolean>;

export interface Imenu {
  id: string;
  name?: React.ReactNode;
  icon?: string;
  items?: Imenu[];
}

export interface IRouteCtx {
  routeMap: TRouteMap;
  auth: TAuthMap;
  menu: Imenu[];
}

export interface TFnOption {
  global: IGlobal;
  session: ISession;
}

const defaultState: TRouteMap = {};

const defaultRouteMapValue = {
  routeMap: defaultState,
  auth: {},
  menu: [],
};

const RouteMapCtx = createContext<IRouteCtx>(defaultRouteMapValue);
const RouteCtx = createContext<TRouteItem | null>(null);
let routeMapCache: IRouteCtx = defaultRouteMapValue;

export function getPathPrefix() {
  const map = routeMapCache.routeMap;
  const rootPath: any = map["/"] || {};
  const { pathPrefix = "" } = rootPath;
  return pathPrefix;
}

function getRouteItem(map: TRouteMap, pathname: string): TRouteItem | null {
  const pathPrefix = getPathPrefix();
  const ppReg = new RegExp(`^${pathPrefix}/`);
  const pathArr = pathname.replace(ppReg, "").split("/");
  for (let i = 0; i < pathArr.length; i += 1) {
    const it = map[`/${pathArr.join("/")}`];
    if (it) return it;
    pathArr.pop();
  }
  return null;
}

const RouteItemProvider: React.FunctionComponent<any> = ({
  children,
  location,
}) => {
  const { routeMap } = useContext(RouteMapCtx);
  const { pathname = "" } = location;
  const value = useMemo(() => {
    const it = getRouteItem(routeMap, pathname);
    if (!it) return null;
    return it;
  }, [routeMap, pathname]);

  return <RouteCtx.Provider value={value}>{children}</RouteCtx.Provider>;
};

function toMenu(arr: TRouteItem[], auth: TAuthMap): Imenu[] {
  const out: Imenu[] = [];
  arr.forEach((el) => {
    if (!el.id) return;
    if (el.hide) return;
    if (!auth[el.rid]) return;
    const r: Imenu = {
      id: el.id,
      icon: el.icon,
      name: el.name || "",
    };
    if (el.routes) r.items = toMenu(el.routes, auth);
    out.push(r);
  });
  return out;
}

function setRouteMap(
  routes: TUmiRoute[],
  map: TRouteMap,
  parent?: TRouteItem
): TRouteItem[] {
  const m: TRouteMap = map;
  return routes.map((el) => {
    const it: TRouteItem = { ...el };
    if (el.rid) m[it.rid] = it;
    if (el.id) {
      it.name = el.id;
    }
    if (parent) it.parent = parent;
    if (it.routes) it.routes = setRouteMap(it.routes, m, it);
    return it;
  });
}

const getAuth = (routeMap: TRouteMap, option?: TFnOption): TAuthMap => {
  const auth: TAuthMap = { "/": true };
  Object.keys(routeMap).forEach((k) => {
    const route = routeMap[k];
    if (route.routes) return;
    const ok = checkAuthFn(routeMap[k].auth, option);
    if (ok) {
      let p = "";
      k.split("/")
        .filter((id) => !!id)
        .forEach((id) => {
          p = `${p}/${id}`;
          auth[p] = true;
        });
    }
  });
  return auth;
};

export const RouteProvider: React.FunctionComponent<any> = ({
  children,
  routes,
  location,
}) => {
  const [global] = useGlobal();
  const [session] = useSession();
  const defaultValue = useMemo(() => {
    const routeMap = {};
    setRouteMap(routes, routeMap);
    return { routeMap, auth: getAuth(routeMap) };
  }, [routes]);

  const value = useMemo(() => {
    const val: IRouteCtx = { ...defaultValue, menu: [] };
    val.auth = getAuth(val.routeMap, { global, session });
    const root = val.routeMap["/"];
    if (root && root.routes) {
      val.menu = toMenu(root.routes, val.auth);
    }
    routeMapCache = val;
    return val;
  }, [defaultValue, global, session]);

  return (
    <RouteMapCtx.Provider value={value}>
      <RouteItemProvider location={location}>{children}</RouteItemProvider>
    </RouteMapCtx.Provider>
  );
};

export default function useRoute(): [TRouteItem | null, TAuthMap, TRouteMap] {
  const { routeMap, auth } = useContext(RouteMapCtx);
  const it = useContext(RouteCtx);
  return [it, auth, routeMap];
}

export function getRouteByPath(pathname: string) {
  return getRouteItem(routeMapCache.routeMap, pathname);
}

export function useRouteMap(): [TRouteMap, TAuthMap] {
  const { routeMap, auth } = useContext(RouteMapCtx);
  return [routeMap, auth];
}

export function useMenu(): Imenu[] {
  const { menu } = useContext(RouteMapCtx);
  return menu;
}

export function getRouteMap(): IRouteCtx {
  return routeMapCache;
}
