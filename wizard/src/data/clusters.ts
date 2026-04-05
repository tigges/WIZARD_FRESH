import type { Cluster } from '../types';

export const clusters: Cluster[] = [
  { id: 'acct', name: 'Core Concepts\n& Account Mgmt', color: '#5F5E5A', tc: '#f1efe8', bc: '#D3D1C7', themes: [{ label: 'Onboarding', bg: '#f1efe8', bc: '#D3D1C7', tc: '#444441' }, { label: 'Player Lifecycle', bg: '#f1efe8', bc: '#D3D1C7', tc: '#444441' }], count: 8 },
  { id: 'with', name: 'Withdrawals\n& Cashier', color: '#BA7517', tc: '#FAEEDA', bc: '#EF9F27', themes: [{ label: 'Financial Flow', bg: '#FAEEDA', bc: '#EF9F27', tc: '#633806' }, { label: 'Cancellation', bg: '#FAEEDA', bc: '#EF9F27', tc: '#633806' }], count: 22 },
  { id: 'pay', name: 'Payments\n& Deposits', color: '#3B6D11', tc: '#EAF3DE', bc: '#97C459', themes: [{ label: 'Financial Flow', bg: '#EAF3DE', bc: '#97C459', tc: '#27500A' }, { label: 'PSP', bg: '#EAF3DE', bc: '#97C459', tc: '#27500A' }], count: 18 },
  { id: 'risk', name: 'Verification\n& Risk', color: '#993C1D', tc: '#FAECE7', bc: '#F0997B', themes: [{ label: 'KYC', bg: '#FAECE7', bc: '#F0997B', tc: '#712B13' }, { label: 'AML', bg: '#FAECE7', bc: '#F0997B', tc: '#712B13' }, { label: 'Compliance', bg: '#FAECE7', bc: '#F0997B', tc: '#712B13' }], count: 16 },
  { id: 'safe', name: 'Account Status\n& Safety', color: '#993556', tc: '#FBEAF0', bc: '#ED93B1', themes: [{ label: 'Responsible Gaming', bg: '#FBEAF0', bc: '#ED93B1', tc: '#72243E' }, { label: 'Self-Exclusion', bg: '#FBEAF0', bc: '#ED93B1', tc: '#72243E' }], count: 9 },
  { id: 'bonus', name: 'Bonuses\n& Gamification', color: '#534AB7', tc: '#EEEDFE', bc: '#AFA9EC', themes: [{ label: 'Promotions', bg: '#EEEDFE', bc: '#AFA9EC', tc: '#3C3489' }, { label: 'Rewards', bg: '#EEEDFE', bc: '#AFA9EC', tc: '#3C3489' }], count: 10 },
  { id: 'sport', name: 'Sports\nBetting', color: '#0F6E56', tc: '#E1F5EE', bc: '#5DCAA5', themes: [{ label: 'Live Betting', bg: '#E1F5EE', bc: '#5DCAA5', tc: '#085041' }], count: 7 },
  { id: 'data', name: 'User Data\n& Support', color: '#185FA5', tc: '#E6F1FB', bc: '#85B7EB', themes: [{ label: 'Player Comms', bg: '#E6F1FB', bc: '#85B7EB', tc: '#0C447C' }, { label: 'Escalation', bg: '#E6F1FB', bc: '#85B7EB', tc: '#0C447C' }], count: 14 },
];
