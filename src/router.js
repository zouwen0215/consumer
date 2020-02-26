import Vue from 'vue'
import Router from 'vue-router'
import home from '@/view/plugin/home'

Vue.use(Router)

export default new Router({
	routes: [
		{ path: '/404', name: '404', component: () => import('@/view/login/404'), },
		{ path: '/login', name: 'login', component: () => import('@/view/login'), },
		{ path: '*', redirect: { path: '/404' } },
		{
			path: '/',
			name: '管理',
			component: home,
			children: [
				{ path: '/dashboard', name: '首页', component: () => import('@/view/index') },
				/*{path: '/test',name: '测试',component: () => import('@/view/test')},*/
				
				{ path: '/shopsList', name: '黑名单列表', component: () => import('@/view/shopsManage/shopsList') },
				{ path: '/blackList', name: '黑名单列表', component: () => import('@/view/rewardPunishManage/blackList') },
				{ path: '/userPrivilege', name: '用户权限列表', component: () => import('@/view/userManage/userPrivilege') },
				{ path: '/roleList', name: '用户权限列表', component: () => import('@/view/userManage/roleList') },
				{ path: '/modifyPwd', name: '修改密码', component: () => import('@/view/login/modifyPwd') },
				{ path: '/orderManage', name: '订单管理', component: () => import('@/view/orderManage/orderManage') },
				{ path: '/memberManage', name: '会员管理', component: () => import('@/view/memberManage/memberManage') },
				{ path: '/activitiesManage', name: '活动管理', component: () => import('@/view/activitiesManage/activitiesManage') },
				{ path: '/tabelCard', name: '台卡管理', component: () => import('@/view/tabelCard/tabelCard') },
				{ path: '/setscoreRulesSet', name: '积分规则', component: () => import('@/view/setscoreRules/setscoreRulesSet') },
				{ path: '/bannerSet', name: 'banner设置', component: () => import('@/view/setManage/bannerSet') },
				{ path: '/noticeSet', name: '公告设置', component: () => import('@/view/setManage/noticeSet') },
				{ path: '/scoreruleShow', name: '积分规则展示', component: () => import('@/view/setManage/scoreruleShow') },
				{ path: '/shareSet', name: '分享图设置', component: () => import('@/view/setManage/shareSet') },
				{ path: '/transmitSet', name: '转发图设置', component: () => import('@/view/setManage/transmitSet') },
			    { path: '/userPrivilege', name: '用户权限列表', component: () => import('@/view/userManage/userPrivilege') },
				{ path: '/roleList', name: '角色权限列表', component: () => import('@/view/userManage/roleList') },
				{ path: '/scoreStatistics', name: '积分统计', component: () => import('@/view/dataCenter/scoreStatistics') },
				{ path: '/scoreDetails', name: '积分明细', component: () => import('@/view/dataCenter/scoreDetails') },
			    { path: '/goodsStatistics', name: '商品统计', component: () => import('@/view/dataCenter/goodsStatistics') },
				{ path: '/memberStatistics', name: '商品详情', component: () => import('@/view/dataCenter/memberStatistics') },
				{ path: '/goodDetails', name: '会员统计', component: () => import('@/view/dataCenter/goodDetails') },
		      
				
				
			]
		},
	]
})
