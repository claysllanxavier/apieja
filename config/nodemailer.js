var hbs = require('nodemailer-express-handlebars'),
    email = process.env.MAILER_EMAIL_ID,
    pass = process.env.MAILER_PASSWORD,
    nodemailer = require('nodemailer');

var path = require("path");
var appDir = path.dirname(require.main.filename);


var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: email,
        pass: pass
    }
});

var handlebarsOptions = {
    viewEngine: 'handlebars',
    viewPath: appDir + '/app/views/',
    extName: '.html'
};


smtpTransport.use('compile', hbs(handlebarsOptions));

module.exports = smtpTransport;
