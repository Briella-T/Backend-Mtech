import { createObjectCsvWriter } from 'csv-writer';

export const users = [
  { id: 1, fullName: 'Alice Johnson', age: 28 },
  { id: 2, fullName: 'Bob Smith', age: 35 },
  { id: 3, fullName: 'Carol Lee', age: 42 },
  { id: 4, fullName: 'David Kim', age: 19 },
  { id: 5, fullName: 'Eva Patel', age: 31 }
];

const csvWriter = createObjectCsvWriter({
    path: 'output/filtered.csv',
    header: [
        { id: 'id', title: 'ID'},
        { id: 'fullName', title: 'Full Name'},
        { id: 'age', title: 'Age'},
    ]
});

csvWriter.writeRecords(users);
console.log('CSV written to output/filtered.csv');