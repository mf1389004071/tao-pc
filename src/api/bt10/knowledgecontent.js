import request from '@/utils/request'

// 查询知识库内容列表
export function listKnowledgecontent(query) {
  return request({
    url: '/bt10/knowledgecontent/list',
    method: 'get',
    params: query
  })
}

// 查询知识库内容详细
export function getKnowledgecontent(id) {
  return request({
    url: '/bt10/knowledgecontent/' + id,
    method: 'get'
  })
}

// 新增知识库内容
export function addKnowledgecontent(data) {
  return request({
    url: '/bt10/knowledgecontent',
    method: 'post',
    data: data
  })
}

// 修改知识库内容
export function updateKnowledgecontent(data) {
  return request({
    url: '/bt10/knowledgecontent',
    method: 'put',
    data: data
  })
}

// 删除知识库内容（支持单个 id 或 id 数组）
export function delKnowledgecontent(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/knowledgecontent/${_ids}`,
    method: 'delete'
  })
}
