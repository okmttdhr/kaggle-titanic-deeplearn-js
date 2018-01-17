const csv = require('csv');
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../../Downloads/train.csv');
const wstream = fs.createWriteStream('./temp.csv');

const sum = (arr) => {
  return arr.reduce((prev, current, i, arr) => {
    return prev + current;
  });
};

const average = (arr) => {
  return sum(arr) / arr.length;
};

const parser = csv.parse({trim: true}, (err, data) => {
  // console.log('data', data);

  const rows = [];
  // const age = [];
  data.forEach((columns, index) => {
    if (index === 0 || index === 1) {
      console.log('columns', columns);
      console.log('columns.length', columns.length);
      // console.log('columns[0]', columns[0]);
      // console.log('columns[9]', columns[9]);
    }

    // console.log('columns[5]: before', columns[5]);
    const averageAge = 23.79929292929293;
    if (!columns[5]) {
      columns[5] = averageAge;
      console.log('columns[5]: after', columns[5]);
    }

    const row = columns.filter((c, i) => {
      const isNotPassengerId = i !== 0;
      const isNotSurvived = i !== 1;
      const isNotName = i !== 3;
      const isNotTicket = i !== 8;
      const isNotCabin = i !== 10;
      if (isNotPassengerId && isNotName && isNotTicket && isNotCabin && isNotSurvived) {
        return true;
      }
      // return i === 1;
    }).join(',');

    rows.push(row);
    // if (index !== 0) {
    //   age.push(Number(columns[9]));
    // }
  });

  // console.log('age', age);
  // console.log('average(age)', average(age));

  // console.log('rows', rows);
  const csvContent = rows.join('\n');

  wstream.write(csvContent);
});


fs.createReadStream(FILE).pipe(parser);
