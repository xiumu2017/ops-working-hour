<template>
  <div class="app-container">
    <!-- 查询区域 -->
    <div class="filter-container">
      <el-input v-model="pageQuery.realName" placeholder="请输入姓名" style="width: 200px;" class="filter-item" />
      <el-select v-model="pageQuery.enable" class="filter-item" placeholder="启用/禁用" clearable>
        <el-option key="1" :value="1" label="启用" />
        <el-option key="0" :value="0" label="禁用" />
      </el-select>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="mini" icon="el-icon-search"
        @click="fetchData">查询</el-button>

      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-refresh"
        @click="reset">重置</el-button>

      <el-button class="filter-item" style="margin-left: 10px;" size="mini" type="primary" icon="el-icon-upload"
        @click="uploadDialogVisiable = true">导入</el-button>

      <el-dialog :visible.sync="uploadDialogVisiable" width="30%">
        <el-upload class="upload-demo" style="margin-left: 25%" drag
          action="http://localhost:8080/ops/attendance/records" :before-upload="beforeUpload" :show-file-list="false"
          :on-success="handlerUploadSuccess">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传 <strong> xlsx </strong> 文件且文件大小不超过 <b>10M</b></div>
        </el-upload>
      </el-dialog>
    </div>
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="姓名" width="75" align="center">
        <template slot-scope="scope">
          {{ scope.row.realName }}
        </template>
      </el-table-column>

      <el-table-column label="考勤组" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.attendanceDepartName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="部门" width="350" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.departFullName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="工号" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.workNo }}
        </template>
      </el-table-column>

      <el-table-column label="职位" width="100" align="center">
        <template slot-scope="scope">
          {{ scope.row.position }}
        </template>
      </el-table-column>

      <el-table-column label="考勤日期" width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.attendanceDate }}
        </template>
      </el-table-column>

      <el-table-column label="考勤时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.attendanceTime }}
        </template>
      </el-table-column>

      <el-table-column label="打卡时间" width="140" align="center">
        <template slot-scope="scope">
          {{ scope.row.clockInTime }}
        </template>
      </el-table-column>

      <el-table-column label="打卡结果" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.clockInResult }}
        </template>
      </el-table-column>

      <el-table-column label="打卡地址" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clockInAddress }}</span>
        </template>
      </el-table-column>

      <el-table-column label="打卡备注" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clockInRemark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常打卡原因" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.exClockInReason }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打卡设备" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.clockInDevice }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageQuery.pageSize"
      :current-page.sync="pageQuery.pageNum" @current-change="fetchData" />
  </div>
</template>

<script>
import { getList } from '@/api/ops/record'

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
      uploadDialogVisiable: false,
      list: null,
      listLoading: true,
      pageQuery: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.pageQuery).then(response => {
        this.list = response.payload.records
        this.listLoading = false
        this.total = response.payload.total
      })
    },
    reset() {
      this.pageQuery = {
        pageNum: 1,
        pageSize: 10
      }
    },

    beforeUpload(file) {
      console.log(file.type)
      const isJPG = file.type === 'image/jpeg'
      const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isXlsx) {
        this.$message.error('上传文件只能是 xlsx 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isXlsx && isLt2M
    },
    handlerUploadSuccess(response, file, fileList) {
      console.log(response)
      if (response && response.code === 0) {
        this.uploadDialogVisiable = false
        this.$message.success('文件上传成功')
      } else {
        this.$message.error(response.message)
      }
    }
  }
}
</script>
