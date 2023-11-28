<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <!-- <el-form-item label="角色名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="drawerProps.row!.description" placeholder="请填写描述" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否启用" prop="status">
        <el-switch v-model="drawerProps.row!.status" size="large" active-value="1" inactive-value="0"></el-switch>
      </el-form-item> -->
      <el-tree
        ref="roleTree"
        :data="drawerProps.tree"
        :props="{ label: 'title' }"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="drawerProps.checkedMenus"
      ></el-tree>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="AccountDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance, ElTree } from "element-plus";
import { Role, Menu } from "@/api/interface";
// import { listRoleMenu }  from '@/api/modules/system';
const rules = reactive({
  name: [{ required: true, message: "请填写角色名称" }],
  description: [{ required: true, message: "请填写描述" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  checkedMenus: string[];
  row: Partial<Role.ResRole>;
  tree: Menu.ResMenu[];
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  tree: [],
  checkedMenus: [],
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const roleTree = ref<InstanceType<typeof ElTree>>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const nodes = roleTree.value?.getCheckedNodes().map(node => node.id);
      await drawerProps.value.api!({ id: drawerProps.value.row.id, menuIds: nodes });
      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
