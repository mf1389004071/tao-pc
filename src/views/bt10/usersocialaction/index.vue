<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="88px">
        <el-form-item label="主页用户" prop="targetUserId">
          <UserSelect v-model="queryParams.targetUserId" placeholder="请选择主页用户" clearable filterable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="操作人" prop="actorUserId">
          <UserSelect v-model="queryParams.actorUserId" placeholder="请选择操作人" clearable filterable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="动作类型" prop="actionType">
          <el-select v-model="queryParams.actionType" placeholder="请选择" clearable filterable style="width: 160px">
            <el-option v-for="item in socialActionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="请选择状态" clearable filterable style="width: 160px">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="never" class="mt10">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bt10:usersocialaction:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['bt10:usersocialaction:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bt10:usersocialaction:remove']">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bt10:usersocialaction:export']">导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="usersocialactionList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" min-width="160" show-overflow-tooltip />
        <el-table-column label="主页用户" align="center" prop="targetUserId" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作人" align="center" prop="actorUserId" min-width="160" show-overflow-tooltip />
        <el-table-column label="动作类型" align="center" prop="actionType" width="120">
          <template #default="scope">
            {{ getOptionLabel(socialActionTypeOptions, scope.row.actionType) }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="100">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:usersocialaction:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:usersocialaction:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <el-dialog :title="title" v-model="open" width="520px" append-to-body>
      <el-form ref="usersocialactionRef" :model="form" :rules="rules" label-width="88px">
        <el-form-item label="主页用户" prop="targetUserId">
          <UserSelect v-model="form.targetUserId" placeholder="请选择主页用户" />
        </el-form-item>
        <el-form-item label="操作人" prop="actorUserId">
          <UserSelect v-model="form.actorUserId" placeholder="请选择操作人" />
        </el-form-item>
        <el-form-item label="动作类型" prop="actionType">
          <el-select v-model="form.actionType" placeholder="请选择" clearable filterable style="width: 100%">
            <el-option v-for="item in socialActionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态" clearable filterable style="width: 100%">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Usersocialaction">
import { listUsersocialaction, getUsersocialaction, delUsersocialaction, addUsersocialaction, updateUsersocialaction } from '@/api/bt10/usersocialaction'
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from '@/utils/Bt10Helper'

const { proxy } = getCurrentInstance()

/** 与 C 端用户主页社交一致：LIKE / COLLECT / SHARE */
const socialActionTypeOptions = [
  { value: 'LIKE', label: '点赞' },
  { value: 'COLLECT', label: '收藏' },
  { value: 'SHARE', label: '分享' }
]

const usersocialactionList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref('')

const statusOptions = ref([])

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    targetUserId: null,
    actorUserId: null,
    actionType: null,
    status: null
  },
  rules: {
    targetUserId: [{ required: true, message: '主页用户不能为空', trigger: 'change' }],
    actorUserId: [{ required: true, message: '操作人不能为空', trigger: 'change' }],
    actionType: [{ required: true, message: '动作类型不能为空', trigger: 'change' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listUsersocialaction(queryParams.value).then(response => {
    usersocialactionList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

function getOptionLabel(options, value) {
  if (value == null || value === '') return value
  return options.find(item => item.value === value)?.label ?? value
}

function loadBt10Enums() {
  statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS)
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS)
  })
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    id: null,
    targetUserId: null,
    actorUserId: null,
    actionType: null,
    status: null,
    remark: null
  }
  proxy.resetForm('usersocialactionRef')
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  proxy.resetForm('queryRef')
  handleQuery()
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length !== 1
  multiple.value = !selection.length
}

function handleAdd() {
  reset()
  open.value = true
  title.value = '添加用户主页社交动作'
}

function handleUpdate(row) {
  reset()
  const _id = row?.id ?? ids.value?.[0]
  getUsersocialaction(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = '修改用户主页社交动作'
  })
}

function stringifyUserIds(f) {
  ;['targetUserId', 'actorUserId'].forEach(k => {
    if (f[k] != null && f[k] !== '') f[k] = String(f[k])
  })
}

function submitForm() {
  proxy.$refs['usersocialactionRef'].validate(valid => {
    if (!valid) return
    const payload = { ...form.value }
    stringifyUserIds(payload)
    if (payload.actionType) {
      payload.actionType = String(payload.actionType).trim().toUpperCase()
    }
    if (payload.id != null) {
      updateUsersocialaction(payload).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        open.value = false
        getList()
      })
    } else {
      addUsersocialaction(payload).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        open.value = false
        getList()
      })
    }
  })
}

function handleDelete(row) {
  const _ids = row?.id ?? ids.value
  proxy.$modal.confirm('是否确认删除用户主页社交动作编号为"' + _ids + '"的数据项？').then(function () {
    return delUsersocialaction(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

function handleExport() {
  proxy.download(
    'bt10/usersocialaction/export',
    { ...queryParams.value },
    `usersocialaction_${new Date().getTime()}.xlsx`
  )
}

loadBt10Enums().finally(() => {
  getList()
})
</script>
