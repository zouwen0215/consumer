import router from '../router'
import store from '../store'
import Vue from 'vue'

//鉴权路由拦截TokenKey(导航守卫)
const whiteList = ['/login', '/404', '/test'] // 不重定向白名单
router.beforeEach((to, from, next) => {
	//	console.error('willGo', to)
	store.commit('goto', getMessage(to.path, store.state.user.menu)); //自动匹配菜单
	//	console.log(getMessage(to.path, store.state.user.menu))
	let status = store.state.user.status;
	if(status) {

		if(to.path == '/login' || to.path == '/') {
			next({
				path: '/dashboard'
			})
		} else {

			if(whiteList.indexOf(to.path) == -1) {
				store.commit('history', to)
			}

			next();
		}
	} else {
		if(whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入)
			next()
		} else {
			next({
				path: '/login'
			})
		}
	}
	//next();
});

function getMessage(path, arr) {
	let goto = {};
	if(arr.length){
		arr[0].children.forEach(function(o1, i1, a1) {
		if(o1.href == path) {
			goto.first = 0;
			goto.second = i1
		}
		a1[i1].children.forEach(function(o2, i2, a2) {
			if(o2.href == path) {
				goto.first = 0;
				goto.second = i1 + '-' + i2;
			}
			a2[i2].children.forEach(function(o3, i3, a3) {
				if(o3.href == path) {
					goto.first = 0;
					goto.second = i1 + '-' + i2 + '-' + i3;
				}

			})
		})
	})
	}
	
	return goto;
	
	//	if(arr.length) {
	//		for (let key in arr`) {
	//			if(arr[key].href == to.path){
	//				
	//			}
	//		}

	//		for(let i = 0; i < arr.length; i++) {
	//			if(JSON.stringify(arr[i]).indexOf(to.path) >= 0) {
	//				goto.first = i
	//				if(arr[i].children.length <= 0) {} else {
	//					for(let j = 0; j < arr[i].children.length; j++) {
	//						if(JSON.stringify(arr[i].children[j]).indexOf(to.path) >= 0) {
	//							if(arr[i].children[j].children.length <= 0) {
	//								goto.second = j;
	//							} else {
	//								for(let k = 0; k < arr[i].children[j].children.length; k++) {
	//									if(JSON.stringify(arr[i].children[j].children[k]).indexOf(to.path) >= 0) {
	//										goto.second = j + '-' + k;
	//									}
	//								}
	//							}
	//						}
	//					}
	//				}
	//			}
	//		}
	//}
	//return goto;
}