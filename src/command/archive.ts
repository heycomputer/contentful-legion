import { Args, Command, Options } from "@effect/cli";
import {
  EntryProps,
  PlainClientAPI,
  QueryOptions,
} from "contentful-management";
import { Console } from "effect";
import * as Data from "effect/Data";
import { parse } from "qs";
import { ContentfulPlainClientAPI } from "../service/contentful-plain-client";
import { hasMorePages } from "../util/contentful";

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
  ({ entity, query }) => {
    const qs = parse(query);
    return Console.log(`Running 'legion archive ${entity} ${query}'`);
  }
).pipe(Command.withDescription("archive entities that match a query"));

const queryEntries =
  (client: ContentfulPlainClientAPI) => async (queryOptions: QueryOptions) => {
    let morePages = true;
    let skip = 0;
    const limit = 1000;
    let entries: EntryProps[] = [];
    while (morePages) {
      const collection = await client.entry.getMany({
        query: {
          skip,
          limit,
          ...queryOptions,
        },
      });
      entries = [...entries, ...collection.items];
      morePages = hasMorePages<EntryProps>(collection);
      skip = collection.skip + collection.items.length;
    }
    return {
      entries,
      queryOptions,
    };

    return client.entry.getMany({ query });
  };
