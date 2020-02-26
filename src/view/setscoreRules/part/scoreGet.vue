<template>
	<div class="scoreGet">
		<div class="limitSet">
			<div class="title">
				<div class="num">1</div>
				<div class="text">上限设置</div>
				<div class="line"></div>
			</div>
			<div class="limitlist">
				<!--<template-page :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">-->

				<div slot="pageRegion">
					<template>
						<div class="addbutton" @click="getDetail(0,1)">
							<div class="icon">+</div>
							<p>添加规则</p>
						</div>
						<el-table :data="params.infor" border style="width: 100%">
							<el-table-column prop="id" label="序号" width="80px">
								<template slot-scope="scope">
									
										<p>{{scope.$index+1}}</p>
								
									
								</template>
							</el-table-column>
							<el-table-column prop="content" label="规则" style="text-align: left !important;">
                                  
							</el-table-column>
							<el-table-column prop="timeStr" label="时间"></el-table-column>

							<el-table-column label="操作" width="90">
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

				<!--</template-page>-->
			</div>

		</div>
		<div class="ruleset">
			<div class="title">
				<div class="num">2</div>
				<div class="text">规则列表</div>
				<div class="line"></div>
			</div>
			<div class="rulelist">
				<!--<template-page :param="params" v-on:handleSize="handleSizeChange" v-on:handleCurrent="handleCurrentChange">-->

				<div slot="pageRegion">
					<template>
						<div v-if="$store.state.user.userInfor.currentChannel==20" class="addbutton" @click="params.addclass=true">
							<div class="icon">+</div>
							<p>添加规则</p>
						</div>
						<div v-else class="addbutton" @click="getDetailrule(0,1)">
							<div class="icon">+</div>
							<p>添加规则</p>
						</div>
						<el-table :data="params.inforRule" border style="width: 100%">
							<el-table-column prop="id" label="序号" width="90">
								<template slot-scope="scope">
									<p>{{scope.$index+1}}</p>
								</template>
							</el-table-column>
							<el-table-column prop="content" label="规则" >
							   
							</el-table-column>
							<el-table-column prop="timeStr" label="时间"></el-table-column>

							<el-table-column fixed="right" label="操作" width="90">
								<template slot-scope="scope">
									<div style=" cursor: pointer;margin: 0 auto;display: flex">
										<p v-if="scope.row.status==0&&scope.row.type==6" @click="getNosmokerule(scope.row.id,0)" class="editText">编辑</p>
										<p v-if="scope.row.status==0&&scope.row.type==2" @click="getDetailrule(scope.row.id,0)" class="editText">编辑</p>
										<p v-if="scope.row.status==0" class="deleteText" @click="deleteid(scope.row.id)">删除</p>
									</div>
								</template>
							</el-table-column>
						</el-table>
					</template>
				</div>
				<!--弹窗-->
				<div class="pageDialog" slot="pageDialog">
					<el-dialog title="选择" :visible.sync="params.addclass" width="400px" back-backdrop='static' center :close-on-click-modal="false">
						<p>请选择需要定制规则的商品类型</p>
						<div style="margin-top: 50px;padding-bottom: 20px;" >
						<img class="imgbutton" ref="img"   :src="'./static/index/smoke.png'"   alt v-on:mouseover="mouseover()" v-on:mouseout="mouseout()" @click="getDetailrule(0,1)">
						<img class="imgbutton" ref="imgnext"  :src="'./static/index/nosmoke.png'"  alt v-on:mouseover="mouseovernext()" v-on:mouseout="mouseoutnext()" @click="getNosmokerule(0,1)">
						<!--<el-button style="margin-right: 30px;"      >卷烟商品</el-button>
						<el-button    >非烟商品</el-button>-->
						</div>
					</el-dialog>
					<el-dialog v-if="params.addnosmoke" :title="params.title" :visible.sync="params.addnosmoke" width="600px" back-backdrop='static' center :close-on-click-modal="false">
						
					</el-dialog>
					<el-dialog v-if="params.addlimitMenu" :title="params.title" :visible.sync="params.addlimitMenu" width="600px" back-backdrop='static' center :close-on-click-modal="false">
						<limitSetup :param="params" v-on:reload="loadMessage"></limitSetup>
					</el-dialog>
					<el-dialog v-if="params.addnosmokeMenu" :title="params.title" :visible.sync="params.addnosmokeMenu" width="550px" back-backdrop='static' center :close-on-click-modal="false">
						<nosmokeRules :param="params"  v-on:reload="loadMessageRule"></nosmokeRules>
						
					</el-dialog>
					<el-dialog v-if="params.addruleMenu" :title="params.title" :visible.sync="params.addruleMenu" width="600px" back-backdrop='static' center :close-on-click-modal="false">
						<selectType :param="params"  v-on:reload="loadMessageRule"></selectType>
					
					</el-dialog>
					<el-dialog title="删除规则" :visible.sync="params.deleteMenu" width="25%" back-backdrop='static' center>
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
	import selectType from "./components/selectType";
	import limitSetup from "./components/limitSetup";
	import nosmokeRules from "./components/nosmokeRules";
	
	export default {
		data() {
			return {

				params: {
					title: "",
					addclass:false,
					addnosmoke:'',
					limitDetail: {},
					ruleDetail: {},
					infor: [],
					addGetoruse: 2,
					inforRule: [{}],
					addnosmokeMenu:false,
					addlimitMenu: false,
					addruleMenu: false,
					deleteMenu: false,
					getDetailID: 0,
					optType: "",
					deleteID: 0,
					pagination: {
						currentPage: 1,
						pageNum: '1',
						pageSize: '1000',
						total: 1,
						hasPage: true,
						hasMenu: false,
					},
					pagination1: {
						currentPage: 1,
						pageNum: '1',
						pageSize: '1000',
						total: 1,
						hasPage: true,
						hasMenu: false,
					},

				}
			};
		},
		components: {
			templatePage,
			selectType,
			limitSetup,
			nosmokeRules
		},
		methods: {
			deleteid(val) {
				let _self = this;
				_self.params.deleteMenu = true;
				_self.params.deleteID = val;
			},
			
            mouseover() {
				this.$refs.img.src =this.$refs.img.src.split(".png")[0] + "_hover.png";
			},
			mouseout() {
				this.$refs.img.src =this.$refs.img.src.split("_hover")[0] + ".png";
			},
			 mouseovernext() {
				this.$refs.imgnext.src =this.$refs.imgnext.src.split(".png")[0] + "_hover.png";
			},
			mouseoutnext() {
				this.$refs.imgnext.src =this.$refs.imgnext.src.split("_hover")[0] + ".png";
			},
			getDetail(val, num) {
				let _self = this;
				_self.params.getDetailID = val
				
				if(num == 0) {

					let url = URL.PROJECT.SCORE + URL.PORTNAME.RULE_DETAIL;
					let msg = {
						id: _self.params.getDetailID,
					};
					url = http.filterUrl(msg, url);
					http.publicRequest("get", url, "", function(res) {
							let result = res.body.data;

							_self.params.limitDetail = result
							let arr = {}
							arr = result;
							_self.params.limitDetail.configJson = JSON.parse(arr.configJson.replace(/\\\"/g, '\"'));
							_self.params.optType = "edit"
							_self.params.title = "编辑规则"
							_self.params.addlimitMenu = true

						},
						function(res) {}
					);
				} else {

					_self.params.optType = "creat"
					_self.params.title = "添加规则"
					_self.params.addlimitMenu = true

				}

			},
			getDetailrule(val, num) {
				let _self = this;
				_self.params.getDetailID = val
				if(num == 0) {
					let url = URL.PROJECT.SCORE + URL.PORTNAME.RULE_DETAIL;
					let msg = {
						id: _self.params.getDetailID,
					};
					url = http.filterUrl(msg, url);
					http.publicRequest("get", url, "", function(res) {
							let result = res.body.data;
							_self.params.ruleDetail = result
							let arr = {}
							arr = result;
							_self.params.ruleDetail.configJson = JSON.parse(arr.configJson.replace(/\\\"/g, '\"'));
							_self.params.optType = "edit"
							_self.params.title = "编辑规则"
							_self.params.addruleMenu = true
						},
						function(res) {}
					);
				} else {
					_self.params.optType = "creat"
					_self.params.title = "添加规则"
					_self.params.addruleMenu = true
				}
			},
            getNosmokerule(val,num){
            	let _self = this;
            	_self.params.getDetailID = val
				if(num == 0) {
					let url = URL.PROJECT.SCORE + URL.PORTNAME.RULE_DETAIL;
					let msg = {
						id: _self.params.getDetailID,
					};
					url = http.filterUrl(msg, url);
					http.publicRequest("get", url, "", function(res) {
							let result = res.body.data;
							_self.params.ruleDetail = result
							let arr = {}
							arr = result;
							_self.params.ruleDetail.configJson = JSON.parse(arr.configJson.replace(/\\\"/g, '\"'));
							_self.params.optType = "edit"
							_self.params.title = "编辑规则"
							_self.params.addnosmokeMenu = true
						},
						function(res) {}
					);
				} else {
					_self.params.optType = "creat"
					_self.params.title = "添加规则"
					_self.params.addnosmokeMenu = true
				}
            	
            },
			Modify() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.MODIFY_GOOD;
				let body = {
					id: _self.param.goodDetail.id,
					name: _self.param.goodDetail.name,
					score: _self.params.infor.score,
					limitNum: _self.params.infor.limitNum,
					goodType: 0,
				};
				http.publicRequest("PUT", url, body, function(res) {
						_self.param.detailMenu = false;
						_self.$emit("reload");

					},
					function(res) {}
				);
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
					_self.loadMessageRule();
					_self.loadMessage()
				}, function(res) {})
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

			loadMessage() {
				let _self = this;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SCORERULE_LIST;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					type: 1,
				};
				url = http.filterUrl(msg, url);
				http.publicRequest("get", url, "", function(res) {
						_self.params.pagination.total = validation.total(res)
						let result = res.body.data;
					
					
						for(let key of result) {
							key.content = key.content.split(",")
							console.log(key.content)
							for(let i=0;i<key.content.length-1;i++){

								key.content[i]='('+(i+1)+')'+key.content[i]+' '+' ';
							
							}
								key.content[key.content.length-1]=","+key.content[key.content.length-1];
						
						}
						_self.params.infor = result;
						console.log(result)
					},
					function(res) {}
				);
			},
			loadMessageRule() {
				let _self = this;
				let pagination = _self.params.pagination1;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SCORERULE_LIST;
				let msg = {
					id: 0,
					pageNum: pagination.pageNum,
					pageSize: pagination.pageSize,
					type: 2,
				};
				url = http.filterUrl(msg, url);
				http.publicRequest("get", url, "", function(res) {
						_self.params.pagination1.total = validation.total(res)
						let result = res.body.data;
						_self.params.inforRule = result;

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
			let _self = this;
			_self.loadMessage();
			_self.loadMessageRule();
		}
	};
</script>

<style lang="less" scoped>
	.scoreGet {
		padding-bottom: 40px;
		.imgbutton{
			width: 120px;
			
			margin-right: 20px;
			margin-left: 20px;
		}
		.deleteText {
			margin-left: 20px;
		}
		
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
			.button {
				margin-top: 80px;
			}
		}
	}
</style>