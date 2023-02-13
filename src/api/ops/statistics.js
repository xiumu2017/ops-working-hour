import request from '@/utils/requestServer'

export function getList(params) {
  return request({
    url: '/ops/working-hours/records',
    method: 'get',
    params
  })
}

export function getUsers(params) {
  return request({
    url: '/ops/working-hours/users',
    method: 'get',
    params
  })
}

export function getPsaList(params) {
  return request({
    url: '/ops/working-hours/psa',
    method: 'get',
    params
  })
}

export function getPsaStatistics(params) {
  return request({
    url: '/ops/working-hours/statistics/psa',
    method: 'get',
    params
  })
}

export function getUserStatistics(params) {
  return request({
    url: '/ops/working-hours/statistics/users',
    method: 'get',
    params
  })
}
