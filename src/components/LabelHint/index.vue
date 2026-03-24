<template>
  <el-tooltip :content="content" placement="top" :show-after="150">
    <span class="label-hint-icon" aria-label="字段说明">!</span>
  </el-tooltip>
</template>

<script setup>
defineProps({
  content: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.label-hint-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 4px;
  border-radius: 50%;
  background: var(--el-color-warning);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  cursor: help;
}
</style>
