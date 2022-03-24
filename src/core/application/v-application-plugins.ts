import {VLogSenderSettings} from "../logger/v-log-sender-settings";

export type VApplicationLoggerPlugin = VLogSenderSettings;

export interface VApplicationPlugins {
    logger?: VApplicationLoggerPlugin;
}