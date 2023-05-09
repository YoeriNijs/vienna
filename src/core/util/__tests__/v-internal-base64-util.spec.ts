import {isBase64Encoded} from "../v-internal-base64-util";

describe('VInternalBase64Util', function () {
    it('should return true when value is base64 encoded', () => {
        const value = window.btoa('encoded');
        const isEncoded = isBase64Encoded(value);
        expect(isEncoded).toBe(true);
    });

    it('should return false when value is not base64 encoded', () => {
        const value = "unencoded";
        const isEncoded = isBase64Encoded(value);
        expect(isEncoded).toBe(false);
    });
});