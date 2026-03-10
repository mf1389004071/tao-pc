<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="被邀请人用户ID(sys_user.user_id)" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入被邀请人用户ID(sys_user.user_id)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="邀请人用户ID" prop="inviterId">
          <el-input
            v-model="queryParams.inviterId"
            placeholder="请输入邀请人用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="使用的邀请码" prop="inviteCode">
          <el-input
            v-model="queryParams.inviteCode"
            placeholder="请输入使用的邀请码"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="被邀请时间" prop="inviteTime">
          <el-date-picker clearable
            v-model="queryParams.inviteTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择被邀请时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邀请奖励积分" prop="rewardPoints">
          <el-input
            v-model="queryParams.rewardPoints"
            placeholder="请输入邀请奖励积分"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="邀请奖励贡献点" prop="rewardContrib">
          <el-input
            v-model="queryParams.rewardContrib"
            placeholder="请输入邀请奖励贡献点"
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
            v-hasPermi="['bt10:userinvite:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:userinvite:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:userinvite:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:userinvite:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="userinviteList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="被邀请人用户ID(sys_user.user_id)" align="center" prop="userId" />
      <el-table-column label="邀请人用户ID" align="center" prop="inviterId" />
      <el-table-column label="使用的邀请码" align="center" prop="inviteCode" />
        <el-table-column label="被邀请时间" align="center" prop="inviteTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.inviteTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="状态：待处理/已接受/已发奖" align="center" prop="rewardStatus" />
      <el-table-column label="邀请人是否已领取奖励" align="center" prop="rewardClaimed" />
      <el-table-column label="邀请奖励积分" align="center" prop="rewardPoints" />
      <el-table-column label="邀请奖励贡献点" align="center" prop="rewardContrib" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:userinvite:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:userinvite:remove']">删除</el-button>
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

    <!-- 添加或修改邀请关系与奖励记录对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="userinviteRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="被邀请人用户ID(sys_user.user_id)" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入被邀请人用户ID(sys_user.user_id)" />
        </el-form-item>
        <el-form-item label="邀请人用户ID" prop="inviterId">
          <el-input v-model="form.inviterId" placeholder="请输入邀请人用户ID" />
        </el-form-item>
        <el-form-item label="使用的邀请码" prop="inviteCode">
          <el-input v-model="form.inviteCode" placeholder="请输入使用的邀请码" />
        </el-form-item>
        <el-form-item label="被邀请时间" prop="inviteTime">
          <el-date-picker clearable
            v-model="form.inviteTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择被邀请时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="邀请奖励积分" prop="rewardPoints">
          <el-input v-model="form.rewardPoints" placeholder="请输入邀请奖励积分" />
        </el-form-item>
        <el-form-item label="邀请奖励贡献点" prop="rewardContrib">
          <el-input v-model="form.rewardContrib" placeholder="请输入邀请奖励贡献点" />
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

<script setup name="Userinvite">
import { listUserinvite, getUserinvite, delUserinvite, addUserinvite, updateUserinvite } from "@/api/bt10/userinvite";

const { proxy } = getCurrentInstance();

const userinviteList = ref([]);
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
    userId: null,
    inviterId: null,
    inviteCode: null,
    inviteTime: null,
    rewardStatus: null,
    rewardClaimed: null,
    rewardPoints: null,
    rewardContrib: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询邀请关系与奖励记录列表 */
function getList() {
  loading.value = true;
  listUserinvite(queryParams.value).then(response => {
    userinviteList.value = response.rows;
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
    userId: null,
    inviterId: null,
    inviteCode: null,
    inviteTime: null,
    rewardStatus: null,
    rewardClaimed: [],
    rewardPoints: null,
    rewardContrib: null,
    remark: null,
    status: null,
    delFlag: null
  };
  proxy.resetForm("userinviteRef");
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
  title.value = "添加邀请关系与奖励记录";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getUserinvite(_id).then(response => {
    form.value = response.data;
    form.value.rewardClaimed = form.value.rewardClaimed.split(",");
    open.value = true;
    title.value = "修改邀请关系与奖励记录";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userinviteRef"].validate(valid => {
    if (valid) {
      form.value.rewardClaimed = form.value.rewardClaimed.join(",");
      if (form.value.id != null) {
        updateUserinvite(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUserinvite(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除邀请关系与奖励记录编号为"' + _ids + '"的数据项？').then(function() {
    return delUserinvite(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/userinvite/export', {
    ...queryParams.value
  }, `userinvite_${new Date().getTime()}.xlsx`)
}

getList();
</script>
