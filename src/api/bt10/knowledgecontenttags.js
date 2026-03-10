import request from '@/utils/request'

// 查询知识内容与标签多对多关联列表
export function listKnowledgecontenttags(query) {
  return request({
    url: '/bt10/knowledgecontenttags/list',
    method: 'get',
    params: query
  })
}

// 查询知识内容与标签多对多关联详细
export function getKnowledgecontenttags(id) {
  return request({
    url: '/bt10/knowledgecontenttags/' + id,
    method: 'get'
  })
}

// 新增知识内容与标签多对多关联
export function addKnowledgecontenttags(data) {
  return request({
    url: '/bt10/knowledgecontenttags',
    method: 'post',
    data: data
  })
}

// 修改知识内容与标签多对多关联
export function updateKnowledgecontenttags(data) {
  return request({
    url: '/bt10/knowledgecontenttags',
    method: 'put',
    data: data
  })
}

// 删除知识内容与标签多对多关联（支持单个 id 或 id 数组）
export function delKnowledgecontenttags(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/knowledgecontenttags/${_ids}`,
    method: 'delete'
  })
}
