export function help(): void {
  console.log(`
    ██████  ███████ ███    ██  ██████       ██████ ██   ██ ███████  ██████ ██   ██     ██    ██ ██████  ██████   █████  ████████ ███████ ███████ 
    ██   ██ ██      ████   ██ ██    ██     ██      ██   ██ ██      ██      ██  ██      ██    ██ ██   ██ ██   ██ ██   ██    ██    ██      ██      
    ██   ██ █████   ██ ██  ██ ██    ██     ██      ███████ █████   ██      █████       ██    ██ ██████  ██   ██ ███████    ██    █████   ███████ 
    ██   ██ ██      ██  ██ ██ ██    ██     ██      ██   ██ ██      ██      ██  ██      ██    ██ ██      ██   ██ ██   ██    ██    ██           ██ 
    ██████  ███████ ██   ████  ██████       ██████ ██   ██ ███████  ██████ ██   ██      ██████  ██      ██████  ██   ██    ██    ███████ ███████ 
`);

  console.log(`
    Help manual - Using the plugin is very simple type the following command :
    deno run -A --unstable https://deno.land/x/deno_check_updates/main.ts -f import_map.json

    Where import_map.json is your imports map file.
    The result is a logged table with details on which modules needs to be updated.
    `);
}
