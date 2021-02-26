<template>
  <el-card class="box-card" shadow="never">

    <el-table
      border
      style="width: 100%"
      :data="tableData.filter((data, index) => index > pageSize * (currentPage - 1) - 1 && index < pageSize * currentPage)"
    >
      <el-table-column label="端口 ID" prop="portIndex" />
      <el-table-column label="端口名" prop="name" />
      <el-table-column label="MAC地址" prop="mac" />
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :total="tableData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50],
      currentPage: 1
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
    },

    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    }
  }
}
</script>

<style scoped>
.el-card /deep/ .el-card__body {
  padding-bottom: 10px;
}
.el-pagination {
  padding-top: 10px;
  text-align: right;
}
</style>
