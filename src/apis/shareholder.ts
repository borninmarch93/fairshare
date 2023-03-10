import { Shareholder } from "../types";

export const postNewShareholder = (shareholder: Omit<Shareholder, "grants" | "id">) => fetch("/shareholder/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(shareholder),
}).then((res) => res.json())