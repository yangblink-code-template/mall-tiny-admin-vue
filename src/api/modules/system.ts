import { Account, Role, Resource, Menu } from "@/api/interface/index";
// import { PORT1 } from "@/api/config/servicePort";
import { UmsAdminParam, UmsAdmin } from "@/api/interface/ums";
import http from "@/api";

// 用户列表
export const getSysUserList = (params: Account.ReqAccountParams) => {
  return http.get(`/admin/list`, params);
};
export const setSysUserStatus = (params: { id: string; status: string }) => {
  return http.post(`/admin/updateStatus/${params.id}`, undefined, { params: { status: params.status } });
};
export const registerSysUser = (params: UmsAdminParam) => {
  return http.post(`/admin/register`, params);
};
export const deleteSysUser = (params: { id: string }) => {
  return http.post(`/admin/delete/${params.id}`);
};
export const updateSysUser = (params: UmsAdmin) => {
  return http.post(`/admin/update/${params.id}`, params);
};
export const updateSysUserRole = (params: { id: string; roleIds: Array<string>[] }) => {
  const formData = new FormData();
  formData.append("adminId", params.id);
  formData.append("roleIds", params.roleIds.join(","));
  return http.post(`/admin/role/update`, formData);
};
export const getSysUserRole = (params: { id: string }) => {
  return http.get<Role.ResRole[]>(`/admin/role/${params.id}`);
};

// 角色列表
export const getSysRoleList = (params: Account.ReqAccountParams) => {
  return http.get(`/role/list`, params);
};
export const getSysRoleListAll = () => {
  return http.get<Role.ResRole[]>(`/role/listAll`);
};
export const createSysRole = (params: Role.RoleParams) => {
  return http.post(`/role/create`, params);
};
export const deleteSysRole = (params: { id: string }) => {
  const formData = new FormData();
  formData.append("ids", params.id);
  return http.post(`/role/delete`, formData);
};
export const updateSysRole = (params: Role.RoleParams) => {
  return http.post(`/role/update/${params.id}`, params);
};
export const setSysRoleStatus = (params: { id: string; status: string }) => {
  return http.post(`/role/updateStatus/${params.id}`, undefined, { params: { status: params.status } });
};
export const listRoleMenu = (id: string) => {
  return http.get<Menu.ResMenu[]>(`/role/listMenu/${id}`);
};
export const allocRoleMenu = (params: { id: string; menuIds: string[] }) => {
  const formData = new FormData();
  formData.set("roleId", params.id);
  formData.set("menuIds", params.menuIds.join(","));
  return http.post(`/role/allocMenu`, formData);
};
// 菜单
export const getMenuTreeList = () => {
  return http.get<Menu.ResMenu[]>(`/menu/treeList`);
};
// export const getMenuListByid = params => {
//   return http.get(`/menu/treeList/${params.id}`, { pageNum: params.pageNum, pageSize: params.pageSize });
// };
export const updateMenuHidden = (params: { id: string; hidden: string }) => {
  return http.post(`/menu/updateHidden/${params.id}`, undefined, { params: { hidden: params.hidden } });
};
export const createMenu = (params: Menu.ReqMenuParams) => {
  return http.post(`/menu/create`, params);
};
export const deleteMenu = (id: number) => {
  return http.post(`/menu/delete/${id}`);
};
// 资源
export const listResourceCategory = () => {
  return http.get<Resource.ResourceCategory>(`/resourceCategory/listAll`);
};
export const listResource = (params: Resource.ReqResourceListParams) => {
  return http.get<Resource.ResourceCategory>(`/resource/list`, params);
};
