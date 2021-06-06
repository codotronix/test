// Since we are low on our email Quota,
// We will send 1 email every 4 hour for the same repeated task
const waitTimeInMS = 4 * 3600 * 1000 // 4 hour in ms

/**
 * If previous OTP was created less than 4 hours ago, return false.
 * Else return new OTP
 * @param {String} prevOTP | otpInt_timeInMS
 */
module.exports.getNewOTP = prevOTP => {
    const time = Date.now()
    if(prevOTP) {
        const [otp, prevTime] = prevOTP.split('_')
        if((time - parseInt(prevTime)) < waitTimeInMS) {
            return false
        }
    }

    const otp = Math.floor(Math.random() * 900000 + 99999)

    return {
        otp, 
        time,
        formattedOTP: otp + '_' + time
    }
}