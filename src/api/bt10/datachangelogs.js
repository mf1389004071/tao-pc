import request from '@/utils/request'

// 查询通用业务数据变更审计列表
export function listDatachangelogs(query) {
  return request({
    url: '/bt10/datachangelogs/list',
    method: 'get',
    params: query
  })
}

// 查询通用业务数据变更审计详细
export function getDatachangelogs(id) {
  return request({
    url: '/bt10/datachangelogs/' + id,
    method: 'get'
  })
}

// 新增通用业务数据变更审计
export function addDatachangelogs(data) {
  return request({
    url: '/bt10/datachangelogs',
    method: 'post',
    data: data
  })
}

// 修改通用业务数据变更审计
export function updateDatachangelogs(data) {
  return request({
    url: '/bt10/datachangelogs',
    method: 'put',
    data: data
  })
}

// 删除通用业务数据变更审计（支持单个 id 或 id 数组）
export function delDatachangelogs(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/datachangelogs/${_ids}`,
    method: 'delete'
  })
}
