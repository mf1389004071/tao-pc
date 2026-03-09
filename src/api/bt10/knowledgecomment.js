import request from '@/utils/request'

// 查询知识内容评论与回复，支持楼中楼与置顶列表
export function listKnowledgecomment(query) {
  return request({
    url: '/bt10/knowledgecomment/list',
    method: 'get',
    params: query
  })
}

// 查询知识内容评论与回复，支持楼中楼与置顶详细
export function getKnowledgecomment(id) {
  return request({
    url: '/bt10/knowledgecomment/' + id,
    method: 'get'
  })
}

// 新增知识内容评论与回复，支持楼中楼与置顶
export function addKnowledgecomment(data) {
  return request({
    url: '/bt10/knowledgecomment',
    method: 'post',
    data: data
  })
}

// 修改知识内容评论与回复，支持楼中楼与置顶
export function updateKnowledgecomment(data) {
  return request({
    url: '/bt10/knowledgecomment',
    method: 'put',
    data: data
  })
}

// 删除知识内容评论与回复，支持楼中楼与置顶（支持单个 id 或 id 数组）
export function delKnowledgecomment(ids) {
  let _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/knowledgecomment/${_ids}`,
    method: 'delete'
  })
}
