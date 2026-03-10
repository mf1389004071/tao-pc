<template>
  <div class="app-container">
    <el-card shadow="never" body-class="search-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input
            v-model="queryParams.subtitle"
            placeholder="请输入副标题"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属分类ID" prop="categoryId">
          <el-input
            v-model="queryParams.categoryId"
            placeholder="请输入所属分类ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="作者用户ID" prop="authorId">
          <el-input
            v-model="queryParams.authorId"
            placeholder="请输入作者用户ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="创始人/发起人ID" prop="founderId">
          <el-input
            v-model="queryParams.founderId"
            placeholder="请输入创始人/发起人ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="内容负责人ID" prop="managerId">
          <el-input
            v-model="queryParams.managerId"
            placeholder="请输入内容负责人ID"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker clearable
            v-model="queryParams.publishTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="浏览次数" prop="viewCount">
          <el-input
            v-model="queryParams.viewCount"
            placeholder="请输入浏览次数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="点赞数" prop="likeCount">
          <el-input
            v-model="queryParams.likeCount"
            placeholder="请输入点赞数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="评论数" prop="commentCount">
          <el-input
            v-model="queryParams.commentCount"
            placeholder="请输入评论数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="分享数" prop="shareCount">
          <el-input
            v-model="queryParams.shareCount"
            placeholder="请输入分享数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="收藏数" prop="collectCount">
          <el-input
            v-model="queryParams.collectCount"
            placeholder="请输入收藏数"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="SEO标题" prop="seoTitle">
          <el-input
            v-model="queryParams.seoTitle"
            placeholder="请输入SEO标题"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="SEO关键词" prop="seoKeywords">
          <el-input
            v-model="queryParams.seoKeywords"
            placeholder="请输入SEO关键词"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="来源" prop="sourceFrom">
          <el-input
            v-model="queryParams.sourceFrom"
            placeholder="请输入来源"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="难度等级" prop="difficultyLevel">
          <el-input
            v-model="queryParams.difficultyLevel"
            placeholder="请输入难度等级"
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
            v-hasPermi="['bt10:knowledgecontent:add']"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="Edit"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bt10:knowledgecontent:edit']"
          >修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="Delete"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bt10:knowledgecontent:remove']"
          >删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="Download"
            @click="handleExport"
            v-hasPermi="['bt10:knowledgecontent:export']"
          >导出</el-button>
        </el-col>
        <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>

      <el-table v-loading="loading" :data="knowledgecontentList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="副标题" align="center" prop="subtitle" />
      <el-table-column label="正文内容" align="center" prop="content" />
      <el-table-column label="类型：文章/工具/案例/Wiki等" align="center" prop="contentType" />
      <el-table-column label="所属分类ID" align="center" prop="categoryId" />
      <el-table-column label="作者用户ID" align="center" prop="authorId" />
      <el-table-column label="创始人/发起人ID" align="center" prop="founderId" />
      <el-table-column label="重点贡献人(逗号分隔)" align="center" prop="keyContributors" />
      <el-table-column label="内容负责人ID" align="center" prop="managerId" />
      <el-table-column label="宣传语" align="center" prop="promotionalText" />
      <el-table-column label="核心价值观描述" align="center" prop="coreValues" />
      <el-table-column label="标签(逗号分隔)" align="center" prop="tags" />
      <el-table-column label="状态：草稿/审核中/已发布/归档/已删" align="center" prop="bizStatus" />
        <el-table-column label="发布时间" align="center" prop="publishTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.publishTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
      <el-table-column label="浏览次数" align="center" prop="viewCount" />
      <el-table-column label="点赞数" align="center" prop="likeCount" />
      <el-table-column label="评论数" align="center" prop="commentCount" />
      <el-table-column label="分享数" align="center" prop="shareCount" />
      <el-table-column label="收藏数" align="center" prop="collectCount" />
      <el-table-column label="SEO标题" align="center" prop="seoTitle" />
      <el-table-column label="SEO描述" align="center" prop="seoDescription" />
      <el-table-column label="SEO关键词" align="center" prop="seoKeywords" />
      <el-table-column label="来源" align="center" prop="sourceFrom" />
      <el-table-column label="难度等级" align="center" prop="difficultyLevel" />
      <el-table-column label="AI生成摘要" align="center" prop="aiSummary" />
      <el-table-column label="扩展文本1" align="center" prop="text1" />
      <el-table-column label="扩展文本2" align="center" prop="text2" />
      <el-table-column label="扩展文本3" align="center" prop="text3" />
      <el-table-column label="扩展JSON" align="center" prop="jsonData" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="状态" align="center" prop="status" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['bt10:knowledgecontent:edit']">修改</el-button>
            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['bt10:knowledgecontent:remove']">删除</el-button>
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

    <!-- 添加或修改知识库内容对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="knowledgecontentRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="副标题" prop="subtitle">
          <el-input v-model="form.subtitle" placeholder="请输入副标题" />
        </el-form-item>
        <el-form-item label="正文内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="类型：文章/工具/案例/Wiki等" prop="contentType">
          <el-select v-model="form.contentType" multiple filterable remote reserve-keyword remote-show-suffix
            placeholder="请选择类型：文章/工具/案例/Wiki等"
            :remote-method="remoteMethodContentType"
            :loading="loadingContentType"
          >
            <el-option v-for="item in optionsContentType" :key="item.value"
              :label="item.label" :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属分类ID" prop="categoryId">
          <el-input v-model="form.categoryId" placeholder="请输入所属分类ID" />
        </el-form-item>
        <el-form-item label="作者用户ID" prop="authorId">
          <el-input v-model="form.authorId" placeholder="请输入作者用户ID" />
        </el-form-item>
        <el-form-item label="创始人/发起人ID" prop="founderId">
          <el-input v-model="form.founderId" placeholder="请输入创始人/发起人ID" />
        </el-form-item>
        <el-form-item label="重点贡献人(逗号分隔)" prop="keyContributors">
          <el-input v-model="form.keyContributors" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="内容负责人ID" prop="managerId">
          <el-input v-model="form.managerId" placeholder="请输入内容负责人ID" />
        </el-form-item>
        <el-form-item label="宣传语" prop="promotionalText">
          <el-input v-model="form.promotionalText" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="核心价值观描述" prop="coreValues">
          <el-input v-model="form.coreValues" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="标签(逗号分隔)" prop="tags">
          <el-input v-model="form.tags" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker clearable
            v-model="form.publishTime"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="浏览次数" prop="viewCount">
          <el-input v-model="form.viewCount" placeholder="请输入浏览次数" />
        </el-form-item>
        <el-form-item label="点赞数" prop="likeCount">
          <el-input v-model="form.likeCount" placeholder="请输入点赞数" />
        </el-form-item>
        <el-form-item label="评论数" prop="commentCount">
          <el-input v-model="form.commentCount" placeholder="请输入评论数" />
        </el-form-item>
        <el-form-item label="分享数" prop="shareCount">
          <el-input v-model="form.shareCount" placeholder="请输入分享数" />
        </el-form-item>
        <el-form-item label="收藏数" prop="collectCount">
          <el-input v-model="form.collectCount" placeholder="请输入收藏数" />
        </el-form-item>
        <el-form-item label="SEO标题" prop="seoTitle">
          <el-input v-model="form.seoTitle" placeholder="请输入SEO标题" />
        </el-form-item>
        <el-form-item label="SEO描述" prop="seoDescription">
          <el-input v-model="form.seoDescription" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="SEO关键词" prop="seoKeywords">
          <el-input v-model="form.seoKeywords" placeholder="请输入SEO关键词" />
        </el-form-item>
        <el-form-item label="来源" prop="sourceFrom">
          <el-input v-model="form.sourceFrom" placeholder="请输入来源" />
        </el-form-item>
        <el-form-item label="难度等级" prop="difficultyLevel">
          <el-input v-model="form.difficultyLevel" placeholder="请输入难度等级" />
        </el-form-item>
        <el-form-item label="AI生成摘要" prop="aiSummary">
          <el-input v-model="form.aiSummary" type="textarea" placeholder="请输入内容" />
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

<script setup name="Knowledgecontent">
import { listKnowledgecontent, getKnowledgecontent, delKnowledgecontent, addKnowledgecontent, updateKnowledgecontent } from "@/api/bt10/knowledgecontent";

const { proxy } = getCurrentInstance();

const knowledgecontentList = ref([]);
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
    title: null,
    subtitle: null,
    content: null,
    contentType: null,
    categoryId: null,
    authorId: null,
    founderId: null,
    keyContributors: null,
    managerId: null,
    promotionalText: null,
    coreValues: null,
    tags: null,
    bizStatus: null,
    publishTime: null,
    viewCount: null,
    likeCount: null,
    commentCount: null,
    shareCount: null,
    collectCount: null,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: null,
    sourceFrom: null,
    difficultyLevel: null,
    aiSummary: null,
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

/** 查询知识库内容列表 */
function getList() {
  loading.value = true;
  listKnowledgecontent(queryParams.value).then(response => {
    knowledgecontentList.value = response.rows;
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
    title: null,
    subtitle: null,
    content: null,
    contentType: null,
    categoryId: null,
    authorId: null,
    founderId: null,
    keyContributors: null,
    managerId: null,
    promotionalText: null,
    coreValues: null,
    tags: null,
    bizStatus: null,
    publishTime: null,
    viewCount: null,
    likeCount: null,
    commentCount: null,
    shareCount: null,
    collectCount: null,
    seoTitle: null,
    seoDescription: null,
    seoKeywords: null,
    sourceFrom: null,
    difficultyLevel: null,
    aiSummary: null,
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
  proxy.resetForm("knowledgecontentRef");
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
  title.value = "添加知识库内容";
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset();
  const _id = row.id || ids.value
  getKnowledgecontent(_id).then(response => {
    form.value = response.data;
    open.value = true;
    title.value = "修改知识库内容";
  });
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["knowledgecontentRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateKnowledgecontent(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          open.value = false;
          getList();
        });
      } else {
        addKnowledgecontent(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除知识库内容编号为"' + _ids + '"的数据项？').then(function() {
    return delKnowledgecontent(_ids);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}



/** 导出按钮操作 */
function handleExport() {
  proxy.download('bt10/knowledgecontent/export', {
    ...queryParams.value
  }, `knowledgecontent_${new Date().getTime()}.xlsx`)
}

getList();
</script>
