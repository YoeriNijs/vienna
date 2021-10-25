import {ContactInformation} from "./contact-information";

export  interface User {
    name: string;
    password: string;
    contact: ContactInformation;
}
