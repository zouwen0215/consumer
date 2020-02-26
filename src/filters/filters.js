/*-------公用方法，供下面的过滤器调用--------*/
//从对象obj中提取属性key对应的值，如果没有则返回默认值
export function commonRet( key ,obj) {
	if(key == undefined) {
		key = "undefined";
	}
	let result = obj[key.toString()];
	return result ? result : obj["default_value"];
}

export function timestampToTime(timestamp) {
	var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate()<10?'0'+  (date.getDate() ) :date.getDate() )+ ' ';
	var h = (date.getHours()+1<10?'0'+  (date.getHours() + 1) :date.getHours() + 1) + ':';
	var m = (date.getMinutes()+1<10?'0'+  (date.getMinutes() + 1) :date.getMinutes() + 1)  + ':';
	var s = (date.getSeconds()+1<10?'0'+  (date.getSeconds() + 1) :date.getSeconds() + 1) ;
	return Y + M + D + h + m + s;
}

function hourFilter(obj) {
	let day = parseInt(obj / 24) + '天';
	let hour = '0时';
	let minute = '0分'
	let second = '0秒'
	let num = obj / 24;
	if(String(num).indexOf('.') > 0) {
		num = Number('0.' + num.toString().split('.')[1]) * 24;
		hour = num.toString().split('.')[0] + '小时';
		if(String(num).indexOf('.') > 0) {
			num = Number('0.' + num.toString().split('.')[1]) * 60;
			minute = num.toString().split('.')[0] + '分';
			if(String(num).indexOf('.') > 0) {
				num = Number('0.' + num.toString().split('.')[1]) * 60;
				second = num.toString().split('.')[0] + '秒'
			}
		}
	}
	return day + hour + minute + second;
}

//服务类型
export function serviceType(value) {
	let obj = {
		"bar": "柜台型",
		"table": "桌台型",
		"retail": "零售型",
		"all": "全部",
		"default_value": "未知状态"
	};
	return commonRet(value,obj);
}

// 停用状态
export function discount(value) {
	value = value?value==1?'不打折': value *10 + "折":"";
	return value;
}

// 停用状态
export function isStop(value) {
	let obj = {
		true: '已启用',
		false: '已停用',
		"default_value": "未知状态"
	};
	return commonRet(value,obj);
}
export function qrState(value) {
	let data = "";
	let obj = {
		0: '未使用',
		1: '已使用',
		"default_value": "没有台卡"
	};
	return commonRet(value,obj);
}

//

export function sex(value) {
	let obj = {
		1: "男",
		2: "女",
		"default_value": "未知"
	};
	return commonRet(value,obj);
}

export function state(value) {
	let obj = {
		0: "未发布",
		1: "已发布",
		"default_value": "未知状态"
	};
	return commonRet(value,obj);
}

export function release(value) {
	let obj = {
		0: "未发布",
		1: "已发布",
		"default_value": "未知"
	};
	return commonRet(value,obj);
}

export function statusDefault(value,msg) {
	let obj = {
		0: "未"+ msg,
		1: "已"+ msg,
		2: "待"+ msg,
		"default_value": "未知"
	};
	return commonRet(value,obj);
}

// 时间戳转换<y-m-d>
export function fmtDate(obj) {
	var date = new Date(obj);
	var y = 1900 + date.getYear();
	var m = "0" + (date.getMonth() + 1);
	var d = "0" + date.getDate();
	return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
}

// 时间戳转换<y-m-d h-m-m>
export function fmtDates(obj) {
	return timestampToTime(obj)
}

// 时间差
export function timeDifference(obj) {
	var nowTime = new Date().getTime();
	let timestampNow = timestampToTime(nowTime)
	var ms = (nowTime - obj) / 1000 / 60 / 60;
	return hourFilter(ms);
}
// 字节转换
export function size(size) {
	let sizeNow = '';
	if(String(size).length > 6) {
		sizeNow = Math.ceil(Number(size) / 1024 / 1024) + 'MB'
	} else if(String(size).length > 3) {
		sizeNow = Math.ceil(Number(size) / 1024) + 'KB'
	} else {
		sizeNow = size + 'B'
	}
	return sizeNow;
}