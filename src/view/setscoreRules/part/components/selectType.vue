<style lang="less" scoped>
	.selectType {
			.el-button:first-child{
			margin-right: 20%;
			
		}
		.fonttwe{
			font-size: 12px;
		}
		.shortinput {
			width: 110px;
			margin-right: 10px;
		}
		.longinput {
			width: 300px;
		}
		.el-form {}
		.line {
			height: 20px;
			border-bottom: 1px solid #C0C4CC;
			margin-left: 20px;
			margin-top: 2px;
			width: 83%;
		}
		.titleone {
			display: flex;
			margin-bottom: 10px;
			p {
				font-size: 14px;
			}
		}
	}
</style>

<template>
	<div class="selectType">
		<div class="titleone">
			<p style="border-bottom: 3px solid #02af81;padding-left: 3px;padding-right: 3px;">购买</p>
			<div class="line"></div>
		</div>
		<div>
			<el-form :model="params" :rules="rules" ref="params" >
				<el-form-item>
					<span class="fonttwe" style="margin-left: -30px;">单位：</span>
					<el-radio-group :disabled="params.brandisdisabled" v-model="params.unit" style="margin-right: 140px;">
						<el-radio  label="slave">每包</el-radio>
						<el-radio  label="master">每条</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item v-if="params.smokeisdisabled==true">
					<span class="fonttwe" style="margin-left: -37px;">卷烟品规：</span>
					<el-input v-model="params.smokeName" class="longinput"  readonly="readonly" :disabled="params.smokeisdisabled"></el-input>
					
				</el-form-item>
				<el-form-item v-else>
					<span class="fonttwe" >卷烟品规：</span>
					<el-input v-model="params.smokeName" class="longinput" @click.native="choosesmoke('goods')" readonly="readonly" :disabled="params.smokeisdisabled"></el-input>
					<span v-if="!params.smokeisdisabled" class="deleteText" style="margin-left: 5px;" @click="clear">删除</span>
				</el-form-item>
					<el-form-item v-if="params.brandisdisabled==true">
					<span class="fonttwe" style="margin-left: -20px;">卷烟品牌：</span>
					<el-input v-model="params.brandName" class="longinput" @click.native="choosesmoke('brand')" readonly="readonly" :disabled="params.brandisdisabled"></el-input>
					
				</el-form-item>
				<el-form-item v-else>
					<span class="fonttwe">卷烟品牌：</span>
					<el-input v-model="params.brandName" class="longinput" @click.native="choosesmoke('brand')" readonly="readonly" :disabled="params.brandisdisabled"></el-input>
					<span v-if="!params.brandisdisabled" class="deleteText" style="margin-left: 5px;" @click="clear">删除</span>
				</el-form-item>
				<el-form-item prop="price">
					<span class="fonttwe" style="margin-left: -38px;">价位:</span>
					<el-input v-model="params.startPrice" class="shortinput" :disabled="params.brandisdisabled" @change="disable"></el-input>至
					<el-input v-model="params.endPrice" class="shortinput" :disabled="params.brandisdisabled" @change="disable"></el-input>元
				</el-form-item>

				<div class="titleone">
					<p style="border-bottom: 3px solid #02af81;padding-left: 3px;padding-right: 3px;">{{params.addusetext}}</p>
					<div class="line"></div>
				</div>
				<div>

					<el-form-item prop="point" >
						<span class="fonttwe" style="margin-left: -30px;">积分值：</span>
						<el-input v-model.number="params.point" class="shortinput" style="width: 120px;"></el-input><span class="fonttwe">积分</span>
					</el-form-item>

				</div>
				<div class="titleone">
					<p style="border-bottom: 3px solid #02af81;padding-left: 3px;padding-right: 3px;">生效时间</p>
					<div class="line"></div>
				</div>
				

					<el-form-item>
						<span class="fonttwe" style="margin-left: 18px;">日期选择：</span>
						<el-date-picker v-model="params.data_list" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" :editable="false" :picker-options="params.pickerOptions" :disabled="params.readOnly"></el-date-picker>
						

					</el-form-item>
					<el-form-item>
						<div class="button">
							<el-button type="primary" @click="onSubmite('params')">确定</el-button>
							<el-button @click="param.addruleMenu=false">取消</el-button>
						</div>

					</el-form-item>
			</el-form>

				</div>
			<el-dialog v-if="params.checkedType" :title="params.title" :visible.sync="params.checkedType" width="700px" back-backdrop='static' :modal="false" center :close-on-click-modal="false">
				<chooseType :param="params"></chooseType>
			</el-dialog>
		</div>
	
</template>

<script>
	import http from "@/utils/http.js";
	import common from "@/utils/common.js";
	import URL from "@/utils/url.js";
	import validation from "@/utils/validation.js";
	import chooseType from "./chooseType";
	export default {
		data() {
			return {
				rules: {
					point: [{
						required: true,
						message: '您还有未填写的积分值',
						trigger: 'blur'
					}, {
						pattern: /^[1-9]{1}[0-9]{0,4}$/,
						message: '积分值必须为大于0小于99999的整数'
					}],
					price: [{
						validator: this.pricerange,
					    trigger: "blur"
					}],
					
				},
				params: {
					pickerOptions: {
						disabledDate(time) {
							return time.getTime() < Date.now();
						}
					},
					title:'',
					addusetext:'',
					configJson: {},
					content: "",
				    redioable:false,
					point: '',
					selectList:[],
					smokeCode: "",
					smokeName: "",
					brandCode: "",
					brandName: "",
					type: "",
                    startPrice:'',
                    endPrice:'',
					unit: "slave",
					data_list: [],
					infor: {},
					checkedType: false,
					smokeisdisabled: false,
					brandisdisabled: false
				}
			};
		},
         
		components: {
			chooseType
		},
		props: {
			param: {
				default: function() {
					return {}
				}
			}
		},
		methods: {
			onSubmite(val) {
				let _self = this;
				_self.$refs[val].validate(valid => {
					if(valid) {
						_self.addmenu();
					}
				});
			},
			disable(){
					let _self = this;
					if(_self.params.startPrice!=''|| _self.params.endPrice!=''){
						_self.params.smokeisdisabled=true
					}else{
						_self.params.smokeisdisabled=false
					}
					
			},
			clear() {
				let _self = this;
				_self.params.smokeName = ''
				_self.params.brandName = ''
				_self.params.brandisdisabled = false
				_self.params.smokeisdisabled = false

			},
           
           pricerange(rule, value, callback) {
				let _self = this;
			    if(_self.params.startPrice!=''&& _self.params.endPrice=='') {
					
					callback(new Error("您还有未填写的价位"));
				} 
				 if(_self.params.startPrice==''&& _self.params.endPrice!='') {
					
					callback(new Error("您还有未填写的价位"));
				} 
				
				if(_self.params.startPrice!=''&&! /^[0-9]\d*$/.test( _self.params.startPrice)) {
					
					callback(new Error("价位必须为数值型"));
				} 
				if(_self.params.endPrice!=''&&! /^[0-9]\d*$/.test( _self.params.endPrice)) {
					
					callback(new Error("价位必须为数值型"));
				}if(_self.params.startPrice!=''&&_self.params.endPrice!=''&&_self.params.startPrice-_self.params.endPrice>0){
					callback(new Error("起始价位必须小于结束价位"));
				}else{
						callback();
				}
		
				
			},
			choosesmoke(val) {
				let _self = this;
				console.log("qqqqqqqqqqqqqqq",_self.params.title)
				
				if(val == "goods"){
					_self.params.title='选择卷烟'
				}
				else{
					_self.params.title='选择品牌'
				}
				
				if(_self.params.smokeName == true && val == "goods") {
				
				    
					_self.params.checkedType = false;
					
					
					
				}
				if(_self.params.brandisdisabled == true && val == "brand") {
					
					_self.params.checkedType = false;
					
				} else {
					_self.params.checkedType = true;
				}
				_self.params.type = val
				console.log(_self.params.checkedType)
			},
			modifydata() {
				let _self = this;
				let data = _self.param.ruleDetail.configJson;
				console.log(_self.param.ruleDetail)
				//		    		let contenttep=JSON.parse(data.configJson.replace(/\\\"/g,'\"'));
				_self.params.data_list[0] = data.startTime;
				_self.params.data_list[1] = data.endTime;
				_self.params.unit=data.unit
				_self.params.smokeCode = data.smokeCode;
				_self.params.smokeName = data.smokeName;
				_self.params.brandCode = data.brandCode;
				_self.params.brandName = data.brandName;
				_self.params.startPrice = data.startPrice;
				_self.params.endPrice = data.endPrice;
				
				_self.params.point = data.point;
				if(_self.params.smokeName!=''){
					_self.params.brandisdisabled=true
				}else{
					_self.params.smokeisdisabled=true
				}

				
				console.log(_self.param.rulelist)
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
				let con, con1, con2, con3, con4 ,con5,aaa= "";
				if(_self.params.unit == "slave") {
				
					con1 = "每包";
				} else {
					
					con1 = "每条";
				}

				if(_self.params.smokeName != "") {
					con2 = _self.params.smokeName
				} else {
					con2 = ""
				}
				if(_self.params.brandName != "") {
					con3 = _self.params.brandName
					
				} else {
					con3 = ""
					aaa='卷烟'
				}
				if(_self.params.startPrice != ""&&_self.params.endPrice != "") {
					con4 = '价位从'+_self.params.startPrice+'至'+_self.params.endPrice+'元的'+aaa
				} else {
					con4 = ""
				}
				if(_self.params.point != "") {
					con5 = _self.params.point
				} else {
					con5 = ""
				}
				
				con = "购买" + con1 + con2+con4+con3 + _self.params.addusetext + con5 + "积分"
				_self.params.content = con;
				let contenttep = {
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",
					point: _self.params.point,
					unit: _self.params.unit,
					smokeCode: _self.params.smokeCode,
					smokeName: _self.params.smokeName,
					brandCode: _self.params.brandCode,
					brandName: _self.params.brandName,
					startPrice:_self.params.startPrice,
					endPrice:_self.params.endPrice,
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
					id: _self.param.ruleDetail.id,
					type: _self.param.addGetoruse,
					points: 0,
					content: _self.params.content,
					configJson: _self.params.configJson.replace(/\"/g, '\\\"'),
					startTime: _self.params.data_list.length ? _self.params.data_list[0] : "",
					endTime: _self.params.data_list.length ? _self.params.data_list[1] : "",

				};
				http.publicRequest(methodType, url, body, function(res) {
					
					common.messageFunc("操作成功", "success");
					_self.param.addruleMenu = false
					_self.param.ruleMenu=false
					_self.$emit("reload");
				}, function(res) {

				})
			},

		},
		created() {

			let _self = this;
		   console.log("hahahahhahahahahah",_self.param.addGetoruse)
		   if(_self.param.addGetoruse==4){
		     _self.params.addusetext="可消耗"
		   }else{
		   	_self.params.addusetext="可获得"
		   }
           console.log(_self.param.optType)
			//			setTimeout(function() {
			http.$on("selectList", function(selectList) {
				_self.params.selectList=selectList
				console.log("qqqqqqqqqqqqqq", selectList)
				var nameList = [];
				var codeList = [];
				var namecontent = ""
				var codecontent = ""
				for(let key of selectList) {
				nameList.push(key.name)
				codeList.push(key.code)
				namecontent = nameList.join(",");
				codecontent = codeList.join(",");
				
				if(_self.params.type == 'goods') {
					_self.params.smokeName = namecontent
					_self.params.smokeCode = codecontent
					_self.params.brandisdisabled = true
				} else {
					_self.params.brandName = namecontent
					_self.params.brandCode = codecontent
					_self.params.smokeisdisabled = true
				}
}            
			});
			
			console.log('aaaaaaaaaaaaaaaaaa',_self.params.smokeName )
			//			}, 200);
			if(_self.param.optType=='edit'){
				_self.modifydata();
			
			}
			
			else{
				_self.getDate();
			}
			
		}
	};
</script>