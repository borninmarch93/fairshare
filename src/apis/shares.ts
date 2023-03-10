import { Share } from "../types";

export const postShare = (share: Share) =>fetch("/share/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(share),
  }).then((res) => res.json());

export const putShare = (share: Share) =>
    fetch("/share/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(share),
    }).then((res) => res.json())