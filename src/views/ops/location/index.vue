<template>
  <div class="app-container">
    <!-- 查询区域 -->
    <div class="filter-container">
      <el-input
        v-model="pageQuery.psaName"
        placeholder="请输入电站名称"
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
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
    >
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
      <el-table-column
        align="center"
        prop="created_at"
        label="创建时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
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
import { getList } from "@/api/ops/locations";

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      pageQuery: {
        pageNum: 1,
        pageSize: 10,
        psaName: "",
      },
      total: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList(this.pageQuery).then((response) => {
        this.list = response.payload.records;
        this.listLoading = false;
        this.total = response.payload.total;
      });
    },
    reset() {
      this.pageQuery = {
        pageNum: 1,
        pageSize: 10,
      };
    },
  },
};
</script>
