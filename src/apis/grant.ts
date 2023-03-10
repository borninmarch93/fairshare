import { Grant } from "../types";

export const postGrant = (grant: Omit<Grant, "id">, shareholderID: string) =>
    fetch("/grant/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            shareholderID: parseInt(shareholderID, 10),
            grant,
        }),
    }).then((res) => res.json())