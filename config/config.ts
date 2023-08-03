import { IConfigFromPlugins } from "@/.umi/core/pluginConfig";
import { defineConfig } from "umi";
import path from "path";
import pkgInfo from "../package.json";
import getRoutes from "../src/config/routes/getUmiRoutes";

type UmiConfig = IConfigFromPlugins;

const { scopePath = "./componenets" } = pkgInfo.dbc || {};
const scopeDir = path.join(__dirname, "../", scopePath);

let config: UmiConfig = {
  outputPath: "output",
  title: false,
  alias: {
    dbc: scopeDir,
  },
  routes: getRoutes(scopeDir, "RootLayout", ["ParamLayout"]),
  //   routes: [
  //     {
  //       path: "/aasView/preface",
  //       page: "PrefacePage",
  //       routes: undefined,
  //       rid: "/preface",
  //       component:
  //         "/Users/nafek/Desktop/Malphite/frontEnd/src/pages/PrefacePage/index.tsx",
  //       wrappers: [
  //         "/Users/nafek/Desktop/Malphite/frontEnd/src/layout/ParamLayout/index.tsx",
  //       ],
  //     },
  //   ],
};
export default defineConfig(config);
