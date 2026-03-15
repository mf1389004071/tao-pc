<template>
  <el-select
    :model-value="modelValue"
    placeholder="请选择人员"
    filterable
    remote
    clearable
    :remote-method="remoteMethod"
    :loading="loading"
    style="width: 100%"
    v-bind="$attrs"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script setup>
import { listUser } from '@/api/system/user';

defineOptions({ name: 'UserSelect' });

import { onMounted } from 'vue';

const props = defineProps({
  modelValue: { type: [Number, String], default: null }
});

const emit = defineEmits(['update:modelValue']);

const options = ref([]);
const loading = ref(false);

function remoteMethod(query) {
  if (!query) {
    // 即使没有输入查询，也加载一些默认的用户选项
    loadDefaultUsers();
    return;
  }
  loading.value = true;
  listUser({ userName: query, pageNum: 1, pageSize: 50 })
    .then((res) => {
      const rows = res.rows || [];
      options.value = rows.map((item) => ({
        value: item.userId,
        label: (item.nickName || item.userName || '') + (item.userId ? ` (${item.userId})` : '')
      }));
    })
    .finally(() => {
      loading.value = false;
    });
}

function loadDefaultUsers() {
  loading.value = true;
  // 加载一些默认的用户列表，比如前50个用户
  listUser({ pageNum: 1, pageSize: 50 })
    .then((res) => {
      const rows = res.rows || [];
      options.value = rows.map((item) => ({
        value: item.userId,
        label: (item.nickName || '') + (item.userName ? ` / ${item.userName}` : '') + (item.userId ? ` / ${item.userId}` : '')
      }));
    })
    .finally(() => {
      loading.value = false;
    });
}

// 组件挂载时加载默认用户列表
onMounted(() => {
  loadDefaultUsers();
});

// 供父组件设置当前选中项的 label（如回显时仅有一份 id）
function setOption(label, value) {
  const v = value ?? props.modelValue;
  if (v != null && !options.value.some((o) => o.value === v)) {
    options.value = [{ value: v, label: label || '用户' + v }];
  }
}

defineExpose({ setOption });
</script>
