<template>
  <el-card>
    <div slot="header">
      <span>Meetings</span>
      <el-button class="header-button" type="text" @click="addMeeting">+ New</el-button>
    </div>
    <el-dialog class="sprint__meeting-dialog" :title="currentMeeting.title"
      :visible.sync="isViewMeeting"
      :modal="false">
      <h1>Type</h1>
      <el-input v-model="currentMeeting.type" placeholder="请输入内容"></el-input>
      <h1>Date</h1>
      <el-date-picker v-model="currentMeeting.date" type="date"/>
      <h1>Description</h1>
      <el-input v-model="currentMeeting.description" type="textarea" placeholder="请输入内容"></el-input>
      <h1>Attachment</h1>
      <p>{{currentMeeting.attachment}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isViewMeeting = false">取消</el-button>
        <el-button type="primary" @click="isViewMeeting = false">确定</el-button>
      </div>
    </el-dialog>
    <el-table :data="data" stripe>
      <el-table-column v-for="(item, index) in fields"
        :key="index"
        :prop="item"
        :label="item"></el-table-column>
        <el-table-column>
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="viewMeeting(scope.$index, scope.row)">
            <span>Detail</span>
            </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'Meetings',
  props:[
    'data',
    'fields'
  ],
  data () {
    return {
      isViewMeeting: false,
      currentMeeting: {
        title: 'Meeting Detail',
        type: '',
        date: '',
        description: '',
        attachment: ''
      }
    }
  },
  methods: {
    viewMeeting (index, row) {
      this.currentMeeting.type = row.type
      this.currentMeeting.date = row.date
      this.currentMeeting.description = row.description
      this.currentMeeting.attachment = row.attachment
      this.isViewMeeting = true
    },
    addMeeting () {
      this.$emit('addMeeting')
    }
  }
}
</script>

<style scoped>
.el-card >>> .el-card__header  {
  background-color: #bddbff38;
}
.sprint__meeting-dialog h1{
  font-size: 18px;
  padding: 12px 0px;
}
.header-button{
  float: right;
  margin-top: -8px;
  margin-right: 12px;
  padding: 10px;
}
</style>
