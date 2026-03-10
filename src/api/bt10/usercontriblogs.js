import request from '@/utils/request'

// 查询用户贡献点收支流水列表
export function listUsercontriblogs(query) {
  return request({
    url: '/bt10/usercontriblogs/list',
    method: 'get',
    params: query
  })
}

// 查询用户贡献点收支流水详细
export function getUsercontriblogs(id) {
  return request({
    url: '/bt10/usercontriblogs/' + id,
    method: 'get'
  })
}

// 新增用户贡献点收支流水
export function addUsercontriblogs(data) {
  return request({
    url: '/bt10/usercontriblogs',
    method: 'post',
    data: data
  })
}

// 修改用户贡献点收支流水
export function updateUsercontriblogs(data) {
  return request({
    url: '/bt10/usercontriblogs',
    method: 'put',
    data: data
  })
}

// 删除用户贡献点收支流水（支持单个 id 或 id 数组）
export function delUsercontriblogs(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/usercontriblogs/${_ids}`,
    method: 'delete'
  })
}
