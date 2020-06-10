const winston = require('winston');

const date = new Date();
module.exports = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.File({
			filename: `public/logs/${date.getDate() + '-' + (date.getMonth() + 1)}/infolog.log`,
			level: 'info'
		}),
		new winston.transports.File({
			filename: `public/logs/${date.getDate() + '-' + (date.getMonth() + 1)}/errorlog.log`,
			level: 'error'
		})
	]
});
