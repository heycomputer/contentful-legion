import { EntryProps, KeyValueMap, QueryOptions } from "contentful-management";
import { Effect } from "effect";
import { ContentfulPlainClientAPI } from "../service/contentful-plain-client";
import { hasMorePages } from "../util/contentful";

export const query =
  (client: ContentfulPlainClientAPI) =>
  <T extends KeyValueMap>(queryOptions: QueryOptions) =>
    Effect.gen(function* (_) {
      let morePages = true;
      let skip = 0;
      const limit = 1000;
      let entries: EntryProps<T>[] = [];
      while (morePages) {
        const collection = yield* _(
          client.entry.getMany<T>({
            query: {
              skip,
              limit,
              ...queryOptions,
            },
          })
        );
        entries = [...entries, ...collection.items];
        morePages = hasMorePages<EntryProps>(collection);
        skip = collection.skip + collection.items.length;
      }
      return {
        entries,
        queryOptions,
      };
    });
