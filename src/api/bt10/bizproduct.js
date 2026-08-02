import request from '@/utils/request'

export function listBizproduct(query) {
  return request({
    url: '/bt10/bizproduct/list',
    method: 'get',
    params: query
  })
}

export function getBizproduct(id) {
  return request({
    url: '/bt10/bizproduct/' + id,
    method: 'get'
  })
}

export function addBizproduct(data) {
  return request({
    url: '/bt10/bizproduct',
    method: 'post',
    data: data
  })
}

export function updateBizproduct(data) {
  return request({
    url: '/bt10/bizproduct',
    method: 'put',
    data: data
  })
}

export function delBizproduct(ids) {
  const _ids = Array.isArray(ids) ? ids.join(',') : ids
  return request({
    url: `/bt10/bizproduct/${_ids}`,
    method: 'delete'
  })
}
