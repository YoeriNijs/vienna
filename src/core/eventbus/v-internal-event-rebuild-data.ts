import {VComponentType} from "../component/v-component-type";

export interface VInternalEventRebuildData {
    component: VComponentType;
    dirtyElementIds: string[];
}