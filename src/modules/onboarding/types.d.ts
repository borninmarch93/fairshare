import { Shareholder, Grant } from "../../types";

export interface OnboardingFields {
    companyName: string;
    userName: string;
    email: string;
    shareholders: { [shareholderID: number]: Shareholder };
    grants: { [grantID: number]: Grant };
}

interface UpdateUserAction {
    type: "updateUser";
    payload: string;
}
interface UpdateEmail {
    type: "updateEmail";
    payload: string;
}
interface UpdateCompanyAction {
    type: "updateCompany";
    payload: string;
}
interface AddShareholderAction {
    type: "addShareholder";
    payload: Omit<Shareholder, "id" | "grants">;
}
interface AddGrant {
    type: "addGrant";
    payload: { shareholderID: number; grant: Omit<Grant, "id"> };
}

export type OnboardingAction =
    | UpdateUserAction
    | UpdateEmail
    | UpdateCompanyAction
    | AddShareholderAction
    | AddGrant;