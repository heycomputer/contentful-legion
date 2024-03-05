import { Args, Command, Options } from "@effect/cli";
import { Console } from "effect";
import * as Data from "effect/Data";

type Entity = Entry | Asset;
class Entry extends Data.TaggedClass("Entry")<{}> {}
class Asset extends Data.TaggedClass("Asset")<{}> {}
const asset = new Asset();
const entry = new Entry();

const entity = Args.choice<Entity>(
  [
    ["asset", asset],
    ["entry", entry],
  ],
  { name: "entity" }
);

const query = Args.text({ name: "query" });

export const archive = Command.make(
  "archive",
  { entity, query },
  ({ entity, query }) => {
    return Console.log(`Running 'legion archive ${entity} ${query}'`);
  }
).pipe(Command.withDescription("archive entities that match a query"));
