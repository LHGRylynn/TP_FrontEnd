<template>
  <el-card>
    <div slot="header">
      <span>{{title}}</span>
    </div>
    <div class="content">
      <el-card class="list" shadow="never">
        <el-table :data="data" stripe class="table">
          <el-table-column v-for="(item, index) in fields" :key="index" :prop="item" :label="item"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </el-card>
</template>

<script>
/*
 * title: "Title",
 * addMethod: AFunction
 * data: {
 *  field1: value,
 *  field2: value,
 *  ...
 * },
 * fields: [
 *  'field1',
 *  'field2',
 *  ...
 * ]
 */
export default {
  name: 'ListCard',
  props: [
    'title',
    'data',
    'fields'
  ],
  methods: {
    add () {
      this.$emit('add')
    }
  }
}
</script>

<style scoped>
.header-button{
  float: right;
  margin-top: -8px;
  margin-right: 12px;
  padding: 10px;
}
.content{
  display: flex;
}
.content>*{
  margin: 0px 12px;
}
.chart{
  flex-basis: 200px;
  flex-shrink: 0;
}
.list{
  flex-shrink: 1;
  flex-grow: 1;
}
.table{
	max-height: 360px;
  overflow: auto;
}
.table *{
  width: max-content;
}
</style>
