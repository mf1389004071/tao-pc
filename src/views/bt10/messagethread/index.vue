<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="100px">
        <el-form-item prop="userAId">
          <template #label>
            参与者A
            <LabelHint content="user_id 较小一侧" />
          </template>
          <UserSelect v-model="queryParams.userAId" placeholder="请选择用户" clearable filterable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item prop="userBId">
          <template #label>
            参与者B
            <LabelHint content="user_id 较大一侧" />
          </template>
          <UserSelect v-model="queryParams.userBId" placeholder="请选择用户" clearable filterable @keyup.enter="handleQuery" />
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
          <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bt10:messagethread:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['bt10:messagethread:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bt10:messagethread:remove']">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bt10:messagethread:export']">导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="messagethreadList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" min-width="160" show-overflow-tooltip />
        <el-table-column label="参与者A" align="center" prop="userAId" min-width="160" show-overflow-tooltip />
        <el-table-column label="参与者B" align="center" prop="userBId" min-width="160" show-overflow-tooltip />
        <el-table-column label="最后消息摘要" align="center" prop="lastMessagePreview" min-width="200" show-overflow-tooltip />
        <el-table-column label="最后消息时间" align="center" prop="lastMessageTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastMessageTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="A 未读" align="center" prop="aUnreadCount" width="88" />
        <el-table-column label="B 未读" align="center" prop="bUnreadCount" width="88" />
        <el-table-column label="状态" align="center" prop="status" width="100">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:messagethread:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:messagethread:remove']">删除</el-button>
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

    <el-dialog :title="title" v-model="open" width="560px" append-to-body>
      <el-form ref="messagethreadRef" :model="form" :rules="rules" label-width="112px">
        <el-form-item prop="userAId">
          <template #label>
            参与者A
            <LabelHint content="user_id 较小一侧" />
          </template>
          <UserSelect v-model="form.userAId" placeholder="请选择用户" />
        </el-form-item>
        <el-form-item prop="userBId">
          <template #label>
            参与者B
            <LabelHint content="user_id 较大一侧" />
          </template>
          <UserSelect v-model="form.userBId" placeholder="请选择用户" />
        </el-form-item>
        <el-form-item label="最后消息摘要" prop="lastMessagePreview">
          <el-input v-model="form.lastMessagePreview" type="textarea" :rows="2" placeholder="可选" />
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

<script setup name="Messagethread">
import LabelHint from '@/components/LabelHint'
import { listMessagethread, getMessagethread, delMessagethread, addMessagethread, updateMessagethread } from '@/api/bt10/messagethread'
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from '@/utils/Bt10Helper'

const { proxy } = getCurrentInstance()

const messagethreadList = ref([])
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
    userAId: null,
    userBId: null,
    status: null
  },
  rules: {
    userAId: [{ required: true, message: '参与者A不能为空', trigger: 'change' }],
    userBId: [{ required: true, message: '参与者B不能为空', trigger: 'change' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listMessagethread(queryParams.value).then(response => {
    messagethreadList.value = response.rows
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

function normalizeThreadUsers(f) {
  const a = f.userAId
  const b = f.userBId
  if (a == null || b == null || a === '' || b === '') return
  const sa = String(a).trim()
  const sb = String(b).trim()
  if (sa === sb) return
  try {
    if (BigInt(sa) < BigInt(sb)) {
      f.userAId = sa
      f.userBId = sb
    } else {
      f.userAId = sb
      f.userBId = sa
    }
  } catch {
    /* 保持原值 */
  }
}

function cancel() {
  open.value = false
  reset()
}

function reset() {
  form.value = {
    id: null,
    userAId: null,
    userBId: null,
    lastMessageId: null,
    lastMessageTime: null,
    lastMessagePreview: null,
    aUnreadCount: null,
    bUnreadCount: null,
    status: null,
    remark: null
  }
  proxy.resetForm('messagethreadRef')
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
  title.value = '添加私信会话'
}

function handleUpdate(row) {
  reset()
  const _id = row?.id ?? ids.value?.[0]
  getMessagethread(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = '修改私信会话'
  })
}

function stringifyIds(f) {
  const keys = ['userAId', 'userBId', 'lastMessageId']
  keys.forEach(k => {
    if (f[k] != null && f[k] !== '') f[k] = String(f[k])
  })
}

function submitForm() {
  proxy.$refs['messagethreadRef'].validate(valid => {
    if (!valid) return
    const payload = { ...form.value }
    normalizeThreadUsers(payload)
    stringifyIds(payload)
    if (payload.id != null) {
      updateMessagethread(payload).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        open.value = false
        getList()
      })
    } else {
      addMessagethread(payload).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        open.value = false
        getList()
      })
    }
  })
}

function handleDelete(row) {
  const _ids = row?.id ?? ids.value
  proxy.$modal.confirm('是否确认删除私信会话编号为"' + _ids + '"的数据项？').then(function () {
    return delMessagethread(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

function handleExport() {
  proxy.download(
    'bt10/messagethread/export',
    { ...queryParams.value },
    `messagethread_${new Date().getTime()}.xlsx`
  )
}

loadBt10Enums().finally(() => {
  getList()
})
</script>
