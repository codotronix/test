import { VERIFY_EMAIL, RESEND_OTP, UPDATE_NEWPSWD } from '../../../utils/urls'
import { ajaxPost } from '../../../utils/ajax'

export const verfyEmail = async (email, otp) => {
    try {
        const res = await ajaxPost(VERIFY_EMAIL, {email, otp})
        return res.data
    }
    catch(err) {
        return { status: 'FAILED', msg: 'Verification failed' }
    }
}

export const resendOTP = async (email, otpType) => {
    try {
        const res = await ajaxPost(RESEND_OTP, {email, otpType})
        return res.data
    }
    catch(err) {
        return { status: 'FAILED', msg: 'Some error occured. Please try again later' }
    }
}

export const updateNewPswd = async (email, pswdchangeotp, newpswd) => {
    try {
        const res = await ajaxPost(UPDATE_NEWPSWD, {email, pswdchangeotp, newpswd})
        return res.data
    }
    catch(err) {
        return { status: 'FAILED', msg: 'Some error occured. Please try again later' }
    }
}
