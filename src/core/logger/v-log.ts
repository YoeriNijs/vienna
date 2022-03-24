import {VInternalLogType} from "./v-internal-log-type";

export interface VLog {
    type: VInternalLogType;
    msg: string;
}