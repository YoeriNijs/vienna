import {VInternalLogSender} from "../v-internal-log-sender";
import {VLog} from "../v-log";

describe('VInternalLogSender', () => {

    it('should not throw exception when there are no settings defined', done => {
       const sender = new VInternalLogSender();
       sender.registerSettings(undefined);
       sender.process([{ type: 'debug', msg: 'log' }]);
       done();
    });

    it('should call process when settings are defined', () => {
        let processed: VLog[];
        const sender = new VInternalLogSender();
        sender.registerSettings({ process: logs => processed = logs });
        sender.process([{ type: 'debug', msg: 'log' }]);
        expect(processed).toEqual([{ type: 'debug', msg: 'log' }]);
    });
});