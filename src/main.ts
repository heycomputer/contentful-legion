import { Command, Options } from "@effect/cli";
import { Config, ConfigProvider, Console, Effect, Layer, Option } from "effect";
import { NodeContext, NodeRuntime } from "@effect/platform-node";

const spaceId = Options.text("space-id").pipe(
  Options.withAlias("s"),
  Options.withFallbackConfig(Config.string("SPACE_ID"))
);

const environmentId = Options.text("environment-id").pipe(
  Options.withAlias("e"),
  Options.withFallbackConfig(Config.string("ENVIRONMENT_ID"))
);

const accessToken = Options.secret("access-token").pipe(
  Options.withAlias("t"),
  Options.withFallbackConfig(Config.secret("ACCESS_TOKEN"))
);

// legion [--version] [-h | --help] [-c SPACE_ID] [-e ENVIRONMENT_ID] [-t ACCESS_TOKEN]
const legion = Command.make(
  "legion",
  { spaceId, environmentId, accessToken },
  ({ spaceId, environmentId }) =>
    Console.log(
      [
        "running legion",
        `space-id: ${spaceId}`,
        `environment-id: ${environmentId}`,
      ].join("\n")
    )
);

const command = legion;

const cli = Command.run(command, {
  name: "legion",
  version: "v0.0.1",
});

Effect.suspend(() => cli(process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain
);