<template>
	<template-page class='blackList' :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">

		<div slot="buttonRegion">
			<span class="ml10">门店名称：</span>
			<el-input class=" " v-model="params.search.shopName" placeholder="门店名称"></el-input>
			<span class="ml10">许可证号：</span>
			<el-input class=" " v-model="params.search.licenseCode" placeholder="许可证号"></el-input>
			<span class="ml10">门店性质：</span>
			<el-select v-model="params.search.blackFlag" placeholder="请选择门店性质">
				<el-option label="显示全部" value="0"></el-option>
				<el-option label="显示黑名单" value="1"></el-option>
			</el-select>
			<el-button class="ml10" type="primary" @click="loadMessage">搜索</el-button>
			<el-button type="text" @click="reset">清空筛选条件</el-button>
		</div>

		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					<el-table-column prop="shopName" label="门店名称"></el-table-column>
					<el-table-column prop="licenseCode" label="许可证号"></el-table-column>
					<el-table-column prop="nickName" label="零售户姓名">
					</el-table-column>
					<el-table-column prop="mobile" label="联系方式"></el-table-column>
					<el-table-column prop="points" label="积分值"></el-table-column>
					<el-table-column prop="level" label="档位"></el-table-column>
					<el-table-column prop="exchangeCount" label="积分兑换次数"></el-table-column>

					<el-table-column fixed="right" label="操作" width="300">
						<template slot-scope="scope">
							<div class="choice">
								<el-button v-if="scope.row.blackFlag== 0 " @click="addBlacks(scope.row)">加入黑名单</el-button>
								<el-button v-if="scope.row.blackFlag== 1 " type="danger" plain @click="deleteBlack(scope.row)">移除黑名单</el-button>
								<!--<el-button v-if="scope.row.blackFlag== 2 " @click="dialog(scope.row)">查看</el-button>-->
								<el-button type="warning" plain @click="clearScore(scope.row)">积分清零</el-button>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<!--弹窗-->
		<div class="pageDialog" slot="pageDialog">
			<!--<el-dialog title="编辑" :visible.sync="params.dialogFormVisible" width="500px">
				<addBlack :param="params" v-on:reload="loadMessage"></addBlack>
			</el-dialog>-->

			<el-dialog title="提示" :visible.sync="params.dialogVisible" width="30%" center>
				<p>加入黑名单原因： 多次违规刷单，违规销售</p>
				<p>加入黑名单时间： 多次违规刷单，违规销售</p>
				<p>操作人员： 多次违规刷单，违规销售</p>
				<p>操作人员联系方式： 多次违规刷单，违规销售</p>
				<span slot="footer" class="dialog-footer">
    			<el-button @click="params.dialogVisible = false">取 消</el-button>
    			<el-button type="primary" @click="deleteBlack(scope.row)">确 定</el-button>
  				</span>
			</el-dialog>
		</div>

	</template-page>
</template>

<script>
	import templatePage from '../template/templatePage'
	import http from '../../utils/http.js'
	import URL from '../../utils/url.js'
	import validation from '@/utils/validation.js'
	import addBlack from "./part/addBlack";
	export default {
		data() {
			return {
				params: {
					dialogFormVisible: false,
					dialogVisible: false,
					rerason: {},
					search: {
						shopName: "",
						licenseCode: '',
						blackFlag: "0",
					},

					dataForm: {
						goodsList: [],
					},
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
			addBlack
		},

		methods: {
			clearScore(item) {
				let _self = this;
				let msg = "确定对【" + item.shopName + "】进行积分清零操作？"
				this.$confirm(msg, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.CLEARSCORES_GET;
						let params = http.params;
						let msg = {
							shopId: item.id,
						};
						url = http.filterUrl(msg, url);
						http.publicRequest(
							"GET",
							url,
							'',
							function(res) {
								_self.$message({
									type: "success",
									message: "操作成功!"
								});
								_self.loadMessage();
							},
							function(res) {}
						);
					})
					.catch(() => {
						_self.$message({
							type: "info",
							message: "已取消操作"
						});
					});
			},
			addBlacks(item) {
				let _self = this;
				let msg = "黑名单用户所有积分权益冻结，恢复后可继续享受，不可获取积分也不可 使用积分"
				this.$confirm(msg, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.ADD_BLACKLIST;
						let params = http.params;
						let body = {
							shopId: item.id,
							cause:"",
							createUser: "",
							createUserPhone: "",
						};
						url = http.filterUrl(msg, url);
						http.publicRequest(
							"post",
							url,
							body,
							function(res) {
								_self.$message({
									type: "success",
									message: "操作成功!"
								});
								_self.loadMessage();
								_self.params.dialogVisible = false;
							},
							function(res) {}
						);
					})
					.catch(() => {
						_self.$message({
							type: "info",
							message: "已取消操作"
						});
					});
			},

			deleteBlack(item) {
				let _self = this;
				let msg = " 从黑名单删除后，【 " + item.shopName + "】继续享受积分商城的权益，是否从黑名单删除？"
				this.$confirm(msg, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.DELETE_BLACKLIST;
						let params = http.params;
						let msg = {
							shopId: item.id,
						};
						url = http.filterUrl(msg, url);
						http.publicRequest(
							"DELETE",
							url,
							'',
							function(res) {
								_self.$message({
									type: "success",
									message: "操作成功!"
								});
								_self.loadMessage();
								_self.params.dialogVisible = false;
							},
							function(res) {}
						);
					})
					.catch(() => {
						_self.$message({
							type: "info",
							message: "已取消操作"
						});
					});
			},

			dialog(item) {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GET_BLACKLIST_INFO;
				let msg = {
					shopId: item.id,
				};
				url = http.filterUrl(msg, url);
				http.publicRequest('get', url, '', function(res) {
					let result = res.body.data;
					_self.params.rerason = result;
					console.log(result)
				}, function(res) {})

				_self.params.dialogVisible = true;
			},

			addBlack(row) {
				let _self = this;
				_self.params.dialogFormVisible = true;
				_self.params.listId = row.id;
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
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.BLACKLIST_GETINFO;
				let msg = {
					id: 0,
					shopName: search.shopName,
					licenseCode: search.licenseCode,
					level: "",
					areaCode: "",
					gridCode: "",
					blackFlag: search.blackFlag,
					startTime: "",
					endTime: "",
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
		}
	}
</script>

<style lang="less" scoped>
	.blackList {
		// padding:15px;
		// background-color: #fff;
		.add {
			text-align: left;
			margin-bottom: 10px;
		}
		.search {
			text-align: left;
		}
		.choice {
			display: flex;
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