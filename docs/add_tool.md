# Make your tool available to install from Trex

if you want your tool to be available to install from trex just add it to [database.json](https://github.com/crewdevio/Trex/blob/master/database.json) file.

it must have the following scheme:

```json
// database.json
{
  "toolName": {
    "permissions": ["--allow-read", "--allow-run"],
    "url": "https://tool.com/tool.ts"
  }
}
```

you create a pull request and send it
