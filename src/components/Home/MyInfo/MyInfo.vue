<template>
  <el-card class="my-info__card">
    <div slot="header">
      <span>My Information</span>
      <el-button class="header-button" type="text" @click="editMyInfo">Edit</el-button>
    </div>
    <div class="card-content">
      <el-card shadow="never">
        <div slot="header">Avatar</div>
        <img :src="MyInfo.avatar" height="150px" width="200px" />
      </el-card>
      <el-card shadow="never" class="myInfo__card">
        <div slot="header">Information</div>
        <h1>ID</h1>
        <p>{{MyInfo.ID}}</p>
        <h1>Name</h1>
        <p>{{MyInfo.name}}</p>
      </el-card>
    </div>
    <el-dialog
      class="my-info__edit-dialog"
      title="Editting My Information "
      :visible.sync="isMyInfoEditting"
      :modal="false"
    >
      <h1>Name</h1>
      <el-input v-model="newMyInfo.name"></el-input>
      <h1>Password</h1>
      <el-input v-model="newMyInfo.password" type="password"></el-input>
      <h1>Avatar</h1>
      <el-upload
        class="avatar-uploader"
        action
        :show-file-list="false"
        :on-change="onUploadChange"
        list-type="picture-card"
      >
        <img v-if="imageUrl" height="145px" width="145px" :src="imageUrl" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEdit">Confirm</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  title: "MyInfo",
  data() {
    return {
      isMyInfoEditting: false,
      imageUrl: "",
      pam:"",
      MyInfo: {
        ID: this._GLOBAL.userObj.ID,
        name: this._GLOBAL.userObj.name,
        avatar: this._GLOBAL.imgBaseUrl + this._GLOBAL.userObj.avatar,
      },
      newMyInfo: {
        ID: this._GLOBAL.userObj.ID,
        name: this._GLOBAL.userObj.name,
        avatar: this._GLOBAL.imgBaseUrl + this._GLOBAL.userObj.avatar,
        password: "",
      },
    };
  },
  methods: {
    onUploadChange(file) {
      const isIMAGE =
        file.raw.type === "image/jpeg" ||
        file.raw.type === "image/png" ||
        file.raw.type === "image/gif";
      const isLt1M = file.size / 1024 / 1024 < 2;

      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
        return false;
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 2MB!");
        return false;
      }

      this.imageUrl = file.url;

      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function (e) {
        hash = asmCrypto.SHA256.hex(this.result);
      };

      // console.log(reader.readAsArrayBuffer(file));

      // this.axios
      //   .post("/api/user/updateAvatarByID?ID="+this.MyInfo.ID+"&avatar="+this.imageUrl, {
      //     emulateJSON: true,
      //   })
      //   .then((response) => {
      //     if (response.data.message == "成功") {
      //       console.log("成功");
      //     }
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });
    },
    editMyInfo() {
      this.isMyInfoEditting = true;
      this.imageUrl = "";
    },
    confirmEdit() {
      this.isMyInfoEditting = false;
    },
  },
};
</script>

<style scoped>
.my-info__card {
  margin: 24px;
  height: max-content;
}
.card-content {
  display: flex;
}
.myInfo__card h1 {
  font-size: 18px;
}
.myInfo__card p {
  padding: 12px 0px;
}
.card-content > * {
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0px 12px;
}
.my-info__edit-dialog h1 {
  font-size: 18px;
  padding: 12px 0px;
}
.header-button {
  float: right;
  margin-top: -8px;
  margin-right: 12px;
  padding: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
