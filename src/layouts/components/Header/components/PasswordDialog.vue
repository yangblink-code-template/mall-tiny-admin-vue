<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="500px" draggable @close="closeDialog">
    <el-form ref="passwordForm" :model="passwordData" :rules="loginRules" label-width="120px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="passwordData.oldPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="passwordData.newPassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPassword">
        <el-input v-model="passwordData.confirmPassword" type="password"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { changePassword, logoutApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { FormInstance } from "element-plus";
import { useRouter } from "vue-router";
import { LOGIN_URL } from "@/config";

const router = useRouter();
const userStore = useUserStore();
function validateConfirmPassword(rule: any, value: string, callback: any) {
  if (value !== passwordData.newPassword) {
    callback(new Error("确认新密码与新密码不一致"));
  } else {
    callback();
  }
}
const loginRules = reactive({
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请输入确认新密码", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" }
  ]
});
const passwordData = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});
const closeDialog = () => {
  passwordData.oldPassword = "";
  passwordData.newPassword = "";
  passwordData.confirmPassword = "";
};
const dialogVisible = ref(false);
const openDialog = () => {
  dialogVisible.value = true;
};

const passwordForm = ref<FormInstance>();
const handleSubmit = () => {
  passwordForm.value!.validate(async valid => {
    if (!valid) return;
    try {
      const param = {
        username: userStore.userInfo.name,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      };
      await changePassword(param);
      // 1.执行退出登录接口
      await logoutApi();
      // 2.清除 Token
      userStore.setToken("");
      // 3.重定向到登陆页
      router.replace(LOGIN_URL);
    } catch (e) {
      console.error(e);
    }
  });
};

defineExpose({ openDialog });
</script>
