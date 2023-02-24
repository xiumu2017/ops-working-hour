import request from '@/utils/requestServer'

export function getList(params) {
  return request({
    url: '/ops/psa/locations',
    method: 'get',
    params,
  })
}
