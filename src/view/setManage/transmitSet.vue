<template>
	<template-page :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">

		<div class="transmitSet" slot="buttonRegion">

			<el-button  type="success" @click="dialog(0,0)" style="float: right;">新建转发图</el-button>
		</div>

		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					<el-table-column prop="id" label="序号" width="100">
						<template slot-scope="scope">{{(params.pagination.pageNum-1)*params.pagination.pageSize+ scope.$index+1}}</template>
					</el-table-column>
					<el-table-column prop="imageUrl" label="图片">
						<template slot-scope="scope">
							<img class="img" :src="scope.row.imageUrl?scope.row.imageUrl:''" alt>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#e6e6e6" @change="changeState(scope.row)"></el-switch>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="150">
						<template slot-scope="scope">
							<div class="operate">
								<p @click="loadDetail(1,scope.row)" v-if="scope.row.status==0" class="editText">编辑</p>
								<p plain @click="deleteNotice(scope.row)" v-if="scope.row.status==0" class="deleteText">删除</p>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>

		<!--弹窗-->
		<div class="pageDialog" slot="pageDialog">
			<el-dialog v-if="params.shareMenu" title="转发图设置" :visible.sync="params.shareMenu" width="450px" center :close-on-click-modal="false">
				<transmitEdit :param="params" v-on:reload="loadMessage"></transmitEdit>
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
	import transmitEdit from "./part/transmitEdit";
	export default {
		data() {
			return {
				params: {

					shareMenu: false,
					noticeModify: false,
					message: "",
					infor: [],
					flagMessage: false,
					optType: 0,
					noticeDetail: {},
                    shareDetail:{},
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
			transmitEdit
		},
		methods: {
			dialog(type, item) {
				let _self = this;
				_self.params.shareMenu = true
				_self.params.optType = type

			},
			Modify(){
				let _self = this;
				console.log("qqqqqqqqqqqqqqq",_self.param.shareDetail)
				let data=_self.param.shareDetail
				_self.params.imageUpload.imgUrlArr[0]=data.imageUrl;
				_self.params.status=false
				
			},
			changeState(item) {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SHARE_MODIFYSTATE;
				console.log(item.status)
				item.status = item.status ? 1 : 0;
				let msg = {
					id: item.id,
					type: 0
				};

				url = http.filterUrl(msg, url);
				http.publicRequest(
					"PUT",
					url,
					"",
					function(res) {

						_self.loadMessage();
					},
					function(res) {
						_self.loadMessage();
					}
				);
			},
			 deleteNotice(item) {
				let _self = this;
				let msg = "是否删除该分享图？";
				this.$confirm(msg, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.SHARE_DELETE;
						let msg = {
							id: item.id,
							type: 0
						};
						url = http.filterUrl(msg, url);
						let params = http.params;
						http.publicRequest(
							"DELETE",
							url,
							"",
							function(res) {
								common.messageFunc("操作成功", "success");
								_self.loadMessage();
							},
							function(res) {
								_self.loadMessage();
							}
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
				_self.params.optType = opt
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SHARE_DETAIL;
				let msg = {
					type: 0,
					id: val.id

				};

				url = http.filterUrl(msg, url);
				http.publicRequest(
					"get",
					url,
					"",
					function(res) {

						let result = res.body.data;
						_self.params.shareDetail = result;
						_self.params.shareMenu = true
					},
					function(res) {}
				);
			},
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SHARE_LIST;
				let msg = {
					id: 0,
					type: 0,
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
								key.status = false
							} else {
								key.status = true
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
	.transmitSet {
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
	.img {
		width: auto;
		height: 60px;
	}
</style>