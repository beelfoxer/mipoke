<template>
  <div>
    <el-card shadow="never">
      <div slot="header">设备管理</div>
      <div>
        <el-table
          border
          style="width: 100%"
          :data="deviceList"
          :row-key="getRowKeys"
          :expand-row-keys="expandRowKeys"
          @row-click="clickTableRow"
          @expand-change="expandChange"
        >
          <el-table-column label="#" type="expand">
            <template slot-scope="props">
              <protTable
                :table-data="portList
                  .filter((data) => data.deviceId === props.row.id)"
              />
            </template>
          </el-table-column>
          <el-table-column label="设备 ID" prop="id" />
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag
                size="medium"
                :type="scope.row.status ? 'success' : 'danger'"
              >{{ scope.row.status ? "在线" : "离线" }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import deviceApi from '@/api/internal-network/device'
import protTable from './protTable'

export default {
  name: 'Index',
  components: {
    protTable
  },
  data() {
    return {
      expandRowKeys: [],
      deviceList: [],
      portList: []
    }
  },
  created() {
    this.loadResource()
  },
  methods: {
    async loadResource() {
      await this.loadDeviceList()
      await this.loadPortList()
    },

    async loadDeviceList() {
      this.deviceList = await deviceApi.devices()
    },

    async loadPortList() {
      this.portList = await deviceApi.ports()
    },

    clickTableRow(row) {
      this.expandChange(row)
    },

    expandChange(row, expandedRows) {
      this.expandRowKeys = this.expandRowKeys.length && this.expandRowKeys[0] === row.id ? [] : [row.id]
    },

    getRowKeys(row) {
      return row.id
    }
  }
}
</script>

<style scoped>
.el-table /deep/ td,
.el-table /deep/ th {
  text-align: center;
}

.el-tag {
  padding: 0px 20px;
}
</style>
