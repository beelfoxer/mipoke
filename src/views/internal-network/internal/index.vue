<template>
  <div>
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">内网管理</span>
        <el-button
          type="primary"
          style="float: right; padding: 5px 15px;"
          @click="dialogAddRingFlag = true"
        >添加</el-button>
        <el-dialog
          width="800px"
          :visible.sync="dialogAddRingFlag"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          @closed="dialogClosed"
        >
          <addRingForm
            ref="addRingForm"
            :switch-list="switchListFilterUsed"
            :ring-list="ringList"
            @hideDialog="hideDialog"
            @addRing="addRing($event)"
          />
        </el-dialog>
      </div>
      <div>
        <el-table
          border
          style="width: 100%"
          :data="ringList"
          :row-key="getRowKeys"
          :expand-row-keys="expandRowKeys"
          @row-click="clickTableRow"
          @expand-change="expandChange"
        >
          <el-table-column label="#" type="expand">
            <template slot-scope="props">
              <deviceTable :table-data="switchListFilterByIDs(props.row.switchIds)" />
            </template>
          </el-table-column>
          <el-table-column :label="ringNameLabel" prop="ringname" />
          <el-table-column :label="ringIDLabel" prop="id" />
          <el-table-column label="设备数量">
            <template slot-scope="scope">
              {{ scope.row.switchIds.length }} 台
            </template>
          </el-table-column>
          <el-table-column :label="mgmtVlanIdLabel" prop="mgmtVlanId" />
          <el-table-column :label="mgmtCidrLabel" prop="mgmtCidr" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除ring" placement="bottom">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click.native.stop="deleteRing(scope.row.id)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import ringApi from '@/api/internal-network/ring'
import deviceApi from '@/api/internal-network/device'

import addRingForm from './addRingForm'
import deviceTable from './deviceTable'

export default {
  name: 'Index',
  components: {
    addRingForm,
    deviceTable
  },

  data() {
    return {
      ringList: [],
      switchList: [],
      dialogAddRingFlag: false,
      expandRowKeys: [],
      rowClickTime: false,

      ringNameLabel: 'ring 名',
      ringIDLabel: 'ring ID',
      mgmtVlanIdLabel: 'mgmtVlanId',
      mgmtCidrLabel: 'mgmtCidr'
    }
  },

  computed: {
    switchListFilterUsed: function() {
      return this.switchList.filter(item => {
        let isUsed = true
        for (let i = 0; i < this.ringList.length; i++) {
          if (this.ringList[i].switchIds.indexOf(item.id) > -1) {
            isUsed = false
            break
          }
        }
        return isUsed
      })
    }
  },

  created() {
    this.loadResource()
  },

  methods: {
    async loadResource() {
      await this.loadRingList()
      await this.loadSwitchList()
    },

    async loadRingList() {
      this.ringList = await ringApi.rings()
    },

    async loadSwitchList() {
      this.switchList = await deviceApi.devices()
    },

    async addRing(addRingFormData) {
      await ringApi.addRing(addRingFormData)
      this.loadResource()
    },

    async deleteRing(id) {
      await ringApi.deleteRing(id)
      this.loadResource()
    },

    switchListFilterByIDs(ids) {
      return this.switchList.filter(item => {
        return ids.indexOf(item.id) !== -1
      })
    },

    hideDialog() {
      this.dialogAddRingFlag = false
    },

    getRowKeys(row) {
      return row.id
    },

    clickTableRow(row) {
      this.expandChange(row)
    },

    expandChange(row, expandedRows) {
      this.expandRowKeys = this.expandRowKeys.length && this.expandRowKeys[0] === row.id ? [] : [row.id]
    },

    dialogClosed() {
      this.$refs.addRingForm.clearForm()
    }
  }
}
</script>

<style scoped>
.el-table /deep/ td,
.el-table /deep/ th {
  text-align: center;
}
.el-table /deep/ p {
  margin: 0;
}
.el-form-item {
  margin-bottom: 0px;
}
</style>
