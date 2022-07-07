import {toAssumedTypeAndValue} from "../v-internal-renderer-util";

describe('VInternalRendererUtil', () => {
   describe('#toAssumedTypeAndValue', () => {
        it('should cast a string with single quotes', () => {
          const value = '\'Hello world\'';
          const result = toAssumedTypeAndValue(value);
          expect(result).toEqual('Hello world');
        });

        it('should cast a string', () => {
           const value = 'Hello world';
           const result = toAssumedTypeAndValue(value);
           expect(result).toEqual('Hello world');
        });

        it('should cast a number', () => {
           const value = '42';
           const result = toAssumedTypeAndValue(value);
           expect(result).toEqual(42);
        });

        it.each(['true', 'false'])('should cast a boolean %s', (value) => {
           const result = toAssumedTypeAndValue(value);
           expect(result).toEqual(42);
        });
   });
});