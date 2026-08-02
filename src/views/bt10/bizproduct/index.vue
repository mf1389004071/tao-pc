<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="80px">
        <el-form-item label="产品编码" prop="code">
          <el-input v-model="queryParams.code" placeholder="产品编码" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="产品名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="产品名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="产品类型" prop="productType">
          <el-input v-model="queryParams.productType" placeholder="如 SKILL_PACK" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item label="上架状态" prop="bizStatus">
          <el-input v-model="queryParams.bizStatus" placeholder="ACTIVE" clearable @keyup.enter="handleQuery" />
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
          <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['bt10:bizproduct:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate" v-hasPermi="['bt10:bizproduct:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete" v-hasPermi="['bt10:bizproduct:remove']">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['bt10:bizproduct:export']">导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="bizproductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编码" align="center" prop="code" min-width="120" />
        <el-table-column label="名称" align="center" prop="name" min-width="160" />
        <el-table-column label="类型" align="center" prop="productType" width="110" />
        <el-table-column label="标价" align="center" prop="priceAmount" width="90" />
        <el-table-column label="续期天数" align="center" prop="validDays" width="90" />
        <el-table-column label="身份编码" align="center" prop="identityCode" min-width="120" />
        <el-table-column label="上架状态" align="center" prop="bizStatus" width="100" />
        <el-table-column label="排序" align="center" prop="orderNum" width="70" />
        <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:bizproduct:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:bizproduct:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <el-dialog :title="title" v-model="open" width="900px" append-to-body>
      <el-form ref="bizproductRef" :model="form" :rules="rules" label-width="96px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="产品编码" prop="code"><el-input v-model="form.code" placeholder="如 SKILL_199_P6" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="产品名称" prop="name"><el-input v-model="form.name" placeholder="产品名称" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="产品类型" prop="productType"><el-input v-model="form.productType" placeholder="SKILL_PACK" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="现金标价" prop="priceAmount"><el-input-number v-model="form.priceAmount" :min="0" :precision="2" controls-position="right" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="续期天数" prop="validDays"><el-input-number v-model="form.validDays" :min="1" controls-position="right" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="身份编码" prop="identityCode"><el-input v-model="form.identityCode" placeholder="IDENTITY_P6" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="购买链接" prop="buyUrl"><el-input v-model="form.buyUrl" placeholder="小鹅通购买页 URL" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="封面图" prop="coverImageUrl"><el-input v-model="form.coverImageUrl" placeholder="封面 URL" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="上架状态" prop="bizStatus"><el-input v-model="form.bizStatus" placeholder="ACTIVE" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="排序" prop="orderNum"><el-input-number v-model="form.orderNum" :min="0" controls-position="right" style="width:100%" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="详情" prop="detailContent"><el-input v-model="form.detailContent" type="textarea" :rows="3" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="扩展JSON" prop="jsonData"><el-input v-model="form.jsonData" type="textarea" :rows="2" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="备注" prop="remark"><el-input v-model="form.remark" type="textarea" /></el-form-item></el-col>
        </el-row>
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

<script setup name="Bizproduct">
import { listBizproduct, getBizproduct, delBizproduct, addBizproduct, updateBizproduct } from "@/api/bt10/bizproduct";

const { proxy } = getCurrentInstance();

const bizproductList = ref([]);
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
    code: null,
    name: null,
    productType: null,
    bizStatus: null
  },
  rules: {
    code: [{ required: true, message: "产品编码不能为空", trigger: "blur" }],
    name: [{ required: true, message: "产品名称不能为空", trigger: "blur" }]
  }
});

const { queryParams, form, rules } = toRefs(data);

function getList() {
  loading.value = true;
  listBizproduct(queryParams.value).then(response => {
    bizproductList.value = response.rows;
    total.value = response.total;
    loading.value = false;
  });
}

function cancel() {
  open.value = false;
  reset();
}

function reset() {
  form.value = {
    id: null,
    code: null,
    name: null,
    productType: "SKILL_PACK",
    priceAmount: 199,
    validDays: 30,
    identityCode: "IDENTITY_P6",
    buyUrl: null,
    coverImageUrl: null,
    detailContent: null,
    bizStatus: "ACTIVE",
    orderNum: 0,
    jsonData: null,
    remark: null
  };
  proxy.resetForm("bizproductRef");
}

function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

function handleAdd() {
  reset();
  open.value = true;
  title.value = "新增业务产品";
}

function handleUpdate(row) {
  reset();
  const _id = row?.id ?? ids.value?.[0];
  getBizproduct(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改业务产品";
  });
}

function submitForm() {
  proxy.$refs["bizproductRef"].validate(valid => {
    if (!valid) return;
    const payload = { ...form.value };
    if (payload.id != null) {
      updateBizproduct(payload).then(() => {
        proxy.$modal.msgSuccess("修改成功");
        open.value = false;
        getList();
      });
    } else {
      addBizproduct(payload).then(() => {
        proxy.$modal.msgSuccess("新增成功");
        open.value = false;
        getList();
      });
    }
  });
}

function handleDelete(row) {
  const _ids = row?.id ?? ids.value;
  proxy.$modal.confirm('是否确认删除业务产品编号为"' + _ids + '"的数据项？').then(function() {
    return delBizproduct(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

function handleExport() {
  proxy.download('bt10/bizproduct/export', { ...queryParams.value }, `bizproduct_${new Date().getTime()}.xlsx`);
}

getList();
</script>
