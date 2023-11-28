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
      <el-form-item label="名称" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="展示名称" prop="title">
        <el-input v-model="drawerProps.row!.title" placeholder="请填写展示名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="组件路径" prop="component">
        <el-input v-model="drawerProps.row!.component" placeholder="请填写组件路径" clearable></el-input>
      </el-form-item>
      <el-form-item label="重定向" prop="redirect">
        <el-input v-model="drawerProps.row!.redirect" placeholder="请填写重定向" clearable></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-input v-model="drawerProps.row!.icon" placeholder="请填写图标" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否隐藏" prop="hidden">
        <el-switch v-model="drawerProps.row!.hidden" size="large" active-value="1" inactive-value="0"></el-switch>
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
import { Menu } from "@/api/interface";

const rules = reactive({
  name: [{ required: true, message: "请填写name" }],
  title: [{ required: true, message: "请填写title" }],
  component: [{ required: true, message: "请填写component" }],
  redirect: [{ required: true, message: "请填写redirect" }],
  icon: [{ required: true, message: "请填写icon" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Menu.ResMenu>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
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
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
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
