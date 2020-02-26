<template>
	<template-page class='roleList' :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">
		
		<div slot="buttonRegion">

			<span class="ml10">状态：</span>
			<el-select v-model="params.search.isStop" placeholder="状态">
				<el-option label="全部" value=""></el-option>
				<el-option label="停用" value="1"></el-option>
				<el-option label="启用" value="0"></el-option>
			</el-select>
			<span class="ml10">角色：</span>
			<el-input class=" " v-model="params.search.roleName" placeholder="角色"></el-input>
			<el-button class="ml10" type="primary" @click="loadMessage">搜索</el-button>
			<el-button  @click="reset">重置</el-button>
            <el-button class="ml10" type="success" @click="dialog(0,0)" style="float: right;">新增</el-button>
		</div>

		<div slot="pageRegion">
			<template>
				<el-table ref="multipleTable" :data="params.infor" border style="width: 100%">
					<el-table-column prop="roleName" label="角色"></el-table-column>
					<!--<el-table-column prop="mobile" label="登录名"></el-table-column>-->
					<el-table-column prop="isStop" label="状态">
						<template slot-scope="scope">
							{{scope.row.isStop ? "停用" : "启用"}}
						</template>
					</el-table-column>
					<el-table-column prop="remark" label="备注">
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间">
						<template slot-scope="scope">
							{{scope.row.createTime | timestampToTime}}
						</template>
					</el-table-column>
					<el-table-column prop="creatorName" label="创建人"></el-table-column>

					<el-table-column  label="操作" width="200">
						<template slot-scope="scope" >
							<div class="operate">
							<p  class="editText" plain  @click="dialog(scope.row,1)">编辑</p>
							<p  class="editText" plain v-if="scope.row.isStop&&scope.row.id!=1" @click="useLink(scope.row)">启用</p>
							<p  class="deleteText" plain v-if="!scope.row.isStop&&scope.row.id!=1" @click="stopLink(scope.row)">停用</p>
							</div>
							
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<!--弹窗-->
		<div class="pageDialog" slot="pageDialog">
			<el-dialog v-if="params.roleMenu" :title="params.title" :visible.sync="params.roleMenu" width="700px" center>
				<addRole :param="params" v-on:reload="loadMessage"></addRole>
			</el-dialog>
			
		</div>

	</template-page>
</template>

<script>
	import templatePage from '../template/templatePage'
	import http from '../../utils/http.js'
	import URL from '../../utils/url.js'
	import validation from '@/utils/validation.js'
	import addRole from "./part/addRole";
	import common from "@/utils/common.js";
	export default {
		data() {
			return {
				params: {
					
					roleMenu: false,
					DialogVisible:false,
					userId:"",
					title:'',
					search: {
						roleName: "",
						isStop: "",
					},

					dataForm: {
						goodsList: [],
					},
					infor: [],
					info:{},
					roleInfor:{},
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
			addRole
		},
		methods: {
			//			pathUrlTo(url) {
			//				let _self = this;
			//				_self.$router.push(url)
			//			},
			routerLink(item) {
				let _self = this;
				let tempData = {
					name: 'shopCountDetail',
					param: item
				}
				_self.$store.commit('tempData', tempData);
				let url = "/shopCountDetail?id=" + item.id + "&startTime=" + _self.params.search.data_list[0] + "&endTime=" + _self.params.search.data_list[1];
				_self.$router.push(url)
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
			useLink(item){
				let _self = this;
				this.$confirm("是否启用该角色", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.ROLE_STOP_USESLIST;
						let msg = {
							roleId: item.id,
							state:0,
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
			stopLink(item){
				let _self = this;
				this.$confirm("是否停用此角色？停用后拥有此角色的账户无法登录使用", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.ROLE_STOP_USESLIST;
						let msg = {
							roleId: item.id,
							state:1,
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
			dialog(val,type) {
				let _self = this;
				if(type==1){
					_self.params.roleInfor = JSON.parse(JSON.stringify(val));					
					_self.params.roleInfor.flag=true;
			        console.log(_self.params.roleInfor)
			        _self.params.title="编辑角色"
					_self.params.roleMenu = true;
				}else{
					_self.params.roleInfor = {};
//					console.log(_self.params.roleInfor)
                   _self.params.title="新增角色"
					_self.params.roleInfor.flag=false;
					_self.params.roleMenu = true;
				}
			
			},
			resetPwd(item) {
				let _self = this;
				_self.params.userId=item.id;
				_self.params.DialogVisible = true;
			},
			reset() {
				let _self = this;
				_self.params.search = validation.reset(_self.params.search);
				_self.loadMessage();
			},
			resetPassword(){
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.RESET_PASSWORD;
				let msg = {
					userId: _self.params.userId,
					password:_self.params.info.password,
				};
				url = http.filterUrl(msg, url);
				http.publicRequest('put', url, '', function(res) {
						_self.params.DialogVisible = false;
						common.messageFunc(
						"密码重置成功!请提醒客户经理重新登陆",
						"success"
					);
				}, function(res) {})
			},
			
			
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SELECT_ROLE_LIST;
				let msg = {
					id: 0,
					roleName: search.roleName,
					isStop: search.isStop,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
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
			this.loadMessage();
			//createUserName:_self.$store.state.user.userInfor.username
		}
	}
</script>

<style lang="less" scoped>
	.roleList {
		// padding:15px;
		// background-color: #fff;
		.operate{
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