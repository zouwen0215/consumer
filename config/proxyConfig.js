module.exports = {
	proxyList: {
		'/api': {
			// 测试环境
			target: 'http://wx.junfengtech.com.cn',
			changeOrigin: true,
		},
		'/ct_opc': {
			// 测试环境
			target: 'http://wx.junfengtech.com.cn',
			changeOrigin: true,
		},
//		'/pt_opc': {
//			// 测试环境
//			target: 'http://192.168.199.254:13020',
//			changeOrigin: true,
//		},
		
		
	}
}