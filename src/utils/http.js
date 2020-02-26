import Vue from 'vue'
import store from '@/store';
import router from '@/router'
import { Loading } from 'element-ui';

let http = new Vue({
	data: {
		imgUrl: "http://img.junfengtech.com.cn/img/",
		imgHref: "http://img.junfengtech.com.cn/upimg",
	},

	methods: {
		filterUrl(data, url) {
			for(let key in data) {
				let keys = "{" + key + "}";
				url = url.replace(keys, data[key])
			}
			return url;
		},
		publicRequest(method, url, body, sucFunc, errFunc, loading) {
			let _self = this;
			let loadingInstance = Loading.service();
			_self.$http({
					method: method,
					url: url,
					body: body,
					responseType: loading == 'blob' ? 'blob' : '',
					timeout: 10000, //设置超时时间
					headers: {
						Authorization: 'Bearer ' + window.sessionStorage.getItem('tokenString'),
					}
				})
				.then((suc) => {
					loadingInstance.close();
					if(suc.data.errorCode == '0') {
						sucFunc(suc);
					} else {
						
						errFunc(suc);
						
						if(loading == 'blob') {

						} else {
							_self.$message({
								showClose: true,
								type: 'error',
								message: suc.data.errorMessage
							});
						}
						if(suc.body.errorMessage && suc.body.errorMessage.indexOf('token')>=0 ){		
							store.commit('loggedOut')
//							window.sessionStorage.setItem('vuex-along','');
//							setTimeout(function(){
//								router.push('/login')
//							},1000)
						}

					}
				}, (res) => {
					loadingInstance.close();
					errFunc(suc);
					_self.$message({
						showClose: true,
						message: "接口正在维护，请稍候...",
						type: 'error'
					});
				});
		},

	},
})

export default http;