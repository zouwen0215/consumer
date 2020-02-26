import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
Vue.use(Vuex)

import vuexAlong from 'vuex-along'
vuexAlong.watchSession([], false);
vuexAlong.onlySession (true);

export default new Vuex.Store({
	modules: {
		user: user,
	},
	plugins :[vuexAlong]
})