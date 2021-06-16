<template>
	<aside class="aside">
		<div class="user-info" style="background-color:#DCDFE6">
			<div>
				<el-avatar :src="avatarURL"></el-avatar>
				<p class="user-info__name">{{userName}}</p>
			</div>
		</div>
		<el-menu  background-color="#606266"
      text-color="#fff"
      active-text-color="#ffd04b" ref="home-menu" class="menu" default-active="my-jobs" :default-openeds="['myJob', 'myProjects']">
			<el-menu-item index="my-info" @click="toMyInfo('my-info')">
				<span>MY INFO</span>
			</el-menu-item>
			<el-menu-item index="my-jobs" @click="toMyJobs('my-jobs')">
				<span>MY JOBS</span>
			</el-menu-item>
			<el-submenu ref="project-menu" index="myProjects">
				<template slot="title">
					<span>MY PROJECTS</span>
				</template>
				<el-menu-item v-for="(item, index) in projectsList" :index="index + ''" @click="toProject(item)" :key="item.ID">
					{{item.name}}
				</el-menu-item>
			</el-submenu>
			<el-menu-item :index="'newProject'" @click="toNewProject('newProject')" :key="'newProject'">
				+ CREATE PROJECT
			</el-menu-item>
		</el-menu>
	</aside>
</template>

<script>
	/* 本组件 HomeMenu 为主页导航组件，从登录页面 Login 组件转入，此后一直驻留
	 * 【输入参数 props】
	 * userID
	 * 【对外功能】
	 * 本组件需要与页面显示 route-view 传参
	 * 但 route-view 无法使用父子组件传参方法
	 * 故本组件需要维护全局变量，使用全局变量传参
	 *  1. 维护全局变量 this._GLOBAL.projectID（以支持 project 组件）
	 *  2. 维护路径 this.$route.params.projectName（以支持 project 组件）
	 *  3. （暂无）维护路径参数 this.$route.query?
	 */
	export default {
		name: 'HomeMenu',
		props: [
			'userID',
			'userName'
		],
		data() {
			return {
				avatarURL: this._GLOBAL.imgBaseUrl + this._GLOBAL.userObj.avatar,
				myJobs: [{
						text: 'My Task',
						path: 'my-task'
					},
					{
						text: 'My Message',
						path: 'my-message'
					}
				],
				//       projectsList: [
				//         { ID: 1, name: 'project-1' },
				//         { ID: 2, name: 'project-2' },
				//         { ID: 3, name: 'project-3' }
				//       ]
				projectsList: this._GLOBAL.ProjectList
			}
		},
		mounted() {
			this.$router.replace('/' + this.userName + '/my-jobs')
		},
		created:function() {
			this.acceptList();
		},
		methods: {
			// 维护路径 this.$route.params.projectName
			// 进入某项目页面
			toProject(project) {
        this._GLOBAL.projectIndex = this.$refs['home-menu']['activeIndex']
				this.$router.push('/' + this.userName + '/' + project.name)
			},
			// 进入某工作页面
			toMyJobs(path) {
				this.$router.push('/' + this.userName + '/' + path)
			},
			// 进入我的信息页面
			toMyInfo(path) {
				this.$router.push('/' + this.userName + '/' + path)
			},
			toNewProject(path) {
				this.$router.push('/' + this.userName + '/' + path)
			},
			acceptList: function() {
				this.$eventBus.$on('add', (message) => {
					this.projectsList = this._GLOBAL.ProjectList;
				})
			}
		}
	}
</script>

<style scoped>
	.aside{
		/* background-color:rgba(215, 255, 255, 0.267) */
	}
	.user-info {
		padding: 24px;
		display: flex;
		flex-direction: column;
	}

	.user-info>div {
		display: flex;
		align-items: center;
	}

	.user-info__name {
		margin-left: 24px;
	}

	.menu {
		border: none;
	}
	.el-menu-item{
		/* background-color:rgba(218, 255, 249, 0.205) */
	}
	.el-submenu{
		/* background-color:rgba(113, 226, 226, 0.205) */
	}
</style>
