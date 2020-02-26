<template>
<div class="orderDetail">
	<div class="firstpart">
		<div class="leftpart">
			<p>订单号：<span class="bold">{{params.infor.orderNO}}</span></p>
			<p>订单时间：<span class="bold">{{params.infor.createTime}}</span></p>
			<p>会员手机号：<span class="bold">{{params.infor.memberPhone}}</span></p>
			<p>订单价值：<span class="bold">{{params.infor.points}}</span></p>
		</div>
		<div class="rightpart">
			<p>收货人：<span class="bold">{{params.infor.customerName}}</span></p>
			<p>收货人手机号：<span class="bold">{{params.infor.customerPhone}}</span></p>
			<p>收货地址：<span class="bold">{{params.infor.address}}</span></p>	
		</div>
	
	</div>
	<div class="secondpart">
		<el-table :data="params.inforlist" border style="width: 100%">
					<el-table-column prop="goodsName" label="商品名称" width="280px"></el-table-column>
					<el-table-column prop="goodsType" label="商品属性"></el-table-column>
					<el-table-column prop="goodsSrcDictId" label="商品来源"></el-table-column>
					<el-table-column prop="points" label="商品积分值">
					</el-table-column>
					<el-table-column prop="goodsNum" label="商品数量"></el-table-column>
		</el-table>
	</div>
	<div class="thirdpart">
		<div class="title">
		<img src="../../../../static/index/chewu.png"/>
			<p style="margin-left: 10px;">物流详情</p>
		</div>
		<div class="information" style="margin-top: 10px;line-height: 20px;">
			<div   v-for="item in params.inforExchange">
				<p >{{item.time}}</p>
				<p style="margin-left: 20px;">{{item.context}}</p>
				
			</div>
			<p style="text-align: left;">...</p>
			
		</div>
	</div>
	
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
					inforlist:[],
					infor:{},
					inforExchange:[]
		},
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
			loadMessage() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.ORDER_DETAIL;
				let msg = {
					id: _self.param.orderdetail.id,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					let result = res.body.data;
					_self.params.infor = result;
					let arr={};
				
					arr={
						id:_self.params.id,
						goodsName:_self.params.infor.goodsName,
						goodsType:_self.params.infor.goodsType==0?'实物':'虚拟',
						goodsSrcDictId:'美胜商品',
						points:_self.params.infor.points,
						goodsNum:_self.params.infor.goodsNum,
					};
					_self.params.inforlist.push(arr)
				}, function(res) {})
			},
			loadExchange() {
				let _self = this;
				let search = _self.params.search;
				let pagination = _self.params.pagination;
				let url = URL.PROJECT.SCORE + URL.PORTNAME.EXCHANGE_INFO;
				//console.log("111111111111",this.param.orderdetail.orderNO)
				let msg = {
					orderNo:_self.param.orderdetail.orderNO,
				};
				url = http.filterUrl(msg, url);
				let params = http.params;
				http.publicRequest('get', url, '', function(res) {
					let result = res.body.data;
					_self.params.inforExchange =JSON.parse(result.content)  ;
					console.log(_self.params.inforExchange)
				
				}, function(res) {})
			},


		},
		created() {
			//console.log("111111111111",this.param.orderdetail.orderNO)
			this.loadMessage()
			this.loadExchange()
		}
	};
</script>

<style lang="less" scoped>
.orderDetail{
	padding-bottom: 30px;
	.firstpart{
		 
	        color: #444444;
			display: flex;
		    line-height: 27px;
			text-align: left;
			font-size: 12px;
			
			.bold{
				font-weight:700;
			}
		.leftpart{
			word-wrap:break-word ;
			width: 35%;
			padding-right: 15px;
			margin-left:3px;
			border-right: 1px dotted #BBBBBB;
		}
		.rightpart{
			width: 28%;
			word-wrap:break-word ;
			padding-right: 15px;
			margin-left: 20px;
			/*border-right: 1px dotted #BBBBBB;*/
		}
		
		
	}
	.secondpart{
		margin-top: 10px;
	}
	.thirdpart{
		
		.title{
			margin-top:20px;
			display: flex;
			padding-bottom: 10px;
			border-bottom: 1px dashed #CCCCCC;
			p{
			font-size: 16px;	
			}
		}
		.information{
		&>div{
			display: flex;
				p{
				text-align: left;
			font-size: 12px;
			line-height: 25px;
			}
		}
		
		
		}
	}
}
</style>