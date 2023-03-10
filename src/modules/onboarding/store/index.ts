import produce from "immer";
import { OnboardingFields, OnboardingAction } from "../types";
import { generateID } from "../utils/storeUtils";

export function signupReducer(
  state: OnboardingFields,
  action: OnboardingAction
) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "updateUser":
        draft.userName = action.payload;
        if (draft.shareholders[0]) {
          draft.shareholders[0].name = action.payload;
        } else {
          draft.shareholders[0] = {
            id: 0,
            name: action.payload,
            grants: [],
            group: "founder",
          };
        }
        break;
      case "updateEmail":
        draft.email = action.payload;
        break;
      case "addShare":
        const nextShareID = generateID(draft.shares);
        draft.shares[nextShareID] = {
          id: nextShareID,
          ...action.payload,
        };
        break;
      case "updateCompany":
        draft.companyName = action.payload;
        break;
      case "addShareholder":
        const nextShareholderID = generateID(draft.shareholders);
        draft.shareholders[nextShareholderID] = {
          id: nextShareholderID,
          grants: [],
          ...action.payload,
        };
        break;
      case "addGrant":
        const nextGrantID = generateID(draft.grants);
        draft.grants[nextGrantID] = {
          id: nextGrantID,
          ...action.payload.grant,
        };
        draft.shareholders[action.payload.shareholderID].grants.push(
          nextGrantID
        );
        break;
    }
  });
}