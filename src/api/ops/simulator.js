import request from '@/utils/requestServer'

export function getCalculator(data) {
  return request({
    url: '/ops/working-hours/simulator/calculator',
    method: 'post',
    data,
  })
}
export function getTimeline(data) {
  return request({
    url: '/ops/working-hours/simulator/timeline',
    method: 'post',
    data,
  })
}
