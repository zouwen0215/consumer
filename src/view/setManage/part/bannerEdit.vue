<template>
	<div class="bannnerEdit">

		<el-form ref="form" :model="params" :rules="rules" label-width="150px">

			<el-form-item label="banner图:" prop="imageUpload">
				<img-upload-list :imgUpload="params.imageUpload" style="margin-left: 10px;"></img-upload-list>
			</el-form-item>
				<p style="margin-left: -12%;margin-bottom: 20px;margin-top: -10px;font-size: 12px;color: #b3b3b3;">只支持.jpg格式</p>
			<span class="red" >*</span>
			<el-form-item label="跳转页面:" >
				<div class="urls">
					<el-radio label="1" v-model="params.type" style="margin-left: -45px;margin-bottom: 20px;"><span class="fonttwe">跳转活动：</span> 
					</el-radio>
					<el-select v-model="params.acurl" placeholder="请选择">
							<el-option v-for="(item,index) in params.activityList" :key="item.fkId":label="item.name" :value="item.fkId">
						</el-option>
					</el-select>
				</div>
				<div class="urls">
					<el-radio label="0" v-model="params.type"><span class="fonttwe">跳转公告：</span> 
					</el-radio>
					<el-select v-model="params.nourl" placeholder="请选择">
						<el-option v-for="(item,index) in params.noticeList":key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
			</el-form-item>
			<el-form-item label="状态:" prop="status">
				<el-switch style="margin-left: -215px;" class="switch" v-model="params.status" active-color="#13ce66" inactive-color="#e6e6e6" active-text="启用"></el-switch>
			</el-form-item>
              <p style="font-size: 12px;">（<span style="color: red">*</span>）为必填选项</p>
			<el-form-item>
				<div class="operate">
					<el-button type="primary" @click.native="onSubmite('form')">确定</el-button>
					<el-button @click="param.bannerMenu=false">取消</el-button>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import imgUploadList from "@/components/upLoadImage/imgUploadList";
	export default {
		data() {
			return {
				rules: {
					imageUpload: [{
							required: true,
							message: "请上传图片",
							trigger: "blur"
						},
						{
							validator: this.validateConfig,
							trigger: "change"
						}
					],
               
				},
				params: {
					type: "0",
					status: false,
					acurl: "",
					nourl: "",
					noticeList: [],
					activityList:[{label:'签到',
					            value:"http://test.junfengtech.com.cn/web/test/CPSA/sing.html"},
					          {
					          	label:'大转盘',
					          	value:"http://test.junfengtech.com.cn/web/test/CPSA/lottery.html"
					          }],
					imageUpload: {
						href: "/upload",
						length: 1,
						delete: true,
						id: "imgUpload",
						imgUrlArr: []
					}
				}
			};
		},
		props: {
			param: {
				default: function() {
					return {}
				}
			}
		},
		components: {
			imgUploadList,

		},
		methods: {

			onSubmite(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.addNotice();
					}
				});
			},
			Modify() {
				let _self = this;
				console.log("qqqqqqqqqqqqqqq", _self.param.bannerDetail)
				let data = _self.param.bannerDetail
				_self.params.imageUpload.imgUrlArr[0] = data.imageUrl;
				
				_self.params.status = false;
				_self.params.type=String(data.type);
				
					if(_self.params.type == 0) {
					_self.params.nourl = Number(data.fkId)
				} else {
					_self.params.acurl =Number(data.fkId)
				}	
				
			

			},

			validateConfig(rule, value, callback) {
				let _self = this;
				if(_self.params.imageUpload.imgUrlArr.length) {
					callback();
				} else {
					callback(new Error("请上传图片"));
				}
			},
			loadnoticeUrl() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.NOTICE_SELECT;
				let msg = {
					status: 0
				};
				url = http.filterUrl(msg, url);
				http.publicRequest(
					"get",
					url,
					"",
					function(res) {

						let result = res.body.data;
						_self.params.noticeList = result;

					},
					function(res) {}
				);
			},
			loadactivityUrl() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.ACTIVITY_SELECT;
				let msg = {
					status: 1
				};
				url = http.filterUrl(msg, url);
				http.publicRequest(
					"get",
					url,
					"",
					function(res) {

						let result = res.body.data;
						_self.params.activityList = result;

					},
					function(res) {}
				);
			},
			addNotice() {
				let _self = this;
				
				if(_self.params.type=='0'&&_self.params.nourl==''){
					common.messageFunc("请选择跳转路径", "error");
					return false
				}
				if(_self.params.type=='1'&&_self.params.acurl==''){
					common.messageFunc("请选择跳转路径", "error");
					return false
				}
				let linkurl="";
				if(_self.params.type==1){
					for(let key of _self.params.activityList){
					 key.fkId=_self.params.acurl	
					 linkurl= key.linkUrl
					}
				}
				var state = 0
                
				let msg = {};
				if(_self.params.status == true) {
					state =0
				} else {
					state =1
					
				}
				if(_self.params.imageUpload.imgUrlArr.length) {
					let params = JSON.parse(JSON.stringify(_self.params));
					let urls = URL.PROJECT.SCORE;
					let port =
						_self.param.optType == 0 ?
						URL.PORTNAME.BANNER_ADD :
						URL.PORTNAME.BANNER_EDIT;
					let url = urls + port;
					let body = {
						id:_self.param.bannerDetail.id,
						fkId:_self.params.type == 0 ? _self.params.nourl : _self.params.acurl,
						imageUrl: _self.params.imageUpload.imgUrlArr[0],
						status: state,
						linkUrl: linkurl,
						type: Number(_self.params.type)
					};

					url = http.filterUrl(msg, url)
					let type = _self.param.optType == 0 ? "POST" : "PUT";
					http.publicRequest(
						type,
						url,
						body,
						function(res) {
							_self.param.shareMenu = false
							_self.$message({
								type: "success",
								message: "操作成功!"
							});
							_self.$emit("reload");
							_self.param.bannerMenu = false
						},
						function(res) {
							_self.$emit("reload");
						}
					);
				} else {
					common.messageFunc("请先上传商品图片", "error");
				}
			}
		},
		created() {
			let _self = this;
			_self.loadnoticeUrl()
				_self.loadactivityUrl()
			console.log("2222222222222222222222", _self.param.optType)
			if(_self.param.optType == 1) {
				_self.Modify()
			}
		}
	}
</script>

<style lang="less" scoped>
	.bannnerEdit {
		.red{
			position: absolute;
			width: 10px;
			color: red;
			margin-left: -155px;
			margin-top: 10px;
		
		}
		.fonttwe{
			font-size: 12px;
		}
		.el-button:first-child{
			margin-right: 25%;
			margin-left: -10%;
		}
		.operate {
			margin: 0 auto;
			
			margin-top: 20px;
			display: flex;
		}
		.img {
			width: auto !important;
			height: 60px !important;
		}
		.switch {
			margin-left: -80px;
		}
		.urls {
			margin-left: -45px;
		}
	}
</style>