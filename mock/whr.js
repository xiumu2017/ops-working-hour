const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    psaId: '@integer(300, 5000)',
    psaName: '@sentence(5, 10)',
    coordinate: '@sentence(5, 10)',
    placeAddress: '@sentence(5, 10)',
    opsLongtitude: '@sentence(5, 10)',
    opsLatitude: '@sentence(5, 10)',
    opsGeoHash: '@sentence(5, 10)',
    'status|1': ['published', 'draft', 'deleted'],
    author: 'name',
    createTime: '@datetime'
  }]
})

module.exports = [
  {
    url: '/mock/ops/psa/locations',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 20000,
        payload: {
          total: items.length,
          records: items
        }
      }
    }
  }
]
