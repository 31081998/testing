const User = require('../../models/user')
const Collector = require('../../models/Collector')

exports.isEmailExist = async email => 
{
    try {
        const userAccount = await User.findOne({ where: { email: email } })
        if (userAccount){
            return false
        }
        const collectorAccount = await Collector.findOne({ where: { email: email } })
        if (collectorAccount) {
            return false
        }
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}
