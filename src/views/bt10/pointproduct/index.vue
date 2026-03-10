<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="商品名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入商品名称"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="兑换所需积分" prop="pointsRequired">
          <el-input
            v-model="queryParams.pointsRequired"
            placeholder="请输入兑换所需积分"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="库存数量，-1表示不限" prop="stockQuantity">
          <el-input
            v-model="queryParams.stockQuantity"
            placeholder="请输入库存数量，-1表示不限"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="已兑换数量" prop="soldQuantity">
          <el-input
            v-model="queryParams.soldQuantity"
            placeholder="请输入已兑换数量"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="有效天数" prop="validDays">
          <el-input
            v-model="queryParams.validDays"
            placeholder="请输入有效天数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input
            v-model="queryParams.orderNum"
            placeholder="请输入排序"
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
            v-hasPermi="['bt10:pointproduct:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:pointproduct:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:pointproduct:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:pointproduct:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="pointproductList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="商品名称" align="center" prop="name" />
      <el-table-column label="描述" align="center" prop="remark" />
      <el-table-column label="类型：优惠券/咨询/实物/会员等" align="center" prop="productType" />
      <el-table-column label="兑换所需积分" align="center" prop="pointsRequired" />
      <el-table-column label="库存数量，-1表示不限" align="center" prop="stockQuantity" />
      <el-table-column label="已兑换数量" align="center" prop="soldQuantity" />
      <el-table-column label="商品图" align="center" prop="imageUrl" />
      <el-table-column label="详情正文" align="center" prop="detailContent" />
      <el-table-column label="有效天数" align="center" prop="validDays" />
      <el-table-column label="状态：上架/下架/售罄" align="center" prop="bizStatus" />
      <el-table-column label="排序" align="center" prop="orderNum" />
      <el-table-column label="扩展文本1" align="center" prop="text1" />
      <el-table-column label="扩展文本2" align="center" prop="text2" />
      <el-table-column label="扩展文本3" align="center" prop="text3" />
      <el-table-column label="扩展JSON" align="center" prop="jsonData" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:pointproduct:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:pointproduct:remove']">删除</el-button>
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

    <!-- 添加或修改积分商城商品对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="pointproductRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="类型：优惠券/咨询/实物/会员等" prop="productType">
          <el-select v-model="form.productType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择类型：优惠券/咨询/实物/会员等"
            :remote-method="remoteMethodProductType"
            :loading="loadingProductType"
          >
            <el-option v-for="item in optionsProductType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="兑换所需积分" prop="pointsRequired">
          <el-input v-model="form.pointsRequired" placeholder="请输入兑换所需积分" />
        </el-form-item>
        <el-form-item label="库存数量，-1表示不限" prop="stockQuantity">
          <el-input v-model="form.stockQuantity" placeholder="请输入库存数量，-1表示不限" />
        </el-form-item>
        <el-form-item label="已兑换数量" prop="soldQuantity">
          <el-input v-model="form.soldQuantity" placeholder="请输入已兑换数量" />
        </el-form-item>
        <el-form-item label="商品图" prop="imageUrl">
          <el-input v-model="form.imageUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="详情正文">
          <editor v-model="form.detailContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="有效天数" prop="validDays">
          <el-input v-model="form.validDays" placeholder="请输入有效天数" />
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入排序" />
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

<script setup name="Pointproduct">
import { listPointproduct, getPointproduct, delPointproduct, addPointproduct, updatePointproduct } from "@/api/bt10/pointproduct";

const { proxy } = getCurrentInstance();

const pointproductList = ref([]);
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
    productType: null,
    pointsRequired: null,
    stockQuantity: null,
    soldQuantity: null,
    imageUrl: null,
    detailContent: null,
    validDays: null,
    bizStatus: null,
    orderNum: null,
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

/** 查询积分商城商品列表 */
function getList() {
  loading.value = true;
  listPointproduct(queryParams.value).then(response => {
    pointproductList.value = response.rows;
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
    productType: null,
    pointsRequired: null,
    stockQuantity: null,
    soldQuantity: null,
    imageUrl: null,
    detailContent: null,
    validDays: null,
    bizStatus: null,
    orderNum: null,
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
  proxy.resetForm("pointproductRef");
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
  title.value = "添加积分商城商品";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getPointproduct(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改积分商城商品";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["pointproductRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updatePointproduct(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addPointproduct(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除积分商城商品编号为"' + _ids + '"的数据项？').then(function() {
    return delPointproduct(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/pointproduct/export', {
    ...queryParams.value
  }, `pointproduct_${new Date().getTime()}.xlsx`)
}

getList();
</script>
