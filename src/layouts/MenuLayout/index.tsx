// 根路由布局
import { Layout } from "antd";
import Scrollbar from "dbc/comp/Scrollbar";
import { getItem } from "dbc/func/store";
import useGlobal from "dbc/hooks/useGlobal";
import useRoute from "dbc/hooks/useRoute";
import useSession from "dbc/hooks/useSession";
import { useState } from "react";
import { Outlet } from "umi";

const collapsedKey = "menu_collapsed";
const { Header, Sider, Content } = Layout;

const MenuLayout = (props: any) => {
  const { children } = props;
  const [route] = useRoute();
  const [global] = useGlobal();
  const [collapsed, setCollapsed] = useState(getItem(collapsedKey, fasle));
  const [sess] = useSession();
  const hideTopMenu = sess?.viewConfig?.hideTopMenu === true;

  if (route && route.noLayout) return children;

  let page = children;
  return (
    <Layout>
      {!hideTopMenu && <Header id="appHeader">{/* <TopMenu /> */}</Header>}
      <Layout>
        <Sider>{/* <Scrollbar>{(sb) => <LeftMenu />}</Scrollbar> */}</Sider>
      </Layout>
    </Layout>
  );
};

export default MenuLayout;
