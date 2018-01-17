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
  const rows = [];
  data.forEach((columns, index) => {
    if (index === 0 || index === 1) {
      console.log('columns', columns);
      console.log('columns.length', columns.length);
      // console.log('columns[0]', columns[0]);
      // console.log('columns[9]', columns[9]);
    }

    // sex
    console.log('columns[4]: before', columns[4]);
    if (columns[4] === 'male') {
      columns[4] = 0;
    } else {
      columns[4] = 1;
    }
    console.log('columns[4]: after', columns[4]);

    // age
    console.log('columns[5]: before', columns[5]);
    const averageAge = 23.79929292929293;
    // columns[5] = Number(columns[5]);
    if (!columns[5]) {
      columns[5] = averageAge;
      console.log('columns[5]: after', columns[5]);
    }

    // embarked
    console.log('columns[11]: before', columns[11]);
    if (columns[11] === 'C') {
      columns[11] = 0;
    } else if (columns[11] === 'Q') {
      columns[11] = 1;
    } else {
      columns[11] = 2;
    }
    console.log('columns[11]: after', columns[11]);

    const row = columns
      .filter((c, i) => {
        // trainX
        const isNotPassengerId = i !== 0;
        const isNotSurvived = i !== 1;
        const isNotName = i !== 3;
        const isNotTicket = i !== 8;
        const isNotCabin = i !== 10;
        if (isNotPassengerId && isNotName && isNotTicket && isNotCabin && isNotSurvived) {
          return true;
        }

        // trainY
        // return i === 1;
      })
      .map((c, i) => {
        return Number(c);
      })
      ;
    // }).join(',');

    // trainX
    rows.push(row);

    // trainY
    // rows.push(columns[1]);
  });

  // const csvContent = rows.join('\n');

  wstream.write(JSON.stringify(rows));
  // wstream.write(JSON.stringify(rows));
  // wstream.write(csvContent);
});


fs.createReadStream(FILE).pipe(parser);
