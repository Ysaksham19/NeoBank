export type BeneficiaryType   = 'INTERNAL' | 'EXTERNAL';
export type BeneficiaryStatus = 'ACTIVE'   | 'BLOCKED';

export interface Beneficiary {
  id:              number;
  nickname:        string;
  accountNumber:   string;
  bankName:        string;
  ifscCode:        string;
  beneficiaryType: BeneficiaryType;
  status:          BeneficiaryStatus;
  isFavorite:      boolean;
  dailyLimit:      number;
  addedAt:         string;
  lastUsedAt:      string | null;
}

export interface AddBeneficiaryRequest {
  nickname:        string;
  accountNumber:   string;
  bankName:        string;
  ifscCode:        string;
  beneficiaryType: BeneficiaryType;
  dailyLimit:      number;
}

export interface EditBeneficiaryRequest {
  nickname:   string;
  dailyLimit: number;
}