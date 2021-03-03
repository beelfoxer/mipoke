<template>
  <div>
    <el-card shadow="never">
      <div slot="header" style="display:flex;align-items:center">
        <div style="width:20%">Pokemon</div>
        <div style="width:30%"><el-switch
          v-model="query.showAbility"
          style="display: block"
          active-color="#44cc55"
          inactive-color="red"
          active-text="show"
          inactive-text="hide"
        /></div>  <div style="width:30%">
          <el-input v-model="query.searchInfo" style="width:160px" />
          <el-button @click="loadList()">查找</el-button>
        </div>
        <div style="width:20%;text-align: right;"><el-button @click="handleCreate()">新增</el-button></div>
      </div>
      <div>
        <el-table
          class="tableBox"
          border
          stripe
          style="width: 100%"
          :data="mypokeList"
        >
          <el-table-column label="编号" prop="pid" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.pid }}</span>
            </template>
          </el-table-column>
          <el-table-column label="昵称" prop="nickname" min-width="40px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column label="等级" prop="level" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.level }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="hp" prop="hp" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ getAbility(row,0) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="atk" prop="atk" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ getAbility(row,1) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="def" prop="def" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ getAbility(row,2) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="sat" prop="sat" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ getAbility(row,3) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="sde" prop="sde" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ getAbility(row,4) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="query.showAbility" label="spd" prop="spd" min-width="30px" align="center">
            <template slot-scope="{row}">
              <span>{{ getAbility(row,5) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="特性" prop="feature" min-width="40px" align="center">
            <template slot-scope="{row}">
              <span>{{ row.feature }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性格" prop="nature" min-width="40px" align="center">
            <template slot-scope="{row}">
              <span>{{ '+'+natureList[((Number(row.nature))%5)+1]+' -'+natureList[Math.floor((Number(row.nature))/5)+1] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="80px" align="center">
            <template slot-scope="{row,$index}">
              <el-button size="mini" type="info" @click="handleUpdate(row,$index)">
                修改
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :visible.sync="dialogFormVisible" width="600px" :close-on-click-modal="false" :close-on-press-escape="false">
        <el-card shadow="never">
          <div slot="header">{{ FormStatus==0?"新增":"修改" }}</div>
          <div>
            <el-form ref="dataForm" :inline="true" :label-position="'right'" label-width="70x" :rules="rules" :model="temp">
              <el-form-item label="宝可梦" prop="pokemon">
                <el-select v-model="temp.pid" class="filter-item" placeholder="Please select" style="width:400px">
                  <el-option v-for="item in pokemonList" :key="item.id" :label="item.name+(item.type?'('+item.type+')':'')" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="temp.nickname" style="width:200px" />
              </el-form-item>
              <el-form-item label="等级" prop="level">
                <el-input v-model="temp.level" style="width:200px" />
              </el-form-item>
              <el-form-item label="个|生命" prop="HP">
                <el-input v-model.number="temp.selfvalue[0]" style="width:70px" />
              </el-form-item>
              <el-form-item label="速度" prop="SPD">
                <el-input v-model.number="temp.selfvalue[5]" style="width:70px" />
              </el-form-item>
              <el-form-item label="努|生命" prop="HP">
                <el-input v-model.number="temp.effortvalue[0]" style="width:70px" />
              </el-form-item>
              <el-form-item label="速度" prop="SPD">
                <el-input v-model.number="temp.effortvalue[5]" style="width:70px" />
              </el-form-item>
              <el-form-item label="体|物攻" prop="ATK">
                <el-input v-model.number="temp.selfvalue[1]" style="width:70px" />
              </el-form-item>
              <el-form-item label="物防" prop="DEF">
                <el-input v-model.number="temp.selfvalue[2]" style="width:70px" />
              </el-form-item>
              <el-form-item label="力|物攻" prop="ATK">
                <el-input v-model.number="temp.effortvalue[1]" style="width:70px" />
              </el-form-item>
              <el-form-item label="物防" prop="DEF">
                <el-input v-model.number="temp.effortvalue[2]" style="width:70px" />
              </el-form-item>
              <el-form-item label="值|特攻" prop="SAT">
                <el-input v-model.number="temp.selfvalue[3]" style="width:70px" />
              </el-form-item>
              <el-form-item label="特防" prop="SDE">
                <el-input v-model.number="temp.selfvalue[4]" style="width:70px" />
              </el-form-item>
              <el-form-item label="值|特攻" prop="SAT">
                <el-input v-model.number="temp.effortvalue[3]" style="width:70px" />
              </el-form-item>
              <el-form-item label="特防" prop="SDE">
                <el-input v-model.number="temp.effortvalue[4]" style="width:70px" />
              </el-form-item>
              <el-form-item label="特性" prop="feature">
                <el-select v-model="temp.feature" class="filter-item" placeholder="Please select" style="width:200px">
                  <el-option v-for="item in getPokemonFeatureListById(temp.pid)" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="性格" prop="nature">
                <el-select v-model="temp.nature" class="filter-item" placeholder="Please select" style="width:200px">
                  <el-option v-for="item in 25" :key="item-1" :label="'+'+natureList[((item-1)%5)+1]+'-'+natureList[Math.floor((item-1)/5)+1]" :value="item-1" />
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
              <el-button @click="dialogFormVisible = false">
                取消
              </el-button>
              <el-button type="primary" @click="FormStatus==0?createData():updateData()">
                确认
              </el-button>
            </div>
          </div>
        </el-card>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

import mipoke from '@/api/mipoke/mipoke'

export default {
  name: 'Index',
  data() {
    return {
      pokemonList: [],
      mypokeList: [],
      natureList: ['hp', '物攻', '物防', '特攻', '特防', '速度'],
      FormStatus: '',
      updateIndex: 0,
      dialogFormVisible: false,
      temp: {
        selfvalue: new Array(6),
        effortvalue: new Array(6)
      },
      query: {
        table: 'mypoke',
        attribute: '',
        showAbility: false,
        searchInfo: ''
      },
      rules: {}
    }
  },
  computed: {},

  created() {
    this.loadResource()
  },

  methods: {
    async loadResource() {
      await this.loadPokeList()
      await this.loadMyList()
    },
    async loadMyList() {
      this.mypokeList = this.praseValue(await mipoke.mipokeQuery(this.query))
    },
    async loadPokeList() {
      this.pokemonList = this.praseValue(await mipoke.mipokeQuery({ table: 'pokemon' }))
    },
    praseValue(v_list) {
      for (const item of v_list) {
        if (item.racevalue && typeof (item.racevalue) === 'string') {
          item.racevalue = JSON.parse(item.racevalue)
        }
        if (item.effortvalue && typeof (item.effortvalue) === 'string') {
          item.effortvalue = JSON.parse(item.effortvalue)
        }
        if (item.selfvalue && typeof (item.selfvalue) === 'string') {
          item.selfvalue = JSON.parse(item.selfvalue)
        }
      }
      return v_list
    },
    getPokemonById(v_id) {
      for (const item of this.pokemonList) {
        if (item.id === v_id) {
          return item
        }
      }
      return null
    },
    getPokemonFeatureListById(v_id) {
      const t_list = []
      const t_pokemon = this.getPokemonById(v_id)
      if (t_pokemon) {
        t_list.push(t_pokemon.feature1)
        if (t_pokemon.feature2) {
          t_list.push(t_pokemon.feature2)
        }
        if (t_pokemon.feature3) {
          t_list.push(t_pokemon.feature3)
        }
      }
      return t_list
    },
    getAbility(row, index) {
      if (index === 0) {
        return Math.floor((this.getPokemonById(row.pid).racevalue[index] * 2 + row.effortvalue[index] / 4 + Number(row.selfvalue[index])) * Number(row.level) / 100 + Number(row.level) + 10)
      } else {
        let tr = 1
        if (Number(row.nature) % 5 === index - 1) {
          tr += 0.1
        }
        if (Number(row.nature) / 5 >= index - 1 && Number(row.nature) / 5 < index) {
          tr -= 0.1
        }
        return Math.floor(((this.getPokemonById(row.pid).racevalue[index] * 2 + row.effortvalue[index] / 4 + Number(row.selfvalue[index])) * Number(row.level) / 100 + 5) * tr)
      }
    },
    handleDelete(row, index) {
      mipoke.mipokeUpdate({ table: 'mypoke', data: { id: row.id, status: 0 }})
      this.mypokeList.splice(index, 1)
    },
    resetTemp() {
      this.temp = {
        id: 0,
        status: 1,
        selfvalue: [31, 31, 31, 31, 31, 31],
        effortvalue: [252, 252, 252, 252, 252, 252]
      }
    },
    handleCreate() {
      this.resetTemp()
      this.FormStatus = 0
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async createData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          if (!this.temp.nickname || this.temp.nickname === '') {
            this.temp.nickname = this.getPokemonById(this.temp.pid).name
          }
          this.dialogFormVisible = false
          this.mypokeList.push(await mipoke.mipokeUpdate({ table: 'mypoke', data: this.temp }))
        }
      })
    },
    handleUpdate(row, index) {
      this.temp = Object.assign({}, row)
      this.FormStatus = 1
      this.updateIndex = index
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.dialogFormVisible = false
          if (!this.temp.nickname || this.temp.nickname === '') {
            this.temp.nickname = this.getPokemonById(this.temp.pid).name
          }
          // this.mypokeList[this.updateIndex] = await mipoke.mipokeUpdate({ table: 'mypoke', data: this.temp })
          this.$set(this.mypokeList, this.updateIndex, await mipoke.mipokeUpdate({ table: 'mypoke', data: this.temp }))
        }
      })
    }

  }
}
</script>

<style lang='scss'>
.tableBox {
  th{
    padding:0 !important;;
    height: 28px;
    line-height: 28px;
  }
  tr{
    padding:0 !important;;
    height: 28px;
    line-height: 28px;
  }
  td{
    padding:0 !important;;
    height: 28px;
    line-height: 28px;
  }
  td .cell{
    padding:0 !important;;
  }
}
.el-table th.gutter{
  display: table-cell!important;
}
</style>
