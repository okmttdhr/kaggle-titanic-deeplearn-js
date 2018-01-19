
# Kaggle's Titanic Tutorial with deeplearn.js

## Demo

```sh
yarn install
yarn build
```

Open `./index.html` and the browser console.

![](/images/1.gif)

![](/images/2.gif)

Check the GPU process.

![](/images/1.png)


## Data Handling

- Remove not useful data (`PassengerId`, `Name`, `Ticket`, `Cabin`)
- Replace missing `Age` with average
- Feature scaling (`Age`, `SibSp`, `Parch`, `Fare`)
- Categorical data to numerical (`Sex`, `Embarked`)


## Model

- SGD
- Multilayer Perceptron
