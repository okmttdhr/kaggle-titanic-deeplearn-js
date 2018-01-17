import {
  Array1D,
  Array2D,
  NDArrayMathGPU,
  NDArrayMath,
  ENV,
  Scalar,
  Session,
  SGDOptimizer,
  InCPUMemoryShuffledInputProviderBuilder,
  CostReduction,
  Graph,
  Tensor,
  NDArray
} from 'deeplearn';

import {trainX} from './trainX';
import {trainY} from './trainY';

const graph: Graph = new Graph();
const x: Tensor = graph.placeholder("x", [7]);
const t: Tensor = graph.placeholder('t', []);

// input layer - hidden layer
const w0: Tensor = graph.variable("w0", Array2D.randNormal([7, 7]));
const b0: Tensor = graph.variable("b0", Scalar.randNormal([]));
const h0: Tensor = graph.relu(graph.add(graph.matmul(x, w0), b0));

// hidden layer - output layer
const w1: Tensor = graph.variable("w1", Array2D.randNormal([7, 1]));
const b1: Tensor = graph.variable("b1", Scalar.randNormal([]));
const y: Tensor = graph.sigmoid(graph.reshape(graph.add(graph.matmul(h0, w1), b1), []));

const cost: Tensor = graph.meanSquaredCost(y, t);

const math: NDArrayMath = ENV.math;
const session: Session = new Session(graph, math);

math.scope((keep, track) => {
  const xs: Array1D[] = trainX.map(x => track(Array1D.new(x)));
  const ys: Scalar[] = trainY.map(x => track(Scalar.new(x)));

  const shuffledInputProviderBuilder = new InCPUMemoryShuffledInputProviderBuilder([xs, ys]);
  const provider = shuffledInputProviderBuilder.getInputProviders();
  const [xProvider, yProvider] = shuffledInputProviderBuilder.getInputProviders();

  const BATCHE_NUM = 500;
  const BATCH_SIZE = xs.length;
  const LEARNING_RATE = 0.7925;
  const optimizer = new SGDOptimizer(LEARNING_RATE);
  console.log('LEARNING_RATE', LEARNING_RATE);

  for (let i = 0; i < BATCHE_NUM; i++) {
    const costValue = session.train(
        cost,
        [{tensor: x, data: xProvider}, {tensor: t, data: yProvider}],
        BATCH_SIZE, optimizer, CostReduction.MEAN
      );
    console.log('-----------------------------');
    console.log('index', i);
    console.log('cost', costValue.get());
  }

  const results = [];
  for (let i = 0; i < trainX.length; i++) {
    const result: NDArray = session.eval(y, [{tensor: x, data: track(Array1D.new(trainX[i]))}]);
    let r = result.getValues()[0] > 0.5 ? 1 : 0;
    const isCorrect = r === trainY[i]
    console.log('isCorrect', isCorrect);
    results.push(isCorrect);
  }
  console.log('results', results)
  console.log('correct', `${results.filter((r) => r).length} / ${results.length}`)
});
