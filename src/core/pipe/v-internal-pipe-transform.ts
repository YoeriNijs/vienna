import {VPipeTransform} from "./v-pipe-transform";
import {VPipeOptions} from "./v-pipe-options";

export interface VInternalPipeTransform extends VPipeTransform {
    vPipeOptions: VPipeOptions;
}