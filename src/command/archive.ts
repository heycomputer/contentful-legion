import { Command, Options } from "@effect/cli";
import { Console } from "effect";

const query = Options.text("query").pipe(Options.withAlias("q"));

export const archive = Command.make("archive", { query }, ({ query }) => {
  return Console.log(`Running 'legion archive ${query}'`);
});
