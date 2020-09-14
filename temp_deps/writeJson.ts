// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

type Replacer = (key: string, value: any) => any;

export interface WriteJsonOptions extends Deno.WriteFileOptions {
  replacer?: Array<number | string> | Replacer;
  spaces?: number | string;
}

function serialize(
  filePath: string,
  object: any,
  options: WriteJsonOptions
): string {
  try {
    const jsonString = JSON.stringify(
      object,
      options.replacer as string[],
      options.spaces
    );
    return `${jsonString}\n`;
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}

/* Writes an object to a JSON file. */
export async function writeJson(
  filePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  options: WriteJsonOptions = {}
): Promise<void> {
  const jsonString = serialize(filePath, object, options);
  await Deno.writeTextFile(filePath, jsonString, {
    append: options.append,
    create: options.create,
    mode: options.mode,
  });
}

/* Writes an object to a JSON file. */
export function writeJsonSync(
  filePath: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  options: WriteJsonOptions = {}
): void {
  const jsonString = serialize(filePath, object, options);
  Deno.writeTextFileSync(filePath, jsonString, {
    append: options.append,
    create: options.create,
    mode: options.mode,
  });
}

// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

/** Reads a JSON file and then parses it into an object */
export async function readJson(filePath: string): Promise<unknown> {
  const decoder = new TextDecoder("utf-8");

  const content = decoder.decode(await Deno.readFile(filePath));

  try {
    return JSON.parse(content);
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}

/** Reads a JSON file and then parses it into an object */
export function readJsonSync(filePath: string): unknown {
  const decoder = new TextDecoder("utf-8");

  const content = decoder.decode(Deno.readFileSync(filePath));

  try {
    return JSON.parse(content);
  } catch (err) {
    err.message = `${filePath}: ${err.message}`;
    throw err;
  }
}
