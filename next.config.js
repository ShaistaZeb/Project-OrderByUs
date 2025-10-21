module.exports = {
  reactStrictMode: true,
  "presets": ["next/babel"]
}

rewrites: async () => [
  {
    source: "/public/document.html",
    destination: "/pages/api/myfile.js",
  },
]