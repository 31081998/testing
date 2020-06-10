const AccountOtp = require('../models/AccountOtp')
const nodemailer = require('nodemailer')
const User = require('../models/user');
exports.parse = async data => {
    const dataStringify = await JSON.stringify(data)
    const parsing = await JSON.parse(dataStringify)
    return parsing
}

exports.sendOtp = async (id) => {
    let date = new Date().getTime()
    date += 1 * 60 * 5 * 1000
    const findExistingOtp = await AccountOtp.findOne({
        where: { account_id: id }
    })
    let randomOtp = this.generateRandomString(6);
    const userEmail = User.findOne({where: {id: id},attributes: ['id','email']});
    if (!findExistingOtp) {
        await this.sendMail(userEmail.email, randomOtp);
        await AccountOtp.create({
            account_id: id,
            otp: randomOtp,
            expiry_date: date
        })
    }
    
    await AccountOtp.update({
        expiry_date: date
    },
    {
        where: {account_id: id}
    })
}

exports.generateRandomString = async (length = 6) => {
    let characters = '0123456789'
    let charactersLength = characters.length
    let randomString = ''
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return randomString
}

exports.sendMail = async (email, otp) => {
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        driver: process.env.MAIL_DRIVER,
        service: 'gmail',
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
      });
  
      let mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: email,
        subject: 'testing',
        html: `
        <html>
        <div style="height: 25vh; width: 100%; background-color: #FCC709; padding: 30px 10px; text-align: center;">
            <img style="width: 80px;"
                src="https://pngimage.net/wp-content/uploads/2018/06/mail-logo-png-3.png">
        
                <h2 style="color: #2b2b2b;">One Time Password</h2>
                <h1 style="color: #2b2b2b;">${otp}</h1>
        </div>
        </html>
        `
      };
  
      transporter.sendMail(mailOptions, function(error, data) {
        if (error) {
          console.log(error);
        } else {
          console.log(data);
          console.log('success');
        }
      });
    } catch (error) {
      next(error);
    }
};