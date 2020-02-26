<template>
	<template-page :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">

		<div class="noticeSet" slot="buttonRegion">

			<el-button style="float:right;" type="success" @click.native="dialog(0,0)">新建公告</el-button>
		</div>

		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					<el-table-column prop="id" label="序号" width="100">
						<template slot-scope="scope">{{(params.pagination.pageNum-1)*params.pagination.pageSize+ scope.$index+1}}</template>
					</el-table-column>
					<el-table-column prop="name" label="公告名称"></el-table-column>
					<el-table-column prop="status" label="状态">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#e6e6e6" @change="changeState(scope.row)"></el-switch>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="150">
						<template slot-scope="scope">
							<div class="operate">
								<p @click="loadDetail(1,scope.row)" v-if="scope.row.status==false" class="editText">编辑</p>
								<p plain @click="deleteNotice(scope.row)" v-if="scope.row.status==false" class="deleteText">删除</p>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>

		<!--弹窗-->
		<div class="pageDialog" slot="pageDialog">
			<el-dialog v-if="params.noticeMenu" title="公告设置" :visible.sync="params.noticeMenu" width="800px" center :close-on-click-modal="false">
				<noticeEdit :param="params" v-on:reload="loadMessage"></noticeEdit>
			</el-dialog>
		</div>
	</template-page>
</template>

<script>
	import templatePage from "../template/templatePage";
	import http from "../../utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	import noticeEdit from "./part/noticeEdit";
	export default {
		data() {
			return {
				params: {
					
					noticeMenu: false,
					noticeModify: false,
					message: "",
					infor: [],
					flagMessage: false,
					optType: 0,
					noticeDetail:{},

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
			noticeEdit
		},
		methods: {
			dialog(type, item) {
				let _self = this;
				_self.params.noticeMenu = true
				_self.params.optType = type

			},
			changeState(item) {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.UPDATE_NOTICESTATE;
				console.log(item.status)
				item.status = item.status ? 0 : 1;
				let msg = {
					noticeId: item.id,
					status: item.status
				};
				url = http.filterUrl(msg, url);
				http.publicRequest(
					"put",
					url,
					"",
					function(res) {
						//					let pagination = JSON.parse(JSON.stringify(_self.params.pagination));
						_self.loadMessage();
					},
					function(res) {
						_self.loadMessage();
					}
				);
			},

			deleteNotice(item) {
				let _self = this;
				let msg = item.state ? "该公告正在启用中，删除后将不会在积分商城展示，是否删除？" : "是否删除改公告？";
				this.$confirm(msg, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.DELETE_NOTICE;
						let msg = {
							noticeId: item.id
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
			loadDetail(opt, val) {
				let _self = this;
				_self.params.optType=opt
				let url = URL.PROJECT.SCORE + URL.PORTNAME.NOTICE_DETAIL;
				let msg = {
					noticeId: val.id

				};

				url = http.filterUrl(msg, url);
				http.publicRequest(
					"get",
					url,
					"",
					function(res) {
					
						let result = res.body.data;
						_self.params.noticeDetail = result;
						_self.params.noticeMenu = true
					},
					function(res) {}
				);
			},
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.NOTICE_LIST;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize
				};

				url = http.filterUrl(msg, url);
				http.publicRequest(
					"get",
					url,
					"",
					function(res) {
						_self.params.pagination.total = validation.total(res);
						let result = res.body.data;
						for(let key of result) {
							if(key.status == 0) {
								key.status = true
							} else {
								key.status = false
							}
						}
						_self.params.infor = result;
					},
					function(res) {}
				);
			}
		},
		created() {
			let _self = this;
			_self.loadMessage();
		}
	};
</script>

<style lang="less" scoped>
	.noticeSet {
		background-color: #FFFFFF;
		height: 50px;
	}
	
	.operate {
		&>p {
			display: inline;
			text-align: center;
			margin-left: 10px;
		}
	}
</style>