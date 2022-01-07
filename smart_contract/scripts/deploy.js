const main = async () => {
  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();

  console.log("Greeter deployed to:", greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
const runMain = async ()=>{
  try {
    await main();
    process.exitCode(0)
  } catch (error) {
    console.error(error);
    process.exitCode(1);
  }
}

runMain();