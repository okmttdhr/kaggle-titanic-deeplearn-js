const csv = require('csv');
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '../../Downloads/train.csv');
const wstream = fs.createWriteStream('./temp2.csv');

const parser = csv.parse({trim: true}, (err, data) => {
  // console.log('data', data);

  const rows = [];
  data.forEach((columns, index) => {
    if (index === 1 || index === 0) {
      console.log('columns', columns);
      console.log('columns.length', columns.length);
    }

    const row = columns.join(',');
    // console.log('row', row);
    const row = columns.filter((c, i) => {
      const isNotPassengerId = i !== 0;
      const isNotName = i !== 3;
      const isNotTicket = i !== 8;
      const isNotCabin = i !== 10;
      if (isNotPassengerId && isNotName && isNotTicket && isNotCabin) {
        return true;
      }
    }).join(',');

    rows.push(row);
  });

  // console.log('rows', rows);
  const csvContent = rows.join('\n');

  wstream.write(csvContent);
});


fs.createReadStream(FILE).pipe(parser);
