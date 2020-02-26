import router from '@/router.js'
import path from '@/assets/json/path.json'
import http from '@/utils/http.js'
import URL from '@/utils/url.js'

const state = {
	status: false, //登陆
	tempData: {},
	tokenString: '', // tokenString
	menu: [],
	level: [],
	userInfor: {},
	history: [],
	choose: {
		first: '0',
		second: '0'
	},

	LoginedUser: {

		history: [],
		nav: {
			choose: {
				first: '0',
				second: '0',
				total: {},
			},
			path: [],
		},

	}
};
const getters = {
	not_show(state) { //这里的state对应着上面这个state
		return !state.status;
	}
};
const mutations = {
	managementLogin(state, body) { //这里的state对应着上面这个state
		let _self = this;
		state.userInfor = {};
		let limits = "[1000,999,1,21,3,4,51,52,53,54,6,7,81,82,83,84,85,9,10,101,102]";
		let menu = JSON.parse(JSON.stringify(path.menu));
		set(menu, [1000,999,1,21,3,4,51,52,53,54,6,7,81,82,83,84,85,9,10,101,102]);
		del(menu);
		state.menu = JSON.parse(JSON.stringify(menu[0].children).replace(/label/g, 'title'));
		state.status = true;
   		console.log(state.menu)
   		router.push(firstPage(state.menu));
		
//		let url = URL.PROJECT.SCORE + URL.PORTNAME.LOGIN_NEW;
//		http.publicRequest('post', url, body, function(res) {
//			state.userInfor = res.body.data;
//			console.log(state.userInfor )
//			let roleId = state.userInfor.roleId;
//			menuGet(roleId, function(val) {
//				console.log(val)
//				let limits = JSON.parse(val);
//				let menu = JSON.parse(JSON.stringify(path.menu));
//				set(menu, limits);
//				del(menu);
//				state.menu = JSON.parse(JSON.stringify(menu[0].children).replace(/label/g, 'title'));
//				state.status = true;
// 				console.log(state.menu)
// 				router.push(firstPage(state.menu));
//			});
//		}, function(res) {
//
//		})
      
		//你还可以在这里执行其他的操作改变state
	},
	saveLevel(state, param) {
		state.level = param;
		console.log(param)
	},
	loggedOut(state) {
		state.status = false;
		state.choose.first = "0";
		state.choose.second = "0";
		state.userInfor = {};
		state.history = [];
		router.push('/login');
	},
	chooseType(state, param) {
		let menu = state.menu;
		if(menu[param].children.length) {
			if(menu[param].children[0].children.length == 0) {
				state.choose.second = '0';
				router.push('.' + menu[param].children[Number(state.choose.second)].href);
			} else {
				state.choose.second = '0-0';
				router.push('.' + menu[param].children[Number(state.choose.second.split('-')[0])].children[Number(state.choose.second.split('-')[1])].href);

			}

		} else {
			console.log(menu[param].href)
			router.push('.' + menu[param].href);
		}
		state.choose.first = param;

	},
	handleList(state, param) {
		state.choose.second = param[0];
		router.push('.' + param[1].href)

	},
	routerCheck(state, param) {
		state.choose.first = param.first;
		state.choose.second = param.second;
		router.push('.' + param.href)
	},
	goto(state, param) {
		if(param.first >= 0) {
			console.warn('我明明执行了')
			state.choose.first = param.first;
			state.choose.second = param.second;
		}

	},
	history(state, params) {
		let pageInfor = {
			title: params.name,
			path: params.path
		}
		state.history.unshift(pageInfor)
	},

	tempData(state, obj) {
		console.log("obj", state)
		state.tempData[obj.name] = obj.param;

	}
};
const actions = {
	login(context) { //这里的context和我们使用的$store拥有相同的对象和方法
		console.log(context)
		//		context.commit('switch_dialog');

		//你还可以在这里触发其他的mutations方法
	},
};

function firstPage(menu) {
	let datas = ""
	if(menu[0].children.length) {
		datas = firstPage(menu[0].children)
	} else {
		datas = menu[0].href
	}
	return datas

}

function set(TreeViewNodeTmp, ids) {
	var isChildCheck = false;
	for(var i in TreeViewNodeTmp) {
		if(TreeViewNodeTmp[i].children.length) {
			if(set(TreeViewNodeTmp[i].children, ids)) {
				TreeViewNodeTmp[i].check = true;
				isChildCheck = true;
			} else {
				TreeViewNodeTmp[i].check = false;
			}
		} else {
			let has = false;
			ids.forEach(function(obj,index){
				if(obj == TreeViewNodeTmp[i].id){
					has = true;
				}
			})
			if(has) {
				TreeViewNodeTmp[i].check = true;
				isChildCheck = true;
			} else {
				TreeViewNodeTmp[i].check = false;
			}
		}
	}
	if(isChildCheck) {
		return true;
	} else {
		return false;
	}

}

function del(TreeViewNodeTmp) {
	for(var i = 0; i < TreeViewNodeTmp.length; i++) {
		if(TreeViewNodeTmp[i].check) {
			del(TreeViewNodeTmp[i].children);
		} else {
			TreeViewNodeTmp.splice(i, 1)
			i--;
		}

	}
}

//function menuGet(roleId, getMenu) {
//	let url = URL.PROJECT.SCORE + URL.PORTNAME.SELECT_ROLE_LISTCONFIG;
//	let data = {
//		//		systemCode: "channelsystem",
//		//		token: tokenString,
//		roleId: roleId,
//	};
//	url = http.filterUrl(data, url);
//	http.publicRequest("get", url, '', function(res) {
//		let result = res.body.data;
//
//		getMenu(result.config);
//	}, function(res) {
//
//	})
//}
//
//function userInforGet(tokenString, getUserInfor) {
//	let url = URL.ENGIN.LOGIN + URL.PORT.LOGIN_INFOR;
//	let data = {
//		token: tokenString,
//	};
//	url = http.filterUrl(data, url);
//	let params = {
//		auth: true,
//		tips: false,
//		loading: true,
//	}
//	http.publicRequest("get", url, '', function(res) {
//		let result = res.body.data;
//		result.channelId = JSON.parse(result.description).channelId;
//		getUserInfor(result)
//		//		state.userInfor = result;
//		//		router.push('/dashboard');
//	}, function(res) {
//
//	})
//}

export default {
	state,
	getters,
	actions,
	mutations,
}