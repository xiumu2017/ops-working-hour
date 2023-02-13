<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="PSA_ID" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.psaId }}
        </template>
      </el-table-column>
      <el-table-column label="电站名称" width="300" align="center">
      <template slot-scope="scope">
          <span>{{ scope.row.psaName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电站经纬度" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coordinate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电站地址" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.placeAddress }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经度" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.opsLongitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="纬度" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.opsLatitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="GEOHASH" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.opsGeoHash }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="Display_time" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/ops/locations'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList({ "pageNum": 1, "pageSize": 10 }).then(response => {
        this.list = response.payload.records
        this.listLoading = false
      })
    }
  }
}
</script>
