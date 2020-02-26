<template>
	<el-form :model="params" :rules="rules" ref="params" class="demo-ruleForm">
		<div class="wheel">
			<div class="activeBox">
				<div style="overflow-y: auto;height:300px; overflow-x: hidden;">
				<el-form-item prop="name">
					<div>
						<span style="color: red;">*</span><span class="fonttwe">活动名称：</span>
						<el-input v-model="params.name" autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input>
					</div>
				</el-form-item>
				<el-form-item prop="choose">
					<div >
						<span style="color: red;">*</span><span class="fonttwe">参与条件：</span>
						<el-checkbox :disabled="params.readOnly" v-model="params.firstFree" style="margin-top: -30px;"><span class="fonttwe">每天首次免费</span></el-checkbox>
						<el-checkbox :disabled="params.readOnly" v-model="params.buyAddNumber" ><span class="fonttwe">在智能终端门店购物一次可增加一次机会</span></el-checkbox>
						<el-checkbox :disabled="params.readOnly" v-model="params.usePointsAddNumber" ><span class="fonttwe">消耗</span>
							<el-input :disabled="!params.usePointsAddNumber||params.readOnly"  v-model="params.usePoints" style="width: 100px; margin-left: 10px;margin-right: 10px;" ></el-input><span class="fonttwe">积分可增加一次机会</span></el-checkbox>

					</div>
				</el-form-item>
				<el-form-item>
					<div >
						<span style="color: red;">*</span><span class="fonttwe">活动时间：</span>
						<el-date-picker v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :editable="false" :picker-options="params.pickerOptions" :disabled="params.readOnly"></el-date-picker>
					</div>
				</el-form-item>
				<el-form-item prop="remark">
					<div >
						<span style="color: red;">*</span><span class="fonttwe">跳转路径：</span>
						<el-input style="width:52%;" v-model="params.remark" class="describe"  autofocus="autofocus" placeholder="请输入内容" :disabled="params.readOnly"></el-input>
					</div>
				</el-form-item>
				<el-form-item prop="contentList">
					<div class="mb10">
						<span style="color: red;">*</span><span class="fonttwe">转盘设置：</span>
						<el-button @click="addText(-1)" :disabled="params.readOnly" >+添加内容</el-button>
						<p v-for="(item,index) in params.contentList" :key="index"><span class="fonttwe">{{index+1}}.内容</span>
							<el-input v-model="item.content" class="firstinput"></el-input><span class="fonttwe">,该内容概率为</span>
							<el-input v-model="item.probability" class="secondinput"></el-input><span class="fonttwe">，该内容奖励为</span>
							<el-input v-model="item.points" class="thirdinput"></el-input><span style="font-size: 12px;color: #333333">积分。</span>
							<span v-if="!params.readOnly" @click="addText(index)">删除</span>
						</p>
					</div>
				</el-form-item>
				<el-form-item prop="imageUpload">
					<div class="mb10">
						<span style="color: red;">*</span><span class="fonttwe">图片：</span>

						<img-upload-list :imgUpload="params.imageUpload" style="margin-left:50px;margin-top: -20px;"></img-upload-list>

					</div>
				</el-form-item>
					<p style="margin-left:8%;margin-bottom: 20px;margin-top: -10px;font-size: 12px;color: #b3b3b3;">只支持.jpg格式</p>
					</div>
				<el-form-item class="button">
					<el-button type="info" v-if="param.operate==2" style="margin-left: 45%;" @click="param.activities = false">返回</el-button>
					
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
						message: "请输入标题",
						trigger: "blur"
					}],
					remark: [{
						required: true,
						message: "请输入内容",
						trigger: "blur"
					},{
						validator: this.bannerurl,
						trigger: "blur"
					}],
					choose: [{
						validator: this.choose,
						trigger: "blur"
					}],
					contentList: [ {
						validator: this.contentList,
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
					name: '',
					buyAddNumber: '',
					firstFree: '',
					usePointsAddNumber: '',
					usePoints: '',
					data_list: [],
					contentList: [{content:'',probability:'',points:''}, 
					              {content:'',probability:'',points:''}, 
					              {content:'',probability:'',points:''}, 
					              {content:'',probability:'',points:''}, 
					              {content:'',probability:'',points:''}],
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
			addText(val) {
				let _self = this;
				if(val == '-1') {

					_self.params.contentList.push({content:'',probability:'',points:''});
				} else {
					_self.params.contentList.splice(val, 1);
				}
			},
			//--------------------------
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
			contentList(rule, value, callback) {
				let _self = this;
				let result = true;
				let temp=0;
				for(let i = 0; i < _self.params.contentList.length; i++) {
					console.log(JSON.stringify(_self.params.contentList[i]) != "{}")
					if(JSON.stringify(_self.params.contentList[i]) != "{}") {
						console.log(_self.params.contentList[i].content,_self.params.contentList[i].probability, _self.params.contentList[i].points,)
						if(_self.params.contentList[i].content== '' || _self.params.contentList[i].probability == '' || _self.params.contentList[i].points == '') {
							result = false;
						}
						if( _self.params.contentList[i].points!=''&&!/^[1-9]{1}[0-9]{0,4}$/.test( _self.params.contentList[i].points)){
							callback(new Error("积分值必须为大于0小于99999的整数"));
						}
						if(_self.params.contentList[i].probability!=''&&!/^(([1-9]{1}[0-9]{0,1})|[0]{0,1})([.]{0}|(([.]{1})([0-9]{0,2})))$/.test( _self.params.contentList[i].probability)){
							callback(new Error("概率为小于100的数值型"));
						}
						
							temp+=Number(_self.params.contentList[i].probability);
						
						console.log("11111111",temp)
						if(temp>100){
							callback(new Error("概率总和不得大于100%"));
						}
						
					}else{
						result = false;
					}
				}
				if(result){
					callback();
				}else{
					callback(new Error("您的转盘内容没有填写完整"));
				}
			

			},
			choose(rule, value, callback) {
				let _self = this;
				if(_self.params.firstFree == false&& _self.params.buyAddNumber == false&&_self.params.usePointsAddNumber == false) {

					callback(new Error("您还有未勾选的参与条件"));

				}
				if(_self.params.usePointsAddNumber == true&&_self.params.usePoints==''){
					callback(new Error("您还有未填写的积分值"));
				}
				if(_self.params.usePointsAddNumber == true&&!/^[1-9]{1}[0-9]{0,4}$/.test(_self.params.usePoints)){
					callback(new Error("积分值必须为大于0小于99999的整数"));
				}
				else {
					callback();
				}
			},
			modifydata() {
				let _self = this;
				_self.params.remark = _self.param.inforDetail.remark;
				let data = _self.param.inforDetail.configJson;

				_self.params.name = data.name;
				_self.params.data_list[0] = data.startTime;
				_self.params.data_list[1] = data.endTime;
				_self.params.usePoints = data.usePoints;
				_self.params.contentList = data.contentList;
				_self.params.remark = _self.param.inforDetail.remark;
				_self.params.firstFree = data.firstFree
				_self.params.buyAddNumber = data.buyAddNumber
				_self.params.usePointsAddNumber = data.usePointsAddNumber
				 _self.params.imageUpload.imgUrlArr[0] = _self.param.inforDetail.linkUrl;

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
					firstFree: _self.params.firstFree,
					usePoints:_self.params.usePoints,
					buyAddNumber: _self.params.buyAddNumber,
					usePointsAddNumber: _self.params.usePointsAddNumber,
					contentList: _self.params.contentList,

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
				_self.params.readOnly = true
				_self.params.imageUpload.delete = false;
				_self.modifydata()
			}
			if(_self.param.operate == 3) {
				_self.modifydata()
			}
		}
	};
</script>

<style lang="less" scoped>
	.wheel {
		background-color: #fff;
		text-align: left;
		
		padding: 10px 10px 0px;
		.button{margin-top: 40px;}
	
		.fonttwe{
			font-size: 12px;
		}
	
		.activeBox {
			margin-left: 20px;
			line-height: 32px;
			.el-checkbox {
				display: block;
				
				margin-left: 78px;
			}
			.describe {
				width: 63%;
			}
			.el-button {
				text-align: center;
				margin-left: 25%;
			}
			.firstinput {
				margin-left: 10px;
				margin-right: 10px;
				width: 180px;
			}
			.secondinput {
				margin-left: 10px;
				margin-right: 10px;
				width: 60px;
			}
			.thirdinput {
				margin-left: 10px;
				margin-right: 10px;
				width: 60px;
				&~span {
					color: #f00;
					cursor: pointer;
				}
			}
			p {
				margin-top: 10px;
			}
			.content {
				line-height: 32px;
				margin-bottom: 20px;
			}
	
		}
	
	}
</style>