<template>
  <div>
    <div class="sprint__card sprint-control">
      <el-select v-model="sprintIndex">
        <el-option
          v-for="(item, index) in sprintsList"
          :key="index"
          :label="index+1 + ' : ' + item.title"
          :value="index"
        ></el-option>
      </el-select>
      <el-button @click="isNewSprint = true">
        <span>+ New</span>
      </el-button>
    </div>
    <sprint-info
      class="sprint__card"
      :title="sprintsList[sprintIndex].title"
      :startDate="sprintsList[sprintIndex].startDate"
      :endDate="sprintsList[sprintIndex].endDate"
      :description="sprintsList[sprintIndex].description"
      @editSprintInfo="editSprintInfo"
      @deleteSptint="deleteSptint"
    />
    <template>
      <div class="gant_card" style="margin-top: 20px">
        <el-card shadow="never" class="card-content__card">
          <div slot="header">Gantt Chart</div>
          <!-- <div style="height: 450px"></div> -->
          <div class="app-container">
            <div ref="gantt" class="left-container" />
          </div>
         
        </el-card>
      </div>
    </template>
    <list-card
      class="sprint__card"
      title="Requires"
      @add="addRequires"
      :data="requires"
      :fields="requiresFields"
    />
    <list-card
      class="sprint__card"
      title="Tasks"
      @add="addTasks"
      :data="tasks"
      :fields="tasksFields"
    />
    <list-card
      class="sprint__card"
      title="Defects"
      @add="addDefects"
      :data="defects"
      :fields="defectsFields"
    />
    <meetings
      class="sprint__card"
      @addMeeting="addMeeting"
      :data="meetings"
      :fields="meetingsFields"
    />
    <el-dialog
      class="sprint__add-meeting-dialog"
      title="Add Meeting"
      :visible.sync="isAddMeeting"
      :modal="false"
    >
      <h1>Type</h1>
      <el-input v-model="newMeeting.type"></el-input>
      <h1>Date</h1>
      <el-date-picker v-model="newMeeting.date" type="date" />
      <h1>Description</h1>
      <el-input v-model="newMeeting.description" type="textarea"></el-input>
      <h1>Attachment</h1>
      <p>{{ newMeeting.attachment }}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddMeeting = false">Cancel</el-button>
        <el-button type="primary" @click="isAddMeeting = false">Confirm</el-button>
      </div>
    </el-dialog>
    <el-dialog
      class="sprint__add-meeting-dialog"
      title="Add Sprint"
      :visible.sync="isNewSprint"
      :modal="false"
    >
      <h1>Title</h1>
      <el-input v-model="newSprint.title"></el-input>
      <h1>Start Date</h1>
      <el-date-picker v-model="newSprint.startDate" type="date" />
      <h1>End Date</h1>
      <el-date-picker v-model="newSprint.endDate" type="date" />
      <h1>Description</h1>
      <el-input v-model="newSprint.description" type="textarea"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isNewSprint = false">Cancel</el-button>
        <el-button type="primary" @click="confirmNewSprint">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ListCard from "./ListCard.vue";
import SprintInfo from "./SprintInfo.vue";
import Meetings from "./Meetings.vue";

import gantt from 'dhtmlx-gantt'  // 引入模块
import './codebase/dhtmlxgantt.css'

function getDate(str)
{
var strArr = str.split('-');
var day=strArr[2];
var month=strArr[1];
var year=strArr[0];
var date = (day+ '-' + month + '-' +year  ).toString();
return date;
}

function getDuration(date1,date2){
  var dateArr1 = date1.split('-');
var dateArr2 = date2.split('-');
var day1=dateArr1[2];
var day2=dateArr2[2];
return day2=day1;
}

export default {
  title: "ProjectSprint",
  components: {
    "list-card": ListCard,
    "sprint-info": SprintInfo,
    meetings: Meetings,
  },
  props: [
    // projectIndex 依赖于组件参数 props
    "projectIndex",
  ],
  data() {
    return {
      isAddMeeting: false,
      isNewSprint: false,
      newMeeting: { type: "", date: "", description: "", attachment: "" },
      newSprint: { title: "", description: "", startDate: "", endDate: "" },
      sprintsList: [{ ID: "", title: "", description: "", start: "", end: "" }],
      sprintIndex: 0,
      requiresFields: [
        "title",
        "type",
        "kind",
        "priority",
        "description",
        "endDate",
        "stitle",
      ],
      tasksFields: [
        "title",
        "state",
        "username",
        "startDate",
        "endDate",
        "priority",
        "description",
      ],
      defectsFields: ["title", "type", "state", "endDate", "description"],
      meetingsFields: ["type", "date", "description", "attachment"],
      requires: [
        {
          title: "",
          type: "",
          kind: "",
          priority: "",
          description: "",
          endDate: "",
          stitle: "",
          state: "",
        },
      ],
      tasks: [
        {
          title: "",
          state: "",
          username: "",
          startDate: "",
          endDate: "",
          priority: "",
          description: "",
        },
      ],
      defects: [
        { title: "", type: "", state: "", endDate: "", description: "" },
      ],
      meetings: [
        {
          ID: 1,
          type: "Require",
          description: "Description of meetings 1",
          date: "2020-12-09",
          attachment: "attachment",
        },
        {
          ID: 2,
          type: "Require",
          description: "Description of meetings 2",
          date: "2020-12-09",
          attachment: "attachment",
        },
      ],
      testData:{
        data: [
      
        ],
        links:[
           
        ]
      },
    };
  },
  watch: {
    // 若 projectID 变更，更新页面
    projectIndex(to, from) {
      this.sprintIndex = 0;
      this.getSprints();
      this.getRequires();
      this.getTasks();
      this.getDefects();
    },
    sprintIndex(to, from) {
      this.getRequires();
      this.getTasks();
      this.getDefects();
      // this.getMeetings()
    },
  },
  mounted() {
    this.getSprints();
    // 包含了回调：
    // this.getRequires()
    // this.getTasks()
    // this.getDefects()
    // this.getMeetings()
        // 初始化
    gantt.init(this.$refs.gantt);
    // 数据解析
    gantt.parse(this.testData);
  },
  methods: {
    addRequires() {
      this.$alert("Add a require", "Dialog", { confirmButtonText: "OK" });
    },
    addTasks() {
      this.$alert("Add a task", "Dialog", { confirmButtonText: "OK" });
    },
    addDefects() {
      this.$alert("Add a defect", "Dialog", { confirmButtonText: "OK" });
    },
    addMeeting() {
      this.isAddMeeting = true;
    },
    getSprints() {
      var projectID = this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].ID;
      this.axios
        .post(this._GLOBAL.baseUrl + "/sprint/getSpListByPID?ID=" + projectID)
        .then((response) => {
          if (response.data.message == "成功") {
            if (response.data.data.spList.length > 0) {
              this.sprintsList = response.data.data.spList;
              this.sprintIndex=this.sprintsList.length-1;
              this.getRequires();
              this.getTasks();
              this.getDefects();
              // this.getMeetings()
            } else {
              this.sprintsList = [
                { ID: "", title: "", description: "", start: "", end: "" },
              ];
              this.requires = [
                {
                  title: "",
                  type: "",
                  kind: "",
                  priority: "",
                  description: "",
                  endDate: "",
                  stitle: "",
                  state: "",
                },
              ];
              this.tasks = [
                {
                  title: "",
                  state: "",
                  username: "",
                  startDate: "",
                  endDate: "",
                  priority: "",
                  description: "",
                },
              ];
              this.defects = [
                {
                  title: "",
                  type: "",
                  state: "",
                  endDate: "",
                  description: "",
                },
              ];
            }
          }
        });
    },
    getRequires() {
      var sprintID = this.sprintsList[this.sprintIndex].ID;
      this.axios
        .post(
          this._GLOBAL.baseUrl + "/requirement/getReqtListBySID?ID=" + sprintID
        )
        .then((response) => {
          if (response.data.message == "成功") {
            this.requires = response.data.data.reqtList;
          }
        });
    },
    getDefects() {
      var sprintID = this.sprintsList[this.sprintIndex].ID;
      this.axios
        .post(this._GLOBAL.baseUrl + "/defect/getDefListBySID?ID=" + sprintID)
        .then((response) => {
          if (response.data.message == "成功") {
            this.defects = response.data.data.defectList;
          }
        });
    },
    getTasks() {
      var sprintID = this.sprintsList[this.sprintIndex].ID;
      var that=this;
      this.axios
        .get(
          this._GLOBAL.baseUrl + "/task/getTaskListBySid?sprintid=" + sprintID
        )
        .then((response) => {
          if (response.data.message == "成功") {
            that.tasks = response.data.data.task;
            var newData={}
            var tasks= response.data.data.task;
            console.log(tasks)
            var templist=[];
            for(var i=0;i<tasks.length;i++){
                var temp={};
                temp.id=tasks[i].ID;
                temp.text=tasks[i].title;
                temp.start_date=getDate( tasks[i].startDate);
                temp.end_date=getDate(tasks[i].endDate);
                temp.parent=0;
                temp.progress=0;
                temp.open=true;
                templist[i]=temp;               
            }

            newData['links']={};
            newData['data']=templist;
            that.testData=newData;
            gantt.init(that.$refs.gantt);
            gantt.clearAll();
            gantt.parse(that.testData)
           
          }
        });
    },
    getMeetings() {
      var sprintID = this.sprintsList[this.sprintIndex].ID;
      this.axios.post(this._GLOBAL.baseUrl + "/").then((response) => {
        if (response.data.message == "成功") {
          this.defects = response.data.data.reqtList;
        }
      });
    },
    editSprintInfo(data) {
      var url = this._GLOBAL.baseUrl + "/sprint/updateSpDesByID";
      var config = { emulateJSON: true };
      var newSprintInfo = JSON.parse(
        JSON.stringify(this.sprintsList[this.sprintIndex])
      );
      newSprintInfo.title = data.title;
      newSprintInfo.startDate = data.startDate;
      newSprintInfo.endDate = data.endDate;
      newSprintInfo.description = data.description;
      this.axios.post(url, newSprintInfo, config).then((response) => {
        if (response.data.message == "成功") {
          this.getSprints();
        }
      });
      url = this._GLOBAL.baseUrl + "/sprint/updateSpEdByID";
      this.axios.post(url, newSprintInfo, config).then((response) => {
        if (response.data.message == "成功") {
          this.getSprints();
        }
      });
      url = this._GLOBAL.baseUrl + "/sprint/updateSpSdByID";
      this.axios.post(url, newSprintInfo, config).then((response) => {
        if (response.data.message == "成功") {
          this.getSprints();
        }
      });
      url = this._GLOBAL.baseUrl + "/sprint/updateSpTitleByID";
      this.axios.post(url, newSprintInfo, config).then((response) => {
        if (response.data.message == "成功") {
          this.getSprints();
        }
      });
    },
    confirmNewSprint() {
      var url = this._GLOBAL.baseUrl + "/sprint/createSprint";
      var config = { emulateJSON: true };
      var postData = this.newSprint;
      postData.projectID = this._GLOBAL.ProjectList[
        this._GLOBAL.projectIndex
      ].ID;
      this.axios.post(url, postData, config).then((response) => {
        if (response.data.message == "成功") {
          this.isNewSprint = false;
          this.getSprints();
        }
      });
    },
    deleteSptint() {
      var params = "ID=" + this.sprintsList[this.sprintIndex].ID;
      var url = this._GLOBAL.baseUrl + "/sprint/delSpByID?" + params;
      var config = { emulateJSON: true };
      var postData = new Object();
      this.axios.post(url, postData, config).then((response) => {
        if (response.data.message == "成功") {
          this.sprintIndex = 0;
          this.getSprints();
        }
      });
    },
  },
};
</script>

<style>
  .left-container {
    height: 600px;
  }
.gant_card {
  margin: 0px 24px 24px 24px;
}
.sprint__card {
  margin: 0px 24px 24px 24px;
}
.sprint__add-meeting-dialog h1 {
  font-size: 18px;
  padding: 12px 0px;
}
.sprint-control {
  display: flex;
}
.sprint-control > div {
  margin-right: 24px;
}
.carId {
  flex: 1;
}
.name {
  display: flex;
  box-sizing: border-box;
  overflow: hidden;
  height: 100%;
  width: 100%;
  padding: 0 5px 0 0;
  border-radius: 8px 0 0 8px;
  align-items: center;
}
.colorBar {
  width: 10px;
  height: 100%;
}
</style>
