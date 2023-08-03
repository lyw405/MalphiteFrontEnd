import { IRoute } from "umi";
import path from "path";
import fs from "fs";
import routes, { TRoute, TUmiRoute } from "./index";

const pathPrefix = "/lyw";

function getIcon(id: string) {
  const iconFile = path.join(__dirname, `icon/${id}/.svg`);
  if (fs.existsSync(iconFile))
    return fs.readFileSync(iconFile).toString().replace(/\n/g, "");
  return undefined;
}

// 递归格式化路由配置
function toRoute(
  arr: TRoute[],
  prefix: string,
  pageDir: string,
  wrappers: string[]
) {
  const out: TUmiRoute[] = [];
  arr.forEach((el) => {
    const key = el.id || el.path;
    if (!key) throw new Error(`Route: 缺少id或path，${JSON.stringify(el)}`);
    const rp = `${prefix}/${key}`;
    const r: TUmiRoute = { ...el, routes: undefined, rid: rp };
    r.path = `${pathPrefix}${rp}`;
    if (el.id) r.icon = getIcon(el.id);
    if (el.routes) {
      r.routes = toRoute(el.routes, rp, pageDir, wrappers);
      if (r.routes.length === 0) return;
    } else {
      if (el.page) {
        r.component = `${pageDir}/${r.page}/index.tsx`;
        //  r.wrappers = wrappers;
      }
    }
    out.push(r);
  });
  return out;
}

function getRoutes(
  dbcPath: string,
  layout: string = "RootLayout",
  wrappers: string[] = []
) {
  const pageDir = `${dbcPath}/pages`;
  const nwrappers = wrappers.map((it) => `${dbcPath}/layouts/${it}/index.tsx`);
  const umiRoutes = toRoute(routes, "", pageDir, nwrappers);

  // return umiRouts;

  return [
    {
      rid: "/",
      path: "/",
      pathPrefix,
      component: `${dbcPath}/layouts/${layout}/index.tsx`,
      routes: umiRoutes,
    },
  ];
}

export default getRoutes;
