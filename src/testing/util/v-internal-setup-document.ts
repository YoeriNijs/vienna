import {JSDOM} from "jsdom";

/* eslint-disable */
// To fix jsdom shortcomings
const doc = new JSDOM('<!doctype html><html><body></body></html>');
global['document'] = doc.window.document;
global['window'] = doc.window as any;
global['HTMLElement'] = doc.window.HTMLElement;
global['DOMParser'] = doc.window.DOMParser;
/* eslint-enable */
