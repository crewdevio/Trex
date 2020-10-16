import { Maven } from "../imports/merlin.ts";
import { LogHelp, newLogHelp } from "../utils/logs.ts";
import { helpsInfo, strInfo } from "../utils/info.ts";

const bench = new Maven();



bench.Bench({
  name: "bench help info native time log",
  fn() {
    LogHelp(helpsInfo);
  },
  steps: 1000
});

bench.Bench({
  name: "bench help info no loop time log",
  fn() {
    newLogHelp(helpsInfo);
  },
  steps: 1000
});


bench.Bench({
  name: "bench help info no loop and array time log",
  fn() {
    console.log(strInfo);
  },
  steps: 1000
});

bench.runBench().then(bench.Result(10));