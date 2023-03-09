<template>
  <div>
    <el-row type="flex" class="row-bg">
      <div>
        <el-radio-group v-model="formData.scheduled" @change="refresh">
          <el-radio-button :label="true">排班</el-radio-button>
          <el-radio-button :label="false">未排班</el-radio-button>
        </el-radio-group>
        <el-button @click="refresh">刷新</el-button>
      </div>
    </el-row>

    <el-row type="flex" class="row-bg">
      <el-col :span="6">
        <div class="sim-title">
          <span>考勤时间轴</span>
        </div>
        <div class="grid-content">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in sortedActivities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
              placement="top"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
          <el-button @click="attendanceRecordAddDialogVisible = true">
            添加打卡记录
          </el-button>
          <el-button @click="overTimeRecordAddDialogVisible = true">
            修改加班记录
          </el-button>
          <el-button @click="notWorkingRecordAddDialogVisible = true">
            添加请假记录
          </el-button>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="sim-title">
          <span>完整时间轴</span>
        </div>
        <div class="grid-content">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in hyperActivities"
              :key="index"
              :icon="activity.icon"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :timestamp="activity.timestamp"
              placement="top"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="sim-title">
          <span>工时统计表</span>
        </div>
        <div class="grid-content bg-purple-light">
          <el-table border fit highlight-current-row :data="records">
            <el-table-column label="电站名称">
              <template v-slot="scope">
                {{ scope.row.psaName }}
              </template>
            </el-table-column>
            <el-table-column label="开始时间">
              <template v-slot="scope">
                {{ scope.row.startTime }}
              </template>
            </el-table-column>
            <el-table-column label="结束时间">
              <template v-slot="scope">
                {{ scope.row.completeTime }}
              </template>
            </el-table-column>
            <el-table-column label="工时(h)">
              <template v-slot="scope">
                {{ (scope.row.durationMinute / 60).toFixed(2) }}
              </template>
            </el-table-column>
            <el-table-column label="工时类型">
              <template v-slot="scope">
                {{ scope.row.category === 'NORMAL' ? '电站运维' : '运营' }}
              </template>
            </el-table-column>
            <el-table-column label="是否加班">
              <template v-slot="scope">
                {{ scope.row.overTimeFlag ? '加班' : '/' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <div>
      <el-dialog
        :visible.sync="attendanceRecordAddDialogVisible"
        title="添加打卡记录"
      >
        <el-form>
          <el-form-item label="电站">
            <el-select v-model="selectedPsa" @change="onPsaSelectChange">
              <el-option
                v-for="psa in psaList"
                :key="psa.psaId"
                :value="psa.psaId"
                :label="psa.psaName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="打卡时间（HH:mm）">
            <el-input v-model="clockInTime" />
          </el-form-item>
        </el-form>
        <el-button @click="addAttendanceRecord">确定</el-button>
      </el-dialog>
      <el-dialog
        :visible.sync="overTimeRecordAddDialogVisible"
        title="加班记录"
      >
        <el-form>
          <el-form-item label="加班开始时间（HH:mm）">
            <el-input v-model="overTimeStartTime" />
          </el-form-item>
          <el-form-item label="加班结束时间（HH:mm）">
            <el-input v-model="overTimeEndTime" />
          </el-form-item>
        </el-form>
        <el-button @click="addOverTimeRecord">确定</el-button>
        <el-button @click="removeOverTimeRecord">清除</el-button>
      </el-dialog>
      <el-dialog
        :visible.sync="notWorkingRecordAddDialogVisible"
        title="请假记录"
      >
        <el-form>
          <el-form-item label="请假开始时间（HH:mm）">
            <el-input v-model="notWorkStartTime" />
          </el-form-item>
          <el-form-item label="请假结束时间（HH:mm）">
            <el-input v-model="notWorkEndTime" />
          </el-form-item>
        </el-form>
        <el-button @click="addNotWorkingRecord">确定</el-button>
        <el-button @click="removeNotWorkingRecord">清除</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getTimeline, getCalculator } from '@/api/ops/simulator'

export default {
  name: 'Simulator',
  data() {
    return {
      currentDate: '2023-02-27',
      records: [],
      selectedPsa: '3100',
      selectedPsaName: 'A',
      clockInTime: '',
      overTimeStartTime: '19:00',
      overTimeEndTime: '22:00',
      notWorkStartTime: '',
      notWorkEndTime: '',
      hasOverTimeRecord: true,
      attendanceRecordAddDialogVisible: false,
      overTimeRecordAddDialogVisible: false,
      notWorkingRecordAddDialogVisible: false,
      psaList: [
        { psaId: '0', psaName: '非电站-外勤' },
        { psaId: '1', psaName: '办公地-Office' },
        { psaId: '3100', psaName: 'A电站' },
        { psaId: '4100', psaName: 'B电站' },
        { psaId: '5100', psaName: 'C电站' },
        { psaId: '6100', psaName: 'D电站' },
        { psaId: '7100', psaName: 'E电站' },
      ],
      activities: [
        {
          content: 'A电站',
          psaId: '3100',
          psaName: 'A电站',
          timestamp: '07:33',
          icon: 'el-icon-position',
          type: 'success',
          size: 'large',
        },
        {
          content: 'B电站',
          psaId: '4100',
          psaName: 'B电站',
          timestamp: '11:33',
          icon: 'el-icon-position',
          type: 'success',
          size: 'large',
        },
        {
          content: '办公地-Office',
          psaId: '1',
          psaName: '办公地-Office',
          timestamp: '14:20',
          icon: 'el-icon-position',
          type: 'success',
          size: 'large',
        },
        {
          content: 'C电站',
          psaId: '5100',
          psaName: 'C电站',
          timestamp: '15:33',
          icon: 'el-icon-position',
          type: 'success',
          size: 'large',
        },
        {
          content: '非电站-外勤',
          psaId: '0',
          psaName: '非电站-外勤',
          timestamp: '17:05',
          icon: 'el-icon-position',
          type: 'success',
          size: 'large',
        },
        {
          content: 'C电站',
          psaId: '5100',
          psaName: 'C电站',
          timestamp: '18:33',
          icon: 'el-icon-position',
          type: 'success',
          size: 'large',
        },
      ],
      overTimeActivities: [
        {
          content: '加班开始',
          timestamp: '19:00',
          icon: 'el-icon-moon',
          type: 'danger',
          size: 'large',
        },
        {
          content: '加班结束',
          timestamp: '22:00',
          icon: 'el-icon-moon',
          type: 'danger',
          size: 'large',
        },
      ],
      notWorkActivities: [],
      hyperActivities: [],
      formData: {
        attendanceRecords: [],
        scheduled: true,
        notWorkingRecords: [],
        record: {},
      },
    }
  },
  computed: {
    sortedActivities() {
      const arr = this.activities
        .concat(this.overTimeActivities)
        .concat(this.notWorkActivities)
      console.log('computed')
      return arr.sort((a, b) => {
        const t1 = a.timestamp
        const t2 = b.timestamp
        if (t1 === t2) {
          return 0
        }
        const h1 = t1.substring(0, 2)
        const h2 = t2.substring(0, 2)
        if (h1 === h2) {
          const m1 = t1.substring(3, 5)
          const m2 = t2.substring(3, 5)
          return m1 - m2
        } else {
          return h1 - h2
        }
      })
    },
  },
  created() {
    const today = new Date()
    const month = today.getMonth() + 1
    const date = today.getDate()
    this.currentDate =
      today.getFullYear() +
      '-' +
      (month < 10 ? '0' + month : month) +
      '-' +
      (date < 10 ? '0' + date : date)

    console.log(this.currentDate)
    this.refresh()
  },
  methods: {
    fetchTimeLine() {
      this.initFormData()
      getTimeline(this.formData).then((res) => {
        this.hyperActivities = []
        this.hyperActivities = res.payload
      })
    },
    fetchTableData() {
      this.initFormData()
      getCalculator(this.formData).then((res) => {
        this.records = res.payload
      })
    },
    initFormData() {
      this.formData.attendanceRecords = []
      this.activities.forEach((item) => {
        this.formData.attendanceRecords.push({
          ciTime: this.currentDate + ' ' + item.timestamp,
          psaName: item.psaName,
          psaId: item.psaId,
        })
      })
      if (this.hasOverTimeRecord) {
        this.formData.record.startTime =
          this.currentDate + ' ' + this.overTimeStartTime
        this.formData.record.endTime =
          this.currentDate + ' ' + this.overTimeEndTime
      }
      if (this.notWorkStartTime && this.notWorkEndTime) {
        this.formData.notWorkingRecords[0] = {
          startTime: this.currentDate + ' ' + this.notWorkStartTime,
          endTime: this.currentDate + ' ' + this.notWorkEndTime,
        }
      }
    },
    addAttendanceRecord() {
      this.activities.push({
        content: this.selectedPsaName + ' 电站打卡',
        timestamp: this.clockInTime,
        icon: 'el-icon-position',
        type: 'success',
        size: 'large',
        psaId: this.selectedPsa,
        psaName: this.selectedPsaName,
      })
      // 如何触发排序
      this.fetchTimeLine()
      this.attendanceRecordAddDialogVisible = false
    },
    onPsaSelectChange(val) {
      this.psaList.forEach((item) => {
        if (item.psaId === val) {
          this.selectedPsaName = item.psaName
        }
      })
    },
    addOverTimeRecord() {
      this.overTimeActivities = []
      this.overTimeActivities.push({
        content: '加班开始',
        timestamp: this.overTimeStartTime,
        icon: 'el-icon-moon',
        type: 'danger',
        size: 'large',
      })
      this.overTimeActivities.push({
        content: '加班结束',
        timestamp: this.overTimeEndTime,
        icon: 'el-icon-moon',
        type: 'danger',
        size: 'large',
      })
      this.refresh()
      this.overTimeRecordAddDialogVisible = false
    },
    removeOverTimeRecord() {
      this.overTimeActivities = []
      this.hasOverTimeRecord = false
      this.overTimeStartTime = ''
      this.overTimeEndTime = ''
      this.formData.record = null
      this.refresh()
      this.overTimeRecordAddDialogVisible = false
    },
    refresh() {
      this.fetchTimeLine()
      this.fetchTableData()
    },
    addNotWorkingRecord() {
      this.notWorkActivities = []
      this.notWorkActivities.push({
        content: '请假开始',
        timestamp: this.notWorkStartTime,
        icon: 'el-icon-bottom',
        type: 'primary',
        size: 'large',
      })
      this.notWorkActivities.push({
        content: '请假结束',
        timestamp: this.notWorkEndTime,
        icon: 'el-icon-top',
        type: 'primary',
        size: 'large',
      })
      this.refresh()
      this.notWorkingRecordAddDialogVisible = false
    },
    removeNotWorkingRecord() {
      this.notWorkActivities = []
      this.notWorkStartTime = ''
      this.notWorkEndTime = ''
      this.formData.notWorkingRecords = []
      this.refresh()
      this.notWorkingRecordAddDialogVisible = false
    },
  },
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;

  & :last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.sim-title {
  margin-bottom: 10px;
}

.el-timeline-item__timestamp {
  font-size: 16px;
  font-weight: bold;
}
</style>
