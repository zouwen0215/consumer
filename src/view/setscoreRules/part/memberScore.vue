<template>
	<el-form :model="params" :rules="rules" ref="params" class="demo-ruleForm">
	<div class="memberScore">
	<el-form-item prop="configJson">
	<el-radio-group v-model="params.configJson.select" @change="Edit">
    <el-radio  label="0" style="margin-left: -300px;">积分永久有效</el-radio>
    <el-radio  label="1">自会员获得积分开始，<el-input type="number" v-model="params.configJson.year"   :disabled="params.isEdit"></el-input>个自然年后积分自动清零</el-radio>
    </el-radio-group >
    </el-form-item>
  <div >
		  <el-button type="primary" @click="onSubmite('params')">保存设置</el-button>
	</div>
	</div>
</el-form>	
	
		
	
</template>

<script>
	import http from '@/utils/http.js'
	import URL from '@/utils/url.js'
	import validation from '@/utils/validation.js'
	export default {
  data() {
    return {
      rules:{
      		configJson: [{
						required: true,
						trigger: "blur"
					},{
						validator: this.configJson,
						trigger: "blur"
					}
					],
      },
      params: {
      	isEdit:false,	
      	infor:{},
      	configJson:{
      		select:"0",
            year:'',
      	},
       
      }
    };
  },
 
  methods: {
 
	configJson(rule, value, callback) {
				let _self = this;
				if(_self.params.configJson.select=="1"&&!/^[1-9]\d*$/.test(_self.params.configJson.year)) {
					callback(new Error("自然年必须为大于0的正整数"));
				} else {
					callback();
				}
			},
	onSubmite(formData) {
				let _self = this;
				_self.$refs[formData].validate(valid => {
					if(valid) {
						_self.loadSave();
					}
				});
			},		
    Edit(){
    	 let _self=this;
    	 if (_self.params.configJson.select=="0"){
    	 	_self.params.isEdit=true
    	 }else{
    	 	_self.params.isEdit=false
    	 }
      	 console.log(_self.params.isEdit)
    },
    loadMessage() {
				let _self = this;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.MEMBER_SCORE;
				let msg = {
					type: 1,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest("get",url,"",function(res) {
						let result = res.body.data;
						let infor=JSON.parse(result.configJson.replace(/\'/g,'\"'));
						_self.params.configJson.select=infor.select.toString();
						_self.params.configJson.year=infor.year;
						console.log("qqqqqqqqq",_self.params.configJson.select)
						
					},
					function(res) {}
				);
			},
		loadSave() {
				let _self = this;
				let contenttep="";
				if(_self.params.configJson.select=="0"){
					 contenttep="积分永久有效";
					_self.params.configJson.year='';
				}else{
					contenttep="自会员获得积分开始"+_self.params.configJson.year+"个自然年后积分自动清零";
				}
				let url = URL.PROJECT.SCORE + URL.PORTNAME.SAVE_MEMBERSCORE;
				let body = {
					type: 1,
					content:contenttep,
					configJson:JSON.stringify(_self.params.configJson) ,
				};
				http.publicRequest("POST",url,body,function(res) {
						_self.loadMessage()
					},
					function(res) {}
				);
			},
  },
   created() {
   	
  	         this.loadMessage()
  }
};
</script>

<style lang="less" scoped>
.memberScore{
	
   float: left;
	background-color: white;
	padding-bottom: 50px;
	.el-radio{
		margin-top: 20px;
		display: block;
	}
	.el-input{
		margin-left: 10px;
		width: 100px;
		margin-right: 10px;
	}
	.el-button{
		display: flex;
		margin-left: 40px;
		margin-top: 100px;
		
	}
}
</style>