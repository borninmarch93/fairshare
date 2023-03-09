import { Stack, FormControl, FormLabel, Input, Button } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingContext } from "../context/OnboardingContext";

const CompanyStep = () => {
  const { companyName, userName, email, dispatch } = useContext(OnboardingContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userName || !email) {
      return navigate("/start/user");
    }
  }, [userName, email]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/start/shares");
  }

  return (
    <Stack as="form" onSubmit={onSubmit} spacing="4">
      <FormControl id="companyName" size="lg" color="teal.400">
        <FormLabel>What company are we examining?</FormLabel>
        <Input
          type="text"
          placeholder="Company Name"
          onChange={(e) =>
            dispatch({ type: "updateCompany", payload: e.target.value })
          }
          value={companyName}
        />
      </FormControl>
      <Button type="submit" colorScheme="teal" isDisabled={!companyName.length}>
        Next
      </Button>
    </Stack>
  );
}

export default CompanyStep;