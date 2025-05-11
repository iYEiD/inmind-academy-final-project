export interface Transaction {
  name: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending';
}

export function getTransactions(): Transaction[] {
  return [
    { name: 'Youssef E.', date: '24.05.2020', amount: 124.97, status: 'Paid' },
    {
      name: 'Michael T.',
      date: '23.05.2020',
      amount: 55.42,
      status: 'Pending',
    },
    { name: 'Rose S.', date: '23.05.2020', amount: 89.9, status: 'Paid' },
    { name: 'Hiba A.', date: '22.05.2020', amount: 144.94, status: 'Pending' },
    { name: 'Christ E.', date: '22.05.2020', amount: 70.52, status: 'Paid' },
  ];
}
