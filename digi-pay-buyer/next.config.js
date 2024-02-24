module.exports = () => {
  const rewrites = () => {
    return [
      {
        source: "/api/buyer/login",
        destination: "http://localhost:5000/api/buyer/login",
      },
      {
        source: "/api/buyer/signup",
        destination: "http://localhost:5000/api/buyer/signup",
      },
      {
        source: "/api/buyer/registerface",
        destination: "http://localhost:5000/api/buyer/registerface",
      },
      {
        source: "/api/buyer/getbalance",
        destination: "http://localhost:5000/api/buyer/getbalance",
      },
      {
        source: "/api/buyer/mypayments",
        destination: "http://localhost:5000/api/buyer/mypayments",
      },
      {
        source: "/api/buyer/blockpayment",
        destination: "http://localhost:5000/api/buyer/blockpayment",
      }
    ];
  };
  return {
    rewrites,
  };
};