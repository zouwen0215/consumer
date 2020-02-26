<template>
	<div class="shareEdit">
		<div class="addshare">
			<el-form ref="form" :model="params" :rules="rules" label-width="150px">
			
				<el-form-item label="分享图:" prop="imageUpload">
					<img-upload-list :imgUpload="params.imageUpload"></img-upload-list>
				</el-form-item>	
				<p style="margin-left:2%;margin-bottom: 20px;margin-top: -10px;font-size: 12px;color: #b3b3b3;">只支持.jpg格式</p>
				
				<el-form-item label="状态:" prop="status">
					<el-switch class="switch" v-model="params.status" active-color="#13ce66" inactive-color="#e6e6e6" active-text="启用"></el-switch>
				</el-form-item>
				 <p style="font-size: 12px;">（<span style="color: red">*</span>）为必填选项</p>

				<el-form-item >
					<div class="operate">
					<el-button type="primary" @click.native="onSubmite('form')">确定</el-button>
					<el-button @click="param.shareMenu=false" >取消</el-button>
					</div>
					
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
	
				    status:false,
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
			Modify(){
				let _self = this;
				console.log("qqqqqqqqqqqqqqq",_self.param.shareDetail)
				let data=_self.param.shareDetail
				_self.params.imageUpload.imgUrlArr[0]=data.imageUrl;
				_self.params.status=false
				
			},
			
	
			validateConfig(rule, value, callback) {
				let _self = this;
				if(_self.params.imageUpload.imgUrlArr.length) {
					callback();
				} else {
					callback(new Error("请上传图片"));
				}
			},

			addNotice() {
				let _self = this;
				var state=0
				let msg={};
				if(_self.params.status==false){
					 state=0
				}else{
					 state=1
				}
				if(_self.params.imageUpload.imgUrlArr.length) {
					let params = JSON.parse(JSON.stringify(_self.params));
					let urls = URL.PROJECT.SCORE;
					let port =
						_self.param.optType== 0 ?
						URL.PORTNAME.SHARE_SAVE :
						URL.PORTNAME.SHARE_MODIFY;
					let url = urls + port;
					if(_self.param.optType== 0){
						 msg={
						type:1,
					     }
					}else{
						 msg={
						type:1,
						id:_self.param.shareDetail.id
						
						}
					};
					
					
					let body = {
						imageUrl: params.imageUpload.imgUrlArr[0],
						status: state,
			
					};
					
					url = http.filterUrl(msg, url)
					let type = _self.param.optType == 0 ? "POST" : "PUT";
					http.publicRequest(
						type,
						url,
						body,
						function(res) {
							_self.param.shareMenu=false
							_self.$message({
									type: "success",
									message: "操作成功!"
								});
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
            if(_self.param.optType==1){
            	_self.Modify()
            }
		}
	}
</script>

<style lang="less" scoped>
	.shareEdit {
	.el-button:first-child{
			margin-right: 25%;
			margin-left: -12%;
		}
	     .operate{
	     	margin-left: -10px;
	     	margin-top: 40px;
	     	display: flex;
	     }
		.img {
			width: auto !important;
			height: 60px !important;
		}
		.switch{
			margin-left: -65%;
		}
		
	}
</style>