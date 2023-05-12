const data = [  {
  columnName: 'age',
  dataType: 'Integer',
  pk: 'f',
  nc: 1,
  uc: 'f',
  fk: 'f'
},  { columnName: 'bmi', dataType: 'Integer', nc: 1}];

const result = data.reduce((acc, obj) => {
  Object.entries(obj).forEach(([key, value]) => {
    if (!acc[key]) acc[key] = [];
    acc[key].push(value);
  });
  return acc;
}, {});

console.log(result);