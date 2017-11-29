const cfork = require('cfork');
const util = require('util');
const {enable} = require('./config')[env];
const path = require('path');
const app = path.join(__dirname, './app.js');

function forkWork() {
    cfork({
        exec: app,
        count: require('os').cpus().length,
    })
        .on('fork', worker => {
            console.warn('[%s] [worker:%d] new worker start', Date(), worker.process.pid);
        })
        .on('disconnect', worker => {
            console.warn('[%s] [master:%s] wroker:%s disconnect, exitedAfterDisconnect: %s, state: %s.',
                Date(), process.pid, worker.process.pid, worker.exitedAfterDisconnect, worker.state);
        })
        .on('exit', (worker, code, signal) => {
            const exitCode = worker.process.exitCode;
            const err = new Error(util.format('worker %s died (code: %s, signal: %s, exitedAfterDisconnect: %s, state: %s)',
                worker.process.pid, exitCode, signal, worker.exitedAfterDisconnect, worker.state));
            err.name = 'WorkerDiedError';
            console.error('[%s] [master:%s] wroker exit: %s', Date(), process.pid, err.stack);
        });
}

if(enable) {
    forkWork();
}else {
    require(app);
}
