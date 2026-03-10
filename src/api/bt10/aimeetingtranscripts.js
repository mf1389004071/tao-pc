import request from '@/utils/request'

// 查询音视频转写与AI摘要列表
export function listAimeetingtranscripts(query) {
  return request({
    url: '/bt10/aimeetingtranscripts/list',
    method: 'get',
    params: query
  })
}

// 查询音视频转写与AI摘要详细
export function getAimeetingtranscripts(id) {
  return request({
    url: '/bt10/aimeetingtranscripts/' + id,
    method: 'get'
  })
}

// 新增音视频转写与AI摘要
export function addAimeetingtranscripts(data) {
  return request({
    url: '/bt10/aimeetingtranscripts',
    method: 'post',
    data: data
  })
}

// 修改音视频转写与AI摘要
export function updateAimeetingtranscripts(data) {
  return request({
    url: '/bt10/aimeetingtranscripts',
    method: 'put',
    data: data
  })
}

// 删除音视频转写与AI摘要（支持单个 id 或 id 数组）
export function delAimeetingtranscripts(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/aimeetingtranscripts/${_ids}`,
    method: 'delete'
  })
}
