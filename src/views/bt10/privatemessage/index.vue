<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="88px">
        <el-form-item label="会话" prop="threadId">
          <el-input v-model="queryParams.threadId" placeholder="会话主键" clearable @keyup.enter="handleQuery" style="width: 200px" />
        </el-form-item>
        <el-form-item label="发送方" prop="senderId">
          <UserSelect v-model="queryParams.senderId" placeholder="请选择发送方" clearable filterable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="接收方" prop="receiverId">
          <UserSelect v-model="queryParams.receiverId" placeholder="请选择接收方" clearable filterable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="消息类型" prop="messageType">
          <el-select v-model="queryParams.messageType" placeholder="请选择" clearable filterable style="width: 140px">
            <el-option v-for="item in messageTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
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
          <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bt10:privatemessage:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['bt10:privatemessage:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bt10:privatemessage:remove']">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bt10:privatemessage:export']">导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="privatemessageList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" min-width="160" show-overflow-tooltip />
        <el-table-column label="会话" align="center" prop="threadId" min-width="160" show-overflow-tooltip />
        <el-table-column label="发送方" align="center" prop="senderId" min-width="160" show-overflow-tooltip />
        <el-table-column label="接收方" align="center" prop="receiverId" min-width="160" show-overflow-tooltip />
        <el-table-column label="类型" align="center" prop="messageType" width="100">
          <template #default="scope">
            {{ getOptionLabel(messageTypeOptions, scope.row.messageType) }}
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center" prop="content" min-width="220" show-overflow-tooltip />
        <el-table-column label="发送时间" align="center" prop="sentTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.sentTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="阅读时间" align="center" prop="readTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.readTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" width="100">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:privatemessage:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:privatemessage:remove']">删除</el-button>
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

    <el-dialog :title="title" v-model="open" width="640px" append-to-body>
      <el-form ref="privatemessageRef" :model="form" :rules="rules" label-width="88px">
        <el-form-item label="会话" prop="threadId">
          <el-input v-model="form.threadId" placeholder="请输入会话主键" />
        </el-form-item>
        <el-form-item label="发送方" prop="senderId">
          <UserSelect v-model="form.senderId" placeholder="请选择发送方" />
        </el-form-item>
        <el-form-item label="接收方" prop="receiverId">
          <UserSelect v-model="form.receiverId" placeholder="请选择接收方" />
        </el-form-item>
        <el-form-item label="消息类型" prop="messageType">
          <el-select v-model="form.messageType" placeholder="请选择" clearable filterable style="width: 100%">
            <el-option v-for="item in messageTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="4" placeholder="请输入内容" />
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

<script setup name="Privatemessage">
import { listPrivatemessage, getPrivatemessage, delPrivatemessage, addPrivatemessage, updatePrivatemessage } from '@/api/bt10/privatemessage'
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from '@/utils/Bt10Helper'

const { proxy } = getCurrentInstance()

const messageTypeOptions = [
  { value: 'TEXT', label: '文本' }
]

const privatemessageList = ref([])
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
    threadId: null,
    senderId: null,
    receiverId: null,
    messageType: null,
    status: null
  },
  rules: {
    threadId: [{ required: true, message: '会话不能为空', trigger: 'blur' }],
    senderId: [{ required: true, message: '发送方不能为空', trigger: 'change' }],
    receiverId: [{ required: true, message: '接收方不能为空', trigger: 'change' }],
    messageType: [{ required: true, message: '消息类型不能为空', trigger: 'change' }],
    content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
  }
})

const { queryParams, form, rules } = toRefs(data)

function getList() {
  loading.value = true
  listPrivatemessage(queryParams.value).then(response => {
    privatemessageList.value = response.rows
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
    threadId: null,
    senderId: null,
    receiverId: null,
    messageType: 'TEXT',
    content: null,
    sentTime: null,
    readTime: null,
    status: null,
    remark: null
  }
  proxy.resetForm('privatemessageRef')
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
  title.value = '添加私信消息'
}

function handleUpdate(row) {
  reset()
  const _id = row?.id ?? ids.value?.[0]
  getPrivatemessage(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = '修改私信消息'
  })
}

function stringifyLongFields(f) {
  const keys = ['threadId', 'senderId', 'receiverId']
  keys.forEach(k => {
    if (f[k] != null && f[k] !== '') f[k] = String(f[k])
  })
}

function submitForm() {
  proxy.$refs['privatemessageRef'].validate(valid => {
    if (!valid) return
    const payload = { ...form.value }
    stringifyLongFields(payload)
    if (payload.id != null) {
      updatePrivatemessage(payload).then(() => {
        proxy.$modal.msgSuccess('修改成功')
        open.value = false
        getList()
      })
    } else {
      addPrivatemessage(payload).then(() => {
        proxy.$modal.msgSuccess('新增成功')
        open.value = false
        getList()
      })
    }
  })
}

function handleDelete(row) {
  const _ids = row?.id ?? ids.value
  proxy.$modal.confirm('是否确认删除私信消息编号为"' + _ids + '"的数据项？').then(function () {
    return delPrivatemessage(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess('删除成功')
  }).catch(() => {})
}

function handleExport() {
  proxy.download(
    'bt10/privatemessage/export',
    { ...queryParams.value },
    `privatemessage_${new Date().getTime()}.xlsx`
  )
}

loadBt10Enums().finally(() => {
  getList()
})
</script>
