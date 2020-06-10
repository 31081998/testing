const bcrypt = require('bcryptjs')
const Sequelize = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const errorHandler = require('../../util/errors')
const apiResponder = require('../../util/responder')
const User = require('../../models/user')
const ValidateEmail = require('../../util/validation/isAlreadyEmail')
const general = require('../../util/general')
const Op = Sequelize.Op
const AccountOtp = require('../../models/AccountOtp')

const AuthHelper = require('../../util/Helper/AuthHelper');


exports.register = async (request, response, next) =>{
    try{
        if (errorHandler.validate(['name','email','password','mobile_no'], request.body))
            return apiResponder(request, response, next, true, 2003, {})

            
        const hashPwd = await bcrypt.hash(request.body.password, 12)
        const user = User.create({
            name: request.body.name,
            email: request.body.email,
            contact_number: request.body.mobile_no,
            password: hashPwd
        })
        if(!user){
            throw errorHandler.createError(1004);
        }
        return apiResponder(request,response,next,true,2002,{})
        
    }catch(error){
        next(error)
    }
}
//login
exports.login = async (request, response, next) => {
    try
     {
        if (errorHandler.validate(['email','password'], request.body))
        return apiResponder(request, response, next, true, 2003, {})

        const user = await User.findOne({
            where: { email: request.body.email, is_active: 1 }
        })
        if (user && user.is_verified == 1) {
            const passwordMatch = await bcrypt.compare(request.body.password, user.password)

            if (!passwordMatch) throw errorHandler.createError(1001)

            const token = await this.generateToken(
                user.id,
                user.email,
                user.name,
                
            )

            details = {
                id: user.id,
                auth_token: token
            }

        } else if (user && user.is_verified == 0) {
            await general.sendOtp(user.id)
            return apiResponder(request, response, next, true, 2006, {
                id: user.id,
                
            })
        }
        return apiResponder(request, response, next, true, 2000, details)
       
    } catch (error) {
        next(error)
    }
}

//verifiyOtp
exports.verifyOtp = async (request, response, next) => {
    try {
        if (errorHandler.validate(['account_id','otp'], request.body))
            return apiResponder(request, response, next, true, 2003, {})

        const date = new Date().getTime()
        const accountOtp = await AccountOtp.findOne({
            where: {
                user_id: request.body.account_id,
                expiry_date: { [Op.gte]: date }
            }
        })
        if (!accountOtp) return apiResponder(request, response, next, true, 2007, {})

        let messageCode, result, resp;

        if (accountOtp.otp == request.body.otp) { 
                const userDetails = await User.findOne({
                    attributes: ['id', 'email', 'name'],
                    where: { id: request.body.user_id }
                })
                if (!userDetails) {
                    messageCode = 2005
                    result = {}
                }else{
                    await User.update({ is_verified: 1 }, { where: { id: request.body.account_id } })
                    result = {
                        id: userDetails.id,
                        email : userDetails.email,
                        name : userDetails.name
                    }
                }
            const token = await AuthHelper.generateToken(result.id, result.email, result.name)
            messageCode = 2009;
            resp = { id: result.id, type: result.type, auth_token: token}

            } else {
                messageCode = 2008
                result = {}
            }

        return apiResponder(request, response, next, true, messageCode , resp)
    } catch (error) {
        next(error)
    }
}

exports.generateToken = async (id, email, name) => {
    try {
        const token = jwt.sign(
            {
                id: id, 
                email: email,
                name: name
            },
            `${process.env.CVM_SECRET_KET}`
        )
        if (token) return token
    } catch (error) {
        return error
    }
}
