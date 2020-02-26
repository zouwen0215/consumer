<template>
	<template-page class="userPrivilege" :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">

		<div slot="buttonRegion">
			<span class="ml10">状态：</span>
			<el-select v-model="params.search.isStop" placeholder="账号状态">
				<el-option label="全部" value=""></el-option>
				<el-option label="停用" value="1"></el-option>
				<el-option label="启用" value="0"></el-option>
			</el-select>
			<span class="ml10">姓名：</span>
			<el-input class v-model="params.search.cnName" placeholder="姓名"></el-input>
			<span class="ml10">用户名：</span>
			<el-input class v-model="params.search.userName" placeholder="用户名"></el-input>
			<el-button class="ml10" type="primary" @click="loadMessage">搜索</el-button>
			<el-button @click="reset">重置</el-button>
			<el-button class="ml10" type="success" @click="dialog(0,0)" style="float: right;">新增</el-button>

		</div>

		<div slot="pageRegion">
			<template>
				<el-table ref="multipleTable" :data="params.infor" border style="width: 100%">
					<el-table-column prop="cnName" label="姓名"></el-table-column>
					<el-table-column prop="userName" label="用户名"></el-table-column>
					<el-table-column prop="mobile" label="手机号"></el-table-column>
					<el-table-column prop="roleName" label="角色"></el-table-column>
					<el-table-column prop="isStop" label="状态">
						<template slot-scope="scope">
							{{scope.row.isStop ? "停用" : "启用"}}
						</template>
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" width="200">
						<template slot-scope="scope">{{scope.row.createTime | timestampToTime}}</template>
					</el-table-column>
					<el-table-column prop="creatorName" label="创建人"></el-table-column>
					<el-table-column prop="loginTime" label="最近一次登录时间" width="200">
						<template slot-scope="scope">{{scope.row.loginTime | timestampToTime}}</template>
					</el-table-column>

					<el-table-column label="操作" width="300" fixed="right">
						<template slot-scope="scope">
							<div class="operate">
								<p class="editText" plain @click="dialog(scope.row,1)">编辑</p>
								<p class="editText" plain v-if="scope.row.isStop" @click="useLink(scope.row)">启用</p>
								<p class="deleteText" plain v-if="!scope.row.isStop&&scope.row.userName!='admin'"  @click="stopLink(scope.row)">停用</p>
								<p class="editText" @click="resetPwd(scope.row)">重置密码</p>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<!--弹窗-->
		<div class="pageDialog" slot="pageDialog">
			<el-dialog v-if="params.addMenu" :title="params.title" :visible.sync="params.addMenu" width="400px" center>
				<addPrivilege :param="params" v-on:reload="loadMessage"></addPrivilege>
			</el-dialog>

			<el-dialog title="重置密码" :visible.sync="params.DialogVisible" width="500px" center>
				<div class="mb20">新密码：
					<el-input placeholder="请输入密码" type="password" v-model="params.info.password" show-password></el-input>
				</div>
				
				<span slot="footer" class="dialog-footer">
        	  <el-button type="primary" @click="resetPassword" style="margin-right:40px;">确 定</el-button>
          <el-button @click="params.DialogVisible = false">取 消</el-button>
        
        </span>
			</el-dialog>
		</div>
	</template-page>
</template>

<script>
	import templatePage from "../template/templatePage";
	import http from "../../utils/http.js";
	import URL from "../../utils/url.js";
	import validation from "@/utils/validation.js";
	import addPrivilege from "./part/addPrivilege";
	import common from "@/utils/common.js";
	import md5 from "js-md5";
	export default {
		data() {
			return {
				params: {
					mapList: [], //网格列表
					addMenu: false,
					DialogVisible: false,
					userId: "",
					userinfo:{},
					search: {
						cnName: "",
						isStop: "",
						userName: ""
					},
					optType:"",
					addInfor: {	},
					dataForm: {
						goodsList: []
					},
					infor: [],
					info: {},
					//分页组建
					pagination: {
						currentPage: 1,
						pageNum: "1",
						pageSize: "10",
						total: 1,
						hasPage: true,
						hasMenu: false
					}
				}
			};
		},
		components: {
			templatePage,
			addPrivilege
		},
		methods: {
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
			dialog(val, type) {
				let _self = this;
				console.log()
				if(type==1) {
				
				_self.params.addInfor =JSON.parse(JSON.stringify(val))

				console.log(val)
				 _self.params.title="编辑账号"
				  _self.params.optType="edit"
				_self.params.addMenu = true;
				} else {
					_self.params.title="新增账号"
					_self.params.optType="creat"
					
					_self.params.addMenu = true;
			
				}

			
			},
			resetPwd(item) {
				let _self = this;
				_self.params.userId = item.id;
				_self.params.DialogVisible = true;
			},
			resetPassword() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.RESET_PASSWORD;
				if(_self.params.info.password) {
					let msg = {
						userId: _self.params.userId,
						password: md5(_self.params.info.password)
					};
					url = http.filterUrl(msg, url);
					http.publicRequest(
						"put",
						url,
						"",
						function(res) {
							_self.params.DialogVisible = false;
							common.messageFunc(
								"密码重置成功!请提醒客户经理重新登录",
								"success"
							);
						},
						function(res) {}
					);
				} else {
					common.messageFunc("新密码不能为空", "error");
				}
			},
			useLink(item) {
				let _self = this;
				_self.$confirm("是否启用此账号？启用后该账户可继续登录使用", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.USER_USER_NOT;
						let msg = {
							userId: item.id,
							state: 0
						};
						url = http.filterUrl(msg, url);
						let params = http.params;
						http.publicRequest(
							"put",
							url,
							"",
							function(res) {
								_self.$message({
									type: "success",
									message: "启用成功!"
								});
								_self.loadMessage();
							},
							function(res) {}
						);
					})
					.catch(() => {});
			},
			loadMap() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SELECT_MAP;
				let msg = {
					cityCode: 0
				};
				url = http.filterUrl(msg, url);
				http.publicRequest(
					"GET",
					url,
					"",
					function(res) {
						_self.params.mapList = res.body.data;
					},
					function(res) {}
				);
			},
			stopLink(item) {
				let _self = this;
				this.$confirm("是否停用此账号？停用后该账户无法进行登录使用", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.USER_USER_NOT;
						let msg = {
							userId: item.id,
							state: 1
						};
						url = http.filterUrl(msg, url);
						let params = http.params;
						http.publicRequest(
							"put",
							url,
							"",
							function(res) {
								_self.$message({
									type: "success",
									message: "停用成功!"
								});
								_self.loadMessage();
							},
							function(res) {}
						);
					})
					.catch(() => {});
			},
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GET_USERLIST_PRIVILEGE;
				let msg = {
					id: 0,
					userName: search.userName,
					cnName: search.cnName,
					isStop: search.isStop,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest(
					"get",
					url,
					"",
					function(res) {
						_self.params.pagination.total = validation.total(res);
						let result = res.body.data;
						console.log(result)
						_self.params.infor = result;
					},
					function(res) {}
				);
			}
		},
		created() {
			this.loadMessage();
			//	this.loadMap();
			//createUserName:_self.$store.state.user.userInfor.username
		}
	};
</script>

<style lang="less" scoped>
	.userPrivilege {
		// padding:15px;
		// background-color: #fff;
		.operate {
			&>p {
				display: inline;
				text-align: center;
				margin-left: 10px;
			}
		}
		.add {
			text-align: left;
			margin-bottom: 10px;
		}
		.search {
			text-align: left;
		}
	}
	
	.img {
		width: auto;
		height: 60px;
	}
	
	.activitys {
		display: flex;
	}
	
	.btn {
		margin-bottom: 20px;
		.el-button {
			width: 200px;
		}
	}
</style>