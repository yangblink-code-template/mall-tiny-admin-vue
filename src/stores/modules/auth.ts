import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getAuthButtonListApi, getAuthMenuListApi } from "@/api/modules/login";
import { getFlatMenuList, getShowMenuList, getAllBreadcrumbList } from "@/utils";
import arrayToTree from "array-to-tree";
import { useUserStore } from "@/stores/modules/user";

export const useAuthStore = defineStore({
  id: "geeker-auth",
  state: (): AuthState => ({
    // 按钮权限列表
    authButtonList: {},
    // 菜单权限列表
    authMenuList: [],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: ""
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: state => state.authButtonList,
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: state => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList)
  },
  actions: {
    // Get AuthButtonList
    async getAuthButtonList() {
      const { data } = await getAuthButtonListApi();
      // const { menus } = data;
      this.authButtonList = data;
    },
    // Get AuthMenuList
    async getAuthMenuList() {
      const { data } = await getAuthMenuListApi();
      const { menus, username } = data;
      // const userInfo = { name: username };
      const userStore = useUserStore();
      userStore.setUserInfo({ name: username });
      let list = menus
        .filter(menu => {
          return menu.component;
        })
        .map(menu => {
          return {
            component: menu.component,
            path: menu.component,
            name: menu.name,
            parentId: menu.parentId,
            id: menu.id,
            redirect: menu.redirect ? menu.redirect : undefined,
            meta: {
              icon: menu.icon,
              title: menu.title,
              isAffix: true,
              isFull: false,
              isHide: !!menu.hidden,
              isKeepAlive: true
            }
          };
        });
      list = arrayToTree(list, {
        parentProperty: "parentId"
      });
      console.log("🚀 ~ file: auth.ts:66 ~ getAuthMenuList ~ list:", list);
      this.authMenuList = list;
    },
    // Set RouteName
    async setRouteName(name: string) {
      this.routeName = name;
    }
  }
});
