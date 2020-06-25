import { offLine } from "../utils/logs.ts"

const response = await fetch(
  "https://raw.githubusercontent.com/crewdevio/Trex/master/database.json"
).catch( (_) => offLine()) as Response;
// * get data from database.json

const data = await response.json();

export default data;
