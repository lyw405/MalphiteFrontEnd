// 根路由布局
import { Outlet } from "umi";

const RootLayout = (props: any) => {
  const { children } = props;
  console.log("children", children);

  let page = children;
  return <Outlet />;
};

export default RootLayout;
