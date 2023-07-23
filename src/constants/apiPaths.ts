const API_PATHS = {
  product: "https://8nzred66a6.execute-api.us-east-1.amazonaws.com/prod", // not used directly, bff is used
  // product: "http://anival-github-bff-api-dev.us-east-1.elasticbeanstalk.com", // proxy
  order: "https://0x886qllp8.execute-api.us-east-1.amazonaws.com/prod", // not used during the course
  // import: "http://anival-github-bff-api-dev.us-east-1.elasticbeanstalk.com", // proxy
  import: "https://ptoha1cju9.execute-api.us-east-1.amazonaws.com/prod", // import products, bff is to be used as proxy
  bff: "http://anival-github-bff-api-dev.us-east-1.elasticbeanstalk.com", // proxy
  // cart: "http://anival-github-bff-api-dev.us-east-1.elasticbeanstalk.com", // proxy
  cart: "http://production.eba-sjic3pmv.us-east-1.elasticbeanstalk.com/api", // not to be used directly, use bff instead
};

export default API_PATHS;
