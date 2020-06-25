import { offLine } from './logs.ts';

// * get all thirt party
const response = await fetch(
  "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json"
  ).catch( (_) => offLine()) as Response;

const database = await response.json();

export default Object.keys(database);
