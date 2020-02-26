<template>
	<div class="noticeEdit" style="height: 80%;">
		
		<div class="model">
			<p class="title">公告模板</p>
			<div class="modelimg" v-bind:style="{background:'url('+params.imageUpload.imgUrlArr[0]+')','background-repeat':'no-repeat'}">
				<div class="content">
					<img class="imgcontent" src="../../../../static/index/contentdiv.png" />
				
					<p class="text" >{{params.title}}</p>
					<p class="context">{{params.content}}</p>
				</div>

			</div>

		</div>
		<div class="addNotice">
			<el-form ref="params" :model="params" :rules="rules" label-width="150px">
				<el-form-item label="公告名称:" prop="name">
					<el-input v-model="params.name"></el-input>
				</el-form-item>
				<el-form-item label="标题:" prop="title">
					<el-input v-model="params.title"></el-input>
				</el-form-item>
				<el-form-item label="背景图:" prop="imageUpload">
					<img-upload-list :imgUpload="params.imageUpload"></img-upload-list>

				</el-form-item>
				<p style="margin-left: 150px;margin-top: 5px;margin-bottom: 10px;color: #909090;font-size: 12px;">只支持.jpg格式</p>
				<el-form-item label="内容:" prop="content">
					<el-input v-model="params.content" type="textarea" :autosize="{ minRows: 4, maxRows: 4}"></el-input>
				</el-form-item>
				<el-form-item label="状态:" prop="status">
					<el-switch v-model="params.status" active-color="#13ce66" inactive-color="#e6e6e6" active-text="启用"></el-switch>
				</el-form-item>
				<p style="font-size: 12px;margin-top: 35px;margin-left: 105px;">（<span style="color: red">*</span>）为必填选项</p>

				<el-form-item fixed class="confirm" style="padding-bottom: -20px;">
					
					<el-button type="primary" @click.native="onSubmite('params')">确定</el-button>
					<el-button @click="param.noticeMenu=false" style="margin:30px 80px;">取消</el-button>
				</el-form-item>
			</el-form>

		</div>
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
					name: [{
						required: true,
						message: "请输入名称",
						trigger: "blur"
					}],
					title: [{
						required: true,
						message: "请输入标题",
						trigger: "blur"
					}],
					content: [{
						required: true,
						message: "请输入内容",
						trigger: "blur"
					}],

					url: [{
						validator: this.bannerurl,
						trigger: "blur"
					}],
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
					name:'',
					title: "",
					content: "",
					dialogFormVisible: false,
					dialogVisible: false,
					status: false,
					url: "",
					dumpType: "",
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
				console.log("qqqqqqqqqqqqqqq", _self.param.noticeDetail)
				let data = _self.param.noticeDetail
				_self.params.name = data.name;
				_self.params.title = data.title;
				_self.params.imageUpload.imgUrlArr[0] = data.imageUrl;
				_self.params.content = data.content;
				_self.params.status = false

			},
			getDate() {
				let _self = this;
				var date = new Date();
				var seperator = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if(month <= 9) {
					_self.params.data_list[0] = year + seperator + "0" + month + seperator + strDate;
					_self.params.data_list[1] = year + seperator + "0" + month + seperator + strDate;
				} else {
					_self.params.data_list[0] = year + seperator + month + seperator + strDate;
					_self.params.data_list[1] = year + seperator + month + seperator + strDate;
				}

			},

			bannerurl(rule, value, callback) {
				let _self = this;
				if(_self.params.url) {
					var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
					if(!reg.test(_self.params.url)) {
						callback(
							new Error(
								"请输入正确的地址,例如：https://baike.baidu.com/item/马云/6252"
							)
						);
					} else {
						callback();
					}
				} else {
					callback();
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

			goback() {
				window.history.go(-1);
			},
			addNotice() {
				let _self = this;
				
				var state = 0
				if(_self.params.status == true) {
					state = 0
				} else {
					state = 1
				}
				if(_self.params.imageUpload.imgUrlArr.length) {
					let params = JSON.parse(JSON.stringify(_self.params));
					let urls = URL.PROJECT.SCORE;
					let port =
						_self.param.optType == 0 ?
						URL.PORTNAME.NOTICE_ADD :
						URL.PORTNAME.NOTICE_UPDATE;
					let url = urls + port;
					let body = {
						id: _self.param.noticeDetail.id,
						name: _self.params.name,
						title: _self.params.title,
						content: _self.params.content,
						type: 1,
						imageUrl: params.imageUpload.imgUrlArr[0],
						status: state,

					};
					console.log(body)
					let type = _self.param.optType == 0 ? "POST" : "PUT";
					http.publicRequest(
						type,
						url,
						body,
						function(res) {
							_self.param.noticeMenu = false
							_self.$emit("reload");
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
			if(_self.param.optType == 1) {
				_self.Modify()
			} else {
				_self.getDate()
			}
		}
	}
</script>

<style lang="less" scoped>
	.noticeEdit {
		
		display: flex;
		
		.model {
			flex: 1;
			.title {
				text-align: center;
				margin-left: 60px;
			}
			.modelimg {
				background-repeat: no-repeat !important;
				background-size: 100% 100% !important;
				min-width: 100px;
				max-width: 260px;
				min-height: 390px;
				max-height: 500px;
				margin-top: 10px;
				margin-left: 50px;
				border: 1px solid #909399;
				.content {
					max-width: 155px;
					margin:0 auto;
					.text{
						max-width: 80px;
						margin-left:25%;
					  margin-top: -160px;
					  
						 color: #FFD84C;
					}
					.context{
						padding-left: 5px;
						padding-right: 5px;
						margin-left: 1%;
						font-size: 12px;
						word-wrap:break-word
					}
					.imgcontent {
						margin-top: 100px;
						width: 160px!important;
						height: 200px !important;
					
					}
					.imgtitle{
						position: absolute;
						margin-left: -17%;
						margin-top: 13%;
						width: 140px;
						
					}
					
				}
			}
		}
		.addNotice {
			flex: 1.5;
			background-color: #fff;
			padding: 10px 10px 0px;
			text-align: left;
			font-size: 14px;
			.urls {
				display: flex;
				line-height: 32px;
			}
			&>div {
				display: flex;
				margin: 20px 20px;
				.title {
					line-height: 130px;
					font-size: 14px;
					margin-left: 200px;
				}
				.imgs {
					margin-top: 10px;
				}
				.state {
					margin-left: 80px;
				}
			}
		}
		.img {
			width: auto !important;
			height: 60px !important;
		}
		.confirm {
			margin-left: -380px;
			margin-top: 20px;
			
			.el-button:first-child {
				margin-left: 150px;
				margin-right: 100px;
			}
		}
	}
</style>