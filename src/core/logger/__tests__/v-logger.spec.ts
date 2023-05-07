import {VLogger} from "../v-logger";

describe('VLogger', () => {

    const sender: any = { process: jest.fn() };
    let logger: VLogger;

    beforeEach(() => logger = new VLogger(sender));

    afterEach(() => jest.clearAllMocks());

    it('should log debug', () => {
        logger.debug('debug1', 'debug2');
        logger.debug('debug3');
        expect(sender.process).toHaveBeenCalledTimes(2);
        expect(sender.process).toHaveBeenNthCalledWith(1, [{ type: 'debug', msg: 'debug1' }, { type: 'debug', msg: 'debug2' }]);
        expect(sender.process).toHaveBeenNthCalledWith(2, [{ type: 'debug', msg: 'debug3' }]);
    });

    it('should log info', () => {
        logger.info('info1', 'info2');
        logger.info('info3');
        expect(sender.process).toHaveBeenCalledTimes(2);
        expect(sender.process).toHaveBeenNthCalledWith(1, [{ type: 'info', msg: 'info1' }, { type: 'info', msg: 'info2' }]);
        expect(sender.process).toHaveBeenNthCalledWith(2, [{ type: 'info', msg: 'info3' }]);
    });

    it('should log warning', () => {
        logger.warning('warning1', 'warning2');
        logger.warning('warning3');
        expect(sender.process).toHaveBeenCalledTimes(2);
        expect(sender.process).toHaveBeenNthCalledWith(1, [{ type: 'warning', msg: 'warning1' }, { type: 'warning', msg: 'warning2' }]);
        expect(sender.process).toHaveBeenNthCalledWith(2, [{ type: 'warning', msg: 'warning3' }]);
    });

    it('should log error', () => {
        logger.error('error1', 'error2');
        logger.error('error3');
        expect(sender.process).toHaveBeenCalledTimes(2);
        expect(sender.process).toHaveBeenNthCalledWith(1, [{ type: 'error', msg: 'error1' }, { type: 'error', msg: 'error2' }]);
        expect(sender.process).toHaveBeenNthCalledWith(2, [{ type: 'error', msg: 'error3' }]);
    });
});