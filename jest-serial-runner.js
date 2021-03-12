// Unfortunately need to use custom serial runner until there is better support from jest
// https://github.com/facebook/jest/issues/10936
// https://github.com/gabrieli/jest-serial-runner/issues/7
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TestRunner = require('jest-runner');

class SerialRunner extends TestRunner {
    constructor(...attr) {
        super(...attr);
        this.isSerial = true;
    }
}

module.exports = SerialRunner;
