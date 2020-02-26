<template>
<div class="orderDetail">
	<el-form  :model="params.infor"  label-width="150px">
	<div class="firstpart">
		<div class="leftpart">
			<el-form-item label="会员ID：" prop="id">
				<el-input v-model="params.infor.id" disabled ></el-input>
			</el-form-item>
			<el-form-item label="昵称：" prop="nickname">
				<el-input v-model="params.infor.nickname" disabled ></el-input>
			</el-form-item>
			<p><span style="margin-left: 80px;">微信头像:</span><img :src="params.infor.avatarUrl" class="img" /></p>
			<el-form-item label="会员手机号：" prop="mobile">
				<el-input v-model="params.infor.mobile" disabled ></el-input>
			</el-form-item>
			<el-form-item label="会员积分值：" prop="points">
				<el-input v-model="params.infor.points" disabled ></el-input>
			</el-form-item>
			<el-form-item label="注册时间：" prop="createTime">
				<el-input v-model="params.infor.createTime" disabled ></el-input>
			</el-form-item>
			<el-form-item label="发展途径：" prop="source">
				<el-input v-model="params.infor.source" disabled ></el-input>
			</el-form-item>
			<el-form-item label="加入途径：" prop="referName">
				<el-input v-model="params.infor.referName" disabled ></el-input>
			</el-form-item>
		
		
			
		</div>
		<div class="rightpart">
			<el-form-item label="性别：" prop="gender">
				<el-input v-model="params.infor.gender"  disabled ></el-input>
				
			</el-form-item>
			<el-form-item label="年龄：" prop="age">
				<el-input v-model="params.infor.age" disabled ></el-input>
			</el-form-item>
			<el-form-item label="学历：" prop="education">
				<el-input v-model="params.infor.education" disabled ></el-input>
			</el-form-item>
			<el-form-item label="职业：" prop="work">
				<el-input v-model="params.infor.work" disabled ></el-input>
			</el-form-item>
			<el-form-item label="生日：" prop="birth">
				<el-input v-model="params.infor.birth" disabled ></el-input>
			</el-form-item>
			<el-form-item label="薪资区间：" prop="salary">
				<el-input v-model="params.infor.salary" disabled ></el-input>
			</el-form-item>
			<el-form-item label="会员姓名：" prop="name">
				<el-input v-model="params.infor.name" disabled ></el-input>
			</el-form-item>
			<el-form-item label="身份证号：" prop="identityId">
				<el-input v-model="params.infor.identityId" disabled ></el-input>
			</el-form-item>
				
		
		</div>
	</div>
</el-form>
</div>	
</template>

<script>
import http from "@/utils/http.js";
import URL from "@/utils/url.js";
import common from "@/utils/common.js";
import validation from "@/utils/validation.js";

	export default {
		data() {
			return {
				params: {		
					infor:{},
		},
		}
		},
		props: {
           param: {
          default: function() {
          return {  }
        }
      }
   },
    methods: {
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.MEMBER_DETAIL;
				let msg = {
					id: _self.param.memberId,
				
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					
					let result = res.body.data;
					if(result.birth){
						result.birth=validation.formatDatefor(Number(result.birth),'yyyy-mm-dd')
					}
					
					console.log(result.birth)
					if(result.gender==1){
						result.gender="男"
					}else if(result.gender==2){
						result.gender="女"
					}
					_self.params.infor = result;
					
				}, function(res) {})
			},
	
	},
		created() {
			let _self = this;
			_self.loadMessage()
			console.log(_self.param.memberId)
			
		}
	};
</script>

<style lang="less" scoped>
.orderDetail{
	padding-bottom: 30px;
	.el-input{
		width: 190px;
	}
	.content{
		text-align: right;
	}
	.firstpart{
		 
		    padding-right: 100px;
	        color: #444444;
			display: flex;
			justify-content: space-between;
		    line-height: 30px;
			text-align: left;
			font-size: 12px;
		.leftpart{
		
			margin-left:3px;
			.img{
				width: 48px;
				height: 48px;
				margin-top: -5px;
				margin-left: 20px;
				margin-bottom: 10px;
			}
		}
		.rightpart{
		
			margin-right: 100px;
		}
		
		
	}
	
	
}
</style>