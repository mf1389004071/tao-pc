<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="活动ID" prop="eventId">
          <el-input
            v-model="queryParams.eventId"
            placeholder="请输入活动ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="报名用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入报名用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input
            v-model="queryParams.paymentAmount"
            placeholder="请输入支付金额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="支付方式：贡献点/积分/混合/现金等" prop="paymentMethod">
          <el-input
            v-model="queryParams.paymentMethod"
            placeholder="请输入支付方式：贡献点/积分/混合/现金等"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="支付单号" prop="paymentNo">
          <el-input
            v-model="queryParams.paymentNo"
            placeholder="请输入支付单号"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="签到时间" prop="checkedInTime">
          <el-date-picker clearable
            v-model="queryParams.checkedInTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择签到时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签到方式：二维码/定位/手动" prop="checkInMethod">
          <el-input
            v-model="queryParams.checkInMethod"
            placeholder="请输入签到方式：二维码/定位/手动"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="转化产品ID" prop="conversionProductId">
          <el-input
            v-model="queryParams.conversionProductId"
            placeholder="请输入转化产品ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="转化金额" prop="conversionAmount">
          <el-input
            v-model="queryParams.conversionAmount"
            placeholder="请输入转化金额"
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
            v-hasPermi="['bt10:eventjoin:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:eventjoin:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:eventjoin:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:eventjoin:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="eventjoinList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="活动ID" align="center" prop="eventId" />
      <el-table-column label="报名用户ID" align="center" prop="userId" />
      <el-table-column label="状态：已确认/已取消/已签到/缺席" align="center" prop="bizStatus" />
      <el-table-column label="报名表单填写数据" align="center" prop="joinForm" />
      <el-table-column label="支付状态：待付/已付/已退/失败/已取消" align="center" prop="paymentStatus" />
      <el-table-column label="支付金额" align="center" prop="paymentAmount" />
      <el-table-column label="支付方式：贡献点/积分/混合/现金等" align="center" prop="paymentMethod" />
      <el-table-column label="支付单号" align="center" prop="paymentNo" />
        <el-table-column label="签到时间" align="center" prop="checkedInTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.checkedInTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="签到方式：二维码/定位/手动" align="center" prop="checkInMethod" />
      <el-table-column label="签到位置信息" align="center" prop="checkInLocation" />
      <el-table-column label="转化状态：无/有意向/已转化" align="center" prop="conversionStatus" />
      <el-table-column label="转化产品ID" align="center" prop="conversionProductId" />
      <el-table-column label="转化金额" align="center" prop="conversionAmount" />
      <el-table-column label="转化备注" align="center" prop="conversionNotes" />
      <el-table-column label="扩展文本1" align="center" prop="text1" />
      <el-table-column label="扩展文本2" align="center" prop="text2" />
      <el-table-column label="扩展文本3" align="center" prop="text3" />
      <el-table-column label="扩展JSON" align="center" prop="jsonData" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:eventjoin:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:eventjoin:remove']">删除</el-button>
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

    <!-- 添加或修改用户活动报名记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="eventjoinRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="活动ID" prop="eventId">
          <el-input v-model="form.eventId" placeholder="请输入活动ID" />
        </el-form-item>
        <el-form-item label="报名用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入报名用户ID" />
        </el-form-item>
        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input v-model="form.paymentAmount" placeholder="请输入支付金额" />
        </el-form-item>
        <el-form-item label="支付方式：贡献点/积分/混合/现金等" prop="paymentMethod">
          <el-input v-model="form.paymentMethod" placeholder="请输入支付方式：贡献点/积分/混合/现金等" />
        </el-form-item>
        <el-form-item label="支付单号" prop="paymentNo">
          <el-input v-model="form.paymentNo" placeholder="请输入支付单号" />
        </el-form-item>
        <el-form-item label="签到时间" prop="checkedInTime">
          <el-date-picker clearable
            v-model="form.checkedInTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择签到时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签到方式：二维码/定位/手动" prop="checkInMethod">
          <el-input v-model="form.checkInMethod" placeholder="请输入签到方式：二维码/定位/手动" />
        </el-form-item>
        <el-form-item label="转化产品ID" prop="conversionProductId">
          <el-input v-model="form.conversionProductId" placeholder="请输入转化产品ID" />
        </el-form-item>
        <el-form-item label="转化金额" prop="conversionAmount">
          <el-input v-model="form.conversionAmount" placeholder="请输入转化金额" />
        </el-form-item>
        <el-form-item label="转化备注" prop="conversionNotes">
          <el-input v-model="form.conversionNotes" type="textarea" placeholder="请输入内容" />
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

<script setup name="Eventjoin">
import { listEventjoin, getEventjoin, delEventjoin, addEventjoin, updateEventjoin } from "@/api/bt10/eventjoin";

const { proxy } = getCurrentInstance();

const eventjoinList = ref([]);
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
    eventId: null,
    userId: null,
    bizStatus: null,
    joinForm: null,
    paymentStatus: null,
    paymentAmount: null,
    paymentMethod: null,
    paymentNo: null,
    checkedInTime: null,
    checkInMethod: null,
    checkInLocation: null,
    conversionStatus: null,
    conversionProductId: null,
    conversionAmount: null,
    conversionNotes: null,
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

/** 查询用户活动报名记录列表 */
function getList() {
  loading.value = true;
  listEventjoin(queryParams.value).then(response => {
    eventjoinList.value = response.rows;
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
    eventId: null,
    userId: null,
    bizStatus: null,
    joinForm: null,
    paymentStatus: null,
    paymentAmount: null,
    paymentMethod: null,
    paymentNo: null,
    checkedInTime: null,
    checkInMethod: null,
    checkInLocation: null,
    conversionStatus: null,
    conversionProductId: null,
    conversionAmount: null,
    conversionNotes: null,
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
    remark: null,
    status: null
  };
  proxy.resetForm("eventjoinRef");
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
  title.value = "添加用户活动报名记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getEventjoin(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户活动报名记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["eventjoinRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateEventjoin(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addEventjoin(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除用户活动报名记录编号为"' + _ids + '"的数据项？').then(function() {
    return delEventjoin(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/eventjoin/export', {
    ...queryParams.value
  }, `eventjoin_${new Date().getTime()}.xlsx`)
}

getList();
</script>
