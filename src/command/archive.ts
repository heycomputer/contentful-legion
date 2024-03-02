import { Args, Command, Options } from "@effect/cli";
import { Console } from "effect";

const query = Args.text({ name: "query" });

export const archive = Command.make("archive", { query }, ({ query }) => {
  return Console.log(`Running 'legion archive ${query}'`);
});
