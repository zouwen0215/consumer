<template>
	<div class="dashboard">
		<div>
			<p class="title">
				<img src="../../static/index/scgl-tit.png" alt>
			</p>
			<div class="list">
				<span v-for="(item,index) in 3">
				<img ref="img"  :key="index" :src="'./static/index/jcgl'+(index+1)+'.png'" @click="routerTo('img',index)" alt v-on:mouseover="mouseover('img',index)" v-on:mouseout="mouseout('img',index)">
					<img v-if="index<2" class="jtt" src="../../static/index/jtt.png"/>
				</span>

				
			</div>
			<!--<p class="border"></p>
			<p class="title mt50">
				<img src="../../static/index/jcgl-tit.png" alt>
			</p>
			<div class="list1">
				<img ref="img2" v-for="(item,index) in 3" :key="index" :src="'./static/index/scgl'+(index+1)+'.png'" alt @click="routerTo('img2',index)" v-on:mouseover="mouseover('img2',index)" v-on:mouseout="mouseout('img2',index)">
			</div>-->
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				img: ["/setscoreRulesSet", "/shopsList", "/activitiesManage"],
				img2: ["/rewardPunishManage", "/blackList", "/rewordsCount"]
			};
		},
		methods: {
			mouseover(ref, index) {
				this.$refs[ref][index].src =
					this.$refs[ref][index].src.split(".png")[0] + "_hover.png";
			},
			mouseout(ref, index) {
				this.$refs[ref][index].src =
					this.$refs[ref][index].src.split("_hover")[0] + ".png";
			},
			routerTo(ref, index) {
				let _self = this;
				let url = _self[ref][index];
				_self.$router.push(url);
			}
		},
		created() {}
	};
</script>

<style lang="less" scoped>
	.dashboard {
		height: 85vh;
		text-align: left;
		background-color: #fff;
		padding: 10px;
		.border {
			border-top: 1px solid #fff;
		}
		.list {
			margin: 50px 0 50px 30px;
			.jtt{
				width: 60px;
			}
			img {
				margin-right: 10px;
				width: 158px;
				cursor: pointer;
			}
		}
		
		.list1 {
			margin: 50px 0 50px 30px;
			.jtt{
				width: 60px;
			}
			img {
				margin-right: 80px;
				width: 158px;
				cursor: pointer;
			}
		}
	}
</style>