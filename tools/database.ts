const response = await fetch(
  "https://raw.githubusercontent.com/crewdevio/Trex/beta-test/database.json"
);

const data = await response.json();

export default data;
