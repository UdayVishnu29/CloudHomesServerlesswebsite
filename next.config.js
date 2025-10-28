/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL:
      "https://vfx6oc7gy2.execute-api.ap-south-1.amazonaws.com/prod",
  },
};

module.exports = nextConfig;
