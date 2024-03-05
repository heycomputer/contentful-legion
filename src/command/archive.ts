import { Args, Command } from "@effect/cli";
import { Console, Effect } from "effect";
import * as Data from "effect/Data";
import { parse } from "qs";

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
).pipe(Args.withDescription("entity type"));

const query = Args.text({ name: "query" }).pipe(
  Args.withDescription(
    "query to find entities - see https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/ for query syntax"
  )
);

export const archive = Command.make(
  "archive",
  { entity, query },
  ({ entity, query }) =>
    Effect.try({
      try: () => parse(query),
      catch: (unknown) =>
        new Error(
          [
            "unable to parse query,",
            "see https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/ for query syntax",
            unknown?.toString(),
          ].join("\n")
        ),
    }).pipe(
      Effect.map((query) => {
        Console.log(`Running 'legion archive ${entity} ${query}'`);
      })
    )
).pipe(Command.withDescription("archive entities that match a query"));
