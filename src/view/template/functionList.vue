<template>
	<div class="functionList">
		<ul class="list">
			<li v-for="(item,index) in funcMenus" @click="item.callback" :key="index">{{item.label}}</li>
			
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		props: {
			funcMenus: {}
		},
		components: {

		},
		methods: {
		},
		created() {

		}
	}
</script>

<style lang="less" scoped>
	.functionList {
		.list {
			text-align: center;
			padding: 0 40px;
			li {
				cursor: pointer;
				list-style: none;
				display: block;
				margin-bottom: 10px;
				line-height: 30px;
				border: 1px solid rgba(0, 0, 0, .1);
				border-radius: 5px;
				&:hover {
					background-color: #A0CFFF;
					color: #fff;
					border: 1px solid rgba(250, 250, 250, .1);
				}
			}
		}
	}
</style>