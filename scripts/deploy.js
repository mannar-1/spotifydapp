const hre = require("hardhat");

async function main() {
  const spotify = await hre.ethers.getContractFactory("spotify");
  const contract = await spotify.deploy(); //instance of contract

  await contract.deployed();
  console.log("Address of contract:", contract.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});