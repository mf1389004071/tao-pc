<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="社群名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入社群名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="创建者(合伙人)用户ID" prop="ownerId">
          <el-input
            v-model="queryParams.ownerId"
            placeholder="请输入创建者(合伙人)用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="最大成员数" prop="maxMembers">
          <el-input
            v-model="queryParams.maxMembers"
            placeholder="请输入最大成员数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="当前成员数" prop="memberCount">
          <el-input
            v-model="queryParams.memberCount"
            placeholder="请输入当前成员数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input
            v-model="queryParams.city"
            placeholder="请输入所在城市"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="扩展文本1" prop="text1">
          <el-input
            v-model="queryParams.text1"
            placeholder="请输入扩展文本1"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="扩展文本2" prop="text2">
          <el-input
            v-model="queryParams.text2"
            placeholder="请输入扩展文本2"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="扩展文本3" prop="text3">
          <el-input
            v-model="queryParams.text3"
            placeholder="请输入扩展文本3"
            clearable
            @keyup.enter="handleQuery"
          />
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
            v-hasPermi="['bt10:communityinfo:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:communityinfo:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:communityinfo:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:communityinfo:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="communityinfoList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="社群名称" align="center" prop="name" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="创建者(合伙人)用户ID" align="center" prop="ownerId" />
      <el-table-column label="是否公开可见" align="center" prop="isPublic" />
      <el-table-column label="最大成员数" align="center" prop="maxMembers" />
      <el-table-column label="当前成员数" align="center" prop="memberCount" />
      <el-table-column label="封面图" align="center" prop="coverImageUrl" />
      <el-table-column label="所在城市" align="center" prop="city" />
      <el-table-column label="状态：正常/已归档/已解散" align="center" prop="bizStatus" />
      <el-table-column label="扩展文本1" align="center" prop="text1" />
      <el-table-column label="扩展文本2" align="center" prop="text2" />
      <el-table-column label="扩展文本3" align="center" prop="text3" />
      <el-table-column label="扩展JSON" align="center" prop="jsonData" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:communityinfo:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:communityinfo:remove']">删除</el-button>
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

    <!-- 添加或修改合伙人创建的社群对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="communityinfoRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="社群名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入社群名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="创建者(合伙人)用户ID" prop="ownerId">
          <el-input v-model="form.ownerId" placeholder="请输入创建者(合伙人)用户ID" />
        </el-form-item>
        <el-form-item label="最大成员数" prop="maxMembers">
          <el-input v-model="form.maxMembers" placeholder="请输入最大成员数" />
        </el-form-item>
        <el-form-item label="当前成员数" prop="memberCount">
          <el-input v-model="form.memberCount" placeholder="请输入当前成员数" />
        </el-form-item>
        <el-form-item label="封面图" prop="coverImageUrl">
          <el-input v-model="form.coverImageUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="所在城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入所在城市" />
        </el-form-item>
        <el-form-item label="扩展文本1" prop="text1">
          <el-input v-model="form.text1" placeholder="请输入扩展文本1" />
        </el-form-item>
        <el-form-item label="扩展文本2" prop="text2">
          <el-input v-model="form.text2" placeholder="请输入扩展文本2" />
        </el-form-item>
        <el-form-item label="扩展文本3" prop="text3">
          <el-input v-model="form.text3" placeholder="请输入扩展文本3" />
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

<script setup name="Communityinfo">
import { listCommunityinfo, getCommunityinfo, delCommunityinfo, addCommunityinfo, updateCommunityinfo } from "@/api/bt10/communityinfo";

const { proxy } = getCurrentInstance();

const communityinfoList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const title = ref("");

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: null,
    ownerId: null,
    isPublic: null,
    maxMembers: null,
    memberCount: null,
    coverImageUrl: null,
    city: null,
    bizStatus: null,
    text1: null,
    text2: null,
    text3: null,
    jsonData: null,
    status: null
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询合伙人创建的社群列表 */
function getList() {
  loading.value = true;
  listCommunityinfo(queryParams.value).then(response => {
    communityinfoList.value = response.rows;
    total.value = response.total;
    loading.value = false;
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
    name: null,
    remark: null,
    ownerId: null,
    isPublic: [],
    maxMembers: null,
    memberCount: null,
    coverImageUrl: null,
    city: null,
    bizStatus: null,
    createId: null,
    updateId: null,
    deleteId: null,
    createTime: null,
    updateTime: null,
    deleteTime: null,
    delFlag: null,
    text1: null,
    text2: null,
    text3: null,
    jsonData: null,
    status: null
  };
  proxy.resetForm("communityinfoRef");
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
  title.value = "添加合伙人创建的社群";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getCommunityinfo(_id).then(response => {
    form.value = response.data;
    form.value.isPublic = form.value.isPublic.split(",");
    open.value = true;
    title.value = "修改合伙人创建的社群";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["communityinfoRef"].validate(valid => {
    if (valid) {
      form.value.isPublic = form.value.isPublic.join(",");
      if (form.value.id != null) {
        updateCommunityinfo(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addCommunityinfo(form.value).then(response => {
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
  const _ids = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除合伙人创建的社群编号为"' + _ids + '"的数据项？').then(function() {
    return delCommunityinfo(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/communityinfo/export', {
    ...queryParams.value
  }, `communityinfo_${new Date().getTime()}.xlsx`)
}

getList();
</script>
