import { Shareholder, Grant, Share } from "../../types";

export interface OnboardingFields {
    companyName: string;
    userName: string;
    email: string;
    shareholders: { [shareholderID: number]: Shareholder };
    grants: { [grantID: number]: Grant };
    shares: {[shareID: number]: Share }
}

interface UpdateUserAction {
    type: "updateUser";
    payload: string;
}
interface UpdateEmailAction {
    type: "updateEmail";
    payload: string;
}
interface AddShareAction {
    type: "addShare",
    payload: Omit<Share, "id">,
}
interface UpdateCompanyAction {
    type: "updateCompany";
    payload: string;
}
interface AddShareholderAction {
    type: "addShareholder";
    payload: Omit<Shareholder, "id" | "grants">;
}
interface AddGrantAction {
    type: "addGrant";
    payload: { shareholderID: number; grant: Omit<Grant, "id"> };
}

export type OnboardingAction =
    | UpdateUserAction
    | UpdateEmailAction
    | UpdateCompanyAction
    | AddShareAction
    | AddShareholderAction
    | AddGrantAction;