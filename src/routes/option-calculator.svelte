<script lang="ts">
  import type { blackScholesOutput, blackScholesParameters } from "$lib/black-scholes";
  import { blackScholesResult } from "$lib/black-scholes";

  export let optionParams: blackScholesParameters = {
    stock: 100.0,
    strike: 100.0,
    rate: 0.035,
    volatility: 0.16,
    timeToExpiry: 1.0,
    dividendRate: 0.01,
    optionType: "put",
  };
  $: console.log(optionParams);
  export let output: blackScholesOutput;
  $: output = blackScholesResult(optionParams);
  console.log(output);
</script>

<h1>Option Calculator</h1>
<lead>Calculate the price of a European call or put option.</lead>
<ul>
  <li>
    <label for="stock">Stock Price</label>
    <input name="stock" type="number" step="1" bind:value={optionParams.stock} />
  </li>
  <li>
    <label for="strike">Strike Price</label>
    <input name="strike" type="number" step="1" bind:value={optionParams.strike} />
  </li>
  <li>
    <label for="rate">Interest Rate</label>
    <input name="rate" type="number" step="0.0025" bind:value={optionParams.rate} />
  </li>
  <li>
    <label for="dividendRate">Dividend Rate</label>
    <input
      name="dividendRate"
      type="number"
      step="0.0025"
      bind:value={optionParams.dividendRate}
    />
  </li>
  <li>
    <label for="volatility">Volatility</label>
    <input
      name="volatility"
      type="number"
      step="0.005"
      bind:value={optionParams.volatility}
    />
  </li>
  <li>
    <label for="timeToExpiry">Time to Expiry</label>
    <input
      name="timeToExpiry"
      type="number"
      step="0.25"
      bind:value={optionParams.timeToExpiry}
    />
  </li>
  <li>
    <label for="optionType">Option Type</label>
    <input name="optionType" type="string" bind:value={optionParams.optionType} />
  </li>
</ul>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Value</th>
    </tr>
  </thead>
  <tr>
    <td>Option Value</td>
    <td>{output.value}</td>
  </tr>
  <tr>
    <td>Delta</td>
    <td>{output.delta}</td>
  </tr>
  <tr>
    <td>Gamma</td>
    <td>{output.gamma}</td>
  </tr>
  <tr>
    <td>Strike Greek</td>
    <td>{output.strikeGreek}</td>
  </tr>
  <tr>
    <td>Rho</td>
    <td>{output.rho}</td>
  </tr>
  <tr>
    <td>Vega</td>
    <td>{output.vega}</td>
  </tr>
  <tr>
    <td>Epsilon</td>
    <td>{output.epsilon}</td>
  </tr>
  <tr>
    <td>Theta</td>
    <td>{output.theta}</td>
  </tr>
</table>
