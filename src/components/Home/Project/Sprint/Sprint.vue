<template>
  <div>
    <div class="sprint__card sprint-control">
      <el-select v-model="sprintIndex">
        <el-option
          v-for="(item, index) in sprintsList"
          :key="index"
          :label="index + 1 + ' : ' + item.title"
          :value="index">
        </el-option>
      </el-select>
      <el-button @click="isNewSprint = true">
        <span>+ New</span>
      </el-button>
    </div>
    <sprint-info class="sprint__card"
      :title="sprintsList[sprintIndex].title"
      :startDate="sprintsList[sprintIndex].startDate"
      :endDate="sprintsList[sprintIndex].endDate"
      :description="sprintsList[sprintIndex].description"
      @editSprintInfo="editSprintInfo"
      @deleteSptint="deleteSptint"/>
    <list-card class="sprint__card"
      title="Requires"
      @add="addRequires"
      :data="requires"
      :fields="requiresFields"/>
    <list-card class="sprint__card"
      title="Tasks"
      @add="addTasks"
      :data="tasks"
      :fields="tasksFields"/>
    <list-card class="sprint__card"
      title="Defects"
      @add="addDefects"
      :data="defects"
      :fields="defectsFields"/>
    <meetings class="sprint__card"
      @addMeeting="addMeeting"
      :data="meetings"
      :fields="meetingsFields"/>
    <el-dialog class="sprint__add-meeting-dialog" title="Add Meeting" :visible.sync="isAddMeeting" :modal="false">
      <h1>Type</h1>
      <el-input v-model="newMeeting.type"></el-input>
      <h1>Date</h1>
      <el-date-picker v-model="newMeeting.date" type="date"/>
      <h1>Description</h1>
      <el-input v-model="newMeeting.description" type="textarea"></el-input>
      <h1>Attachment</h1>
      <p>{{newMeeting.attachment}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddMeeting = false">取消</el-button>
        <el-button type="primary" @click="isAddMeeting = false">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog class="sprint__add-meeting-dialog" title="Add Sprint" :visible.sync="isNewSprint" :modal="false">
      <h1>Title</h1>
      <el-input v-model="newSprint.title"></el-input>
      <h1>Start Date</h1>
      <el-date-picker v-model="newSprint.startDate" type="date"/>
      <h1>End Date</h1>
      <el-date-picker v-model="newSprint.endDate" type="date"/>
      <h1>Description</h1>
      <el-input v-model="newSprint.description" type="textarea"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isNewSprint = false">取消</el-button>
        <el-button type="primary" @click="confirmNewSprint">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ListCard from './ListCard.vue'
import SprintInfo from './SprintInfo.vue'
import Meetings from './Meetings.vue'
export default{
  title: 'ProjectSprint',
  components: {
    'list-card': ListCard,
    'sprint-info': SprintInfo,
    'meetings': Meetings
  },
  props: [
    // projectIndex 依赖于组件参数 props
    'projectIndex'
  ],
  data () {
    return {
      isAddMeeting: false,
      isNewSprint: false,
      newMeeting: { type: '', date: '', description: '', attachment: '', },
      newSprint: { title:'', description: '', startDate: '', endDate:'' },
      sprintsList: [{ ID: '', title: '', description: '', start: '', end: '' }],
      sprintIndex: 0,
      requiresFields: [ 'title', 'type', 'kind', 'priority', 'description', 'endDate', 'stitle' ],
      tasksFields: [ 'title', 'state', 'username', 'startDate', 'endDate', 'priority', 'description' ],
      defectsFields: ['title', 'type', 'state', 'endDate', 'description'],
      meetingsFields: ['type', 'date', 'description', 'attachment'],
      requires: [{ title: '', type: '', kind: '', priority: '', description: '', endDate: '', stitle: '', state: '' }],
      tasks: [{ title: '', state: '', username: '', startDate: '', endDate: '', priority: '', description: '' }],
      defects: [{ title: '', type: '', state: '', endDate: '', description: '' }],
      meetings: [
        { ID: 1, type: "Require", description: 'Description of meetings 1', date: '2020-12-09', attachment: 'attachment' },
        { ID: 2, type: "Require", description: 'Description of meetings 2', date: '2020-12-09', attachment: 'attachment' }
      ]
    }
  },
  watch: {
    // 若 projectID 变更，更新页面
    projectIndex (to, from) {
      this.sprintIndex = 0
      this.getSprints()
    },
    sprintIndex (to, from){
      this.getRequires()
      this.getTasks()
      this.getDefects()
      // this.getMeetings()
    }
  },
  mounted () {
    this.getSprints()
    // 包含了回调：
    // this.getRequires()
    // this.getTasks()
    // this.getDefects()
    // this.getMeetings()
  },
  methods: {
    addRequires () {
      this.$alert('Add a require', 'Dialog', { confirmButtonText: 'OK' })
    },
    addTasks () {
      this.$alert('Add a task', 'Dialog', { confirmButtonText: 'OK' })
    },
    addDefects () {
      this.$alert('Add a defect', 'Dialog', { confirmButtonText: 'OK' })
    },
    addMeeting () {
      this.isAddMeeting = true
    },
    getSprints () {
      var projectID = this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].ID
      this.axios
      .post(this._GLOBAL.baseUrl + '/sprint/getSpListByPID?ID=' + projectID)
      .then((response) => {
        if(response.data.message == '成功'){
          if(response.data.data.spList.length > 0){
            this.sprintsList = response.data.data.spList
            this.getRequires()
            this.getTasks()
            this.getDefects()
            // this.getMeetings()
          }
          else {
            this.sprintsList = [{ ID: '', title: '', description: '', start: '', end: '' }]
            this.requires = [{ title: '', type: '', kind: '', priority: '', description: '', endDate: '', stitle: '', state: '' }]
            this.tasks = [{ title: '', state: '', username: '', startDate: '', endDate: '', priority: '', description: '' }]
            this.defects = [{ title: '', type: '', state: '', endDate: '', description: '' }]
          }
        }
      })
    },
    getRequires () {
      var sprintID = this.sprintsList[this.sprintIndex].ID
      this.axios
      .post(this._GLOBAL.baseUrl + '/requirement/getReqtListByPID?ID=' + sprintID)
      .then((response) => {
        if(response.data.message == '成功'){
          this.requires = response.data.data.reqtList
        }
      })
    },
    getDefects () {
      var sprintID = this.sprintsList[this.sprintIndex].ID
      this.axios
      .post(this._GLOBAL.baseUrl + '/defect/getDefListBySID?ID=' + sprintID)
      .then((response) => {
        if(response.data.message == '成功'){
          this.defects = response.data.data.defectList
        }
      })
    },
    getTasks () {
      var sprintID = this.sprintsList[this.sprintIndex].ID
      this.axios
      .get(this._GLOBAL.baseUrl + '/task/getTaskListBySid?sprintid=' + sprintID)
      .then((response) => {
        if(response.data.message == '成功'){
          this.tasks = response.data.data.task
        }
      })
    },
    getMeetings () {
      var sprintID = this.sprintsList[this.sprintIndex].ID
      this.axios
      .post(this._GLOBAL.baseUrl + '/')
      .then((response) => {
        if(response.data.message == '成功'){
          this.defects = response.data.data.reqtList
        }
      })
    },
    editSprintInfo (data) {
      var url = this._GLOBAL.baseUrl + '/sprint/updateSpDesByID'
      var config = { emulateJSON: true }
      var newSprintInfo = JSON.parse(JSON.stringify(this.sprintsList[this.sprintIndex]))
      newSprintInfo.title = data.title
      newSprintInfo.startDate = data.startDate
      newSprintInfo.endDate = data.endDate
      newSprintInfo.description = data.description
      this.axios.post(url, newSprintInfo, config).then((response) => {
        if(response.data.message == '成功'){
          this.getSprints()
        }
      })
      url = this._GLOBAL.baseUrl + '/sprint/updateSpEdByID'
      this.axios.post(url, newSprintInfo, config).then((response) => {
        if(response.data.message == '成功'){
          this.getSprints()
        }
      })
      url = this._GLOBAL.baseUrl + '/sprint/updateSpSdByID'
      this.axios.post(url, newSprintInfo, config).then((response) => {
        if(response.data.message == '成功'){
          this.getSprints()
        }
      })
      url = this._GLOBAL.baseUrl + '/sprint/updateSpTitleByID'
      this.axios.post(url, newSprintInfo, config).then((response) => {
        if(response.data.message == '成功'){
          this.getSprints()
        }
      })
    },
    confirmNewSprint () {
      var url = this._GLOBAL.baseUrl + '/sprint/createSprint'
      var config = { emulateJSON: true }
      var postData = this.newSprint
      postData.projectID = this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].ID
      this.axios.post(url, postData, config).then((response) => {
        if(response.data.message == '成功'){
          this.isNewSprint = false
          this.getSprints()
        }
      })
    },
    deleteSptint () {
      var params = 'ID=' + this.sprintsList[this.sprintIndex].ID
      var url = this._GLOBAL.baseUrl + '/sprint/delSpByID?' + params
      var config = { emulateJSON: true }
      var postData = new Object()
      this.axios.post(url, postData, config).then((response) => {
        if(response.data.message == '成功'){
          this.sprintIndex = 0
          this.getSprints()
        }
      })
    }
  }
}
</script>

<style>
.sprint__card{
  margin: 0px 24px 24px 24px;
}
.sprint__add-meeting-dialog h1{
  font-size: 18px;
  padding: 12px 0px;
}
.sprint-control{
  display: flex;
}
.sprint-control>div{
  margin-right: 24px;
}
</style>
