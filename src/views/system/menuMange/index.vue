<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="id"
      :indent="30"
      :columns="columns"
      :data="menuData"
      :pagination="false"
      :request-api="getTableList"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button v-auth="'add'" type="primary" :icon="CirclePlus" @click="openDrawer('新增')"> 新建菜单 </el-button>
      </template>
      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <!-- <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)"> 查看 </el-button> -->
        <!-- <el-button type="primary" link :icon="EditPen" @click="openSelectRoleDrawer('编辑', scope.row)"> 分配角色 </el-button> -->
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <!-- <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)"> 重置密码 </el-button> -->
        <el-button type="primary" link :icon="Delete" @click="deleteAccount(scope.row)"> 删除 </el-button>
      </template>
    </ProTable>
    <AccountDrawer ref="drawerRef" />
    <!-- <SelectRoleDrawer ref="selectRoleDrawerRef" /> -->
    <!-- <ImportExcel ref="dialogRef" /> -->
  </div>
</template>

<script setup lang="tsx" name="menuMange">
import { ref, onMounted } from "vue";
import { Menu } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
// import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/ProTable/index.vue";
// import SelectRoleDrawer from "./SelectRoleDrawer.vue";
import AccountDrawer from "./AccountDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete, EditPen } from "@element-plus/icons-vue";
// import { getUserStatus } from "@/api/modules/user";
import { getMenuTreeList, createMenu, deleteMenu, updateSysUser } from "@/api/modules/system";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref<ProTableInstance>();

const menuData = ref<Menu.ResMenu[]>([]);
onMounted(async () => {
  await getTableList();
});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，那么你可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
// const dataCallback = (data: any) => {
//   return {
//     list: data.list,
//     total: data.total,
//     pageNum: data.pageNum,
//     pageSize: data.pageSize
//   };
// };

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = async () => {
  const { data } = await getMenuTreeList();
  menuData.value = data;
  // menuData.value = data;
  // let newParams = JSON.parse(JSON.stringify(params));
  // newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  // newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  // delete newParams.createTime;
};

// 页面按钮权限（按钮权限既可以使用 hooks，也可以直接使用 v-auth 指令，指令适合直接绑定在按钮上，hooks 适合根据按钮权限显示不同的内容）
// const { BUTTONS } = useAuthButtons();

// 表格配置项
const columns: ColumnProps<Menu.ResMenu>[] = [
  { type: "index", label: "#", width: 80 },
  {
    prop: "title",
    width: 150,
    label: "名称"
  },
  {
    prop: "level",
    label: "级数"
  },
  {
    prop: "icon",
    label: "图标"
  },
  {
    prop: "sort",
    label: "排序"
  },
  // {
  //   prop: "hidden",
  //   label: "是否隐藏",
  //   enum: getUserStatus,
  //   // search: { el: "tree-select", props: { filterable: true } },
  //   fieldNames: { label: "userLabel", value: "userStatus" },
  //   render: scope => {
  //     return (
  //       <>
  //         {BUTTONS.value.status ? (
  //           <el-switch
  //             model-value={scope.row.hidden}
  //             active-text={scope.row.hidden ? "隐藏" : "显示"}
  //             active-value={1}
  //             inactive-value={0}
  //             onClick={() => changeStatus(scope.row)}
  //           />
  //         ) : (
  //           <el-tag type={scope.row.hidden ? "success" : "danger"}>{scope.row.hidden ? "启用" : "禁用"}</el-tag>
  //         )}
  //       </>
  //     );
  //   }
  // },
  { prop: "operation", label: "操作", fixed: "right", width: 330 }
];

// 删除用户信息
const deleteAccount = async (params: Menu.ResMenu) => {
  await useHandleData(deleteMenu, params.id, `删除菜单【${params.title}】`);
  proTable.value?.getTableList();
};

// 切换用户状态
// const changeStatus = async (row: Menu.ResMenu) => {
//   await useHandleData(updateMenuHidden, { id: row.id, hidden: row.hidden == 1 ? 0 : 1 }, `修改【${row.title}】显示状态`);
//   proTable.value?.getTableList();
// };

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof AccountDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Menu.ResMenu> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? createMenu : title === "编辑" ? updateSysUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
