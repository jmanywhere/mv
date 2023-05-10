// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  images:{
    domains: ["f004.backblazeb2.com"]
  },
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: "/moon",
        destination: "/",
        permanent: false
      },
      {
        source: "/create",
        destination: "/",
        permanent: false
      },
      {
        source: "/raise",
        destination: "/",
        permanent: false
      },
      {
        source: "/raise/:path*",
        destination: "/",
        permanent: false
      },
      {
        source: "/private",
        destination: "/",
        permanent: false
      },
    ]
  }
};
export default config;
