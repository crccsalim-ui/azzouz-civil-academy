import path from "node:path";
import type {NextConfig} from "next";

import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./messages");

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ["ts", "tsx", "mdx"],
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    config.resolve.alias["next-intl/config"] = path.resolve("./next-intl.config.js");
    return config;
  },
};

export default withNextIntl(withMDX(nextConfig));
