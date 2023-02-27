<template>
  <div class="app-container">
    <!-- 查询区域 -->
    <div class="filter-container">
      <el-input
        v-model="pageQuery.realName"
        placeholder="请输入姓名"
        style="width: 200px"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        size="mini"
        icon="el-icon-search"
        @click="fetchData"
        >查询
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        size="mini"
        type="primary"
        icon="el-icon-refresh"
        @click="reset"
        >重置
      </el-button>

      <el-button
        class="filter-item"
        style="margin-left: 10px"
        size="mini"
        type="primary"
        icon="el-icon-upload"
        @click="statisticsDialogVisible = true"
        >打开统计
      </el-button>

      <el-dialog :visible.sync="statisticsDialogVisible" width="40%">
        <el-select
          v-model="workNo"
          filterable
          placeholder="请选择"
          @change="statisticsByUser"
        >
          <el-option
            v-for="item in users"
            :key="item.workNo"
            :label="item.realName"
            :value="item.workNo"
          />
        </el-select>
        <el-select
          v-model="psaId"
          filterable
          placeholder="请选择"
          @change="statisticsByPsa"
        >
          <el-option
            v-for="item in psaList"
            :key="item.psaId"
            :label="item.psaName"
            :value="item.psaId"
          />
        </el-select>

        <el-table
          v-loading="statisticsListLoading"
          :data="statisticsList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="ID" width="95">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>

          <el-table-column
            v-if="flag"
            label="电站ID"
            width="110"
            align="center"
          >
            <template v-slot="scope">
              <span>{{ scope.row.psaId ? scope.row.psaId : '--' }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="flag" label="电站名称">
            <template slot-scope="scope">
              {{ scope.row.psaName ? scope.row.psaName : '非电站' }}
            </template>
          </el-table-column>

          <el-table-column v-if="!flag" label="工号" width="110" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.workNo }}</span>
            </template>
          </el-table-column>

          <el-table-column v-if="!flag" label="姓名">
            <template slot-scope="scope">
              {{ scope.row.realName }}
            </template>
          </el-table-column>

          <el-table-column label="工时（分钟）" width="200" align="center">
            <template slot-scope="scope">
              {{ scope.row.duration }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="created_at"
            label="工时占比"
            width="200"
          >
            <template slot-scope="scope">
              <i class="el-icon-pie-chart" />
              <span>{{ scope.row.percent }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="日期" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.statDate }}
        </template>
      </el-table-column>

      <el-table-column label="工号" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.workNo }}
        </template>
      </el-table-column>

      <el-table-column label="姓名" width="75" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>

      <el-table-column label="PSA_ID" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.psaId }}
        </template>
      </el-table-column>
      <el-table-column label="电站名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.psaName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="开始时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.startTime }}
        </template>
      </el-table-column>

      <el-table-column label="结束时间" width="150" align="center">
        <template slot-scope="scope">
          {{ scope.row.completeTime }}
        </template>
      </el-table-column>

      <el-table-column label="工时（分钟）" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.durationMinute }}
        </template>
      </el-table-column>

      <el-table-column label="运维组" width="500" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.opsDepName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="地址" width="450" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        prop="created_at"
        label="创建时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createAt }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageQuery.pageSize"
      :current-page.sync="pageQuery.pageNum"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import {
  getList,
  getUsers,
  getPsaList,
  getUserStatistics,
  getPsaStatistics,
} from '@/api/ops/statistics'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger',
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      list: null,
      statisticsList: null,
      listLoading: true,
      statisticsListLoading: false,
      pageQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      users: [],
      psaList: [],
      workNo: '',
      psaId: '',
      statisticsDialogVisible: false,
      flag: true,
    }
  },
  created() {
    this.fetchData()
    this.getUserList()
    getPsaList().then((response) => {
      this.psaList = response.payload
    })
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.pageQuery).then((response) => {
        this.list = response.payload.records
        this.listLoading = false
        this.total = response.payload.total
      })
    },
    getUserList() {
      getUsers().then((response) => {
        this.users = response.payload
      })
    },
    reset() {
      this.pageQuery = {
        pageNum: 1,
        pageSize: 10,
      }
    },
    statisticsByUser(val) {
      this.statisticsListLoading = true
      getUserStatistics({ workNo: val }).then((res) => {
        console.log(res)
        this.flag = true
        this.psaId = null
        this.statisticsList = res.payload
        this.statisticsListLoading = false
      })
    },
    statisticsByPsa(val) {
      this.statisticsListLoading = true
      getPsaStatistics({ psaId: val }).then((res) => {
        console.log(res)
        this.flag = false
        this.workNo = null
        this.statisticsList = res.payload
        this.statisticsListLoading = false
      })
    },
  },
}
</script>
