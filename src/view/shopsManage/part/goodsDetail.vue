<template>
	<div class="shopsDetail">
		<el-form ref="form" :model="params.infor" :rules="rules" label-width="150px">
			<div style="overflow-y: auto;height:370px; overflow-x: hidden;">
				<el-form-item label="商品名称:" prop="name">
					<el-input type="textarea" maxlength="100" placeholder="请输入商品名称" :autosize="{ minRows:1, maxRows: 3}" v-model="params.infor.name" :disabled="param.operate==0||$store.state.user.userInfor.currentChannel!=20" style="width: 300px;">{{params.infor.name}}</el-input>
				</el-form-item>
				<el-form-item label="商品图：" prop="imageUpload">
					<img-upload-list :imgUpload="params.imageUpload"></img-upload-list>
				</el-form-item>
				<p style="margin-left: 150px;margin-top: -5px;margin-bottom: 15px;color: #909090;font-size: 12px;">只支持.jpg格式</p>
				
				<el-form-item v-if="$store.state.user.userInfor.currentChannel==20" label="商品库存:" prop="stock">
					<el-input maxlength="8" v-model="params.infor.stock" :disabled="param.operate==0||$store.state.user.userInfor.currentChannel!=20" style="width: 300px;" placeholder="请输入商品库存">{{params.infor.goodsSrcDict}}</el-input>
				</el-form-item>
				<el-form-item v-else label="商品来源：" prop="goodsSrcDict">
					<el-input v-model="params.infor.goodsSrcDict" :disabled="param.operate==0||$store.state.user.userInfor.currentChannel!=20" style="width: 300px;"> {{params.infor.goodsSrcDict}}</el-input>
				</el-form-item>
				<el-form-item label="详细介绍：" prop="imageUploadDetail">
					<img-upload-list :imgUpload="params.imageUploadDetail">{{params.imageUploadDetail}}</img-upload-list>
				</el-form-item>
				<p style="margin-left: 150px;margin-top: -5px;margin-bottom: 15px;color: #909090;font-size: 12px;">只支持.jpg格式</p>
				
				<el-form-item label="商品积分值：" prop="score">
					<el-input v-model="params.infor.score" :disabled="param.operate==0" style="width: 300px;" placeholder="请输入商品积分值"></el-input>

				</el-form-item>
				<el-form-item label="限兑数量：" prop="limitNum">
					<el-input maxlength="8" v-model="params.infor.limitNum" :disabled="param.operate==0" style="width: 300px;" placeholder="请输入限兑数量"></el-input>
				</el-form-item>
			</div>
             	<p style="font-size: 12px;text-align: center;margin-right: 100px;">说明：单个活动中每个用户最大兑换数量，0表示不限量</p>
			<el-form-item style="margin-top:30px;">
				<el-button type="info" v-if="param.operate==0" style="margin-left: 90px;margin-top: 10px;" @click="param.detailMenu = false">返回</el-button>
				<el-button type="primary" @click="onSubmite('form')" v-if="param.operate==1||param.operate==2">确定</el-button>
				<el-button style="margin-left: 28%" @click="param.detailMenu = false" v-if="param.operate==1||param.operate==2">取消</el-button>
			</el-form-item>
		</el-form>

	</div>
</template>

<script>
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	import imgUploadList from "@/components/upLoadImage/imgUploadList";
	export default {
		data() {
			return {
				rules: {
					name: [{
						required: true,
						message: "请输入商品名称",
						trigger: "blur"
					}],
					score: [{
							required: true,
							message: "请输入商品名称",
							trigger: "blur"
						}, {
							pattern: /^[1-9]{1}[0-9]{0,4}$/,
							message: "商品积分值必须为大于0小于99999的整数"
						},

					],

					stock: [{
							pattern: /^[1-9]\d*$/,
							message: "商品库存为必须大于0的整数"
						},
						{
							required: true,
							message: "请输入商品库存",
							trigger: "blur"
						}
					],

					limitNum: [{
						required: true,
						validator: this.limitNum,
						trigger: "blur"

					}],
					imageUpload: [{
						required: true,
						validator: this.imageUpload,
						trigger: "blur"
					}],
					imageUploadDetail: [{
						required: true,
						validator: this.imageUploadDetail,
						trigger: "blur"
					}]
				},
				params: {
                    channelId:'',
					infor: {
						name:"",
						goodsFlag: 0,
						ptGoodsCategoryId: "",
						imgUrlList: [],
						limitNum: '',
						score: '',
						stock: "",
					},

					imageUpload: {
						href: "/upload",
						length: 4,
						delete: true,
						id: "imgUpload",
						imgUrlArr: []
					},

					imageUploadDetail: {
						href: "/upload",
						length: 1,
						delete: true,
						id: "imageUploadDetail",
						imgUrlArr: []
					},

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
			imgUploadList
		},

		methods: {
			onSubmite(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.Modify();
					}
				});
			},
			operate() {
				let _self = this;

			},
			limitNum: function(rule, value, callback) {
				let _self = this;

				if(_self.params.infor.limitNum == '') {
					callback();
				}
				if(_self.params.infor.limitNum != '' && !/^[0-9]\d*$/.test(_self.params.infor.limitNum)) {
					callback(new Error("限兑数量必须为数值型"));

				} else {
					callback();
				}
			},
			score: function(rule, value, callback) {
				let _self = this;

				if(_self.params.infor.score > 0 && _self.params.infor.score < 100000) {
					callback();
				} else {
					callback(new Error("商品积分值必须为大于0小于99999的数值型"));
				}
			},
			imageUpload: function(rule, value, callback) {
				let _self = this;
				console.log(_self.params.imageUpload.imgUrlArr.length);
				if(_self.params.imageUpload.imgUrlArr.length) {
					callback();
				} else {
					callback(new Error("请上传图片"));
				}
			},
			imageUploadDetail: function(rule, value, callback) {
				let _self = this;
				console.log(_self.params.imageUploadDetail.imgUrlArr.length);
				if(_self.params.imageUploadDetail.imgUrlArr.length) {
					callback();
				} else {
					callback(new Error("请上传图片"));
				}
			},
			Modify() {
				let _self = this;
				if(_self.params.infor.limitNum == '') {
					_self.params.infor.limitNum = 0
				}
				if(this.$store.state.user.userInfor.currentChannel == 20) {
					let imageUrl=[]
					let detailImage=[]
					for(let key of _self.params.imageUpload.imgUrlArr) {
						let roles={
							imageUrl:key
						}
						imageUrl.push(roles);
					}
					
					let url = URL.PROJECT.SCORE
					let methodType = "POST";
					if(_self.param.operate == 1) {
						console.log("edit")
						url += URL.PORTNAME.MODIFY_GOOD;
						methodType = "PUT";
					} else {
						url += URL.PORTNAME.CREATE_GOOD;
					}
					let body = {
						id: _self.param.goodDetail.id,
						name: _self.params.infor.name,
						status: 1,
						stock:Number(_self.params.infor.stock),
						score: Number(_self.params.infor.score),
						limitNum: Number(_self.params.infor.limitNum),
						imageUrls: imageUrl,
						detailImage: _self.params.imageUploadDetail.imgUrlArr[0],

					};
					http.publicRequest(
						methodType,
						url,
						body,
						function(res) {
							_self.param.detailMenu = false;
							_self.$emit("reload");
						},
						function(res) {}
					);
				} else {
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
				}

			},

			loadMessage() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.GOODS_DETAIL;
				console.log(_self.params.channelId)
				let msg = {
					id: _self.param.goodDetail.id,
				};
				url = http.filterUrl(msg, url);
				http.publicRequest("get", url, "", function(res) {
						let result = res.body.data;
						_self.params.infor = result;						
                        let imgUrlList = [];
						let imgUrlDetailList = [];
						for(let key of _self.params.infor.imageUrls) {
							imgUrlList.push(key.imageUrl);

						}
						_self.params.imageUpload.imgUrlArr = imgUrlList;
						_self.params.imageUploadDetail.imgUrlArr[0] = result.detailImage;
						console.log(_self.params.imageUploadDetail.imgUrlArr[0])
                        
					
					},
					function(res) {}
				);	
				
			
			},

		},
		created() {
			let _self = this;
			_self.params.channelId=this.$store.state.user.userInfor.currentChannel
			if(this.$store.state.user.userInfor.currentChannel==20) {
				if(_self.param.operate == 2) {

				} else if(_self.param.operate == 1) {
					_self.loadMessage();
					_self.params.imageUpload.delete = true;
					_self.params.imageUploadDetail.delete = true;
				} else {
					_self.loadMessage();
					_self.params.imageUpload.delete = false;
					_self.params.imageUploadDetail.delete = false;
				}

			} else {
				_self.loadMessage();
				_self.params.imageUpload.delete = false;
				_self.params.imageUploadDetail.delete = false;
			}
		}
	};
</script>

<style lang="less" scoped>
	.goodsDetail {
		background-color: #fff;
		padding: 10px 10px 30px;
	}
	
	.el-form {
		text-align: left;
		span {
			color: #606266;
		}
		//   .el-input,
		//   .el-select {
		//     width: 200px;
		//   }
		.title {
			font-size: 18px;
			text-align: left;
			margin-top: 20px;
			padding: 0 15px 20px;
		}
		.hr {
			border-bottom: 1px solid #e5e5e5;
			margin-bottom: 20px;
		}
		.dashed {
			border-bottom: 1px dashed #e5e5e5;
			margin: 0 80px 20px;
		}
		.el-radio {
			line-height: 40px;
		}
		.min {
			width: 80px;
		}
	}
	
	.xiangxi {
		text-align: left;
		// margin-left: 60px;
		.name {
			// display: flex;
		}
		.classList {
			.list {
				display: inline-block;
				margin: 10px;
				padding: 2px 10px;
				border: 1px solid #ccc;
				position: relative;
				border-radius: 10px;
				i {
					position: absolute;
					top: -5px;
					right: -5px;
				}
			}
		}
		.className {
			// width: 200px;
		}
		.classes {
			// display: flex;
			// & > div:nth-child(1) {
			//   margin-top: 10px;
			// }
			// & > div:nth-child(2) {
			//   & > div {
			//     display: flex;
			//     margin-top: 10px;
			//   }
			// }
		}
		.notice {
			text-align: left;
			margin-top: 20px;
		}
	}
</style>