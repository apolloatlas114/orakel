/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Vercel/Next always uses the default build output folder.
  // The error `/public/routes-manifest.json` typically means the build output
  // directory was mis-detected/misconfigured as `public/`.
  distDir: ".next",

  // Make output file tracing deterministic, even if the workspace root is inferred incorrectly.
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;

