/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "chat",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
      new sst.aws.StaticSite("Web", {
        domain: "chat.yourdoc.click",
        build: {
          command: "pnpm run build",
          output: "dist",
        },
      });
  },
});
