import { Args, Command } from "@effect/cli";
import { Console, Effect, Match } from "effect";
import * as Data from "effect/Data";
import { parse } from "qs";

const QUERY_SYNTAX_DOC_URL =
  "https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/search-parameters/";

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
    `query to find entities - see ${QUERY_SYNTAX_DOC_URL} for query syntax`
  )
);

export const archive = Command.make(
  "archive",
  { entity, query },
  ({ entity, query }) => {
    switch (entity._tag) {
      case "Entry":
        return Effect.gen(function* (_) {
          yield* _(Console.log(`Running 'legion archive entry ${query}'`));
          const parsedQuery = yield* _(parseQuery(query));
        });

      case "Asset":
        return Effect.gen(function* (_) {
          yield* _(Console.log(`Running 'legion archive asset ${query}'`));
          const parsedQuery = yield* _(parseQuery(query));
        });
    }
  }
).pipe(Command.withDescription("archive entities that match a query"));

const parseQuery = (query: string) =>
  Effect.try({
    try: () => parse(query),
    catch: (unknown) =>
      new Error(
        [
          "unable to parse query,",
          `see ${QUERY_SYNTAX_DOC_URL} for query syntax`,
          unknown?.toString(),
        ].join("\n")
      ),
  });
