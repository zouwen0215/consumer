<template>
	<div class="box" @click="cancel()">
		<div class="Absolute-Center">
				<img :src="imgUrl"/>
		</div>
	</div>

	<!--
    	作者：361789874@qq.com
    	时间：2017-12-14
    	描述：
    	用法：
    	this.$msgBox.showMsgBox({
						title: '温馨提示',
						content: '请下载App后，在App内查看',
						isShowCancelBtn: true,
						isShowCancelImg: '/static/icon/list/miao1.png',
					}).then(async(val) => {
						this.loadApp
					}).catch(() => {
						// ...
					});
    -->
</template>

<script>
	export default {
		props: {
			imgUrl: '/static/icon/list/miao1.png',
		},
		data() {
			return {
				isShowMessageBox: false,
				resolve: '',
				reject: '',
				promise: '' // 保存promise对象
			};
		},
		methods: {
			// 确定,将promise断定为resolve状态
			confirm: function() {
				this.isShowMessageBox = false;
				if(this.isShowInput) {
					this.resolve(this.inputValue);
				} else {
					this.resolve('confirm');
				}
				this.remove();
			},
			// 取消,将promise断定为reject状态
			cancel: function() {
				this.isShowMessageBox = false;
				this.reject('cancel');
				this.remove();
			},
			// 弹出messageBox,并创建promise对象
			showMsgBox: function() {
				this.isShowMessageBox = true;
				this.promise = new Promise((resolve, reject) => {
					this.resolve = resolve;
					this.reject = reject;
				});
				// 返回promise对象
				return this.promise;
			},
			remove: function() {
				setTimeout(() => {
					this.destroy();
				}, 0);
			},
			destroy: function() {
				this.$destroy();
				document.body.removeChild(this.$el);
			}
		},
		created(){
			
		}
	};
</script>

<style lang="less" scoped>
	.box {
		position: fixed;
		z-index: 10000000000;
		top: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, .3);
		margin: 0 auto;
	}
	
	.Absolute-Center {
		width:600px;
		height: 650px;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		overflow-y: auto;
		
		img{
			width: 100%;
		}
	}
	
	.cancel {
		width: 24px;
		height: 24px;
		position: absolute;
		right: -10px;
		background: #fff;
		top: -10px;
		z-index: 10;
		text-align: center;
		border-radius: 50px;
		background-size: 100% 100%;
	}
</style>