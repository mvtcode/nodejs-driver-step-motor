module.exports = {
	server_name: '127.0.0.1', //address webserver listening
	port: 4953, //port webserver
	relay: 10, //relay step
	range_file: './data/range.json', //range file
	pin_interrupt_horizontal: 'PA14',//'PA11', //input
	pin_interrupt_vertical: 'PA13',//'PA12', //input
	motor_horizontal: ['PA7','PA8','PA9','PA10'], //output
	motor_vertical: ['PA20','PC4','PC7','PD14'] //output
};