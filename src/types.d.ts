export interface User {
  name: string;
  email: string;
  shareholderID?: number;
}

export interface Company {
  name: string;
}

export interface Share {
  id: number;
  type: ShareType
  price: number;
}

export interface Grant {
  id: number;
  name: string;
  amount: number;
  issued: string;
  type: ShareType
}

export interface Shareholder {
  id: number;
  name: string;
  // TODO: allow inviting/creating user account for orphan shareholders
  email?: string;
  grants: number[];
  group: ShareholderGroup
}

export type ShareType = "common" | "preferred";

export type ShareholderGroup = "employee" | "founder" | "investor";
