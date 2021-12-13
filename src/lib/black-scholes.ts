export interface blackScholesParameters {
  stock: number;
  strike: number;
  rate: number;
  volatility: number;
  timeToExpiry: number;
  dividendRate: number;
  optionType: "call" | "put";
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

// black scholes formula for call and put options
export const blackScholesValue = (params: blackScholesParameters): number => {
  if (params.optionType === "call") {
    return d1(params);
  }
  return d2(params);
};
