require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
  solidity: "0.8.0",
  networks:{
    ropsten:{
      url: `${process.env.CONTRACT_URL_API}`,
      accounts:[`${process.env.PRIVATE_KEY}`]
    }
  }
};
