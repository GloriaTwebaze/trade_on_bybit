import { ethers } from "ethers";
import { Configs, swapConfigs } from "../config";
import { uniswapABI } from "../utils/uniswapABI";

export default class UniswapTrader {
  wallet: ethers.Wallet;
  uniswapRouter: ethers.Contract;
  constructor() {
    const provider = new ethers.providers.JsonRpcProvider(swapConfigs.SWAP_URL);
    this.wallet = new ethers.Wallet(swapConfigs.PRIVATE_KEY, provider);
    this.uniswapRouter = new ethers.Contract(
      "0xE592427A0AEce92De3Edee1F18E0157C05861564",
      uniswapABI,
      this.wallet
    );
  }

  async getBalance() {
    let bal = await this.wallet.getBalance();
    const readableBal = parseFloat(ethers.utils.formatEther(bal)).toFixed(4);

    console.log(readableBal, "balance");
  }

  async buy() {
    try {
      const value = ethers.utils.parseEther("0.01");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
      const tokenIn = "0xFfb99f4A02712C909d8F7cC44e67C87Ea1E71E83"; // ETH
      const tokenOut = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; //UNI
      const amountOutMin = ethers.utils.parseUnits("0", 18);

      const txn = await this.uniswapRouter.swapExactETHForTokens(
        amountOutMin,
        [tokenIn, tokenOut],
        this.wallet.address,
        deadline,
        {
          value: value,
          gasLimit: 50000,
          maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
          maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
        }
      );
        return txn
      //console.log(`Transaction hash: ${txn.hash}`);
    } catch (error) {
      console.error("Unable to execute trade", error);
    }
  }

  async sell() {
    try {
      const value = ethers.utils.parseEther("0.01");
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
      const tokenIn = "0xFfb99f4A02712C909d8F7cC44e67C87Ea1E71E83"; // ETH
      const tokenOut = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"; //UNI
      const amountOutMin = ethers.utils.parseUnits("0", 18);

      const txn = await this.uniswapRouter.swapExactETHForTokens(
        amountOutMin,
        [tokenIn, tokenOut].reverse(),
        this.wallet.address,
        deadline,
        {
          value: value,
          gasLimit: 50000,
          maxFeePerGas: ethers.utils.parseUnits("20", "gwei"),
          maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
        }
      );
        return txn
      //console.log(`Transaction hash: ${txn.hash}`);
    } catch (error) {
      console.error("Unable to execute trade", error);
    }
  }
}
