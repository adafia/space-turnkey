class Logger {

    constructor() {
        this.logs = [];
    }

    get count() {
        return this.logs.length;
    }

    log(message) {
        const timestamp = new Date().toDateString();
        this.logs.push({ message, timestamp });
        console.log(`${timestamp} - ${message}`)
    }
}


module.exports = new Logger();
