<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="真实姓名" prop="realName">
          <el-input
            v-model="queryParams.realName"
            placeholder="请输入真实姓名"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="当前积分余额" prop="points">
          <el-input
            v-model="queryParams.points"
            placeholder="请输入当前积分余额"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="历史累计获得积分" prop="totalPoints">
          <el-input
            v-model="queryParams.totalPoints"
            placeholder="请输入历史累计获得积分"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="贡献点余额(1:1人民币)" prop="contributionPoints">
          <el-input
            v-model="queryParams.contributionPoints"
            placeholder="请输入贡献点余额(1:1人民币)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="历史累计贡献点" prop="totalContributionPoints">
          <el-input
            v-model="queryParams.totalContributionPoints"
            placeholder="请输入历史累计贡献点"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="成长阶段：入门/学员/高手/导师" prop="growthStage">
          <el-input
            v-model="queryParams.growthStage"
            placeholder="请输入成长阶段：入门/学员/高手/导师"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="加入/注册日期" prop="joinDate">
          <el-date-picker clearable
            v-model="queryParams.joinDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择加入/注册日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最后活跃时间" prop="lastActiveAt">
          <el-date-picker clearable
            v-model="queryParams.lastActiveAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择最后活跃时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="微信开放平台 unionid" prop="wechatUnionid">
          <el-input
            v-model="queryParams.wechatUnionid"
            placeholder="请输入微信开放平台 unionid"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="微信开放平台 openid" prop="wechatOpenid">
          <el-input
            v-model="queryParams.wechatOpenid"
            placeholder="请输入微信开放平台 openid"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="小程序 openid" prop="miniappOpenid">
          <el-input
            v-model="queryParams.miniappOpenid"
            placeholder="请输入小程序 openid"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="企业微信用户ID" prop="wxWorkUserid">
          <el-input
            v-model="queryParams.wxWorkUserid"
            placeholder="请输入企业微信用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="Facebook用户ID" prop="facebookUserid">
          <el-input
            v-model="queryParams.facebookUserid"
            placeholder="请输入Facebook用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="Google用户ID" prop="googleUserid">
          <el-input
            v-model="queryParams.googleUserid"
            placeholder="请输入Google用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="Apple用户ID" prop="appleUserid">
          <el-input
            v-model="queryParams.appleUserid"
            placeholder="请输入Apple用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="Outlook用户ID" prop="outlookUserid">
          <el-input
            v-model="queryParams.outlookUserid"
            placeholder="请输入Outlook用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="小鹅通用户ID(同步)" prop="xiaoeUserId">
          <el-input
            v-model="queryParams.xiaoeUserId"
            placeholder="请输入小鹅通用户ID(同步)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="邀请人用户ID(sys_user.user_id)" prop="inviterId">
          <el-input
            v-model="queryParams.inviterId"
            placeholder="请输入邀请人用户ID(sys_user.user_id)"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="本人邀请码，用于邀请好友" prop="invitationCode">
          <el-input
            v-model="queryParams.invitationCode"
            placeholder="请输入本人邀请码，用于邀请好友"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="业务角色：创始人/联创/合伙人/高手/城市主理人/会员" prop="bizRole">
          <el-input
            v-model="queryParams.bizRole"
            placeholder="请输入业务角色：创始人/联创/合伙人/高手/城市主理人/会员"
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
            v-hasPermi="['bt10:userprofiles:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:userprofiles:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:userprofiles:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:userprofiles:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="userprofilesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID(主键且外键)" align="center" prop="userId" />
      <el-table-column label="真实姓名" align="center" prop="realName" />
      <el-table-column label="当前积分余额" align="center" prop="points" />
      <el-table-column label="历史累计获得积分" align="center" prop="totalPoints" />
      <el-table-column label="贡献点余额(1:1人民币)" align="center" prop="contributionPoints" />
      <el-table-column label="历史累计贡献点" align="center" prop="totalContributionPoints" />
      <el-table-column label="成长阶段：入门/学员/高手/导师" align="center" prop="growthStage" />
        <el-table-column label="加入/注册日期" align="center" prop="joinDate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.joinDate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最后活跃时间" align="center" prop="lastActiveAt" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.lastActiveAt, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="微信开放平台 unionid" align="center" prop="wechatUnionid" />
      <el-table-column label="微信开放平台 openid" align="center" prop="wechatOpenid" />
      <el-table-column label="小程序 openid" align="center" prop="miniappOpenid" />
      <el-table-column label="企业微信用户ID" align="center" prop="wxWorkUserid" />
      <el-table-column label="Facebook用户ID" align="center" prop="facebookUserid" />
      <el-table-column label="Google用户ID" align="center" prop="googleUserid" />
      <el-table-column label="Apple用户ID" align="center" prop="appleUserid" />
      <el-table-column label="Outlook用户ID" align="center" prop="outlookUserid" />
      <el-table-column label="小鹅通用户ID(同步)" align="center" prop="xiaoeUserId" />
      <el-table-column label="小鹅通原始数据快照" align="center" prop="xiaoeData" />
      <el-table-column label="邀请人用户ID(sys_user.user_id)" align="center" prop="inviterId" />
      <el-table-column label="本人邀请码，用于邀请好友" align="center" prop="invitationCode" />
      <el-table-column label="业务角色：创始人/联创/合伙人/高手/城市主理人/会员" align="center" prop="bizRole" />
      <el-table-column label="最美照片URL" align="center" prop="bestPhotoUrl" />
      <el-table-column label="微信头像URL(同步用)" align="center" prop="avatarWechatUrl" />
      <el-table-column label="宣传用头像URL" align="center" prop="avatarPromoUrl" />
      <el-table-column label="个人宣传图URL" align="center" prop="promoImageUrl" />
      <el-table-column label="心树图URL(商业定位成果)" align="center" prop="heartTreeUrl" />
      <el-table-column label="心钥图URL(商业定位成果)" align="center" prop="heartKeyUrl" />
      <el-table-column label="商业定位文案(探索本质)" align="center" prop="businessPositioning" />
      <el-table-column label="天赋解读与能力总结" align="center" prop="talentSummary" />
      <el-table-column label="可交流时段描述" align="center" prop="availableTimeSlots" />
      <el-table-column label="可约状态：可约/已约/不约" align="center" prop="appointmentStatus" />
      <el-table-column label="额外画像信息(JSON)，如家庭成员/挑战列表等" align="center" prop="extraProfile" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:userprofiles:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:userprofiles:remove']">删除</el-button>
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

    <!-- 添加或修改用户和角色关联表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="userprofilesRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="当前积分余额" prop="points">
          <el-input v-model="form.points" placeholder="请输入当前积分余额" />
        </el-form-item>
        <el-form-item label="历史累计获得积分" prop="totalPoints">
          <el-input v-model="form.totalPoints" placeholder="请输入历史累计获得积分" />
        </el-form-item>
        <el-form-item label="贡献点余额(1:1人民币)" prop="contributionPoints">
          <el-input v-model="form.contributionPoints" placeholder="请输入贡献点余额(1:1人民币)" />
        </el-form-item>
        <el-form-item label="历史累计贡献点" prop="totalContributionPoints">
          <el-input v-model="form.totalContributionPoints" placeholder="请输入历史累计贡献点" />
        </el-form-item>
        <el-form-item label="成长阶段：入门/学员/高手/导师" prop="growthStage">
          <el-input v-model="form.growthStage" placeholder="请输入成长阶段：入门/学员/高手/导师" />
        </el-form-item>
        <el-form-item label="加入/注册日期" prop="joinDate">
          <el-date-picker clearable
            v-model="form.joinDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择加入/注册日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="最后活跃时间" prop="lastActiveAt">
          <el-date-picker clearable
            v-model="form.lastActiveAt"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择最后活跃时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="微信开放平台 unionid" prop="wechatUnionid">
          <el-input v-model="form.wechatUnionid" placeholder="请输入微信开放平台 unionid" />
        </el-form-item>
        <el-form-item label="微信开放平台 openid" prop="wechatOpenid">
          <el-input v-model="form.wechatOpenid" placeholder="请输入微信开放平台 openid" />
        </el-form-item>
        <el-form-item label="小程序 openid" prop="miniappOpenid">
          <el-input v-model="form.miniappOpenid" placeholder="请输入小程序 openid" />
        </el-form-item>
        <el-form-item label="企业微信用户ID" prop="wxWorkUserid">
          <el-input v-model="form.wxWorkUserid" placeholder="请输入企业微信用户ID" />
        </el-form-item>
        <el-form-item label="Facebook用户ID" prop="facebookUserid">
          <el-input v-model="form.facebookUserid" placeholder="请输入Facebook用户ID" />
        </el-form-item>
        <el-form-item label="Google用户ID" prop="googleUserid">
          <el-input v-model="form.googleUserid" placeholder="请输入Google用户ID" />
        </el-form-item>
        <el-form-item label="Apple用户ID" prop="appleUserid">
          <el-input v-model="form.appleUserid" placeholder="请输入Apple用户ID" />
        </el-form-item>
        <el-form-item label="Outlook用户ID" prop="outlookUserid">
          <el-input v-model="form.outlookUserid" placeholder="请输入Outlook用户ID" />
        </el-form-item>
        <el-form-item label="小鹅通用户ID(同步)" prop="xiaoeUserId">
          <el-input v-model="form.xiaoeUserId" placeholder="请输入小鹅通用户ID(同步)" />
        </el-form-item>
        <el-form-item label="邀请人用户ID(sys_user.user_id)" prop="inviterId">
          <el-input v-model="form.inviterId" placeholder="请输入邀请人用户ID(sys_user.user_id)" />
        </el-form-item>
        <el-form-item label="本人邀请码，用于邀请好友" prop="invitationCode">
          <el-input v-model="form.invitationCode" placeholder="请输入本人邀请码，用于邀请好友" />
        </el-form-item>
        <el-form-item label="业务角色：创始人/联创/合伙人/高手/城市主理人/会员" prop="bizRole">
          <el-input v-model="form.bizRole" placeholder="请输入业务角色：创始人/联创/合伙人/高手/城市主理人/会员" />
        </el-form-item>
        <el-form-item label="最美照片URL" prop="bestPhotoUrl">
          <el-input v-model="form.bestPhotoUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="微信头像URL(同步用)" prop="avatarWechatUrl">
          <el-input v-model="form.avatarWechatUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="宣传用头像URL" prop="avatarPromoUrl">
          <el-input v-model="form.avatarPromoUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="个人宣传图URL" prop="promoImageUrl">
          <el-input v-model="form.promoImageUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="心树图URL(商业定位成果)" prop="heartTreeUrl">
          <el-input v-model="form.heartTreeUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="心钥图URL(商业定位成果)" prop="heartKeyUrl">
          <el-input v-model="form.heartKeyUrl" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="商业定位文案(探索本质)" prop="businessPositioning">
          <el-input v-model="form.businessPositioning" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="天赋解读与能力总结" prop="talentSummary">
          <el-input v-model="form.talentSummary" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="可交流时段描述" prop="availableTimeSlots">
          <el-input v-model="form.availableTimeSlots" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="额外画像信息(JSON)，如家庭成员/挑战列表等" prop="extraProfile">
          <file-upload v-model="form.extraProfile"/>
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

<script setup name="Userprofiles">
import { listUserprofiles, getUserprofiles, delUserprofiles, addUserprofiles, updateUserprofiles } from "@/api/bt10/userprofiles";

const { proxy } = getCurrentInstance();

const userprofilesList = ref([]);
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
    realName: null,
    points: null,
    totalPoints: null,
    contributionPoints: null,
    totalContributionPoints: null,
    growthStage: null,
    joinDate: null,
    lastActiveAt: null,
    wechatUnionid: null,
    wechatOpenid: null,
    miniappOpenid: null,
    wxWorkUserid: null,
    facebookUserid: null,
    googleUserid: null,
    appleUserid: null,
    outlookUserid: null,
    xiaoeUserId: null,
    xiaoeData: null,
    inviterId: null,
    invitationCode: null,
    bizRole: null,
    bestPhotoUrl: null,
    avatarWechatUrl: null,
    avatarPromoUrl: null,
    promoImageUrl: null,
    heartTreeUrl: null,
    heartKeyUrl: null,
    businessPositioning: null,
    talentSummary: null,
    availableTimeSlots: null,
    appointmentStatus: null,
    extraProfile: null,
    status: null,
  },
  rules: {
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询用户和角色关联表列表 */
function getList() {
  loading.value = true;
  listUserprofiles(queryParams.value).then(response => {
    userprofilesList.value = response.rows;
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
    userId: null,
    realName: null,
    points: null,
    totalPoints: null,
    contributionPoints: null,
    totalContributionPoints: null,
    growthStage: null,
    joinDate: null,
    lastActiveAt: null,
    wechatUnionid: null,
    wechatOpenid: null,
    miniappOpenid: null,
    wxWorkUserid: null,
    facebookUserid: null,
    googleUserid: null,
    appleUserid: null,
    outlookUserid: null,
    xiaoeUserId: null,
    xiaoeData: null,
    inviterId: null,
    invitationCode: null,
    bizRole: null,
    bestPhotoUrl: null,
    avatarWechatUrl: null,
    avatarPromoUrl: null,
    promoImageUrl: null,
    heartTreeUrl: null,
    heartKeyUrl: null,
    businessPositioning: null,
    talentSummary: null,
    availableTimeSlots: null,
    appointmentStatus: null,
    extraProfile: null,
    text1: null,
    text2: null,
    text3: null,
    jsonData: null,
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
  proxy.resetForm("userprofilesRef");
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
  ids.value = selection.map(item => item.userId);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  open.value = true;
  title.value = "添加用户和角色关联表";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _userId = row.userId || ids.value
  getUserprofiles(_userId).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改用户和角色关联表";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["userprofilesRef"].validate(valid => {
    if (valid) {
      if (form.value.userId != null) {
        updateUserprofiles(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addUserprofiles(form.value).then(response => {
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
  const _userIds = row.userId || ids.value;
  proxy.$modal.confirm('是否确认删除用户和角色关联表编号为"' + _userIds + '"的数据项？').then(function() {
    return delUserprofiles(_userIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/userprofiles/export', {
    ...queryParams.value
  }, `userprofiles_${new Date().getTime()}.xlsx`)
}

getList();
</script>
