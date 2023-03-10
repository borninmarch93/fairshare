import React from "react";
import { useParams } from "react-router-dom";
import {
  Text,
  Stack,
  Spinner,
  Alert,
  AlertTitle,
  AlertIcon,
} from "@chakra-ui/react";
import { Grant, Share, Shareholder } from "../types";
import { useQuery } from "react-query";
import Chart from "../modules/dashboard/components/Chart";
import DashboardNav from "../modules/dashboard/components/DashboardNav";
import DashboardStats from "../modules/dashboard/components/DashboardStats";
import ShareholdersTable from "../modules/dashboard/components/ShareholdersTable";
import SharesTable from "../modules/dashboard/components/SharesTable";

export function Dashboard() {
  
  const { mode } = useParams();

  // TODO: using this dictionary thing a lot... hmmm
  const grant = useQuery<{ [dataID: number]: Grant }, string>("grants", () =>
    fetch("/grants").then((e) => e.json())
  );
  const shareholder = useQuery<{ [dataID: number]: Shareholder }>(
    "shareholders",
    () => fetch("/shareholders").then((e) => e.json())
  );
  const shares = useQuery<{ [dataID: number]: Share }>(
    "shares",
    () => fetch("/shares").then((e) => e.json())
  );

  const calcMarketCap = () => {
    const sharePricesPerType = Object.values(shares?.data ?? {})
      .reduce((prev, curr) => {
        prev[curr.type] = curr.price
        return prev;
      }, { common: 0, preferred: 0 });

    return Object.values(grant?.data ?? {})
      .reduce((prev, curr) => {
        return prev += curr.amount * sharePricesPerType[curr.type]
      }, 0)
  }

  const noData = !(grant.data && Object.keys(grant.data).length);

  if (grant.status === "error") {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error: {grant.error}</AlertTitle>
      </Alert>
    );
  }
  if (grant.status !== "success") {
    return <Spinner />;
  }
  if (!grant.data || !shareholder.data) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Failed to get any data</AlertTitle>
      </Alert>
    );
  }

  return (
    <Stack>
      <DashboardNav mode={mode} />
      <DashboardStats marketCap={calcMarketCap()} />

      {noData && <Text>There are no grants</Text>}
      {!noData && <Chart
        groupBy={mode}
        shareholder={shareholder.data}
        grant={grant.data}
        shares={shares.data} />}

      <ShareholdersTable shareholders={shareholder.data} grants={grant.data} />
      <SharesTable shares={shares.data ?? {}} />
    </Stack>
  );
}
