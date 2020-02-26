<template>
	<el-form :model="params" :rules="rules" ref="params" class="demo-ruleForm">
		<div class="sign">

			<div class="activeBox">
				<div style="overflow-y: auto;height:370px; overflow-x: hidden;">

					<el-form-item prop="name">
						<div>
							<span style="color: red;">*</span><span class="fonttwe">活动名称：</span>
							<el-input v-model="params.name" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input>
						</div>
					</el-form-item>
					<el-form-item>
						<div>
							<span style="color: red;">*</span><span class="fonttwe">参与条件：</span>
							<el-radio v-model="params.condition" label="0" style="margin-top: -25px;" :disabled="params.readOnly"><span class="fonttwe">无条件</span></el-radio>
							<el-radio v-model="params.condition" label="1" style="margin-top: 15px;" :disabled="params.readOnly"><span class="fonttwe">在智能终端门店购物一次</span></el-radio>
						</div>
					</el-form-item>
					<el-form-item>
						<div>
							<span style="color: red;">*</span><span class="fonttwe">活动时间：</span>
							<el-date-picker v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :editable="false" :picker-options="params.pickerOptions" :disabled="params.readOnly"></el-date-picker>
						</div>
					</el-form-item>
					<el-form-item prop="remark">
						<div>
							<span style="color: red;">*</span><span class="fonttwe">跳转路径：</span>
							<el-input style="margin-left: -1px;width:63%;" class="described" v-model="params.remark" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input>
						</div>
					</el-form-item>
					<el-form-item prop="dayOnePoints">
						<div>
							<span style="color: red;">*</span><span class="fonttwe">活动内容： 连续签到第一天</span>
							<el-input v-model.number="params.dayOnePoints" class="describe" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input><span class="fonttwe">积分</span>
						</div>
					</el-form-item>
					<el-form-item style="margin-left: 73px;margin-top: -10px;" prop="dayTwoPoints">
						<div>
							<span class="fonttwe">连续签到第二天</span>
							<el-input v-model.number="params.dayTwoPoints" class="describe" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input><span class="fonttwe">积分</span>
						</div>
					</el-form-item>
					<el-form-item style="margin-left: 73px;margin-top: -10px;" prop="dayThreePoints">
						<div>
							<span class="fonttwe">连续签到第三天</span>
							<el-input v-model.number="params.dayThreePoints" class="describe" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input><span class="fonttwe">积分</span>
						</div>
					</el-form-item>
					<el-form-item style="margin-left: 73px;margin-top: -10px;" prop="dayFourPoints">
						<div>
							<span class="fonttwe">连续签到第四天</span>
							<el-input v-model.number="params.dayFourPoints" class="describe" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input><span class="fonttwe">积分</span>
						</div>
					</el-form-item>
					<el-form-item style="margin-left: 73px;margin-top: -10px;" prop="dayFivePoints">
						<div>
							<span class="fonttwe">连续签到第五天</span>
							<el-input v-model.number="params.dayFivePoints" class="describe" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input><span class="fonttwe">积分</span>
						</div>
					</el-form-item>
					<el-form-item style="margin-left: 73px;margin-top: -10px;" prop="daySixPoints">
						<div>
							<span class="fonttwe">连续签到第六天</span>
							<el-input v-model.number="params.daySixPoints" class="describe" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input><span class="fonttwe">积分</span>
						</div>
					</el-form-item>
					<el-form-item style="margin-left: 73px;margin-top: -10px;" prop="daySevenPoints">
						<div>
							<span class="fonttwe">连续签到第七天</span>
							<el-input v-model.number="params.daySevenPoints" class="describe" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input><span class="fonttwe">积分</span>
						</div>
					</el-form-item>
					<el-form-item prop="imageUpload">
						<div>
							<span style="color: red;">*</span><span class="fonttwe">图片：</span>

							<img-upload-list :imgUpload="params.imageUpload" style="margin-left:80px;margin-top: -20px;"></img-upload-list>

						</div>

					</el-form-item>
					<p style="margin-left: 15%;margin-bottom: 20px;margin-top: -10px;font-size: 12px;color: #b3b3b3;">只支持.jpg格式</p>
				</div>
				<el-form-item class="button">
					<el-button type="info" v-if="param.operate==2" style="margin-left: 38%;" @click="param.activities = false">返回</el-button>
					<el-button v-if="param.operate!=2" type="primary" @click="onSubmite('params')">确定</el-button>
					<el-button v-if="param.operate!=2" @click="param.activities=false">取消</el-button>
				</el-form-item>
			</div>
		</div>
	</el-form>
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
							message: "请输入活动名称",
							trigger: "blur"
						},

					],
					remark: [{
						required: true,
						message: "请输入活动内容",
						trigger: "blur"
					}, {
						validator: this.bannerurl,
						trigger: "blur"
					}],

					dayOnePoints: [{
							required: true,
							message: "请输入积分值",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]{1}[0-9]{0,4}$/,
							message: "积分值必须为大于0小于99999的整数"
						}
					],
					dayTwoPoints: [{
							required: true,
							message: "请输入积分值",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]{1}[0-9]{0,4}$/,
							message: "积分值必须为大于0小于99999的整数"
						}
					],
					dayThreePoints: [{
							required: true,
							message: "请输入积分值",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]{1}[0-9]{0,4}$/,
							message: "积分值必须为大于0小于99999的整数"
						}
					],
					dayFourPoints: [{
							required: true,
							message: "请输入积分值",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]{1}[0-9]{0,4}$/,
							message: "积分值必须为大于0小于99999的整数"
						}
					],
					dayFivePoints: [{
							required: true,
							message: "请输入积分值",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]{1}[0-9]{0,4}$/,
							message: "积分值必须为大于0小于99999的整数"
						}
					],
					daySixPoints: [{
							required: true,
							message: "请输入积分值",
							trigger: "blur"
						},
						{
							pattern: /^[1-9]{1}[0-9]{0,4}$/,
							message: "积分值必须为大于0小于99999的整数"
						}
					],
					daySevenPoints: [{
						required: true,
						message: "请输入积分值",
						trigger: "blur"
					}, {
						pattern: /^[1-9]{1}[0-9]{0,4}$/,
						message: "积分值必须为大于0小于99999的整数"
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
					pickerOptions: {
						disabledDate(time) {
							return time.getTime() < Date.now();
						}
					},
					readOnly: false,
					remark: "",
					data_list: ['2019-05-11'],
					name: '',
					condition: "1",
					dayOnePoints: 1,
					dayTwoPoints: 1,
					dayThreePoints: 1,
					dayFourPoints: 1,
					dayFivePoints: 1,
					daySixPoints: 1,
					daySevenPoints: 1,

					configJson: {},

					imageUpload: {
						href: "/upload",
						length: 1,
						delete: true,
						id: "imgUpload",
						imgUrlArr: []
					},

					//分页组建
					pagination: {
						currentPage: 1,
						pageNum: "1",
						pageSize: "10",
						total: 1,
						hasPage: true,
						hasMenu: false
					},

				}
			};
		},
		components: {

			imgUploadList
		},
		props: {
			param: {
				default: function() {
					return {}
				}
			}
		},
		methods: {
			onSubmite(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.onSubmit();
					}
				});
			},
			validateConfig(rule, value, callback) {
				let _self = this;
				if(_self.params.imageUpload.imgUrlArr.length) {
					callback();
				} else {
					callback(new Error("请上传图片"));
				}
			},
			bannerurl(rule, value, callback) {
				let _self = this;
				if(_self.params.remark) {
					var reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
					if(!reg.test(_self.params.remark)) {
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
			modifydata() {
				let _self = this;
				let data = _self.param.inforDetail.configJson;
				console.log('1111111111111111', _self.param.inforDetail.remark)
				_self.params.name = data.name;
				_self.params.data_list[0] = data.startTime;
				console.log("44444444", _self.params.data_list[0])
				_self.params.data_list[1] = data.endTime;
				_self.params.condition = String(data.condition);
				_self.params.dayOnePoints = data.dayOnePoints;
				_self.params.dayTwoPoints = data.dayTwoPoints;
				_self.params.dayThreePoints = data.dayThreePoints;
				_self.params.dayFourPoints = data.dayFourPoints;
				_self.params.dayFivePoints = data.dayFivePoints;
				_self.params.daySixPoints = data.daySixPoints;
				_self.params.daySevenPoints = data.daySevenPoints;
				_self.params.imageUpload.imgUrlArr[0] = _self.param.inforDetail.linkUrl;
				_self.params.remark = _self.param.inforDetail.remark;

			},
			getDate() {
				let _self = this;
				var date = new Date();
				date.setDate(date.getDate() + 1);
				var seperator = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;

				var strDate = date.getDate();

				month = month > 9 ? month : "0" + month;
				strDate = strDate > 9 ? strDate : "0" + strDate;

				_self.params.data_list[0] = year + seperator + month + seperator + strDate;
				_self.params.data_list[1] = year + seperator + month + seperator + strDate;
			},

			dealdata() {
				let _self = this;
				let contenttep = {
					name: _self.params.name,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					condition: Number(_self.params.condition),
					dayOnePoints: _self.params.dayOnePoints,
					dayTwoPoints: _self.params.dayTwoPoints,
					dayThreePoints: _self.params.dayThreePoints,
					dayFourPoints: _self.params.dayFourPoints,
					dayFivePoints: _self.params.dayFivePoints,
					daySixPoints: _self.params.daySixPoints,
					daySevenPoints: _self.params.daySevenPoints,
				}
				_self.params.configJson = JSON.stringify(contenttep)
			},
			onSubmit() {
				let _self = this;

				_self.dealdata();
				let url = URL.PROJECT.SCORE
				let methodType = "POST";
				if(_self.param.operate == 1) {

					url += URL.PORTNAME.ACTIVITIES_ADD
					methodType = "POST";
				} else {
					methodType = "PUT";
					url += URL.PORTNAME.ACTIVITIES_EDIT

				}
				let msg = {
					type: _self.param.type,

				};
				url = http.filterUrl(msg, url);
				let body = {
					id: _self.param.inforDetail.id,
					name: _self.params.name,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					linkUrl: _self.params.imageUpload.imgUrlArr[0],
					configJson: _self.params.configJson.replace(/\"/g, '\\\"'),
					remark: _self.params.remark,

				};
				http.publicRequest(methodType, url, body, function(res) {
					_self.param.activities = false;

					common.messageFunc("操作成功", "success");
					_self.$emit("reload");

				}, function(res) {})

			}
		},
		created() {
			let _self = this;
			console.log("aaaaaaaaaaaaaa", _self.param.type, _self.param.operate)
			if(_self.param.operate == 1) {
				_self.getDate()
			}
			if(_self.param.operate == 2) {
				_self.modifydata()
				_self.params.readOnly = true
				_self.params.imageUpload.delete = false;

			}
			if(_self.param.operate == 3) {
				_self.modifydata()
			}

		}
	};
</script>

<style lang="less" scoped>
	.sign {
		background-color: #fff;
		text-align: left;
		padding: 10px 10px 10px;
		.fonttwe {
			font-size: 12px;
		}
		.activeBox {
			line-height: 32px;
			font-size: 12px;
			.el-radio {
				display: block;
				margin-left: 90px;
			}
			.remark {
				width: 73%;
			}
			.described {
				margin-left: 10px;
				margin-right: 10px;
				width: 300px;
			}
			.describe {
				margin-left: 10px;
				margin-right: 10px;
				width: 100px;
			}
			.el-button {
				text-align: center;
				margin-left: 20%;
			}
			.content {
				line-height: 32px;
				margin-bottom: 20px;
			}
		}
		.button {
			margin: 0 auto;
			margin-top: 20px;
			margin-left: 60px;
		}
	}
</style>