<template>
  <div class="footer flx-center">
    <a target="_blank"> 2023 © {{ name }} </a>
  </div>
</template>

<script setup lang="ts">
import { SYS_NAME } from "@/config";
const name = SYS_NAME;
</script>
<style scoped lang="scss">
@import "./index.scss";
</style>
