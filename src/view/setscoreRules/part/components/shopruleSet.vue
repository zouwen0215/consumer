<template>
	<el-form :model="params" :rules="rules" ref="params" class="demo-ruleForm">
		<div class="limitSetdown">

			<span class="fonttwe" style="margin-left: -280px;">日期选择：</span>
						<el-date-picker v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :editable="false" :picker-options="params.pickerOptions" :disabled="params.readOnly"></el-date-picker>
			

			</el-date-picker>
			<div class="check">
				<el-form-item prop="holdone">
					<el-checkbox v-model="params.memberShopVo.selCheck"><span class="fonttwe">1会员积分=</span>
						<el-input v-model="params.memberShopVo.shopPoint" :disabled="!params.memberShopVo.selCheck"></el-input><span class="fonttwe">零售户积分</span> </el-checkbox>
				</el-form-item>
				<el-form-item prop="holdtwo">
					<el-checkbox v-model="params.shopVo.selCheck"><span class="fonttwe">零售户每邀请一位消费者注册成功，获得</span>
						<el-input v-model="params.shopVo.point" :disabled="!params.shopVo.selCheck"></el-input><span class="fonttwe">积分，每日邀请获取积分上限为</span>
						<el-input v-model="params.shopVo.dayLimitPoint" :disabled="!params.shopVo.selCheck"></el-input>
					</el-checkbox>
				</el-form-item>
				<el-form-item prop="holdthree">
					<el-checkbox v-model="params.terminalVo.selCheck"><span class="fonttwe">零售户激活智能终端后</span>
						<el-input v-model="params.terminalVo.month" :disabled="!params.terminalVo.selCheck"></el-input><span class="fonttwe">天内：1会员积分=</span>
						<el-input v-model="params.terminalVo.shopPoint" :disabled="!params.terminalVo.selCheck"></el-input><span class="fonttwe">零售户积分</span></el-checkbox>
				</el-form-item>
			</div>
			<el-form-item>
				<div class="button">
					<el-button type="primary" @click="onSubmite('params')">确定</el-button>
					<el-button @click="param.addruleMenu = false">取消</el-button>
				</div>
			</el-form-item>
		</div>

		</div>
		</div>
	</el-form>
</template>

<script>
	import http from "@/utils/http.js";
	import URL from "@/utils/url.js";
	import common from "@/utils/common.js";
	import validation from "@/utils/validation.js";
	export default {
		data() {
			return {
				rules: {
					holdone: [
						{
							validator: this.holdone,
							trigger: "blur"
						}
					],
					holdtwo: [
						{
							validator: this.holdtwo,
							trigger: "blur"
						}
					],
					holdthree: [
						{
							validator: this.holdthree,
							trigger: "blur"
						}
					]

				},
				params: {
					pickerOptions: {
						disabledDate(time) {
							return time.getTime() < Date.now();
						}
					},
					data_list: [],
					content: "",
					configJson: {},
					checkedCities: [],
					memberShopVo: {
						selCheck: false,
						shopPoint: ""
					},
					shopVo: {
						selCheck: false,
						point: "",
						dayLimitPoint: ""
					},
					terminalVo: {
						selCheck: false,
						month: "",
						shopPoint: ""
					}

				}
			}

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
						_self.addmenu();
					}
				});
			},
			holdone(rule, value, callback) {
				let _self = this;
				if(_self.params.memberShopVo.selCheck == true ) {
					if( _self.params.memberShopVo.shopPoint == ""){
							callback(new Error("您还有未填写的积分值"));
					}
				    if( ! /^[1-9]{1}[0-9]{0,4}$/.test(_self.params.memberShopVo.shopPoint )) {
				     callback(new Error("积分值必须为大于0小于99999的整数"));}

				else {
						callback();
					}
				}
				
				else {
					callback();
				}
			},
			holdtwo(rule, value, callback) {
				let _self = this;
				if(_self.params.shopVo.selCheck == true) {
					if(_self.params.shopVo.point == "" || _self.params.shopVo.dayLimitPoint == "") {
						callback(new Error("您还有未填写的积分值"));

					}
					if(! /^[1-9]{1}[0-9]{0,4}$/.test(_self.params.shopVo.point ) || ! /^[1-9]{1}[0-9]{0,4}$/.test(_self.params.shopVo.dayLimitPoint)) {
				     callback(new Error("积分值必须为大于0小于99999的整数"));}
					else {
						callback();
					}

				} else {
					callback();
				}
			},
			holdthree(rule, value, callback) {
				let _self = this;
				if(_self.params.terminalVo.selCheck == true) {
					if(_self.params.terminalVo.month == "" || _self.params.terminalVo.shopPoint == "") {
						callback(new Error("您还有未填写的内容"));

					}
					if(!/^[1-9]\d*$/.test(_self.params.terminalVo.month) ) {
				     callback(new Error("月份必须为数值型"));}
					if(! /^[1-9]{1}[0-9]{0,4}$/.test(_self.params.terminalVo.shopPoint)) {
				     callback(new Error("积分值必须为大于0小于99999的整数"));}
						else {
						callback();
					}
				}
				else{
					callback();
				}
			},
			modifydata() {
				let _self = this;
				console.log(_self.param.limitDetail)
				let data = _self.param.limitDetail.configJson;
				_self.params.data_list[0] = data.startTime;
				_self.params.data_list[1] = data.endTime;
				_self.params.memberShopVo.selCheck = data.memberShopVo.selCheck;
				_self.params.memberShopVo.shopPoint = data.memberShopVo.shopPoint;
				_self.params.shopVo.dayLimitPoint = data.shopVo.dayLimitPoint;
				_self.params.shopVo.point = data.shopVo.point;
				_self.params.shopVo.selCheck = data.shopVo.selCheck;
				_self.params.terminalVo.month = data.terminalVo.month;
				_self.params.terminalVo.selCheck = data.terminalVo.selCheck;
				_self.params.terminalVo.shopPoint = data.terminalVo.shopPoint;

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
				let con, con1, con2, con3 = "";
				if(_self.params.memberShopVo.selCheck == true) {
					con1 = "1会员积分=" + _self.params.memberShopVo.shopPoint + "零售户积分;"
				} else {
					con1 = ""
				}
				if(_self.params.shopVo.selCheck == true) {
					con2 = "零售户每邀请一位消费者注册成功，获得" + _self.params.shopVo.point +
						"积分,每日邀请获取积分上限为" + _self.params.shopVo.dayLimitPoint+';'
				} else {
					con2 = ""
				}
				if(_self.params.terminalVo.selCheck == true) {
					con3 = "零售户激活智能终端后" + _self.params.terminalVo.month + "天内：1会员积分" +
						_self.params.terminalVo.shopPoint + "零售户积分"
				} else {
					con3 = ""
				}
				con = con1 + con2 + con3
				_self.params.content = con;
				let contenttep = {
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					memberShopVo: _self.params.memberShopVo,
					shopVo: _self.params.shopVo,
					terminalVo: _self.params.terminalVo,

				}
				_self.params.configJson = JSON.stringify(contenttep)
			},
			addmenu() {
				let _self = this;
				_self.dealdata();
				let url = URL.PROJECT.SCORE
				let methodType = "POST";
				if("edit" == _self.param.optType) {
					console.log("edit")
					url += URL.PORTNAME.MODIFY_DELETE
					methodType = "PUT";
				} else {
					url += URL.PORTNAME.RULE_SAVE
				}
				let body = {
					id: _self.param.limitDetail.id,
					type: 5,
					points: 0,
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					content: _self.params.content,
					configJson: _self.params.configJson.replace(/\"/g, '\\\"')
				};
				http.publicRequest(methodType, url, body, function(res) {
					_self.param.addruleMenu = false;
					common.messageFunc("操作成功", "success");
					_self.$emit("reload");

				}, function(res) {})
			},
		},
		created() {
			let _self = this;
			if(_self.param.optType == 'edit') {
				_self.modifydata();

			} else {
				_self.getDate();
			}
		}
	};
</script>

<style lang="less" scoped>
	.limitSetdown {
			.el-button:first-child{
			margin-right: 20%;
			
		}
		.fonttwe{
			font-size: 12px;
		}
		.button {
			margin-top: 50px;
		}
		.check {
			margin-top: 20px;
			text-align: left;
			.el-checkbox:first-child {
				margin-left: 30px;
			}
			.el-input {
				margin-left: 10px;
				margin-right: 10px;
				width: 100px;
			}
		}
	}
</style>