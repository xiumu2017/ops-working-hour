<template>
  <div>
    <el-select v-model="workNo" filterable placeholder="请选择">
      <el-option
        v-for="item in users"
        :key="item.workNo"
        :label="item.realName"
        :value="item.workNo"
      />
    </el-select>
    <el-date-picker
      v-model="selectedDate"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期"
    />
    <el-button @click="queryRecord">查询</el-button>
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :type="activity.type"
        :color="activity.color"
        :size="activity.size"
        :timestamp="activity.timestamp"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getUsers } from '@/api/ops/statistics'
import { getList } from '@/api/ops/record'

export default {
  name: 'TimeLine',
  data() {
    return {
      workNo: '',
      realName: '',
      users: [],
      selectedDate: '',
      activities: [],
    }
  },
  created() {
    getUsers().then((response) => {
      this.users = response.payload
    })
  },
  methods: {
    queryRecord() {
      getList({
        workNo: this.workNo,
        pageSize: '100',
        pageNum: 1,
        startDate: this.selectedDate,
        endDate: this.selectedDate,
      }).then((res) => {
        const records = res.payload.records
        this.activities = []
        records.forEach((item) => {
          item.content = item.clockInAddress
          item.timestamp = item.clockInTime
          item.icon = 'el-icon-position'
          item.type = 'success'
          item.size = 'large'
          this.activities.push(item)
        })
      })
    },
  },
}
</script>

<style scoped></style>
