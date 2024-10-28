/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // NEXTAUTH_URL: "http://localhost:3000",
    // NEXTAUTH_URL: "http://admin.getgeo.io",
    NEXTAUTH_URL: "http://localhost:3000",


    NEXTAUTH_SECRET: "Vx4GgzAwkhQXxwL3r3a0rcbxgF63Rmp2ke11yd5K8dY=",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
