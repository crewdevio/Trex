const response = await fetch(
  "https://raw.githubusercontent.com/denoland/deno_website2/master/database.json"
); // * get all thirt party 

const database = await response.json();

export default Object.keys(database);
