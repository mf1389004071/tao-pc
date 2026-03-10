import request from '@/utils/request'

// 查询用户对知识内容的行为记录列表
export function listKnowledgeaction(query) {
  return request({
    url: '/bt10/knowledgeaction/list',
    method: 'get',
    params: query
  })
}

// 查询用户对知识内容的行为记录详细
export function getKnowledgeaction(id) {
  return request({
    url: '/bt10/knowledgeaction/' + id,
    method: 'get'
  })
}

// 新增用户对知识内容的行为记录
export function addKnowledgeaction(data) {
  return request({
    url: '/bt10/knowledgeaction',
    method: 'post',
    data: data
  })
}

// 修改用户对知识内容的行为记录
export function updateKnowledgeaction(data) {
  return request({
    url: '/bt10/knowledgeaction',
    method: 'put',
    data: data
  })
}

// 删除用户对知识内容的行为记录（支持单个 id 或 id 数组）
export function delKnowledgeaction(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/knowledgeaction/${_ids}`,
    method: 'delete'
  })
}
