var util = {};

util.sha256 = function(s){
	var crypto = require("crypto");
	var sha256 = crypto.createHash("sha256");
	sha256.update(s, "utf8");//utf8 here
	return sha256.digest("hex");
};

util.MD5 = function(s){
	var crypto = require("crypto");
	var md5 = crypto.createHash("md5");
	md5.update(s, "utf8");//utf8 here
	return md5.digest("hex");
};

util.isIpV4 = function(s){
	var pattern = /^(\-)?\d+(\.\d+)?$/;
	return pattern.test(s);  // returns a boolean
};

util.isOnlyNumber = function(s){
	var pattern = /\d+/;
	return pattern.test(s);  // returns a boolean
};

util.isNumber = function(s){
	var pattern = /^(\-)?\d+(\.\d+)?$/;
	return pattern.test(s);  // returns a boolean
};

util.isInt = function(s){
	var pattern = /^(\-)?\d+$/;
	return pattern.test(s);  // returns a boolean
};

util.isPhoneNumber = function(s){
	var pattern = /^0(9\d{8}|1\d{9})$/;
	return pattern.test(s);  // returns a boolean
};

util.isEmail = function(s){
	var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	return pattern.test(s);  // returns a boolean
};

util.hidenEmail = function(s,char){
	if(s){
		var n = s.indexOf('@');
		if(n>0){
			var s1 = s.substring(0,n);
			var s2 = s.substring(n);
			n = s1.length;
			if(!char) char = '*';
			var s11=s1.substring(0,Math.round(n/2));
			for(var i=Math.round(n/2);i<n;i++){
				s11+=char;
			}
			return s11+s2;
		}
		else
			return s;
	}
	return null;
};

util.isUsername = function(s){
	var pattern = /^[a-z][a-z0-9_]{4,19}$/;
	return pattern.test(s);  // returns a boolean
};

util.isPassword = function(s){
	var pattern = /^.{6,30}$/;
	return pattern.test(s);  // returns a boolean
};

util.isNameVi = function(s){
	var pattern = /^[a-zA-Z\s áàảãạăâắằấầặẵẫậéèẻẽẹêếềểễệóòỏõọôốồổỗộơớờởỡợíìỉĩịđùúủũụưứửữựÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼÊỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỨỪỬỮỰỲỴÝỶỸửữựỵỷỹ]{3,30}$/gi;
	return pattern.test(s);
};

util.validateUrl = function(url){
	var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
	return urlregex.test(url);
};

util.kodau = function(str){
	str= str.toLowerCase();
	str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
	str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
	str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
	str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
	str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
	str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
	str= str.replace(/đ/g,"d");
	str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
	/* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
	str= str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
	str= str.replace(/^\-+|\-+$/g,"");
	//cắt bỏ ký tự - ở đầu và cuối chuỗi
	return str;
};

// Validates that the input string is a valid date formatted as "dd/mm/yyyy"
util.isValidDate = function(s){
	// First check for the pattern
	if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s))
		return false;

	// Parse the date parts to integers
	var parts = s.split("/");
	var day = parseInt(parts[0], 10);
	var month = parseInt(parts[1], 10);
	var year = parseInt(parts[2], 10);

	// Check the ranges of month and year
	if(year < 1000 || year > 3000 || month == 0 || month > 12)
		return false;

	var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	// Adjust for leap years
	if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
		monthLength[1] = 29;

	// Check the range of the day
	return day > 0 && day <= monthLength[month - 1];
};

// Validates that the input string is a valid date formatted as "yyyy-mm-dd"
util.isValidDate2 = function(s){
	// First check for the pattern
	if(!/^\d{4}\-\d{2}\-\d{2}$/.test(s))
		return false;

	// Parse the date parts to integers
	var parts = s.split("-");
	var year = parseInt(parts[0], 10);
	var month = parseInt(parts[1], 10);
	var day = parseInt(parts[2], 10);

	// Check the ranges of month and year
	if(year < 1000 || year > 3000 || month == 0 || month > 12)
		return false;

	var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	// Adjust for leap years
	if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
		monthLength[1] = 29;

	// Check the range of the day
	return day > 0 && day <= monthLength[month - 1];
};

util.replaceHtml = function(s){
	if(s) return s.replace(/>/g, "&gt;").replace(/</g, "&lt;");
	return "";
};

util.StringFormat = function(s,arg){
	if(s && arg && arg.length && arg.length > 0 && (typeof s === 'string')){
		for(var i=0; i < arg.length; i++) {
			s = s.replace('{' + i + '}', arg[i]);
		}
	}
	return s;
};

//*********************parse data***********************//
util.parseString = function(s,defaul){
	// var pattern = /^(\-)?\d+(\.\d+)?$/;
	// if(pattern.test(s)) return parseInt(s);
	// else if(defaul) return defaul;
	if(typeof(s)=='string') return s;
	if(s) return s.toString();
	return defaul;
};

util.parseInt = function(s,defaul){
	var pattern = /^(\-)?\d+(\.\d+)?$/;
	if(pattern.test(s)) return parseInt(s);
	else if(defaul) return defaul;
	return 0;
};

util.parseJson = function(s){
	try{
		return JSON.parse(s);
	}
	catch(e){
		return null;
	}
};

util.parseNumber = function(s,defaul){
	var pattern = /^(\-)?\d+(\.\d+)?$/;
	if(pattern.test(s)) return parseFloat(s);
	else if(defaul)return defaul;
	return 0
};

util.toString = function(obj,defaul){
	if(obj){
		return String(obj);
	}
	else{
		if(defaul) return defaul;
		return "";
	}
};

//date format dd/mm/yyyy
util.parseDate = function(s,defaul){
	if(this.isValidDate(s)){
		var parts = s.split("/");
		var day = parseInt(parts[0], 10);
		var month = parseInt(parts[1], 10);
		var year = parseInt(parts[2], 10);

		return new Date(year,month -1,day);
	}
	if(defaul)return defaul;
	return null;
};

//yyyy-MM-dd HH:mm:ss
util.date2String = function(date){
	if(date){
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var second = date.getSeconds();
		if(month<10) month ='0' + month;
		if(day<10) day='0'+day;
		if(hour<10) hour='0'+hour;
		if(minutes<10) minutes='0'+minutes;
		if(second<10) second='0'+second;
		return  year + '-' + month + '-' + day +' ' + hour + ':' + minutes + ':' + second;
	}
	return '';
};

//yyyyMMddHHmmss
util.date2String2 = function(date){
	if(date){
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var second = date.getSeconds();
		if(month<10) month ='0' + month;
		if(day<10) day='0'+day;
		if(hour<10) hour='0'+hour;
		if(minutes<10) minutes='0'+minutes;
		if(second<10) second='0'+second;
		return  year + '' + month + '' + day +'' + hour + '' + minutes + '' + second;
	}
	return '';
};

//dd/MM/yyy HH:mm:ss
util.date2String3 = function(date){
	if(date){
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var minutes = date.getMinutes();
		var second = date.getSeconds();
		if(month<10) month ='0' + month;
		if(day<10) day='0'+day;
		if(hour<10) hour='0'+hour;
		if(minutes<10) minutes='0'+minutes;
		if(second<10) second='0'+second;
		return  day + '/' + month + '/' + year + ' ' + hour + ':' + minutes + ':' + second;
	}
	return '';
};

util.randomString = function(n){
	var patent = '0123456789abcdefghijklmnopqrstuvwxyz';
	var patent_length = patent.length;
	var s = '';
	for(i=0;i<n;i++){
		s+=patent[Math.floor(Math.random()*patent_length)];
	}
	return s;
};

util.randomNumber = function(n){
	var patent = '0123456789';
	var patent_length = patent.length;
	var s = '';
	for(i=0;i<n;i++){
		s+=patent[Math.floor(Math.random()*patent_length)];
	}
	return s;
};

util.getTokenCard = function(server_id,card_id,cardnumber,serial,datetime,capacity,key){
	var s = this.StringFormat('VP9@{0}^{1}-{2}-{3}+{4}-{5}|MVT|{6}$',[server_id,card_id,cardnumber.toUpperCase(),serial.toUpperCase(),datetime,capacity,key]);
	return this.sha256(s);
}

util.execFun = function(list_fun,callback){
	if(list_fun && list_fun.length>0){
		var fun_len = list_fun.length;
		var i_done = 0;
		var list_err = [];
		var list_result = [];

		for(var i=0;i<fun_len;i++){
			try{
				var fun = list_fun[i];
				var result = fun(exec_done);
			}
			catch(err){
				exec_done(err,null);
			}
		}

		function exec_done(err,result){
			list_err.push(err);
			list_result.push(result);
			i_done++;
			if(i_done==fun_len) callback(list_err,list_result);
		}
	}
	else{
		callback(null,null);
	}
};

util.RandomArray = function(arr, n) {
	if (n <= arr.length) {
		var arr_index = [];
		var clone = arr.slice();
		for (i = 0; i < n; i++) {
			var index = Math.floor(Math.random() * clone.length);
			arr_index.push(clone[index]);
			clone.splice(index, 1);
		}
		return arr_index;
	}
	else {
		console.log('Random array: n not greate than length array!');
		return null;
	}
}

util.RandomListArray = function(arr,arr2, n) {
	if(arr && arr2){
		if (n <= arr.length) {
			var arr_1 = [];
			var arr_2 = [];
			var clone1 = arr.slice();
			var clone2 = arr2.slice();
			for (i = 0; i < n; i++) {
				var index = Math.floor(Math.random() * clone1.length);

				arr_1.push(clone1[index]);
				arr_2.push(clone2[index]);

				clone1.splice(index, 1);
				clone2.splice(index, 1);
			}
			return {list_1:arr_1,list_2:arr_2};
		}
		else {
			return null;
		}
	}
	else{
		return null;
	}
}

util.RankScore = function(list_id,list_info) {
	if(list_id && list_info){
		var arr_temp = [];
		for (i = 0; i < list_id.length; i++) {
			for(j=0;j<list_info.length;j++){
				var user_info = list_info[j];
				if(user_info._id==list_id[i]){
					arr_temp.push(user_info);
					list_info.splice(j, 1);
					break;
				}
			}
		}
		return arr_temp;
	}
	else{
		return null;
	}
}

// util.GenPageHtml = function($totalrecord,$irecordofpage,$pageindex,$className,$classActive,$rshow,$function_name){
util.GenPageHtml = function($totalrecord,$irecordofpage,$pageindex,$className,$classActive,$rshow){
	$numberpage = 0;
	if ($totalrecord % $irecordofpage == 0)
		$numberpage = Math.floor($totalrecord / $irecordofpage);
	else
		$numberpage = Math.floor($totalrecord / $irecordofpage) + 1;
		
	if ($numberpage == 1)
		return "";
	
	$loopend = 0;
	$loopstart = 0;
	$istart = false;
	$iend = false;
	if ($pageindex == 0)
	{
		$loopstart = 0;
		$loopend = $numberpage > ($rshow - 1) ? $rshow : $numberpage;
		if ($numberpage > $rshow)
			$iend = true;
	}
	else
	{
		if ($pageindex < $numberpage - ($rshow - 1) && $pageindex != 0)
		{
			$loopstart = $pageindex - 1;
			$loopend = $pageindex + ($rshow - 1);
			$iend = true;
			if ($pageindex > 1)
				$istart = true;
		}
		else
		{
			if ($numberpage - $rshow > 0)
			{
				$loopstart = $numberpage - $rshow;
				$istart = true;
				$loopend = $numberpage;
			}
			else
			{
				$loopstart = 0;
				$loopend = $numberpage;
			}
		}
	}
	
	$sPage = '<ul class="'+ $className +'">';
	if ($istart)
		$sPage += '<li><a href="?trang=0">&lt;&lt;</a></li>';
	if ($pageindex >= 1)
		$sPage += '<li><a href="?trang=' + ($pageindex - 1) + '">&lt;</a></li>';
	for ($i = $loopstart; $i < $loopend; $i++)
	{
		if ($pageindex == $i)
			$sPage += '<li class="' + $classActive + '"><a href="javascript:void(0);">';
		else
			$sPage += '<li><a href="?trang=' + $i + '">';
		$sPage += ($i+1) + '</a></li>';
	}
	if ($pageindex <= $numberpage - 2)
		$sPage += '<li><a href="?trang=' + ($pageindex + 1) + '">&gt;</a></li>';
	if ($iend)
		$sPage += '<li><a href="?trang=' + ($numberpage - 1) + '">&gt;&gt;</a></li>';
	$sPage += '</ul>';
	
	return $sPage;
}

module.exports = util;