<template>
  <el-card class="my-info__card">
    <div slot="header">
      <span>My Information</span>
      <el-button class="header-button" type="text" @click="editMyInfo">Edit</el-button>
    </div>
    <div class="card-content">
      <el-card shadow="never">
        <div slot="header">Avatar</div>
        <!-- <img :src="MyInfo.avatar" height="150px" width="200px" /> -->
        <!-- ../../../assets/treetop.png -->
        <img src="http://120.79.157.21/huajiaohuixiang/avatar5b0dfb08f4174c7a8e5b721ac84b4414.jpg" height="200px" width="200px" />
      </el-card>
      <el-card shadow="never" class="myInfo__card">
        <div slot="header">Information</div>
        <h1>ID</h1>
        <p>{{MyInfo.ID}}</p>
        <h1>Name</h1>
        <p>{{MyInfo.name}}</p>
        <h1>Email</h1>
        <p>{{MyInfo.mail}}</p>
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
      <h1>Email</h1>
      <el-input v-model="newMyInfo.mail"></el-input>
      <h1>Avatar</h1>
      <el-upload
        class="avatar-uploader"
        action="#"
        :http-request="httpRequest"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
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
      MyInfo: {
        ID: this._GLOBAL.userObj.ID,
        // name: this._GLOBAL.userObj.name,
        // avatar: this._GLOBAL.imgBaseUrl + this._GLOBAL.userObj.avatar,
        // mail: this._GLOBAL.userObj.mail,
        name:"",
        avatar:"",
        mail:""
      },
      newMyInfo: {
        ID: this._GLOBAL.userObj.ID,
        name: this._GLOBAL.userObj.name,
        avatar: this._GLOBAL.imgBaseUrl + this._GLOBAL.userObj.avatar,
        mail: this._GLOBAL.userObj.mail,
        password: "",
      },
    };
  },
  created:function(){
    this.getAvatar();
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.axios
        .get("/api/user/getUserByID?ID=" + this.MyInfo.ID, {
          emulateJSON: true,
        })
        .then((response) => {
          if (response.data.message == "成功") {
            this.MyInfo.name=response.data.data.user.name;
            this.MyInfo.mail=response.data.data.user.mail;
            this.newMyInfo.mail=response.data.data.user.mail;
            this.newMyInfo.name=response.data.data.user.name;
            this.newMyInfo.password=response.data.data.user.password;

          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getAvatar() {
      this.axios
        .get("/api/user/getAvatarByID?ID=" + this.MyInfo.ID, {
          emulateJSON: true,
        })
        .then((response) => {
          if (response.data.message == "成功") {
            this._GLOBAL.avatar = response.data.data.avatar;
            this.MyInfo.avatar =
              this._GLOBAL.imgBaseUrl + response.data.data.avatar;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    httpRequest(data) {
      let _this = this;
      let rd = new FileReader(); // 创建文件读取对象
      let file = data.file;
      rd.readAsDataURL(file); // 文件读取装换为base64类型
      rd.onloadend = function (e) {
        console.log("测试：" + this.result);
        _this.imageUrl = this.result; // this指向当前方法onloadend的作用域
      };
    },
    editMyInfo() {
      this.isMyInfoEditting = true;
      this.imageUrl = "";
    },
    updateInfo(){
      this.axios
        .post(
          "/api/user/updateUserByID",
          {
            ID: this.MyInfo.ID,
            name:this.newMyInfo.name,
            password:this.newMyInfo.password,
            mail:this.newMyInfo.mail
          },
          {
            emulateJSON: true,
          }
        )
        .then((response) => {
          if (response.data.message == "成功") {
            this.MyInfo.name=this.newMyInfo.name;
            this.MyInfo.mail=this.newMyInfo.mail;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    updateAvatar() {
      this.axios
        .post(
          "/api/user/updateAvatarByID",
          {
            ID: this.MyInfo.ID,
            file: this.imageUrl,
          },
          {
            emulateJSON: true,
          }
        )
        .then((response) => {
          if (response.data.message == "成功") {
            console.log("成功")
            this.getAvatar();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    confirmEdit() {
      this.isMyInfoEditting = false;
      this.updateInfo();
      if (this.imageUrl.length != 0) {
        this.updateAvatar();
      }
    },
  },
};
</script>

<style scoped>
.el-card >>> .el-card__header {
  background-color: #bddbff38;
}
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
