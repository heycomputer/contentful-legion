import { Effect, Context, Layer, Config } from "effect";
import {
  createClient,
  KeyValueMap,
  PlainClientAPI,
} from "contentful-management";

export class ContentfulPlainClient extends Context.Tag("ContentfulPlainClient")<
  ContentfulPlainClient,
  ContentfulPlainClientAPI
>() {}
export const ContentfulPlainClientLive = Layer.effect(
  ContentfulPlainClient,
  Effect.all([
    Config.string("ENVIRONMENT_ID"),
    Config.string("SPACE_ID"),
    Config.string("ACCESS_TOKEN"),
  ]).pipe(
    Effect.flatMap(([environmentId, spaceId, accessToken]) => {
      const client = createClient(
        { accessToken },
        {
          type: "plain",
          defaults: {
            spaceId,
            environmentId,
          },
        }
      );
      return Effect.succeed(toEffectAPI(client));
    })
  )
);

const toEffectAPI = (client: PlainClientAPI) => ({
  entry: {
    get: <T extends KeyValueMap>(
      ...params: Parameters<PlainClientAPI["entry"]["get"]>
    ) =>
      Effect.tryPromise({
        try: () => client.entry.get<T>(...params),
        catch: (unknown) => new Error(`something went wrong ${unknown}`), // remap the error
      }),
    getMany: <T extends KeyValueMap>(
      ...params: Parameters<PlainClientAPI["entry"]["getMany"]>
    ) =>
      Effect.tryPromise({
        try: () => client.entry.getMany<T>(...params),
        catch: (unknown) => new Error(`something went wrong ${unknown}`), // remap the error
      }),
    archive: <T extends KeyValueMap>(
      ...params: Parameters<PlainClientAPI["entry"]["archive"]>
    ) =>
      Effect.tryPromise({
        try: () => client.entry.archive<T>(...params),
        catch: (unknown) => new Error(`something went wrong ${unknown}`), // remap the error
      }),
    delete: (...params: Parameters<PlainClientAPI["entry"]["delete"]>) =>
      Effect.tryPromise({
        try: () => client.entry.delete(...params),
        catch: (unknown) => new Error(`something went wrong ${unknown}`), // remap the error
      }),
  },
});

type ContentfulPlainClientAPI = ReturnType<typeof toEffectAPI>;
