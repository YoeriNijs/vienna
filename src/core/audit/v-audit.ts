import {VInjectable} from "../injector/v-injectable-decorator";

const URL_REGEX = new RegExp('https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)');
const EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
const IP_REGEX = new RegExp(/\b(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)(?::\d{0,4})?\b/);

@VInjectable({ singleton: false })
export class VAudit {

    isValidUrl(url: string): boolean {
        return !!url && URL_REGEX.test(url);
    }

    isValidEmail(email: string): boolean {
        return !!email && EMAIL_REGEX.test(email);
    }

    isValidIp4(ip: string): boolean {
        return !!ip && ip.split('.').length === 4 && IP_REGEX.test(ip);
    }
    
    isBlank(v: any): boolean {
        if (!v) {
            return true;
        }
        if (typeof v === 'string') {
            return v.trim().length < 1;
        }
        if (typeof v === 'boolean') {
            return !v;
        }
        if (typeof v === 'object') {
            return Object.keys(v).length < 1;
        }
        if (typeof v === 'function') {
            const stripped = v.toString().replace(/\s/g,'');
            return stripped === 'function{}' || stripped === '()=>{}'
        }
        return !(typeof v !== 'undefined');
    }

}