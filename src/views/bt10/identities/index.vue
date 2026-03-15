<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="身份数值等级(如 0/10/20/30/50/60)" prop="identityLevel">
          <el-input
            v-model="queryParams.identityLevel"
            placeholder="请输入身份数值等级(如 0/10/20/30/50/60)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="身份名称，如 创始人/联创/合伙人/高手/粉丝/城市主理人/合作方" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入身份名称，如 创始人/联创/合伙人/高手/粉丝/城市主理人/合作方"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="身份图标URL或名称" prop="icon">
          <el-input
            v-model="queryParams.icon"
            placeholder="请输入身份图标URL或名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="身份主题色" prop="themeColor">
          <el-input
            v-model="queryParams.themeColor"
            placeholder="请输入身份主题色"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="身份付费金额(人民币)" prop="priceAmount">
          <el-input
            v-model="queryParams.priceAmount"
            placeholder="请输入身份付费金额(人民币)"
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
            v-hasPermi="['bt10:identities:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:identities:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:identities:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:identities:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="identitiesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="身份编码(如 FOUNDER/PARTNER)" align="center" prop="identityCode" />
      <el-table-column label="身份数值等级(如 0/10/20/30/50/60)" align="center" prop="identityLevel" />
      <el-table-column label="身份名称，如 创始人/联创/合伙人/高手/粉丝/城市主理人/合作方" align="center" prop="name" />
      <el-table-column label="身份图标URL或名称" align="center" prop="icon" />
      <el-table-column label="身份主题色" align="center" prop="themeColor" />
      <el-table-column label="身份简介" align="center" prop="intro" />
      <el-table-column label="系统法律说明" align="center" prop="legalText" />
      <el-table-column label="权利说明" align="center" prop="rightsText" />
      <el-table-column label="责任说明" align="center" prop="dutiesText" />
      <el-table-column label="利益说明" align="center" prop="benefitsText" />
      <el-table-column label="晋升说明" align="center" prop="upgradeRulesText" />
      <el-table-column label="身份付费金额(人民币)" align="center" prop="priceAmount" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:identities:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:identities:remove']">删除</el-button>
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

    <!-- 添加或修改系统身份定义表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="identitiesRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="身份数值等级(如 0/10/20/30/50/60)" prop="identityLevel">
          <el-input v-model="form.identityLevel" placeholder="请输入身份数值等级(如 0/10/20/30/50/60)" />
        </el-form-item>
        <el-form-item label="身份名称，如 创始人/联创/合伙人/高手/粉丝/城市主理人/合作方" prop="name">
          <el-input v-model="form.name" placeholder="请输入身份名称，如 创始人/联创/合伙人/高手/粉丝/城市主理人/合作方" />
        </el-form-item>
        <el-form-item label="身份图标URL或名称" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入身份图标URL或名称" />
        </el-form-item>
        <el-form-item label="身份主题色" prop="themeColor">
          <el-input v-model="form.themeColor" placeholder="请输入身份主题色" />
        </el-form-item>
        <el-form-item label="身份简介" prop="intro">
          <el-input v-model="form.intro" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="系统法律说明" prop="legalText">
          <el-input v-model="form.legalText" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="权利说明" prop="rightsText">
          <el-input v-model="form.rightsText" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="责任说明" prop="dutiesText">
          <el-input v-model="form.dutiesText" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="利益说明" prop="benefitsText">
          <el-input v-model="form.benefitsText" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="晋升说明" prop="upgradeRulesText">
          <el-input v-model="form.upgradeRulesText" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="身份付费金额(人民币)" prop="priceAmount">
          <el-input v-model="form.priceAmount" placeholder="请输入身份付费金额(人民币)" />
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

<script setup name="Identities">
import { listIdentities, getIdentities, delIdentities, addIdentities, updateIdentities } from "@/api/bt10/identities";

const { proxy } = getCurrentInstance();

const identitiesList = ref([]);
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
    identityLevel: null,
    name: null,
    icon: null,
    themeColor: null,
    intro: null,
    legalText: null,
    rightsText: null,
    dutiesText: null,
    benefitsText: null,
    upgradeRulesText: null,
    priceAmount: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询系统身份定义表列表 */
function getList() {
  loading.value = true;
  listIdentities(queryParams.value).then(response => {
    identitiesList.value = response.rows;
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
    identityCode: null,
    identityLevel: null,
    name: null,
    icon: null,
    themeColor: null,
    intro: null,
    legalText: null,
    rightsText: null,
    dutiesText: null,
    benefitsText: null,
    upgradeRulesText: null,
    priceAmount: null,
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
  proxy.resetForm("identitiesRef");
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
  ids.value = selection.map(item => item.identityCode);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加系统身份定义表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _identityCode = row.identityCode || ids.value
  getIdentities(_identityCode).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改系统身份定义表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["identitiesRef"].validate(valid => {
    if (valid) {
      if (form.value.identityCode != null) {
        updateIdentities(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addIdentities(form.value).then(response => {
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
  const _identityCodes = row.identityCode || ids.value;
  proxy.$modal.confirm('是否确认删除系统身份定义表编号为"' + _identityCodes + '"的数据项？').then(function() {
    return delIdentities(_identityCodes);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/identities/export', {
    ...queryParams.value
  }, `identities_${new Date().getTime()}.xlsx`)
}

getList();
</script>
