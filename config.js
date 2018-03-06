global.env = process.env.environment || 'localhost';


module.exports = {
    'development': {
        port: 5000,
        dbUrl: 'mongodb://localhost:27017/vote',
        redis: {
            port: 6379,
            host: 'localhost'
        },
        enable: true   //是否开启利用多核cpu
    },
    'test': {
        port: 5000,
        dbUrl: 'mongodb://localhost:27017/vote',
        redis: {
            port: 6379,
            host: 'localhost'
        },
        enable: true   //是否开启利用多核cpu
    },
    'prouction': {
        port: 5000,
        dbUrl: 'mongodb://localhost:27017/vote',
        redis: {
            port: 6379,
            host: 'localhost'
        }
    },
    'localhost': {
        port: 5000,
        dbUrl: 'mongodb://localhost:27017/vote',
        redis: {
            port: 6379,
            host: 'localhost'
        },
        enable: true   //是否开启利用多核cpu
    }
};
