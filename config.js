// const env = 'heroWithMLab' // 'local', 'heroWithMLab', 'prod'
const ENV = process.env.ENV || 'prod'

const _config = {
    dev: {
        jwtSecret: 'S&je!i5kP9x$o=',
        encSecret: '#xJo-c7$d=9h',
        // mailKey: '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'
    },
    prod: {
        jwtSecret: '9=iUk@7c6#FZ-q',
        encSecret: '?5nM2&9s!a7=',
    }
}

module.exports = _config[ENV]
