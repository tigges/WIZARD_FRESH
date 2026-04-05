import type { FileMeta } from '../types';

export interface SampleDef {
  id: string;
  label: string;
  file: FileMeta;
  text: string;
}

export const sampleFiles: FileMeta[] = [
  { name: 'CS_Training_Manual_v3.pdf', pages: 142, size: '38 MB', type: 'PDF', typeBg: '#fef2f2', typeColor: '#991b1b' },
  { name: 'KYC_Escalation_Procedures.docx', pages: 28, size: '9 MB', type: 'DOC', typeBg: '#eff6ff', typeColor: '#1e40af' },
];

export const samples: SampleDef[] = [
  {
    id: 'withdrawal',
    label: 'Withdrawal Processing',
    file: { name: '4.2_Processing_a_Withdrawal.pdf', pages: 3, size: '179 KB', type: 'PDF', typeBg: '#fef2f2', typeColor: '#991b1b' },
    text: `4.2 Processing a Withdrawal

Finance Tab
An initiated withdrawal request will show as Pending

Withdrawal statuses
The status of the withdrawal is shown in the Finance tab, under the column 'Status':
- Pending: The withdrawal request has been created, and it's being processed
- Cancelled/Declined: The withdrawal request has been declined for some reason
- Complete: The withdrawal has been processed and already sent from our side
- Awaiting: Is a withdrawal that should be "pending", but due to a bug became "awaiting"

Cancelling a withdrawal request
By the player — can only be cancelled while in 'pending' status:
1. Cashier Withdrawal tab
2. Choose the withdrawal they want to cancel
3. Click cancel

By KYC — without player's approval:
- Wrong/missing payment details
- Error in processing
- Verification failed

By Customer Support — upon player's request:
1. Advise/teach the customer to do it themselves
2. If they cannot do it, escalate to SM
3. Post in the support channel`,
  },
  {
    id: 'kyc',
    label: 'KYC Verification (raw)',
    file: { name: 'KYC_Verification_Procedures.txt', pages: 1, size: '4 KB', type: 'TXT', typeBg: '#f5f5f5', typeColor: '#555' },
    text: `KYC & Verification Procedures

Document Verification Service (DVS)
All new players must complete identity verification before first withdrawal.

Required documents:
- Government-issued photo ID (passport, driver's license)
- Proof of address (utility bill, bank statement — less than 3 months old)
- Payment method verification (credit card photo, e-wallet screenshot)

DVS Check Process:
1. Player uploads documents via account settings
2. System auto-checks document quality and readability
3. If auto-check passes → DVS verification triggered
4. DVS result: Pass / Fail / Inconclusive
5. Pass → account marked as verified
6. Fail → player notified to resubmit
7. Inconclusive → manual review by Team Lead

Escalation Triggers:
- 3+ failed attempts → account flagged for AML review
- Mismatched names → compliance team notification
- Expired documents → auto-rejection with resubmit prompt`,
  },
];
