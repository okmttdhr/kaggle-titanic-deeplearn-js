const csv = require('csv');
const fs = require('fs');
const path = require('path');

// const FILE = path.join(__dirname, '../../Downloads/ml/test.csv');
const FILE = path.join(__dirname, '../../Downloads/ml/train.csv');
const wstream = fs.createWriteStream('./temp.csv');
// const wstream = fs.createWriteStream('./temp2.csv');

const sum = (arr) => {
  return arr.reduce((prev, current, i, arr) => {
    return prev + current;
  });
};

const average = (arr) => {
  return sum(arr) / arr.length;
};

const variance = (arr) => {
  var ave = average(arr);
  var varia = 0;
  for (i = 0; i < arr.length; i++) {
    varia = varia + Math.pow(arr[i] - ave, 2);
  }
  return (varia / arr.length);
}

const standardDeviation = (arr) => {
  var varia = variance(arr);
  return Math.sqrt(varia);
}

const parser = csv.parse({trim: true}, (err, data) => {
  const rows = [];

  const sibsp = [];
  const parch = [];
  const fare = [];
  const age = [];

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
    const standardDeviationAge = 13.206201002454545;
    if (!columns[5]) {
      columns[5] = averageAge;
    }
    columns[5] = (columns[5] - averageAge) / standardDeviationAge;
    console.log('columns[5]: after', columns[5]);

    // sibsp
    console.log('columns[6]: before', columns[6]);
    const averageSibsp = 0.5230078563411896;
    const standardDeviationSibsp = 1.1021244350892836;
    columns[6] = (columns[6] - averageSibsp) / standardDeviationSibsp;
    console.log('columns[6]: after', columns[6]);

    // parch
    console.log('columns[7]: before', columns[7]);
    const averageParch = 0.38159371492704824;
    const standardDeviationParch = 0.8056047612452284;
    columns[7] = (columns[7] - averageParch) / standardDeviationParch;
    console.log('columns[7]: after', columns[7]);

    // fare
    console.log('columns[9]: before', columns[9]);
    const averageFare = 32.2042079685746;
    const standardDeviationFare = 49.66553444477411;
    columns[9] = (columns[9] - averageFare) / standardDeviationFare;
    console.log('columns[9]: after', columns[9]);

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

    // trainX
    rows.push(row);

    if (index !== 0) {
      sibsp.push(Number(columns[6]));
      parch.push(Number(columns[7]));
      fare.push(Number(columns[9]));
      age.push(Number(columns[5]));
    }

    // trainY
    // rows.push(columns[1]);
  });

  console.log('average(sibsp)', average(sibsp));
  console.log('standardDeviation(sibsp)', standardDeviation(sibsp));
  console.log('average(parch)', average(parch));
  console.log('standardDeviation(parch)', standardDeviation(parch));
  console.log('average(fare)', average(fare));
  console.log('standardDeviation(fare)', standardDeviation(fare));
  console.log('average(age)', average(age));
  console.log('standardDeviation(age)', standardDeviation(age));

  wstream.write(JSON.stringify(rows));
});


fs.createReadStream(FILE).pipe(parser);
