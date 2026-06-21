export type NotifType =
  | 'TRANSFER'
  | 'BILL'
  | 'CASHBACK'
  | 'LOAN'
  | 'KYC'
  | 'ACCOUNT'
  | 'SYSTEM';

export interface NotifItem {
  id:      number;
  title:   string;
  message: string;
  time:    string;       // ISO string from backend
  read:    boolean;
  type?:   NotifType;
  link?:   string;
}

// ← backward-compat alias so older files don't break
export type AppNotification = NotifItem;