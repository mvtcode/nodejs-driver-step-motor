//motor half step driver
//coder: tanmv
//email: tanmv@vp9.tv
//update code: 18/05/2016

const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const logger = require('tracer').colorConsole();
const colors = require('colors');
const async = require('async');
const config = require('./config');
const util = require('./util');

//********************************variable global*************************************//
var tHorizontal;
var tVertical;
var hw_state = {h: 0, v: 0};
var hw_range = {h: 0, v: 0};
var bBusy = true;

//********************************function*************************************//
var get_gpio = function(pin) {
	var value = fs.readFileSync('/sys/class/gpio_sw/'+pin+'/data').toString();
	//console.log('read pin:', '/sys/class/gpio_sw/'+pin+'/data =>',value);
	return value == 1;
};

var set_gpio = function(pin, bState, callback){
	fs.writeFile('/sys/class/gpio_sw/' + pin + '/data',(bState?'1':'0'), function(err) {
		if(callback) callback();
	});
};

var StopAll = function(arr_pins) {
	for(var i=0; i < arr_pins.length; i++) {
		set_gpio(arr_pins[i], false);
	}
};

var work_process = function(arr_pin, interrupt, relay, bReverse, callback_timeout, callback_process) {
	var arr = arr_pin.slice();
	if(bReverse) arr.reverse();

	var i = 0;
	var arr_length = arr.length;
	async.whilst(
		function () {
			return !get_gpio(interrupt);
		},
		function (callback_item) {
			var mod = i % (arr_length*2);
			var pin;
			var value = mod%2==0;
			var curent_pin = mod/2;
			if(value){
				pin = arr[curent_pin];
			}
			else{
				curent_pin = Math.floor(curent_pin);
				pin = arr[curent_pin==0 ? arr_length-1 : curent_pin-1];
			}
			var date_1 = (new Date()).getTime();
			set_gpio(pin, value, function() {
				i++;
				var date_2 = (new Date()).getTime();
				var tRelay = relay - (date_2 - date_1);
				var tTimeout =setTimeout(function() {
					callback_item(null, i);
				},tRelay);
				if(callback_timeout) callback_timeout(tTimeout, i);
			});
		},
		function (err, n){
			if(callback_process) callback_process(err, n);
		}
	);
};

var ReadRange = function(){
	try{
		var data = fs.readFileSync(config.range_file);
		if(data && data!=''){
			var data_json = util.parseJson(data);
			if(data_json){
				if(data_json.h && data_json.h >0 && data_json.v && data_json.v >0){
					return data_json;
				}
			}
		}
		return null;
	}
	catch(e){
		return null;
	}
};

var SaveFile = function(file, data, callback){
	var s = JSON.stringify(data);
	fs.writeFile(file, s, function(err){
		if(err) {
			logger.error(err);
		}
		if(callback) callback(err);
	});
};

var MotorMoveH = function(val, callback) {
	if(val >= 0 && val <= hw_range.h) {
		if(tHorizontal) {
			clearTimeout(tHorizontal);
			tHorizontal = null;
		}
		var d = val - hw_state.h;
		if(d == 0) {
			if(callback) callback({error: 0, message: ''});
		} else {
			var bReverse = d < 0;
			if(bReverse) {
				d = -d; //d = Math.abs(d);
			}
			work_process(config.motor_horizontal, config.pin_interrupt_horizontal, config.relay, bReverse, function(tTimeout, iCount) {
				tHorizontal = tTimeout;
				if(bReverse) hw_state.h--;
				else hw_state.h++;
				if(iCount >= d) {
					clearTimeout(tHorizontal);
					tHorizontal = null;
					StopAll(config.motor_horizontal);
					if(callback) callback({error: 0, message: ''});
				}
			},function(err, n) {
				if(bReverse) hw_state.h = 0;
				else hw_state.h = hw_range.h;
				StopAll(config.motor_horizontal);
				if(callback) callback({
					error: 0,
					message: '',
					state: hw_state,
					range: hw_range
				});
			});
		}
	} else {
		if(callback) callback({error: 2, message: 'error range value'});
	}
};

var MotorMoveV = function(val, callback) {
	if(val >= 0 && val <= hw_range.v) {
		if(tVertical) {
			clearTimeout(tVertical);
			tVertical = null;
		}
		var d = val - hw_state.v;
		if(d == 0) {
			if(callback) callback({error: 0, message: ''});
		} else {
			var bReverse = d < 0;
			if(bReverse) {
				d =- d; //d = Math.abs(d);
			}
			work_process(config.motor_vertical, config.pin_interrupt_vertical, config.relay, bReverse, function(tTimeout, iCount) {
				tVertical = tTimeout;
				if(bReverse) hw_state.v--;
				else hw_state.v++;
				if(iCount >= d) {
					clearTimeout(tVertical);
					tVertical = null;
					StopAll(config.motor_vertical);
					if(callback) callback({error: 0, message: ''});
				}
			},function(err, n) {
				if(bReverse) hw_state.v = 0;
				else hw_state.v = hw_range.v;
				StopAll(config.motor_vertical);
				if(callback) callback({
					error:0,
					message:'',
					state: hw_state,
					range: hw_range
				});
			});
		}
	} else {
		if(callback) callback({error: 2, message: 'error range value'});
	}
};

var move_0_0 = function(callback) {
	console.log(colors.cyan('Motor ') + colors.yellow('move to (0,0)'));
	async.parallel([
		function(callback_step) {
			work_process(config.motor_horizontal, config.pin_interrupt_horizontal, config.relay, false, function(tTimeout, iCount) {
				tHorizontal = tTimeout;
			},function(err, n) {
				StopAll(config.motor_horizontal);
				callback_step(null, true);
			});
		},
		function(callback_step) {
			work_process(config.motor_vertical, config.pin_interrupt_vertical, config.relay, false, function(tTimeout, iCount) {
				tVertical = tTimeout;
			},function(err, n) {
				StopAll(config.motor_vertical);
				callback_step(null, true);
			});
		}
	],function() {
		callback(null, true);
		StopAll(config.motor_horizontal);
		StopAll(config.motor_vertical);
	});
};

var move_max_max = function(callback) {
	console.log(colors.cyan('Motor ') + colors.yellow('move to (max, max)'));
	async.parallel([
		function(callback_step) {
			work_process(config.motor_horizontal, config.pin_interrupt_horizontal, config.relay, true, function(tTimeout, iCount) {
				tHorizontal = tTimeout;
			},function(err, n) {
				hw_state.h = n;
				hw_range.h = n;
				callback_step(null, true);
			});
		},
		function(callback_step) {
			work_process(config.motor_vertical, config.pin_interrupt_vertical, config.relay, true, function(tTimeout, iCount) {
				tVertical = tTimeout;
			}, function(err, n) {
				hw_state.v = n;
				hw_range.v = n;
				callback_step(null, true);
			});
		}
	],function() {
		callback(null, true);
		StopAll(config.motor_horizontal);
		StopAll(config.motor_vertical);
	});
};

var move_half_half = function(callback) {
	console.log(colors.cyan('Motor ') + colors.yellow('move to (half, half)'));
	async.parallel([
		function(callback_step) {
			MotorMoveH(Math.floor(hw_range.h / 2), function() {
				callback_step(null, true);
			});
		},
		function(callback_step) {
			MotorMoveV(Math.floor(hw_range.v / 2), function() {
				callback_step(null, true);
			});
		}
	],function() {
		callback(null, true);
	});
};

var move = function(h, v, callback) {
	console.log(colors.cyan('Motor ') + colors.yellow('move to (%d, %d)'),h,v);
	async.parallel([
		function(callback_step) {
			MotorMoveH(h, function(msg) {
				callback_step(null, true);
			});
		},
		function(callback_step) {
			MotorMoveV(v, function(msg) {
				callback_step(null, true);
			});
		}
	],function() {
		callback();
	});
};

//*********************************server************************************//
var init_webserver = function() {
	var app = new express();
	var server = http.createServer(app);
	server.listen(config.port,config.server_name);
	
	app.use(express.static(path.join(__dirname,'http_public'),{ maxAge: 129600000}));//1.5d
	//routes
	app.get('/info', function (req, res) {
		res.json({
			error:0,
			message: '',
			state: hw_state,
			range: hw_range
		});
	});

	app.get('/move-h/:value', function (req, res) {
		if(bBusy) {
			res.json({
				error: 1,
				message: 'device is busy'
			});
		} else {
			var value = util.parseInt(req.params.value);
			MotorMoveH(value,function(msg) {
				res.json(msg);
			});
		}
	});

	app.get('/move-v/:value', function (req, res) {
		if(bBusy) {
			res.json({
				error: 1,
				message: 'device is busy'
			});
		} else {
			var value = util.parseInt(req.params.value);
			MotorMoveV(value,function(msg) {
				res.json(msg);
			});
		}
	});

	app.get('/move/:h/:v', function (req, res) {
		if(bBusy){
			res.json({
				error: 1,
				message: 'device is busy'
			});
		} else {
			var h = util.parseInt(req.params.h);
			var v = util.parseInt(req.params.v);
			if(v >= 0 && v <= hw_range.v && h >= 0 && h <= hw_range.h){
				move(h,v,function() {
					res.json({
						error: 0,
						message: '',
						state: hw_state,
						range: hw_range
					});
				});
			} else {
				res.json({error: 2, message: 'error range value'});
			}
		}
	});

	app.get('/reset', function (req, res) {
		bBusy = true;
		async.waterfall([
			//move horizontal & vertical to 0
			function(callback){
				move_0_0(function() {
					callback(null,true);
				});
			},
			//move vertical & vertical to max
			function(data,callback) {
				setTimeout(function() {
					move_max_max(function() {
						callback(null, true);
					});
				},1000);
			},
			//move center
			function(data, callback) {
				setTimeout(function() {
					move_half_half(function() {
						callback(null, true);
					});
				}, 1000);
			},
			//save data
			function(data, callback) {
				SaveFile(config.range_file, hw_range, function() {
					callback(null, true);
				});
			},
		], function() {
			bBusy = false;
			res.json({
				error: 0,
				message: '',
				state: hw_state,
				range: hw_range
			})
		});
	});
	console.log(colors.cyan('Webserver: ') + colors.green('listen: %s:%d'), config.server_name, config.port);
};

//init application
console.log(colors.cyan('Application: ') + colors.yellow('starting...'));
async.waterfall([
	//move horizontal & vertical to 0
	function(callback) {
		move_0_0(function() {
			callback(null, true);
		});
	},
	//load data range
	function(data,callback) {
		console.log(colors.cyan('Application: ') + colors.yellow('loading data'));
		var range = ReadRange();
		if(range) {
			//end load data
			hw_range = range;
			callback(true, null);
		} else {
			//continue...
			console.log(colors.cyan('Application: ') + colors.yellow('initing...'));
			callback(false, null);
		}
	},
	// //move horizontal & vertical max
	function(data, callback){
		setTimeout(function() {
			move_max_max(function() {
				callback(null, true);
			});
		},1000);
	},
	//save file range
	function(data, callback) {
		console.log(colors.cyan('Application: ') + colors.yellow('save range file'));
		SaveFile(config.range_file, hw_range, function() {
			callback(null, true);
		});
	}
],
function() {
	console.log(colors.cyan('Application: ') + colors.yellow('started'));
	//move center
	setTimeout(function(){
		move_half_half(function(){
			bBusy = false;
			init_webserver();
		});
	},1000);
});