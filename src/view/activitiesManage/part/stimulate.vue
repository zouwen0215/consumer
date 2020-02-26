<template>
	<el-form :model="params" :rules="rules" ref="params" class="demo-ruleForm">
		<div class="stimulate">

			<div class="activeBox">
				<div style="overflow-y: auto;height:370px; overflow-x: hidden;">
				<el-form-item prop="name">
					<div>
						<span style="color: red;">*</span><span class="fonttwe">活动名称:</span>
						<el-input v-model="params.name" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly" style="width: 350px;margin-left: -1px;"></el-input>
					</div>
				</el-form-item>

				<el-form-item>
					<div>
						<span style="color: red;">*</span><span class="fonttwe">活动时间:</span>
						<el-date-picker v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :editable="false" :picker-options="params.pickerOptions" :disabled="params.readOnly"></el-date-picker>
					</div>

				</el-form-item>
				<el-form-item prop="register">
					<div>
						<span style="color: red;">*</span><span class="fonttwe">注册:</span>
						<el-radio v-model="params.registerPointsSelect" :label="true" style="margin-top: -30px;" :disabled="params.readOnly"><span class="fonttwe">成功注册可获得</span>
							<el-input v-model.number="params.registerPoints" :disabled="!params.registerPointsSelect"></el-input><span class="fonttwe">积分</span></el-radio>
						<el-radio v-model="params.registerPointsSelect" :label="false" style="margin-top: 15px;" :disabled="params.readOnly"><span class="fonttwe">没有奖励</span></el-radio>
					</div>
				</el-form-item>
				<el-form-item prop="completeInfo">
					<div style="margin-top: 0px;">
						<span style="color: red;">*</span><span class="fonttwe">完善基础信息：</span>
						<el-radio v-model="params.completeInfoPointsSelect" :label="true" style="margin-top: -30px;" :disabled="params.readOnly"><span class="fonttwe">完善每条基础信息可获得</span>
							<el-input v-model="params.completeInfoPoints" :disabled="!params.completeInfoPointsSelect"></el-input><span class="fonttwe">积分</span></el-radio>
						<el-radio v-model="params.completeInfoPointsSelect" :label="false" style="margin-top: 15px;" :disabled="params.readOnly"><span class="fonttwe">没有奖励</span></el-radio>
					</div>
				</el-form-item>
				<el-form-item prop="realNamePoints">
					<div style="margin-top: 10px;">
						<span style="color: red;">*</span><span class="fonttwe">实名认证：</span>
						<el-radio v-model="params.realNamePointsSelect" :label="true" style="margin-top: -30px;" :disabled="params.readOnly"><span class="fonttwe">通过实名认证可获得</span>
							<el-input v-model="params.realNamePoints" :disabled="!params.realNamePointsSelect"></el-input><span class="fonttwe">积分</span></el-radio>
						<el-radio v-model="params.realNamePointsSelect" :label="false" style="margin-top: 15px;" :disabled="params.readOnly"><span class="fonttwe">没有奖励</span></el-radio>
					</div>
				</el-form-item>
				<el-form-item prop="invite">
					<div>
						<span style="color: red;">*</span><span class="fonttwe">邀请好友：</span>
						<el-radio v-model="params.inviteSelect" :label="true" style="margin-top: -30px;" :disabled="params.readOnly"><span class="fonttwe">每邀请一位好友注册成功可获得</span>
							<el-input v-model="params.invitePoints" :disabled="!params.inviteSelect"></el-input><span class="fonttwe">积分，每日邀请</span>
							<el-input v-model="params.inviteLimit" :disabled="!params.inviteSelect"></el-input><span class="fonttwe">个好友后不再获得积分</span></el-radio>
						<el-radio v-model="params.inviteSelect" :label="false" style="margin-top: 15px;" :disabled="params.readOnly"><span class="fonttwe">没有奖励</span></el-radio>
					</div>
				</el-form-item>
</div>
				<el-form-item class="button">
					<el-button type="info" v-if="param.operate==2" style="margin-left: 45%;" @click="param.activities = false">返回</el-button>
					<el-button v-if="param.operate!=2" type="primary" @click="onSubmite('params')">确定</el-button>
					<el-button  v-if="param.operate!=2" @click="param.activities=false">取消</el-button>
				</el-form-item>
			</div>
		</div>
	</el-form>
</template>

<script>
	import templatePage from "../../template/templatePage";
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	export default {
		data() {
			return {
				rules: {
					name: [{
						required: true,
						message: "请输入活动名称",
						trigger: "blur"
					}],
					register: [{

							message: "您还有未填写的积分值",
							trigger: "blur"
						}, {
							validator: this.register,
							trigger: "blur"
						},

					],

					completeInfo: [{

							message: "您还有未填写的积分值",
							trigger: "blur"
						}, {
							validator: this.completeInfo,
							trigger: "blur"
						},

					],
					realNamePoints: [{

							message: "您还有未填写的积分值",
							trigger: "blur"
						}, {
							validator: this.realNamePoints,
							trigger: "blur"
						},

					],
					invite: [{

							message: "您还有未填写的积分值",
							trigger: "blur"
						}, {
							validator: this.invite,
							trigger: "blur"
						},

					],
				},

				params: {
					pickerOptions: {
						disabledDate(time) {
							return time.getTime() < Date.now();
						}
					},
					registerPointsSelect: false,
					registerPoints: '',
					completeInfoPointsSelect: false,
					completeInfoPoints: '',
					realNamePointsSelect: false,
					realNamePoints: '',
					inviteSelect: false,
					invitePoints: '',
					inviteLimit: '',
					name: '',
					data_list: [],

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
		props: {
			param: {
				default: function() {
					return {}
				}
			}
		},
		components: {
			templatePage
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
			modifydata() {
				let _self = this;
				_self.params.remark = _self.param.inforDetail.remark;
				let data = _self.param.inforDetail.configJson;
				_self.params.name = data.name;
				_self.params.data_list[0] = data.startTime;
				_self.params.data_list[1] = data.endTime;
				_self.params.registerPointsSelect = data.registerPointsSelect
				_self.params.registerPoints = data.registerPoints
				_self.params.completeInfoPointsSelect = data.completeInfoPointsSelect
				_self.params.completeInfoPoints = data.completeInfoPoints
				_self.params.realNamePointsSelect = data.realNamePointsSelect
				_self.params.realNamePoints = data.realNamePoints
				_self.params.inviteSelect = data.inviteSelect
				_self.params.invitePoints = data.invitePoints
				_self.params.inviteLimit = data.inviteLimit

			},
			register(rule, value, callback) {
				let _self = this;
				if(_self.params.registerPointsSelect == true && _self.params.registerPoints == '') {
					callback(new Error("您还有未填写的积分值"));
				}
				if(_self.params.registerPointsSelect == true &&!/^[1-9]{1}[0-9]{0,4}$/.test(_self.params.registerPoints)  ) {
					callback(new Error("积分值必须为大于0小于99999的整数"));
				} else {
					callback();
				}
			},
			completeInfo(rule, value, callback) {
				let _self = this;
				if(_self.params.completeInfoPointsSelect == true && _self.params.completeInfoPoints == '') {
					callback(new Error("您还有未填写的积分值"));
				}
				if(_self.params.completeInfoPointsSelect == true &&!/^[1-9]{1}[0-9]{0,4}$/.test(_self.params.completeInfoPoints)  ) {
					callback(new Error("积分值必须为小于6位的数值型"));
				} else {
					callback();
				}
			},
			realNamePoints(rule, value, callback) {
				let _self = this;
				if(_self.params.realNamePointsSelect == true && _self.params.realNamePoints == '') {
					callback(new Error("您还有未填写的积分值"));
				}
				if(_self.params.realNamePointsSelect == true && !/^[1-9]{1}[0-9]{0,4}$/.test(_self.params.realNamePoints) ) {
					callback(new Error("积分值必须为大于0小于99999的整数"));
				} else {
					callback();
				}
			},
			
			invite(rule, value, callback) {
				let _self = this;
				if(_self.params.inviteSelect == true) {
					if(_self.params.invitePoints == '' || _self.params.inviteLimit == '') {
						callback(new Error("您还有未填写的内容"));
              
					}if(!/^[1-9]{1}[0-9]{0,4}$/.test(_self.params.invitePoints) || !/^[1-9]{1}[0-9]{0,4}$/.test(_self.params.inviteLimit) ) {
				     callback(new Error("积分值必须为大于0小于99999的整数"));}
				     else {
						callback();
					}
				}
				else {
					callback();
				}
				 
			},

			getDate() {
				let _self = this;
				var date = new Date();
				date.setDate(date.getDate()+1);
				var seperator = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				
				var strDate = date.getDate();
				
				month=month>9?month:"0"+month;				
				strDate=strDate>9?strDate:"0"+strDate;
				
				_self.params.data_list[0] = year + seperator + month + seperator + strDate;
				_self.params.data_list[1] = year + seperator + month + seperator + strDate;

			},

			dealdata() {
				let _self = this;

				let contenttep = {
					name: _self.params.name,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					registerPointsSelect: _self.params.registerPointsSelect,
					registerPoints: _self.params.registerPoints,
					completeInfoPointsSelect: _self.params.completeInfoPointsSelect,
					completeInfoPoints: _self.params.completeInfoPoints,
					realNamePointsSelect: _self.params.realNamePointsSelect,
					realNamePoints: _self.params.realNamePoints,
					inviteSelect: _self.params.inviteSelect,
					invitePoints: _self.params.invitePoints,
					inviteLimit: _self.params.inviteLimit,

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
					linkUrl: '',
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
				_self.params.readOnly = true
				_self.modifydata()
			}
			if(_self.param.operate == 3) {
				_self.modifydata()
			}
		}
	};
</script>

<style lang="less" scoped>
	.stimulate {
		background-color: #fff;
		text-align: left;
		padding: 10px 10px 0px;
		.button{
			margin-top: 30px;
		}
		.fonttwe {
			font-size: 12px;
		}
		.activeBox {
			margin-left: 20px;
			line-height: 32px;
			.el-radio {
				display: block;
				margin-left: 110px;
			}
			.el-button {
				text-align: center;
				margin-left: 25%;
			}
			.el-input {
				margin-left: 10px;
				margin-right: 10px;
				width: 60px;
			}
		
		}
		
	}
</style>