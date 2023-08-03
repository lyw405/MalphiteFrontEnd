export type TRoute = {
  /** 菜单ID，用于国际化文案，icon等关联，全局唯一;不是菜单时请使用path，如登录页*/
  id?: string;
  /**路径，如果有id时可以不配*/
  path?: string;
  /** 访问页面需要的权限，存在子路由时不需要设置*/
  auth?: string[];
  /**图标配置，如不配置会自动到icons目录下查找与id一致的文件*/
  icon?: string;
  /**不在菜单中显示 */
  hide?: boolean;
  /**不显示顶部和左侧菜单 */
  noLayout?: boolean;
  /**不通过url传参*/
  noParams?: boolean;
  /**没有页头 */
  noHeader?: boolean;
  /**菜单对应的页面组件名称*/
  page?: string;
  /**页面内容不显示边框 */
  noBorder?: boolean;
  /** 子路由 */
  routes?: TRoute[];
  /**微前端的子应用名*/
  microApp?: string;
};

export type TUmiRoute = Omit<TRoute, "routes"> & {
  rid: string;
  routes?: TUmiRoute[];
  component?: string;
  wrappers?: string[];
};

const routes: TRoute[] = [
  {
    id: "/",
    page: "PrefacePage",
  },
  {
    id: "preface",
    page: "PrefacePage",
  },
];

export default routes;
