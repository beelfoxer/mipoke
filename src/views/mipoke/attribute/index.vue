<template>
  <div>
    <el-card shadow="never">
      <div slot="header" style="display:flex;align-items:center">
        <div style="width:50%">属性</div>
        <div style="width:50%;text-align: right;"><el-switch
          v-model="openChange"
          style="display: block"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="开启修改"
        />
          <!--el-button disabled @click="handleCreate()">新增</el-button-->
        </div>
      </div>
      <div>
        <el-table
          class="tableBox"
          border
          stripe
          style="width: 100%"
          :cell-style="getColor"
          :header-cell-style="getHeaderColor"
          :data="attributeList"
          @cell-click="handleClick"
        >
          <el-table-column label="/" prop="name" min-width="40px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.name }}</span>
            </template>
          </el-table-column>

          <template v-for="item in attributeList">
            <el-table-column :key="item.id" :label="item.name" :prop="item.id" min-width="40px" align="center">
              <template slot-scope="{row}">
                <span>{{ getValueById(row.id,item.id) }}</span>
              </template>
            </el-table-column>
          </template>

          <el-table-column v-if="openChange" label="操作" prop="control" min-width="40px" align="center">
            <template slot-scope="{row}">
              <el-button size="mini" type="success" icon="el-icon-check" circle @click="handleSubmit(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>

import mipoke from '@/api/mipoke/mipoke'

export default {
  name: 'Index',
  data() {
    return {
      attributeList: [],
      openChange: false,
      query: {
        table: 'attribute'
      }
    }
  },
  computed: {},

  created() {
    this.loadResource()
  },
  methods: {
    async loadResource() {
      await this.loadList()
    },
    async loadList() {
      this.attributeList = this.praseAttr(await mipoke.mipokeQuery(this.query))
    },
    praseAttr(v_list) {
      for (const item of v_list) {
        item.resist_halve = this.jsonParse(item.resist_halve)
        item.resist_double = this.jsonParse(item.resist_double)
        item.resist_complete = this.jsonParse(item.resist_complete)
      }
      return v_list
    },
    jsonParse(v_str) {
      if (v_str == null || v_str === '' || v_str === 'null' || v_str === [] || v_str === '[]') {
        return []
      } else if (typeof (v_str) === 'string') {
        return JSON.parse(v_str)
      }
      return v_str
    },
    getValueById(v_row, v_col) {
      for (const item of this.attributeList) {
        if (item.id === v_row) {
          if (item.resist_halve.includes(v_col)) {
            return 2
          } else if (item.resist_double.includes(v_col)) {
            return 0.5
          } else if (item.resist_complete.includes(v_col)) {
            return 0
          } else {
            return 1
          }
        }
      }
      return 1
    },
    handleClick(row, column, cell, event) {
      if (!this.openChange || column.property === 'name' || column.property === 'control') {
        return
      }
      for (const item of this.attributeList) {
        if (item.id === row.id) {
          let index = item.resist_halve.indexOf(column.property)
          if (index > -1) {
            item.resist_halve.splice(index, 1)
            item.resist_complete.push(column.property)
            return
          }
          index = item.resist_double.indexOf(column.property)
          if (index > -1) {
            item.resist_double.splice(index, 1)
            return
          }
          index = item.resist_complete.indexOf(column.property)
          if (index > -1) {
            item.resist_complete.splice(index, 1)
            item.resist_double.push(column.property)
            return
          }
          item.resist_halve.push(column.property)
        }
      }
    },
    getColor(val) {
      if (val.columnIndex === 0) { return { background: val.row.color } }
      if (val.column.property === 'name' || val.column.property === 'control') { return }
      if (val.row.resist_complete.includes(val.column.property)) {
        return { background: 'grey' }
      } else if (val.row.resist_halve.includes(val.column.property)) {
        return { background: 'red' }
      } else if (val.row.resist_double.includes(val.column.property)) {
        return { background: '#22cc33' }
      }
    },
    getHeaderColor(val) {
      if (val.columnIndex === 0) {
        return
      }
      if (val.column.property === 'name' || val.column.property === 'control') {
        return
      }
      for (const item of this.attributeList) {
        if (item.id === val.column.property) {
          return { background: item.color }
        }
      }
    },
    handleSubmit(row) {
      mipoke.mipokeUpdate({ table: 'attribute', data: row })
    }
  }
}
</script>
<style lang='scss'>
.el-table th.gutter{
  display: table-cell!important;
}
</style>
