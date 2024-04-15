const config = {
  development: {
    REACT_APP_API_BASE_URL: "http://localhost:3000/api",
  },
  production: {
    REACT_APP_API_BASE_URL: "https://wonderland-seven.vercel.app/api",
  },
};

export const currentConfig = config[process.env.NODE_ENV || "production"];
