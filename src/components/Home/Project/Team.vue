<template>
	<div>
		<el-card class="my-info__card">
			<div slot="header">
				<span>Team Member</span>
				<el-button class="header-button" type="text" @click="isInviting = true" style="float: right; padding: 3px 0">Invite</el-button>
			</div>
			<el-card class="list" shadow="never">
				<el-table :data="data" stripe>
					<el-table-column prop="ID" label="ID" align="center"></el-table-column>
					<el-table-column prop="name" label="Name" align="center"></el-table-column>
				</el-table>
			</el-card>
		</el-card>
		<el-dialog class="my-info__edit-dialog" title="Invite more teamates" :visible.sync="isInviting" :modal-append-to-body="false">
			<el-input v-model="userid" placeholder="Please enter User ID"></el-input>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isInviting = false">Cancel</el-button>
				<el-button type="primary" @click="invite">Invite</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		props: [
			'list',
      'projectID'
		],
		data() {
			return {
				isHost: true,
				isInviting: false,
				userid: '',
				data: [],
			}
		},
		created: function() {
			this.show();
		},
    watch:{
      projectID(to, from){
        this.show()
      }
    },
		methods: {
			handleClose(done) {
				this.$confirm('Confirm?')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			invite() {
				this.isInviting = false;
				this.axios.get('/api/project/addMember', {
						params: {
							PID: this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].ID,
							UID: this.userid
						}
					})
					.then((response) => {
						if (response.data.message == '成功') {
							this.$alert('Invite successfully');
						}
					})
			},
			show() {
				this.axios.get('/api/project/getMemberListByPID', {
						params: {
							ID: this._GLOBAL.ProjectList[this._GLOBAL.projectIndex].ID,
						}
					})
					.then((response) => {
						if (response.data.message == '成功') {
							this.data = response.data.data.memberList;
						}
					})
			}
		}
	}
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

	.card-content>* {
		flex-grow: 1;
		flex-shrink: 1;
		margin: 0px 12px;
	}

	.my-info__edit-dialog h1 {
		font-size: 18px;
		padding: 12px 0px;
	}

	.list {
		flex-shrink: 1;
		flex-grow: 1;
	}
</style>
