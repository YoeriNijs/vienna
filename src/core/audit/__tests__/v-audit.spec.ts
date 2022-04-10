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

    describe('IPv4', () => {
        it.each([
            '0.0.0.0',
            '127.0.0.1',
            '192.168.0.0/16',
            '192.168.0.0:80'
        ])(`should return true for '%s'`, v => expect(audit.isValidIp4(v)).toBe(true));

        it.each([
            '0.0.0',
            '127.0.0.0.1',
            '2001:0db8:85a3:0000:1319:8a2e:0370:7344',
            undefined,
            null,
            '',
            ' '
        ])(`should return false for '%s'`, v => expect(audit.isValidIp4(v)).toBe(false));
    });

    describe('IPv6', () => {
        it.each([
            '2001:0db8:85a3:0000:1319:8a2e:0370:7344',
            '2001:db8:85a3::1319:8a2e:370:7344'
        ])(`should return true for '%s'`, v => expect(audit.isValidIp6(v)).toBe(true));

        it.each([
            '2001:0db8:85a3:0000:1319:8a2e:0370',
            '2001.0db8.85a3.0000.1319.8a2e.0370.7344',
            '127.0.0.1',
            undefined,
            null,
            '',
            ' '
        ])(`should return false for '%s'`, v => expect(audit.isValidIp6(v)).toBe(false));
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

    describe('isUserAgentBot', () => {
       it.each([
           'bot',
           'BOT',
           ' bot',
           'bot ',
           'BoT',
           'slurper',
           'spider',
           'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
           'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
           'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36 some crawler value',
       ])('should know is user agent %s is a bot', (ua) => {
          expect(audit.isUserAgentBot(ua)).toBe(true);
       });

        it.each([
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393',
            'Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
            'Mozilla/5.0 (Linux; Android 6.0.1; SAMSUNG SM-G570Y Build/MMB29K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/4.0 Chrome/44.0.2403.133 Mobile Safari/537.36',
            undefined,
            null,
            ''
        ])('should know is user agent %s is not a bot', (ua) => {
            expect(audit.isUserAgentBot(ua)).toBe(false);
        });
    });
});