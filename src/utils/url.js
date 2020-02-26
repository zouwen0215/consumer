export default {
	PROJECT: {
		AUTH: "/api",
		SCORE: "/ct_opc",
	},
	PORTNAME: {
		//获取公告详情
		NOTICE_DETAIL: "/notice/getinfo/{noticeId}",
		//公告列表查询接口
		NOTICE_LIST: "/notice/list/query_{id};context={context};title={title}?pageNum={pageNum}&pageSize={pageSize}",

		//删除公告
		DELETE_NOTICE: "/notice/delete/{noticeId}",
		//新增公告
		ADD_NOTICE: "/notice/put",
		//公告修改
		MODIFY_NOTICE: "/notice/update",
		//banner列表查询接口
		BANNER_LIST: "/banner/list/query_{id}?pageNum={pageNum}&pageSize={pageSize}",
		//获取banner详情
		BANNER_DETAIL: "/banner/getinfo/{bannerId}",
		//banner修改
		BANNER_MODIFY: "/banner/update",
		//新增banner
		ADD_BANNER: "/banner/put",
		//删除banner
		//积分清零
		CLEARSCORES_GET: "/shop/black/{shopId}/clear",
		//加入黑名单
		ADD_BLACKLIST: "/shop/black/put",
		//查询零售户列表（黑名单）
		BLACKLIST_GETINFO: "/shop/list/query_{id};shopName={shopName};licenseCode={licenseCode};blackFlag={blackFlag};areaCode={areaCode};gridCode={gridCode};startTime={startTime};endTime={endTime}?pageNum={pageNum}&pageSize={pageSize}",
		//移出黑名单
		DELETE_BLACKLIST: "/shop/black/{shopId}/remove",
		//查看原因
		GET_BLACKLIST_INFO: "/shop/black/{shopId}",
		//商品上下架
		SHOPS_UPPER_LOWER: "/goods/upOrDown/{id}",
		//积分总数据（获取，消耗，剩余，零售户）
		INTEGRAL_TOTAL_DETAIL: "/statistics/points/statistic/query_{id};areaCode={areaCode};gridCode={gridCode};level={level};startTime={startTime};endTime={endTime}",
		//积分获取，消耗，剩余排行榜
		INTEGRAL_DETAIL_LIST: "/statistics/points/query_{id};areaCode={areaCode};gridCode={gridCode};level={level};startTime={startTime};endTime={endTime}?pageSize={pageSize}&pageNum={pageNum}",
		//积分规则获得，商品兑换饼图
		GETPIE_INTEGRAL_DETAIL: "/statistics/points/circle/{type}/query_{id};areaCode={areaCode};gridCode={gridCode};level={level};startTime={startTime};endTime={endTime}",
		//获取token
		GET_TOKENS: "/login/get/token",
		//登录
		LOGIN_NEW: "/login",
		//角色启用停用接口
		ROLE_STOP_USESLIST: "/role/isstop/{roleId}/{state}",
		//用户修改密码接口
		MODIFY_PASSWORD_USE: "/user/update/password/{password}",
		//查询角色信息
		SELECT_ROLE_LISTCONFIG: "/role/{roleId}",
		//获取会员管理列表
		MEMBER_LIST: "/member/list/query_{id};nickname={nickname};mobile={mobile};source={source}?pageNum={pageNum}&pageSize={pageSize}",
		//获取会员详情
		MEMBER_DETAIL: "/member/getinfo/{id}",
		//商品列表
		GOODS_LIST: "/goods/list/query_{id};status={status};goodsSrcDictId={goodsSrcDictId};name={name}?pageNum={pageNum}&pageSize={pageSize}",
		//获取商品信息详情接口
		GOODS_DETAIL: "/goods/getinfo/{id}",
		//删除商品
		GOODS_DELETE: "/goods/delete/{id}",
		//修改商品信息接口
		MODIFY_GOOD: "/goods/update",
		//新建商品
		CREATE_GOOD:"/goods/put",
		//商品来源接口
		GOODS_SRCDICT: "/goods/goodsSrcDict/list",
		//美胜商品列表
		MEISHENG_GOOD: "/msgoods/list/query_{id};goodsProductName={goodsProductName}?pageNum={pageNum}&pageSize={pageSize}",
		//美胜商品加入积分商城
		ADD_SHOP: "/msgoods/put",

		//商品上下架
		UPDOWN_GOOD: "/goods/upOrDown/{id}",
		//获取积分通用信息
		MEMBER_SCORE: "/pointRuleNormal/getinfo/{type}",
		//保存积分通用信息接口
		SAVE_MEMBERSCORE: "/pointRuleNormal/put",
		//积分规则列表查询
		SCORERULE_LIST: "/rule/{type}/list/query_{id}?pageNum={pageNum}&pageSize={pageSize}",
		//保存积分规则信息
		RULE_SAVE: "/rule/put",
		//获取卷烟及品牌信息（规则设置）
		SMOKE_LIST: "/smoke/{type}/list/query_{id};name={name}",
		//订单列表
		ORDER_LIST: "/exchangeorder/list/query_{id};orderNO={orderNO};customerPhone={customerPhone};memberPhone={memberPhone}?pageNum={pageNum}&pageSize={pageSize}",
		//订单详情
		ORDER_DETAIL: "/exchangeorder/getinfo/{id}",
		//删除规则
		RULE_DELETE: "/rule/delete/{id}",
		//编辑规则
		MODIFY_DELETE: "/rule/update",
		//规则详情
		RULE_DETAIL: "/rule/getinfo/{id}",
		//获取规则描述信息
		RULE_INFODETAIL:"/pointRuleMessage/getinfo",
		//保存规则描述信息
		SAVE_RULECONTENT:"/pointRuleMessage/put",
		//物流信息
		EXCHANGE_INFO: "/exchangeorder/getexpressInfo/{orderNo}",
		//台卡列表
		TABLECARD_LIST: "/shopcard/list/query_{id};isStop={isStop};beginTime={beginTime};endTime={endTime};shopNameOrCode={shopNameOrCode}?pageNum={pageNum}&pageSize={pageSize}",
		//单个台卡下载
		DOWNLOAD_SINGLE: "/shopcard/{shopId}/download/{type}",
		//批量台卡下载
		DOWNLOAD_MULTI: "/shopcard/batch/download/{type}",
		//新增公告
		NOTICE_ADD: "/notice/put",
		//删除公告
		NOTICE_DELETE: "/notice/delete/{noticeId}",
		//公告列表查询接口
		NOTICE_LIST: "/notice/list/query_{id}?pageNum={pageNum}&pageSize={pageSize}",
		//获取公告详情
		NOTICE_DETAIL: "/notice/getinfo/{noticeId}",
		//公告修改
		NOTICE_UPDATE: "/notice/update",
		//修改公告状态
		UPDATE_NOTICESTATE: "/notice/{status}/{noticeId}",
		//活动列表
		ACTIVITIES_LIST: "/activity/list/query_{id};type={type};status={status}?pageNum={pageNum}&pageSize={pageSize}",
		//新增活动接口
		ACTIVITIES_ADD: "/activity/{type}/put",
		//删除活动 
		ACTIVITIES_DELETE: "/activity/delete/{id}",
		//编辑活动 
		ACTIVITIES_EDIT: "/activity/{type}/update",
		//获取活动详情
		ACTIVITIES_GET: "/activity/getinfo/{id}",
		//转发图或分享图列表接口
		SHARE_LIST:"/share/{type}/list/query_{id}?pageNum={pageNum}&pageSize={pageSize}",
		//转发图或分享图保存
		SHARE_SAVE:"/share/{type}/put",
		//修改转发图或分享图接口
		SHARE_MODIFY:"/share/{type}/update/{id}",
		//删除转发图或分享图
		SHARE_DELETE:"/share/{type}/delete/{id}",
		//修改转发图或分享图状态
		SHARE_MODIFYSTATE:"/share/{type}/update/status/{id}",
		//获取转发图或分享图详情
		SHARE_DETAIL:"/share/{type}/getinfo/{id}",
		//修改密码
		PASSWARD_EDIT:"/user/update/password/{password}",
		//banner保存
		BANNER_ADD:"/banner/put",
		//banner修改
		BANNER_EDIT:"/banner/update",
		//获取banner详情
		BANNER_DETAIL:"/banner/getinfo/{bannerId}",
		//banner列表查询接口
		BANNER_LIST:"/banner/list/query_{id}?pageNum={pageNum}&pageSize={pageSize}",
		//修改banner状态
		BANNER_SRATE:"/banner/{status}/{bannerId}",
		//删除banner
		BANNER_DELETE:"/banner/delete/{bannerId}",
		//公告下拉列表接口
		NOTICE_SELECT:"/notice/list/{status}",
		//活动-下拉列表
		ACTIVITY_SELECT:"/activity/select/{status}",
		//查询用户列表
		GET_USERLIST_PRIVILEGE:"/user/list/query_{id};userName={userName};cnName={cnName};isStop={isStop}?pageNum={pageNum}&pageSize={pageSize}",
		//查询角色列表
		SELECT_ROLE_LIST:"/role/list/query_{id};roleName={roleName};isStop={isStop}?pageNum={pageNum}&pageSize={pageSize}",
		//角色启用停用接口
		ROLE_STOP_USESLIST:"/role/isstop/{roleId}/{state}",
		//用户停用启用接口
		USER_USER_NOT:"/user/isstop/{userId}/{state}",
		//用户初始化密码
		RESET_PASSWORD:"/user/init/password/{userId}/{password}",
		//用户修改密码接口
		MODIFY_PASSWORD_USE:"/update/password/{password}",
		//新增角色
		ADD_ROLES_LIST:"/role",
		//添加用户接口
		ADD_USER:"/user/put",
		//用户修改
		UPDATE_USER:"/user/update",
		
		
		//统计中心```````````````````````````````````````````````````````
		//今日获得+消耗积分
		TODAY_SCORE:"/point/current/count",
		//日统计概况（获得积分+消耗积分）
		DALIY_SCORE:"/point/day/{type}/collect?startTime={startTime}&&endTime={endTime}",
		//总获取积分+总消耗积分（数值统计）
		SUM_SCORE:"/point/sum/{type}/count",
		//总获取积分+总消耗积分
		PIE_SCORE:"/point/total/{type}/count",
		//积分明细列表
		SCORE_DETAILS:"/point/detail/list/query_{id};memberId={memberId};mobile={mobile};type={type};startTime={startTime};endTime={endTime}?pageSize={pageSize}&pageNum={pageNum}",
		//商品统计列表
		GOODS_STATISTICS:"/statistics/goods/list/query_{id};status={status};goodsSrcDictId={goodsSrcDictId};name={name};startTime={startTime};endTime={endTime}?pageSize={pageSize}&pageNum={pageNum}",
	   //商品统计列表导出
	   GOODSSTITISTICS_EXPORT:"/statistics/goods/list/export/query_{id};status={status};goodsSrcDictId={goodsSrcDictId};name={name};startTime={startTime};endTime={endTime}",
	   //详情-商品统计
	   GOODS_DETAILS:"/statistics/goods/detail/{goodId}/list/query_{id};startTime={startTime};endTime={endTime}?pageSize={pageSize}&pageNum={pageNum}",
	   //详情-商品统计-导出
	    GOODSDETAILS_EXPORT:"/statistics/goods/detail/export/{id}?startTime={startTime}&&endTime={endTime}",
	   //会员（今日新增+近七日+累计会员）
	    MEMBER_TOTAL:"/statistics/member/home/count",
	   //新增+下单+累计会员
	    LINE_MEMBER:"/statistics/member/line/count/{type}?startTime={startTime}&&endTime={endTime}",
	   //会员分布
	    MEMBER_AREA:"/statistics/member/area/number",
	   //会员分析（年龄端+性别+资料完善）
	    MEMBER_INFO:"/statistics/member/infor/{type}",
	
	
	
	}
}