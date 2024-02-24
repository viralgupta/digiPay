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
        source: "/api/buyer/mypayments",
        destination: "http://localhost:5000/api/buyer/mypayments",
      },
      {
        source: "/api/buyer/getbalance",
        destination: "http://localhost:5000/api/buyer/getbalance",
      },
      {
        source: "/api/seller/finduser",
        destination: "http://localhost:5000/api/seller/finduser",
      },
      {
        source: "/api/seller/createpayment",
        destination: "http://localhost:5000/api/seller/createpayment",
      },
    ];
  };
  return {
    rewrites,
  };
};