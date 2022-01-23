import jStat from "jstat";
const { normal } = jStat;

export interface blackScholesParameters {
  stock: number;
  strike: number;
  rate: number;
  volatility: number;
  timeToExpiry: number;
  dividendRate: number;
  optionType: "call" | "put";
}

export interface blackScholesOutput {
  value: number;
  delta: number;
  gamma: number;
  rho: number;
  vega: number;
  epsilon: number;
  theta: number;
  strikeGreek: number;
}

// d1 component of the black scholes formula
const d1 = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
}: blackScholesParameters): number => {
  return (Math.log(s / k) + (r - d + (v * v) / 2) * t) / (v * Math.sqrt(t));
};

// d2 component of the black scholes formula
const d2 = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
}: blackScholesParameters): number => {
  return (Math.log(s / k) + (r - d - (v * v) / 2) * t) / (v * Math.sqrt(t));
};

// delta sensitivity of the black scholes formula
const delta = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
  optionType,
}: blackScholesParameters): number => {
  const params: blackScholesParameters = {
    stock: s,
    strike: k,
    rate: r,
    volatility: v,
    timeToExpiry: t,
    dividendRate: d,
    optionType,
  };
  const d1_ = d1(params);
  if (optionType === "call") {
    return Math.exp(-d * t) * normal.cdf(d1_, 0, 1);
  }
  return -Math.exp(-d * t) * normal.cdf(-d1_, 0, 1);
};

// gamma sensitivity of the black scholes formula
const gamma = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
  optionType,
}: blackScholesParameters): number => {
  const params: blackScholesParameters = {
    stock: s,
    strike: k,
    rate: r,
    volatility: v,
    timeToExpiry: t,
    dividendRate: d,
    optionType,
  };
  const d1_ = d1(params);
  return (Math.exp(-d * t) * normal.pdf(d1_, 0, 1)) / (s * v * Math.sqrt(t));
};

// rho sensitivity of the black scholes formula
const rho = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
  optionType,
}: blackScholesParameters): number => {
  const params: blackScholesParameters = {
    stock: s,
    strike: k,
    rate: r,
    volatility: v,
    timeToExpiry: t,
    dividendRate: d,
    optionType,
  };
  const d2_ = d2(params);
  if (optionType === "call") {
    return k * t * Math.exp(-r * t) * normal.cdf(d2_, 0, 1);
  }
  return -k * t * Math.exp(-r * t) * normal.cdf(-d2_, 0, 1);
};

// vega sensitivity of the black scholes formula
const vega = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
  optionType,
}: blackScholesParameters): number => {
  const params: blackScholesParameters = {
    stock: s,
    strike: k,
    rate: r,
    volatility: v,
    timeToExpiry: t,
    dividendRate: d,
    optionType,
  };
  const d1_ = d1(params);
  return s * Math.exp(-d * t) * normal.pdf(d1_, 0, 1) * Math.sqrt(t);
};

// theta sensitivity of the black scholes formula
const theta = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
  optionType,
}: blackScholesParameters): number => {
  const params: blackScholesParameters = {
    stock: s,
    strike: k,
    rate: r,
    volatility: v,
    timeToExpiry: t,
    dividendRate: d,
    optionType,
  };
  const d1_ = d1(params);
  const d2_ = d2(params);
  if (optionType === "call") {
    return (
      -(s * Math.exp(-d * t) * normal.pdf(d1_, 0, 1) * v) / (2 * Math.sqrt(t)) -
      r * k * Math.exp(-r * t) * normal.cdf(d2_, 0, 1) +
      d * s * Math.exp(-d * t) * normal.cdf(d1_, 0, 1)
    );
  }
  return (
    -(s * Math.exp(-d * t) * normal.pdf(d1_, 0, 1) * v) / (2 * Math.sqrt(t)) +
    r * k * Math.exp(-r * t) * normal.cdf(-d2_, 0, 1) -
    d * s * Math.exp(-d * t) * normal.cdf(-d1_, 0, 1)
  );
};

// epsilon sensitivity of the black scholes formula
const epsilon = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
  optionType,
}: blackScholesParameters): number => {
  const params: blackScholesParameters = {
    stock: s,
    strike: k,
    rate: r,
    volatility: v,
    timeToExpiry: t,
    dividendRate: d,
    optionType,
  };
  const d1_ = d1(params);
  if (optionType === "call") {
    return -s * t * Math.exp(-d * t) * normal.cdf(d1_, 0, 1);
  }
  return -s * t * Math.exp(-d * t) * normal.cdf(-d1_, 0, 1);
};

// strikeGreek sensitivity of the black scholes formula
const strikeGreek = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
  optionType,
}: blackScholesParameters): number => {
  const params: blackScholesParameters = {
    stock: s,
    strike: k,
    rate: r,
    volatility: v,
    timeToExpiry: t,
    dividendRate: d,
    optionType,
  };
  const d2_ = d2(params);
  if (optionType === "call") {
    return -Math.exp(-r * t) * normal.cdf(d2_, 0, 1);
  }
  return Math.exp(-r * t) * normal.cdf(-d2_, 0, 1);
};

// black scholes value for call and put options
const blackScholesValue = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
  optionType,
}: blackScholesParameters): number => {
  const params: blackScholesParameters = {
    stock: s,
    strike: k,
    rate: r,
    volatility: v,
    timeToExpiry: t,
    dividendRate: d,
    optionType,
  };
  const d1_ = d1(params);
  const d2_ = d2(params);
  if (optionType === "call") {
    return (
      s * Math.exp(-d * t) * normal.cdf(d1_, 0, 1) -
      k * Math.exp(-r * t) * normal.cdf(d2_, 0, 1)
    );
  }
  return (
    k * Math.exp(-r * t) * normal.cdf(-d2_, 0, 1) -
    s * Math.exp(-d * t) * normal.cdf(-d1_, 0, 1)
  );
};

// black scholes value and greeks for call and put options
export const blackScholesResult = ({
  stock: s,
  strike: k,
  rate: r,
  volatility: v,
  timeToExpiry: t,
  dividendRate: d,
  optionType,
}: blackScholesParameters): blackScholesOutput => {
  const params: blackScholesParameters = {
    stock: s,
    strike: k,
    rate: r,
    volatility: v,
    timeToExpiry: t,
    dividendRate: d,
    optionType,
  };
  return {
    value: blackScholesValue(params),
    delta: delta(params),
    gamma: gamma(params),
    rho: rho(params),
    vega: vega(params),
    epsilon: epsilon(params),
    theta: theta(params),
    strikeGreek: strikeGreek(params),
  };
};
