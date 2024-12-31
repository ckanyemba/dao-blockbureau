require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.22",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/e8fd669a14484b278a89996419bfa61e",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
