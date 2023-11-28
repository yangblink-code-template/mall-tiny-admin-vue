<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}用户`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <!-- <el-form-item label="账户" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写账户" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="分配角色" prop="roles">
        <el-select v-model="drawerProps.row!.roles" multiple>
          <el-option v-for="item in drawerProps.allRoles" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false"> 取消 </el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit"> 确定 </el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="AccountDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Role } from "@/api/interface";
import { getSysUserRole } from "@/api/modules/system";

const rules = reactive({
  roles: [{ required: true, message: "请填写账户" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  allRoles: Array<Role.ResRole>;
  // row: Partial<Role.RoleSelect>;
  row: Partial<Role.RoleSelect>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  allRoles: [],
  row: {}
});
const getRoles = async (id: string) => {
  const { data } = await getSysUserRole({ id });
  const list = data.filter(role => role).map((role: Role.ResRole) => role.id);
  drawerProps.value.row.roles = list;
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  // getRoles(params.row.id);
  drawerProps.value = params;
  getRoles(params.row!.id ?? "");
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      // await drawerProps.value.api!(drawerProps.value.row);
      await drawerProps.value.api!({ id: drawerProps.value.row.id, roleIds: drawerProps.value.row.roles });
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
