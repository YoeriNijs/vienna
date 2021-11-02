export interface VInternalCheck {
    accept: (element: Element) => boolean;
    transform: (document: Document, element: Element, callInternalMethod: Function) => Document;
}