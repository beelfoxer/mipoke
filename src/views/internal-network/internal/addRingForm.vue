<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span style="line-height: 26px">添加Ring</span>
      <el-button style="float: right; padding: 5px 20px;" type="primary" size="small" @click="addRing">提交</el-button>
    </div>
    <div class="clearfix">
      <el-form ref="addRingFormRef" :model="addRingForm" :rules="rules" label-position="top">
        <div style="float: left;">
          <el-form-item :label="ringNameLabel" :label-width="formLabelWidth" prop="ringName">
            <el-input v-model="addRingForm.ringname" placeholder="请输入ring名" />
          </el-form-item>
          <el-form-item :label="mgmtVlanIdLabel" :label-width="formLabelWidth" prop="mgmtVlanId">
            <el-input v-model.number="addRingForm.mgmtVlanId" placeholder="可选" />
          </el-form-item>
          <el-form-item :label="mgmtCidrLabel" :label-width="formLabelWidth" prop="mgmtCidr">
            <el-input v-model="addRingForm.mgmtCidr" placeholder="可选，格式 192.168.10.1/24" />
          </el-form-item>
        </div>
        <div style="float: left; margin-left: 20px; width: 485px">
          <el-form-item :label="switchListLabel" :label-width="formLabelWidth" prop="switchList">
            <el-table
              ref="multipleTable"
              :border="true"
              tooltip-effect="dark"
              style="width: 100%"
              max-height="500"
              :data="switchList"
              :row-key="switchList.id"
              @selection-change="handleSelectionChange"
              @row-click="rowSelectChange"
            >
              <el-table-column type="selection" />
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
          </el-form-item>
        </div>
      </el-form>
    </div>
  </el-card>

</template>

<script>

export default {
  props: {
    switchList: {
      type: Array,
      default() {
        return []
      }
    },
    ringList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    var ringNameCheck = (rule, value, callback) => {
      if (this.addRingForm.ringname === '') {
        callback(new Error(this.ringNameLabel + '不能为空'))
      } else if (this.ringNameList.includes(this.addRingForm.ringname)) {
        callback(new Error(this.ringNameLabel + '不能重复'))
      } else {
        callback()
      }
    }
    var mgmtVlanIdCheck = (rule, value, callback) => {
      if (this.addRingForm.mgmtVlanId.length === 0 ||
      (/^[0-9]*$/g.test(this.addRingForm.mgmtVlanId) &&
          parseInt(this.addRingForm.mgmtVlanId) > this.mgmtVlanIdMin - 1 &&
        parseInt(this.addRingForm.mgmtVlanId) < this.mgmtVlanIdMax + 1)) {
        callback()
      } else {
        callback(new Error(this.mgmtVlanIdLabel + '必须为' + this.mgmtVlanIdMin + '至' + this.mgmtVlanIdMax + '之间的整数'))
      }
    }
    var mgmtCidrCheck = (rule, value, callback) => {
      if (this.addRingForm.mgmtCidr.length === 0 ||
      /^(([1-9]?\d|1\d\d|2[0-5][0-5]).){3}([1-9]?\d|1\d\d|2[0-5][0-5])\/([1-2]?\d|3[0-2])$/g.test(this.addRingForm.mgmtCidr)) {
        callback()
      } else {
        callback(new Error('格式错误'))
      }
    }
    var switchListCheck = (rule, value, callback) => {
      if (this.addRingForm.switchIds.length < 1) {
        callback(new Error('至少选择一台设备'))
      } else {
        callback()
      }
    }
    return {
      addRingForm: {
        switchIds: [],
        mgmtVlanId: '',
        mgmtCidr: '',
        ringname: ''
      },
      switchActive: '1',
      formLabelWidth: '100px',

      ringNameLabel: 'ring 名',

      mgmtVlanIdLabel: 'mgmtVlanId',
      mgmtVlanIdMin: 1,
      mgmtVlanIdMax: 4096,

      mgmtCidrLabel: 'mgmtCidr',

      switchListLabel: '设备列表',

      rules: {
        ringName: [
          { required: true, validator: ringNameCheck, trigger: 'blur' }
        ],
        mgmtVlanId: [
          { validator: mgmtVlanIdCheck, trigger: 'blur' }
        ],
        mgmtCidr: [
          { validator: mgmtCidrCheck, trigger: 'blur' }
        ],
        switchList: [
          { required: true, validator: switchListCheck, trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    selectSwitchNum() {
      return '已选择 ' + this.addRingForm.switchIds.length + ' 台设备'
    },
    ringNameList() {
      return this.ringList.map(value => value.ringname)
    }
  },

  methods: {
    addRing() {
      const that = this
      this.$refs.addRingFormRef.validate(valid => {
        if (valid) {
          that.$emit('addRing', that.addRingForm)
          that.close()
        }
      })
    },

    clearForm() {
      this.addRingForm = {
        ringname: '',
        switchIds: [],
        mgmtVlanId: '',
        mgmtCidr: ''
      }
      this.$refs.multipleTable.clearSelection()
      this.$refs.addRingFormRef.clearValidate()
    },

    close() {
      this.$emit('hideDialog')
    },

    switchActiveChange(activeNames) {
      activeNames = activeNames.length ? '' : '1'
    },

    handleSelectionChange(val) {
      this.addRingForm.switchIds = val.map(item => item.id)
    },

    rowSelectChange(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    }

  }
}
</script>

<style scoped>
.el-table /deep/ td,
.el-table /deep/ th {
  padding: 5px 0px;
  text-align: center;
}
</style>
