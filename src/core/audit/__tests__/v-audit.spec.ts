import {VAudit} from "../v-audit";

describe('VAudit', () => {

    let audit: VAudit;

    beforeEach(() => audit = new VAudit());

    describe('Url', () => {
        it.each([
            'https://www.site.com',
            'http://www.site.com',
            'https://www.site.com/page',
            'http://www.site.com/page',
            'https://www.site.com?param=something',
            'http://www.site.com?param=something',
        ])(`should return true for '%s'`, v => expect(audit.isValidUrl(v)).toBe(true));

        it.each([
            'www.site.com',
            'www.site.com',
            'www.site.com/page',
            'www.site.com/page',
            'www.site.com?param=something',
            'www.site.com?param=something',
            'site.com',
            '.site.com',
            'http:/site.com',
            'https:/site.com',
            'http//site.com',
            'https//site.com',
            'http:site.com',
            'http://site.',
            undefined,
            null,
            '',
            ' '
        ])('should return false for %s', v => expect(audit.isValidUrl(v)).toBe(false));
    });

    describe('Email', () => {
        it.each([
            'name@domain.com',
            'first.second@domain.com'
        ])(`should return true for '%s'`, v => expect(audit.isValidEmail(v)).toBe(true));

        it.each([
            'domain.com',
            'name@domain',
            'name@',
            '@',
            'namedomain',
            'name @domain',
            undefined,
            null,
            '',
            ' '
        ])(`should return false for '%s'`, v => expect(audit.isValidEmail(v)).toBe(false));
    });

    describe('Ip4', () => {
        it.each([
            '0.0.0.0',
            '127.0.0.1',
            '192.168.0.0/16',
            '192.168.0.0:80'
        ])(`should return true for '%s'`, v => expect(audit.isValidIp4(v)).toBe(true));

        it.each([
            '0.0.0',
            '127.0.0.0.1',
            undefined,
            null,
            '',
            ' '
        ])(`should return false for '%s'`, v => expect(audit.isValidIp4(v)).toBe(false));
    });

    describe('IsBlank', () => {
        it.each([
            '',
            ' ',
            {},
            false,
            () => {},
            null,
            undefined
        ])(`should return true for '%s'`, v => expect(audit.isBlank(v)).toBe(true));

        it.each([
            'text',
            true,
            { name: 'Ernie', age: 50 },
            () => console.log('something')
        ])(`should return false for '%s'`, v => expect(audit.isBlank(v)).toBe(false));
    });
});