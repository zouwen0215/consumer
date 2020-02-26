<template>
	<div class="shopSet">
		<div class="limitSet">

			<div class="limitlist">
				<!--<template-page :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">-->

					<div slot="pageRegion">
						<template>
							<div class="addbutton" @click="getDetail(0,1)">
								<div class="icon">+</div>
								<p>添加规则</p>
							</div>
							<el-table :data="params.infor" border style="width: 100%">
								<el-table-column prop="id" label="序号" width="90">
                     <template slot-scope="scope">
									    <p>{{scope.$index+1}}</p>
									</template>
								</el-table-column>
								<el-table-column prop="content" label="规则">
                                   <!--<template slot-scope="scope">
									 	<div style="text-align: left;">
									 		  <p  v-for="key in scope.row.content">{{key}}</p>
									 	</div>
									  
									</template>-->
								</el-table-column>
								<el-table-column prop="timeStr" label="时间"></el-table-column>

								<el-table-column fixed="right" label="操作" width="90">
									<template slot-scope="scope">
										<div style=" cursor: pointer;margin: 0 auto;display: flex">
											<p v-if="scope.row.status==0" @click="getDetail(scope.row.id,0)" class="editText">编辑</p>
											<p v-if="scope.row.status==0" class="deleteText" @click="deleteid(scope.row.id)">删除</p>
										</div>
									</template>
								</el-table-column>
							</el-table>
						</template>
					</div>
					<!--弹窗-->
					<div class="pageDialog" slot="pageDialog">
						<el-dialog :title="params.title" v-if="params.addruleMenu"  :visible.sync="params.addruleMenu" width="800px" back-backdrop='static' center :close-on-click-modal="false">
							<shopruleSet :param="params" v-on:reload="loadMessage"></shopruleSet>
						</el-dialog>
						<el-dialog  title="删除规则" :visible.sync="params.deleteMenu" width="25%" back-backdrop='static' center>
							<p>是否要删除该规则？</p>
							<div class="button">
								<el-button type="primary" @click="deleteRules">确定</el-button>
								<el-button @click="params.deleteMenu=false">取消</el-button>
							</div>
						</el-dialog>

					</div>
				<!--</template-page>-->
			</div>

		</div>

	</div>
</template>

<script>
	import templatePage from '../../template/templatePage'
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	import shopruleSet from "./components/shopruleSet";

	export default {
		data() {
			return {

				params: {
					infor: [],
					limitDetail: {},
					addlimitMenu: false,
					addruleMenu: false,
					deleteMenu: false,
					deleteID: 0,
					getDetailID: 0,
					optType:"",
					title:"",
					pagination: {
						currentPage: 1,
						pageNum: '1',
						pageSize: '10',
						total: 1,
						hasPage: true,
						hasMenu: false,
					},

				}
			};
		},
		components: {
			templatePage,
			shopruleSet
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
			deleteid(val) {
				let _self = this;
				_self.params.deleteMenu = true;
				_self.params.deleteID = val;
			},
			getDetail(val, num) {
				let _self = this;
				_self.params.getDetailID = val;
				if(num==0){
				let url = URL.PROJECT.SCORE + URL.PORTNAME.RULE_DETAIL;
				let msg = {
					id: _self.params.getDetailID,
				};
				url = http.filterUrl(msg, url);
				http.publicRequest("get", url, "", function(res) {
						let result = res.body.data;
//						debugger
						_self.params.limitDetail = result
						let arr = {}
						arr = result;
						_self.params.limitDetail.configJson = JSON.parse(arr.configJson.replace(/\\\"/g, '\"'));
						console.log(_self.params.limitDetail)
						
						_self.params.optType = "edit";
						 _self.params.title="编辑规则"
                        _self.params.addruleMenu = true;
					
						
					},
					function(res) {}
				);}else{
				
				_self.params.optType = "creat"
				 _self.params.title="添加规则"
				_self.params.addruleMenu = true
				
			}
			},
			deleteRules() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.RULE_DELETE;
				let msg = {
					id: _self.params.deleteID,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('DELETE', url, '', function(res) {
					_self.params.deleteMenu = false;
					_self.loadMessage()
				}, function(res) {})
			},
			loadMessage() {
				let _self = this;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SCORERULE_LIST;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					type: 5,
				};
				url = http.filterUrl(msg, url);
				http.publicRequest("get", url, "", function(res) {
						_self.params.pagination.total = validation.total(res)
						let result = res.body.data;
						_self.params.infor = result;
//						for(let key of result) {
//							key.content = key.content.split(";")
//							console.log(key.content)
//							for(let i=0;i<key.content.length-1;i++){
//
//								key.content[i]='('+(i+1)+')'+key.content[i]+' ';
//							
//							}
//								//key.content[key.content.length-1]=","+key.content[key.content.length-1];
//						
//							
//                        
//						}
					},
					function(res) {}
				);
			},
			loadSave() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SAVE_MEMBERSCORE;
				let body = {
					type: 1,
				};
				http.publicRequest("POST", url, body, function(res) {
						let result = res.body.data;
						_self.params.infor = result;
						_self.params.configJson.year = _self.params.infor.configJson.year;
						_self.params.configJson.select = _self.params.infor.configJson.select;
					},
					function(res) {}
				);
			},
		},
		created() {
			this.loadMessage();
		}
	};
</script>

<style lang="less" scoped>
	.shopSet {
		.button{
			margin-top: 50px;
		}
		.deleteText {
			margin-left: 20px;
		}
		height: 800px;
		.addbutton {
			float: right;
			color: #FFFFFF;
			font-weight: bolder;
			display: flex;
			margin-bottom: 10px;
			cursor: pointer;
			p {
				margin-right: 5px;
				color: #666666;
			}
			.icon {
				margin-right: 10px;
				width: 20px;
				height: 20px;
				background-color: #02af81;
				border-radius: 50%;
			}
		}
		.limitSet {
			.limitlist {
				margin-top: 30px;
				padding-left: 37px;
				padding-right: 37px;
			}
			.title {
				display: flex;
				margin-left: 15px;
				margin-top: 10px;
				.num {
					width: 24px;
					height: 24px;
					background-color: #02af81;
					border-radius: 3px;
					color: #FFFFFF;
					font-family: STLiti;
					font-size: 20px;
					padding-top: 4px;
					padding-right: 3px;
				}
				.text {
					font-size: 16px;
					color: #666666;
					margin-left: 10px;
				}
				.line {
					height: 10px;
					border-bottom: 1px solid #f1f1f1;
					margin-left: 20px;
					margin-top: 2px;
					width: 88%;
				}
			}
		}
		.ruleset {
			.rulelist {
				margin-top: 30px;
				padding-left: 37px;
				padding-right: 37px;
			}
			.title {
				display: flex;
				margin-left: 15px;
				margin-top: 40px;
				.num {
					width: 24px;
					height: 24px;
					background-color: #02af81;
					border-radius: 3px;
					color: #FFFFFF;
					font-family: STLiti;
					font-size: 20px;
					padding-top: 4px;
					padding-right: 3px;
				}
				.text {
					font-size: 16px;
					color: #666666;
					margin-left: 10px;
				}
				.line {
					height: 10px;
					border-bottom: 1px solid #f1f1f1;
					margin-left: 20px;
					margin-top: 2px;
					width: 88%;
				}
			}
		}
	}
</style>