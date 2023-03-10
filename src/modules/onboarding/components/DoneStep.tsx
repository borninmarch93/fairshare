import { Stack, Spinner, Text, Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { postShare } from "../../../apis/shares";
import { AuthContext } from "../../../App";
import { Grant, Shareholder, User, Company, Share } from "../../../types";
import { OnboardingContext } from "../context/OnboardingContext";

const DoneStep = () => {
  const { authorize } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { email, userName, companyName, shareholders, grants, shares } =
    useContext(OnboardingContext);
  const [error, setError] = useState(false);

  const shareMutation = useMutation<Share, unknown, Share>(postShare);

  const grantMutation = useMutation<Grant, unknown, Grant>((grant) =>
    fetch("/grant/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grant }),
    }).then((res) => res.json())
  );
  const shareholderMutation = useMutation<Shareholder, unknown, Shareholder>(
    (shareholder) =>
      fetch("/shareholder/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(shareholder),
      }).then((res) => res.json()),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user");
      },
    }
  );
  const userMutation = useMutation<User, unknown, User>((user) =>
    fetch("/user/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).then((res) => res.json())
  );
  const companyMutation = useMutation<Company, unknown, Company>((company) =>
    fetch("/company/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(company),
    }).then((res) => res.json())
  );

  React.useEffect(() => {
    async function saveData() {
      try {
        const user = await userMutation.mutateAsync({ email, name: userName });

        await Promise.all([
          ...Object.values(grants).map((grant) =>
            grantMutation.mutateAsync(grant)
          ),
          ...Object.values(shares).map((share) => shareMutation.mutateAsync(share)),
          ...Object.values(shareholders).map((shareholder) =>
            shareholderMutation.mutateAsync(shareholder)
          ),
          companyMutation.mutateAsync({ name: companyName }),
        ])

        authorize(user);
        navigate("/dashboard");
      } catch (err) {
        setError(true);
      }
    }

    saveData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack alignItems="center">
      {!error ? <>
        <Spinner />
        <Text color="teal.400">...Wrapping up</Text>
      </> :
        <Alert status='error'>
          <AlertIcon />
          <AlertTitle>Registration is not completed!</AlertTitle>
          <AlertDescription>Please try again later.</AlertDescription>
        </Alert>}
    </Stack>
  );
};

export default DoneStep;