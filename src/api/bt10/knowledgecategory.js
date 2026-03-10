import request from '@/utils/request'

// 查询知识库分类列表
export function listKnowledgecategory(query) {
  return request({
    url: '/bt10/knowledgecategory/list',
    method: 'get',
    params: query
  })
}

// 查询知识库分类详细
export function getKnowledgecategory(id) {
  return request({
    url: '/bt10/knowledgecategory/' + id,
    method: 'get'
  })
}

// 新增知识库分类
export function addKnowledgecategory(data) {
  return request({
    url: '/bt10/knowledgecategory',
    method: 'post',
    data: data
  })
}

// 修改知识库分类
export function updateKnowledgecategory(data) {
  return request({
    url: '/bt10/knowledgecategory',
    method: 'put',
    data: data
  })
}

// 删除知识库分类（支持单个 id 或 id 数组）
export function delKnowledgecategory(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/knowledgecategory/${_ids}`,
    method: 'delete'
  })
}
