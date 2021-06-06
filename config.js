// const env = 'heroWithMLab' // 'local', 'heroWithMLab', 'prod'
const RTL_ENV = process.env.RTL_ENV || 'prod'

const _config = {
    local: {
        dbUri: 'mongodb://localhost:27017/rtl1?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false',
        dbName: 'rtl2',
        usersCollection: 'users',
        talesCollection: 'tales',
        notifCollection: 'notifs',
        jwtSecret: 'S&je!i5kP9x$o=',
        encSecret: '#xJo-c7$d=9h',
        mailKey: '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'
    },

    // dev1
    heroWithMLab: {
        dbUri: 'mongodb+srv://almighty:Jomma2018@codocluster-nwvop.mongodb.net/test?retryWrites=true&w=majority',
        dbName: 'rtl1',
        usersCollection: 'users',
        talesCollection: 'tales',
        notifCollection: 'notifs',
        jwtSecret: 'S&jc!i8kP9Z$o=',
        encSecret: '#RloQ_70d=9h'
    },
    prod: {
        dbUri: '',
        dbName: 'rtl',
        usersCollection: 'users',
        talesCollection: 'tales',
        notifCollection: 'notifs',
        jwtSecret: '9=iUk@7c6#FZ-q',
        encSecret: '?5nM2&9s!a7='
    }
}

module.exports = _config[RTL_ENV]
