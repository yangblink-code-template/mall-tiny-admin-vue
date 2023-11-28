// CRUD模版代码，新建 直接复制 替换对应tpl
import { Tpl } from "@/api/interface/index";
import http from "@/api";

export const getTplList = (param: Tpl.TplListParams) => {
  return http.get("/Tpl/list", param);
};
export const createTpl = (param: Tpl.Tpl) => {
  return http.post("/Tpl/create", param);
};
export const updateTpl = (param: Tpl.Tpl) => {
  return http.get("/Tpl/update", param);
};
export const deleteTpl = (id: number) => {
  return http.post(`/Tpl/delete/${id}`);
};
