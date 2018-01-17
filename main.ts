import {
  Array1D,
  Array2D,
  NDArrayMathGPU,
  Scalar,
  Session,
  SGDOptimizer,
  InCPUMemoryShuffledInputProviderBuilder,
  CostReduction,
  Graph,
  Tensor,
  NDArray
} from 'deeplearn';

import {trainY} from './trainY';
const graph: Graph = new Graph();
const x: Tensor = graph.placeholder("x", [12]);
const t: Tensor = graph.placeholder('t', []);

// input layer - hidden layer
const w0: Tensor = graph.variable("w0", Array2D.randNormal([12, 12]));
const b0: Tensor = graph.variable("b0", Scalar.randNormal([]));
const h0: Tensor = graph.relu(graph.add(graph.matmul(x, w0), b0));

// hidden layer - output layer
const w1: Tensor = graph.variable("w1", Array2D.randNormal([12, 1]));
const b1: Tensor = graph.variable("b1", Scalar.randNormal([]));
const y: Tensor = graph.sigmoid(graph.reshape(graph.add(graph.matmul(h0, w1), b1), []));

const cost: Tensor = graph.meanSquaredCost(y, t);

const math: NDArrayMathGPU = new NDArrayMathGPU();
const session: Session = new Session(graph, math);

math.scope((keep, track) => {
  const xs: Array1D[] = trainX.map(x => track(Array1D.new(x)));
  const ys: Scalar[] = trainY.map(x => track(Scalar.new(x)));

  const shuffledInputProviderBuilder = new InCPUMemoryShuffledInputProviderBuilder([xs, ys]);
  const [xProvider, yProvider] = shuffledInputProviderBuilder.getInputProviders();

  const NUM_BATCHES = 500;
  const BATCH_SIZE = xs.length;
  const LEARNING_RATE = 1;
  const optimizer = new SGDOptimizer(LEARNING_RATE);
  for (let i = 0; i < NUM_BATCHES; i++) {
    const costValue = session.train(
        cost,
        [{tensor: x, data: xProvider}, {tensor: t, data: yProvider}],
        BATCH_SIZE, optimizer, CostReduction.MEAN
      );
    console.log("Average cost: " + costValue.get());
  }
});
