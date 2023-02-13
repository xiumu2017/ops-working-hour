import request from '@/utils/requestServer'

export function getList(params) {
  return request({
    url: '/ops/attendance/records',
    method: 'get',
    params
  })
}
