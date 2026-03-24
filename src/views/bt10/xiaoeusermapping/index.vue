<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="本平台用户" prop="userId">
          <UserSelect
            v-model="queryParams.userId"
            placeholder="请选择本平台用户"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="小鹅通用户ID" prop="xiaoeUserId">
          <el-input
            v-model="queryParams.xiaoeUserId"
            placeholder="请输入小鹅通用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="匹配置信度0-1" prop="confidenceScore">
          <el-input
            v-model="queryParams.confidenceScore"
            placeholder="请输入匹配置信度0-1"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="建立映射时间" prop="mappedTime">
          <el-date-picker clearable
            v-model="queryParams.mappedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择建立映射时间">
          </el-date-picker>
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
          <el-button
            type="primary"
            plain
            icon="Plus"
            @click="handleAdd"
            v-hasPermi="['bt10:xiaoeusermapping:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:xiaoeusermapping:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:xiaoeusermapping:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:xiaoeusermapping:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="xiaoeusermappingList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="本平台用户" align="center" prop="userId" />
      <el-table-column label="小鹅通用户ID" align="center" prop="xiaoeUserId" />
      <el-table-column label="映射方式" align="center" prop="mappingType" />
      <el-table-column label="匹配置信度0-1" align="center" prop="confidenceScore" />
        <el-table-column label="建立映射时间" align="center" prop="mappedTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.mappedTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
          <template #default="scope">
            {{ getOptionLabel(statusOptions, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:xiaoeusermapping:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:xiaoeusermapping:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    
      <pagination
        v-show="total>0"
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 添加或修改本平台用户与小鹅通用户ID映射对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="xiaoeusermappingRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="本平台用户" prop="userId">
          <UserSelect v-model="form.userId" placeholder="请选择本平台用户" />
        </el-form-item>
        <el-form-item label="小鹅通用户ID" prop="xiaoeUserId">
          <el-input v-model="form.xiaoeUserId" placeholder="请输入小鹅通用户ID" />
        </el-form-item>
        <el-form-item label="映射方式" prop="mappingType">
     <el-select v-model="form.mappingType" multiple filterable reserve-keyword remote-show-suffix
            placeholder="请选择映射方式：自动/手动"
            :loading="loadingMappingType"
          >
            <el-option v-for="item in optionsMappingType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="匹配置信度0-1" prop="confidenceScore">
          <el-input v-model="form.confidenceScore" placeholder="请输入匹配置信度0-1" />
        </el-form-item>
        <el-form-item label="建立映射时间" prop="mappedTime">
          <el-date-picker clearable
            v-model="form.mappedTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择建立映射时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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

<script setup name="Xiaoeusermapping">
import { listXiaoeusermapping, getXiaoeusermapping, delXiaoeusermapping, addXiaoeusermapping, updateXiaoeusermapping } from "@/api/bt10/xiaoeusermapping";
import { ensureBt10EnumsAndStatusLoaded, getBt10OptionsFromCache, BT10_ENUM_KEYS } from "@/utils/Bt10Helper";

const { proxy } = getCurrentInstance();

const xiaoeusermappingList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const statusOptions = ref([]);

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: null,
    xiaoeUserId: null,
    mappingType: null,
    confidenceScore: null,
    mappedTime: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询本平台用户与小鹅通用户ID映射列表 */
function getList() {
  loading.value = true;
  listXiaoeusermapping(queryParams.value).then(response => {
    xiaoeusermappingList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function getOptionLabel(options, value) {
  if (value == null || value === '') return value;
  return options.find(item => item.value === value)?.label ?? value;
}

function loadBt10Enums() {
  statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  return ensureBt10EnumsAndStatusLoaded().then(() => {
    statusOptions.value = getBt10OptionsFromCache(BT10_ENUM_KEYS.STATUS);
  });
}

// 取消按钮
function cancel() {
  open.value = false;
  reset();
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    userId: null,
    xiaoeUserId: null,
    mappingType: null,
    confidenceScore: null,
    mappedTime: null,
    createId: null,
    createBy: null,
    createTime: null,
    updateId: null,
    updateBy: null,
    updateTime: null,
    status: null,
    delFlag: null,
    remark: null
  };
  proxy.resetForm("xiaoeusermappingRef");
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加本平台用户与小鹅通用户ID映射";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getXiaoeusermapping(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改本平台用户与小鹅通用户ID映射";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["xiaoeusermappingRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateXiaoeusermapping(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addXiaoeusermapping(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          open.value = false;
          getList();
        });
      }
    }
  });
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row?.id ?? ids.value;
  proxy.$modal.confirm('是否确认删除本平台用户与小鹅通用户ID映射编号为"' + _ids + '"的数据项？').then(function() {
    return delXiaoeusermapping(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/xiaoeusermapping/export', {
    ...queryParams.value
  }, `xiaoeusermapping_${new Date().getTime()}.xlsx`)
}

loadBt10Enums().finally(() => {
  getList();
});
</script>
