<template>
  <el-card>
    <div slot="header">
      <span>Sprint Info</span>
      <el-button class="header-button" type="text" @click="editSprintInfo"
        >Edit</el-button
      >
    </div>
    <div class="card-content">
      <el-card shadow="never" class="card-content__card max-width">
        <div slot="header">Sprint</div>
        <p>Title : {{ title }}</p>
        <br />
        <p>StartDate : {{ startDate }}</p>
        <br />
        <p>EndDate : {{ endDate }}</p>
      </el-card>
      <el-card shadow="never" class="card-content__card">
        <div slot="header">Description</div>
        <p>{{ description }}</p>
      </el-card>
    </div>
   
    <el-dialog
      class="sprint__edit-sprint-dialog"
      title="Editting Sprint Info"
      :visible.sync="isSprintEditting"
      :modal="false"
    >
      <h1>Title</h1>
      <el-input v-model="sprintInfo.title"></el-input>
      <h1>Start</h1>
      <el-date-picker v-model="sprintInfo.startDate" type="date" />
      <h1>End</h1>
      <el-date-picker v-model="sprintInfo.endDate" type="date" />
      <h1>Description</h1>
      <el-input v-model="sprintInfo.description" type="textarea"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteSptint">删除迭代</el-button>
        <el-button @click="isSprintEditting = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import dayjs from "dayjs"; //时间库
export default {
  name: "SprintInfo",
  props: ["title", "startDate", "endDate", "description"],
  data() {
    return {
      isSprintEditting: false,
      sprintInfo: {
        title: this.title,
        startDate: this.startDate,
        endDate: this.endDate,
        description: this.description,
      },
      tasks: [{ title: '', state: '', username: '', startDate: '', endDate: '', priority: '', description: '' }],
      
      startTime: this.startDate, //时间轴开始时间
      endTime: this.endDate, //时间结束时间
      datas: [
        {
          id: "test", //非必须
          gtArray: [
            //默认的需要渲染的数组
            {
              name: "test", //非必须
              start: "2019-01-11 18:18:18",
              end: "2019-01-11 18:18:18",
            },
          ],
          customKey: [
            //自定义的需要渲染的数组
            {
              id: "test", //非必须
              start: "2019-01-11 18:18:18",
              end: "2019-01-11 18:18:18",
            },
          ],
        },
      ], // gantt数据
    };
  },
  watch: {
    title(to, from) {
      this.sprintInfo.title = to;
    },
    startDate(to, from) {
      this.sprintInfo.startDate = to;
    },
    endDate(to, from) {
      this.sprintInfo.endDate = to;
    },
    description(to, from) {
      this.sprintInfo.description = to;
    },
  },
  methods: {
    editSprintInfo() {
      this.isSprintEditting = true;
    },
    confirmEdit() {
      this.isSprintEditting = false;
      var newSptintInfo = this.sprintInfo;
      this.$emit("editSprintInfo", newSptintInfo);
    },
    deleteSptint() {
      this.isSprintEditting = false;
      this.$emit("deleteSptint");
    },
  },
};
</script>

<style scoped>
.card-content {
  display: flex;
}
.card-content__card {
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0px 12px;
}
.max-width {
  width: 500px;
}
.sprint__edit-sprint-dialog h1 {
  font-size: 18px;
  padding: 12px 0px;
}
.header-button {
  float: right;
  margin-top: -8px;
  margin-right: 12px;
  padding: 10px;
}
</style>
