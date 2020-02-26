<template>
	<template-page :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">
		<div slot="funcRegion" class="button">
			<el-button style="margin-bottom: 10px;float: right;" type="success" @click.native="dialog(0,0)">新建banner</el-button>
		</div>
		<div slot="pageRegion">
			<template>
				<el-table :data="params.infor" border style="width: 100%">
					<el-table-column prop="id" label="序号" width="80">
						<template slot-scope="scope">{{(params.pagination.pageIndex-1)*params.pagination.pageSize+ scope.$index+1}}</template>
					</el-table-column>
					<el-table-column prop="imageUrl" label="图片">
						<template slot-scope="scope">
							<img class="img" :src="scope.row.imageUrl?scope.row.imageUrl:''" alt>
						</template>
					</el-table-column>
					<el-table-column prop="linkUrl" label="链接">
						<template slot-scope="scope">
							<div class="max-text lens90">{{scope.row.linkUrl}}</div>
						</template>
					</el-table-column>
					<el-table-column prop="status" label="状态" width="120px">
						<template slot-scope="scope">
							<el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#e6e6e6" @change="changeState(scope.row)"></el-switch>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="200">
						<template slot-scope="scope">
							<div class="operate">
								<p @click="loadDetail(1,scope.row)" v-if="scope.row.status==false" class="editText">编辑</p>
								<p plain @click="deleteLink(scope.row)" v-if="scope.row.status==false" class="deleteText">删除</p>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</template>
		</div>
		<div class="pageDialog" slot="pageDialog">
          <el-dialog v-if="params.bannerMenu" title="banner设置" :visible.sync="params.bannerMenu" width="500px" center :close-on-click-modal="false">
				<bannerEdit :param="params" v-on:reload="loadMessage"></bannerEdit>
			</el-dialog>
		</div>
	</template-page>
</template>

<script>
    import templatePage from "../template/templatePage";
	import http from "../../utils/http.js";
	import URL from "@/utils/url.js";
	import validation from "@/utils/validation.js";
	import common from "@/utils/common.js";
	import bannerEdit from "./part/bannerEdit";
	export default {
		data() {
			return {
				params: {
					infor: [],
				    bannerMenu:false,
                    optType:0,
                   bannerDetail:{},
					dataForm: {
						goodsList: []
					},
					pagination: {
						
						currentPage: 1,
						pageNum: "1",
						pageSize: "10",
						total: 1,
						pageIndex: 1,
						hasPage: true,
						hasMenu: false
					}
				}
			};
		},
		components: {
			bannerEdit,
			templatePage
		},
		methods: {
		    
			dialog(type, item) {
				let _self = this;
				_self.params.bannerMenu = true
				_self.params.optType = type

			},
			changeState(item) {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.BANNER_SRATE;
				item.status = item.status ? "0" : "1";
				let msg = {
					bannerId:item.id,
					status:item.status
				};
				url = http.filterUrl(msg, url);
				http.publicRequest(
					"put",
					url,
					'',
					function(res) {
					_self.loadMessage();
					},
					function(res) {
						_self.loadMessage();
					}
				);
			},
			deleteLink(item) {
				let _self = this;
				
				let msg =  "是否删除改Banner？";
				_self.$confirm(msg, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
						center: true
					})
					.then(() => {
						let url = URL.PROJECT.SCORE + URL.PORTNAME.BANNER_DELETE;
						let msg = {
							bannerId: item.id
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
							function(res) {
                                _self.loadMessage();
							}
						);
					})
					.catch(() => {});
			},
			handleSizeChange(index) {
				let _self = this;
				_self.loadMessage();
			},
			handleCurrentChange(index) {
				let _self = this;
				_self.loadMessage();
			},
			loadDetail(opt, val) {
				let _self = this;
				_self.params.optType=opt
				let url = URL.PROJECT.SCORE + URL.PORTNAME.BANNER_DETAIL;
				let msg = {
				
					bannerId:val.id

				};

				url = http.filterUrl(msg, url);
				http.publicRequest(
					"get",
					url,
					"",
					function(res) {
					
						let result = res.body.data; 
						console.log("bannerdetail",result)
						_self.params.bannerDetail = result;
						_self.params.bannerMenu = true
					},
					function(res) {}
				);
			},
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.BANNER_LIST;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize
				};
				url = http.filterUrl(msg, url);
				http.publicRequest("get",
					url,
					"",
					function(res) {
						_self.params.pagination.total = validation.total(res);
						_self.params.pagination.pageIndex = validation.pageIndex(res);
						let result = res.body.data;
						for(let key of result) {
							if(key.status == "0") {
								key.status = true;
							} else {
								key.status = false;
							}
						}
						_self.params.infor = result;
						console.log(_self.params.infor);
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
    .button{
    	background-color: #FFFFFF;
    	height:47px;
    }
	.img {
		width: auto;
		height: 60px;
	}
	.operate {
		&>p {
			display: inline;
			text-align: center;
			margin-left: 10px;
		}
	}
</style>