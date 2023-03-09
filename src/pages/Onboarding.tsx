import React from "react";
import {
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  Heading,
  Stack,
} from "@chakra-ui/react";
import UserStep from "../modules/onboarding/components/UserStep";
import CompanyStep from "../modules/onboarding/components/CompanyStep";
import ShareholdersStep from "../modules/onboarding/components/ShareholdersStep";
import ShareholderGrantsStep from "../modules/onboarding/components/ShareholderGrantsStep";
import DoneStep from "../modules/onboarding/components/DoneStep";
import { signupReducer } from "../modules/onboarding/store";
import { OnboardingContext } from "../modules/onboarding/context/OnboardingContext";
import SharePriceStep from "../modules/onboarding/components/SharePriceStep";

export function Start() {
  const [state, dispatch] = React.useReducer(signupReducer, {
    userName: "",
    email: "",
    companyName: "",
    shareholders: {},
    grants: {},
    shares: {},
  });

  return (
    <OnboardingContext.Provider value={{ ...state, dispatch }}>
      <Stack direction="column" alignItems="center" spacing="10">
        <Heading size="2x1" color="teal.400">
          Lets get started.
        </Heading>
        <Routes>
          <Route path="/" element={<Navigate to="user" replace={true} />} />
          <Route path="user" element={<UserStep />} />
          <Route path="shares" element={<SharePriceStep />} />
          <Route path="company" element={<CompanyStep />} />
          <Route path="shareholders" element={<ShareholdersStep />} />
          <Route
            path="grants"
            element={<Navigate to={`/start/grants/0`} replace={true} />}
          />
          <Route
            path="grants/:shareholderID"
            element={<ShareholderGrantsStep />}
          />
          <Route path="done" element={<DoneStep />} />
        </Routes>
      </Stack>
    </OnboardingContext.Provider>
  );
}
