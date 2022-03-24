import {VLog} from "./v-log";

export interface VLogSenderSettings {
    process: (logs: VLog[]) => void;
}