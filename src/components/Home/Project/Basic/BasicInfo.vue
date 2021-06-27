<template>
  <div>
    <el-card>
      <div slot="header">
        Basic Info
        <el-button
          :v-show="isHost"
          @click="editInfo"
          style="float: right; padding: 3px 0"
          type="text"
        >Edit</el-button>
      </div>
      <div class="card-content">
        <el-card shadow="never">
          <div slot="header">Basic</div>
          <p>Name : {{name}}</p>
          <br />
          <p>Leader : {{hostname}}</p>
          <br />
          <p>Start : {{start}}</p>
          <br />
          <p>End : {{end}}</p>
          <br />
          <p :key="index">Current Status : {{state}}</p>
        </el-card>
        <el-card shadow="never">
          <div slot="header">Description</div>
          <p>{{description}}</p>
        </el-card>
      </div>
    </el-card>
    <el-dialog
      title="Edit basic info"
      :visible.sync="dialogVisible"
      width="50%"
      :modal-append-to-body="false"
    >
      <el-form :model="form">
        <el-form-item label="Name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" style="width: 65%;"></el-input>
        </el-form-item>
        <el-form-item label="Start" :label-width="formLabelWidth">
          <el-date-picker
            type="date"
            placeholder="Choose start date"
            v-model="form.start"
            value-format="yyyy-MM-dd"
            style="width: 65%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="End" :label-width="formLabelWidth">
          <el-date-picker
            type="date"
            placeholder="Choose end date"
            v-model="form.end"
            value-format="yyyy-MM-dd"
            style="width: 65%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="Status" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="Choose status">
            <el-option label="Pending" value="Pending"></el-option>
            <el-option label="In progress" value="In progress"></el-option>
            <el-option label="Completed" value="Completed"></el-option>
            <el-option label="Shilved" value="Shilved"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Description" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            v-model="form.desc"
            placeholder="No longer than 100 characters"
            style="width: 65%;"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveEdit">Save</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  //name: 'BasicInfo',
  props: ["name", "hostname", "start", "end", "description", "state"],
  data() {
    return {
      isHost: true,
      dialogVisible: false,
      form: {
        name: this.name,
        status: this.state,
        start: this.start,
        end: this.end,
        desc: this.description,
      },
      formLabelWidth: "120px",
      index: 1,
    };
  },
  watch: {
    state(to, from) {
      console.log("state改了");
      this.index++;
    },
  },
  created: function () {
    this.isHostF();
    this.name = this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].name;
    this.hostname = this._GLOBAL.ProjectList[
      this._GLOBAL.projectIndex
    ].hostName;
    this.description = this._GLOBAL.ProjectList[
      this._GLOBAL.projectIndex
    ].description;
    this.start = this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].startDate;
    this.end = this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].endDate;
    this.state = this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].state;
  },
  methods: {
    handleClose(done) {
      this.$confirm("Confirm?")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    editInfo() {
      this.dialogVisible = true;
      this.form.name = this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].name;
      this.form.desc = this._GLOBAL.ProjectList[
        this._GLOBAL.projectIndex
      ].description;
      this.form.start = this._GLOBAL.ProjectList[
        this._GLOBAL.projectIndex
      ].startDate;
      this.form.end = this._GLOBAL.ProjectList[
        this._GLOBAL.projectIndex
      ].endDate;
      this.form.status = this._GLOBAL.ProjectList[
        this._GLOBAL.projectIndex
      ].state;
    },
    isHostF() {
      this.axios
        .get("/api/project/isPrjHost", {
          params: {
            ID: this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].ID,
            UID: this._GLOBAL.userObj.ID,
            token: localStorage.getItem('token')
          },
        })
        .then((response) => {
          if (response.data.message == "成功") {
            this.isHost = response.data.data.isHost;
            // console.log(this.isHost);
          }
        });
    },
    saveEdit() {
      this.dialogVisible = false;
      this.axios
        .post(
          "/api/project/updatePrjAll",
          {
            name: this.form.name,
            description: this.form.desc,
            startDate: this.form.start,
            endDate: this.form.end,
            state: this.form.status,
            ID: this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].ID,
          },
          {
            emulateJSON: true,
          }
        )
        .then((response) => {
          if (response.data.message == "成功") {
            this._GLOBAL.ProjectList[
              this._GLOBAL.projectIndex
            ].name = this.form.name;
            this._GLOBAL.ProjectList[
              this._GLOBAL.projectIndex
            ].description = this.form.desc;
            this._GLOBAL.ProjectList[
              this._GLOBAL.projectIndex
            ].startDate = this.form.start;
            this._GLOBAL.ProjectList[
              this._GLOBAL.projectIndex
            ].endDate = this.form.end;
            this._GLOBAL.ProjectList[
              this._GLOBAL.projectIndex
            ].state = this.form.status;
            this.$eventBus.$emit("refreshbi");
            alert("Edit successfully!");
          } else {
            alert("Edit fail!");
          }
        });
    },
  },
};
</script>

<style scoped>
.el-card >>> .el-card__header  {
  background-color: #bddbff38;
}
.card-content {
  display: flex;
}

.card-content > * {
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0px 12px;
}
</style>
