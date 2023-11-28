<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <!-- <template #tableHeader>
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')"> 新增角色 </el-button>
      </template> -->
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- usernameHeader -->
      <!-- <template #usernameHeader="scope">
        <el-button type="primary" @click="ElMessage.success('我是通过作用域插槽渲染的表头')">
          {{ scope.column.label }}
        </el-button>
      </template> -->
      <!-- 表格操作 -->
      <template #operation="scope">
        <!-- <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)"> 查看 </el-button> -->
        <!-- <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button> -->
        <!-- <el-button type="primary" link :icon="EditPen" @click="openRoleMenuList('菜单', scope.row)"> 分配菜单 </el-button> -->
        <!-- <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)"> 重置密码 </el-button> -->
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <!-- <RoleDrawer ref="drawerRef" /> -->
    <!-- <RoleMenuList ref="roleMenuList" /> -->
    <!-- <ImportExcel ref="dialogRef" /> -->
  </div>
</template>

<script setup lang="tsx" name="resourceManage">
import { ref, reactive } from "vue";
// import { useRouter } from "vue-router";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
// import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
// import { ElMessageBox } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
// import RoleDrawer from "./RoleDrawer.vue";
// import RoleMenuList from "./RoleMenuList.vue";
// import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Delete } from "@element-plus/icons-vue";
import { getUserStatus } from "@/api/modules/user";
import { listResource, setSysRoleStatus, deleteSysRole } from "@/api/modules/system";

// const router = useRouter();

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total,
    pageNum: data.pageNum,
    pageSize: data.pageSize
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  // newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  // newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  // delete newParams.createTime;
  return listResource(newParams);
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns: ColumnProps<User.ResUserList>[] = [
  { type: "index", label: "编号", width: 80 },
  {
    prop: "name",
    label: "资源名称"
  },
  {
    prop: "url",
    label: "资源路径"
  },
  {
    prop: "description",
    label: "描述"
  },
  {
    prop: "createTime",
    label: "添加时间",
    width: 180
  },
  {
    prop: "status",
    label: "角色状态",
    enum: getUserStatus,
    // search: { el: "tree-select", props: { filterable: true } },
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: scope => {
      return (
        <>
          {BUTTONS.value.status ? (
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          ) : (
            <el-tag type={scope.row.status ? "success" : "danger"}>{scope.row.status ? "启用" : "禁用"}</el-tag>
          )}
        </>
      );
    }
  },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
];

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteSysRole, { id: params.id }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 重置用户密码
// const resetPass = async (params: User.ResUserList) => {
//   await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.username}】用户密码`);
//   proTable.value?.getTableList();
// };

// 切换用户状态
const changeStatus = async (row: User.ResUserList) => {
  await useHandleData(setSysRoleStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.username}】用户状态`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
// const drawerRef = ref<InstanceType<typeof RoleDrawer> | null>(null);
// const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
//   const params = {
//     title,
//     isView: title === "查看",
//     row: { ...row },
//     api: title === "新增" ? createSysRole : title === "编辑" ? updateSysRole : undefined,
//     getTableList: proTable.value?.getTableList
//   };
//   drawerRef.value?.acceptParams(params);
// };

// const roleMenuList = ref<InstanceType<typeof RoleDrawer> | null>(null);
// const openRoleMenuList = async (title: string, row: User.ResUserList) => {
//   const { data: tree } = await getMenuTreeList();
//   const { data: menus } = await listRoleMenu(row.id);
//   const checkMenus = menus.map(menu => menu.id);
//   console.log("🚀 ~ file: index.vue:189 ~ openRoleMenuList ~ checkMenus:", checkMenus);
//   const params = {
//     title,
//     isView: title === "查看",
//     row: { ...row, tree, menus: checkMenus },
//     api: allocRoleMenu,
//     getTableList: proTable.value?.getTableList
//   };
//   roleMenuList.value?.acceptParams(params);
// };
</script>
