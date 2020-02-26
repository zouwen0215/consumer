<template>
	<template-page class='activitiesManage' :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">

		<div slot="buttonRegion">
			<span class="ml10">活动类型：</span>
			<el-select v-model="params.search.type">
				<el-option label="全部" value=""></el-option>
				<el-option label="签到" value="1"></el-option>
				<el-option label="幸运大转盘" value="2"></el-option>
				<el-option label="激励活动" value="3"></el-option>
			</el-select>
			<span class="ml10">活动状态：</span>
			<el-select v-model="params.search.status">
				<el-option label="全部" value=""></el-option>
				<el-option label="活动中" value="1"></el-option>
				<el-option label="预发布" value="0"></el-option>
				<el-option label="已结束" value="2"></el-option>
			</el-select>

			<el-button class="ml10" type="primary" @click.native="loadMessage">搜索</el-button>
			<el-button @click.native="reset">重置</el-button>
			<el-button type="success" @click="params.importMenu=true" style="float: right;">新建活动</el-button>
		</div>

		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">

					<el-table-column prop="name" label="活动名称"></el-table-column>
					<el-table-column prop="typeName" label="活动类型">
					</el-table-column>

					<el-table-column prop="timeStr" label="活动时间"></el-table-column>
					<el-table-column prop="status" label="活动状态">
						<template slot-scope="scope">
							<p v-if="scope.row.status==0">预发布</p>
							<p v-if="scope.row.status==1">活动中</p>
							<p v-if="scope.row.status==2">已结束</p>
						</template>

					</el-table-column>

					<el-table-column fixed="right" label="操作" width="150">
						<template slot-scope="scope">
							<div class="operate">
								<p @click="details(scope.row,2)" class="editText">查看</p>
								<p @click="details(scope.row,3)" v-if="scope.row.status==0" class="editText">编辑</p>
								<p class="deleteText" @click="deleteNotice(scope.row)" v-if="scope.row.status==0">删除</p>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<!--弹窗-->

		<div class="pageDialog" slot="pageDialog">
			<el-dialog title="选择活动" :visible.sync="params.importMenu" v-if="params.importMenu" width="30%" back-backdrop='static' center>
				<p>请选择以下活动其中一项</p>
				<el-button @click="activitisTo(1,1)">签到</el-button>
				<el-button @click="activitisTo(2,1)">幸运大转盘</el-button>
				<el-button @click="activitisTo(3,1)">激励活动</el-button>
			</el-dialog>
			<el-dialog v-if="params.activities" :title="params.acName" :visible.sync="params.activities" :width="params.perwidth" back-backdrop='static' center :close-on-click-modal="false">
				<sign :param="params" v-if="params.type==1" v-on:reload="loadMessage"></sign>
				<wheel :param="params" v-if="params.type==2" v-on:reload="loadMessage"></wheel>
				<stimulate :param="params" v-if="params.type==3" v-on:reload="loadMessage"></stimulate>
			</el-dialog>

			</el-dialog>

		</div>
	</template-page>
</template>

<script>
	import templatePage from '../template/templatePage'
	import http from '../../utils/http.js'
	import URL from '../../utils/url.js'
	import validation from '@/utils/validation.js'
	import sign from "./part/sign"
	import wheel from "./part/wheel"
	import stimulate from "./part/stimulate"

	export default {
		data() {
			return {
				params: {
					importMenu: false,
					activities: false,
					activitytype: '',
					activitydetail: {},
					kind: 0,
					acName: "",
					operate: 1,
					perwidth:'',
					search: {
						type: '',
						status: '',

					},
					//-----------------------------
					inforDetail: {},
					infor: [{}],

					//分页组建
					pagination: {
						currentPage: 1,
						pageNum: '1',
						pageSize: '10',
						total: 1,
						hasPage: true,
						hasMenu: false,
					},

				},
			}
		},
		components: {
			templatePage,
			sign,
			wheel,
			stimulate
		},
		methods: {
			details(val, opt) {
				let _self = this;
				_self.params.activitydetail = val
				_self.params.type = val.type
				_self.params.operate = opt;
					if(val.type == 1) {
					_self.params.acName = "签到设置"
					_self.params.perwidth='500px'
				} else if(val.type == 2) {
					_self.params.acName = "幸运大转盘设置"
					_self.params.perwidth='1000px'
				} else {
				_self.params.acName = "激励活动设置"
					_self.params.perwidth='900px'
				}
				_self.loadDetail()

			},
		
			activitisTo(val, opt) {
				let _self = this;
				_self.params.operate = opt;
				_self.params.type = val
				if(val == 1) {
					_self.params.acName = "签到设置"
					_self.params.perwidth='600px'
				} else if(val == 2) {
					_self.params.acName = "幸运大转盘设置"
					_self.params.perwidth='800px'
				} else {
					_self.params.acName = "激励活动设置"
					_self.params.perwidth='800px'
				}
				_self.params.activities = true;
			},
			//----------------------------------------
			dealData() {
				let _self = this;

			},
			deleteNotice(item) {
				let _self = this;
				let msg = "是否删除该活动？"
				this.$confirm(msg, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.ACTIVITIES_DELETE;
						let msg = {
							id: item.id
						};
						url = http.filterUrl(msg, url);
						let params = http.params;
						http.publicRequest(
							"DELETE",
							url,
							"",
							function(res) {
								_self.$message({
									type: "success",
									message: "删除成功!"
								});
								_self.loadMessage();
							},
							function(res) {}
						);
					})
					.catch(() => {});
			},
			handleSizeChange(index) {
				let _self = this;
				_self.params.pagination.pageSize = index;
				_self.loadMessage();

			},
			handleCurrentChange(index) {
				let _self = this;
				_self.params.pagination.pageNum = index;
				_self.loadMessage();
			},
			reset() {
				let _self = this;
				_self.params.search = validation.reset(_self.params.search);
				_self.loadMessage();
			},
			loadDetail() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.ACTIVITIES_GET;

				let msg = {
					id: _self.params.activitydetail.id,

				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					let result = res.body.data;
					_self.params.inforDetail = result;
					let arr = _self.params.inforDetail;
					_self.params.inforDetail.configJson = JSON.parse(arr.configJson.replace(/\\\"/g, '\"'));
					console.log(_self.params.inforDetail)
					_self.params.activities = true;
				}, function(res) {})

			},
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.ACTIVITIES_LIST;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					type: search.type,
					status: search.status,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					_self.params.pagination.total = validation.total(res)
					let result = res.body.data;
					_self.params.infor = result;

				}, function(res) {})
			},

		},
		created() {
			let _self = this;
			_self.loadMessage();
			//			this.loadGoodsList();
		}
	}
</script>

<style lang="less" scoped>
	.activitiesManage {
		.pageDialog {
			.el-button {
				display: block;
				margin: 0 auto;
				margin-top: 20px;
			}
		}
		.operate {
			&>p {
				display: inline;
				text-align: center;
				margin-left: 10px;
			}
		}
		.search {
			text-align: left;
		}
	}
	
	

	
</style>