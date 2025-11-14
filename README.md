<div align="center">

# 🪙 Mintly CLI

### Create Solana SPL Tokens with Metadata - (Low-fee and open-source)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/badge/GitHub-juliuspleunes4-blue?logo=github)](https://github.com/juliuspleunes4/mintly-cli)
[![Solana](https://img.shields.io/badge/Solana-SPL_Token-14F195?logo=solana)](https://solana.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org)

[Website](https://www.mintly.cc) • [CLI Version](https://github.com/juliuspleunes4/mintly-cli) • [Report Bug](https://github.com/juliuspleunes4/mintly-cli/issues)

</div>

---

## 📖 About

**Mintly CLI** is a command-line tool for creating Solana SPL tokens with custom images and metadata. This is a fork of [Woody4618's create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata) project, enhanced with additional features and improved documentation.

### 🌐 Mintly Ecosystem

- **CLI Version** (this repository): Free and open-source command-line tool. Only pay standard Solana network fees.
- **Web Version** ([www.mintly.cc](https://www.mintly.cc)): User-friendly web interface with the same functionality. Includes a small service fee on top of network fees. Also open-source!

Both versions are fully open-source and maintained primarily by [Julius Pleunes](https://linkedin.com/in/juliuspleunes).

## ✨ Features

- 🎨 Create SPL tokens with custom images and metadata
- 🎮 **Interactive wizard mode** - perfect for beginners!
- 🔐 Multiple wallet options (Phantom, Solflare, Solana CLI, or wallet.json)
- 🎯 Optional vanity address generation
- 🌐 Works on devnet (free testing) and mainnet (production)
- 💰 **No service fees** - only pay standard Solana network costs
- 📝 Automatic base58 private key conversion
- 🎨 Beautiful colored terminal interface
- ⚡ Fast and easy - create tokens in under 2 minutes

## ⚡ What You'll Need

Before creating your token, have these ready:

- ✅ **Node.js installed** (download from [nodejs.org](https://nodejs.org/))
- ✅ **Your wallet's private key** (from Phantom, Solflare, etc.) OR Solana CLI wallet
- ✅ **Some SOL** for transaction fees:
  - Testing (devnet): Get free SOL at [faucet.solana.com](https://faucet.solana.com)
  - Production (mainnet): ~0.01-0.02 SOL (buy from any exchange)
- ✅ **Token image** (PNG or JPG, 512x512px recommended)
- ✅ **Token details** (name, symbol, supply amount)

## 📋 Prerequisites

Before you begin, make sure you have:

### Required
- **[Node.js](https://nodejs.org/)** (v18 or higher) - Download and install from nodejs.org
- **A Solana wallet** with some SOL for transaction fees:
  - **For testing (devnet)**: Free SOL from [faucet.solana.com](https://faucet.solana.com)
  - **For production (mainnet)**: Purchase SOL from an exchange like Coinbase, Binance, or Kraken

### Optional (Only for Advanced Features)
- **[Solana CLI tools](https://solana.com/docs/intro/installation)** - Only needed if you want to:
  - Use the default Solana CLI wallet
  - Generate vanity addresses manually
  - Use advanced Solana commands

> 💡 **Beginner Tip**: If you only have a Phantom or Solflare wallet, that's all you need! The interactive mode will help you convert your private key.

## 🎓 Complete Beginner? Start Here!

Never created a token before? No problem! Here's everything you need:

1. **Install Node.js**: Go to [nodejs.org](https://nodejs.org/), download, and install it
2. **Get a Solana wallet**: Download [Phantom](https://phantom.app/) or [Solflare](https://solflare.com/) (free!)
3. **Get some SOL** (required for creating the token):
4. **Prepare your image**: Have a 512x512px PNG or JPG ready for your token icon
5. **Follow the Quick Start below** ⬇️

> ⚠️ **Important**: You MUST have SOL in your wallet before creating a token - it's needed to pay for uploading the image/metadata to Arweave and creating the token on Solana. ~0.1-~0.3 is enough.

## 🚀 Quick Start

### Step 1: Installation

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/juliuspleunes4/mintly-cli.git

# Navigate to the directory
cd mintly-cli

# Install dependencies (this may take a minute)
npm install
```

### Step 2: Run the Interactive Wizard

The easiest way to get started:

```bash
npm start
```

That's it! The colorful wizard will guide you through the rest. ✨

---

## 🎯 Two Ways to Use Mintly

### 🌟 Option A: Interactive Mode (Recommended for Beginners)

The easiest way to create your token! An interactive wizard guides you through every step with colorful prompts.

#### How to Use Interactive Mode

**Windows Users (Easiest):**
1. Double-click `mintly.bat`
2. Follow the colorful prompts in the terminal window

**All Users (Command Line):**
```bash
npm start
```

#### What the Interactive Wizard Does

The wizard walks you through 5 simple steps:

1. **💳 Wallet Setup** - Choose how to provide your wallet:
   - Enter your Phantom/Solflare private key (it will be converted automatically)
   - Use an existing `wallet.json` file
   - Use your default Solana CLI wallet (if installed)

2. **📝 Token Details** - Answer a few questions:
   - What's your token name? (e.g., "My Token")
   - What's the symbol? (e.g., "MTK")
   - How many tokens to create? (e.g., 1000000)
   - Which network? (Devnet for testing, Mainnet for real)

3. **🖼️ Token Image** - Provide your token's icon:
   - Enter the path to your image file
   - Or use an existing image in the `src/` folder

4. **🎯 Vanity Address (Optional)** - Want a cool token address?
   - Like "MINT..." instead of random letters
   - This step is completely optional!

5. **✅ Review & Create** - Confirm everything looks good and create!

> 💡 **Perfect for**: First-time users, quick token creation, or when you want a guided experience

### 🛠️ Option B: Manual Mode (Advanced Users)

For developers who prefer direct control or want to automate the process.

#### Wallet Setup

You have three options for wallet configuration:

**Option 1: Use Default Solana CLI Wallet**
- The tool will automatically use your [default Solana wallet](https://solana.com/docs/intro/installation#create-wallet)

**Option 2: Use Custom Wallet (wallet.json)**

If you have a base58-encoded private key (from Phantom, Solflare, etc.):

1. Open `convert-key.js`
2. Replace `'EXAMPLE_BASE58_PRIVATE_KEY_HERE'` with your actual base58 private key
3. Run the conversion:
   ```bash
   node convert-key.js
   ```
4. This will automatically create `src/wallet.json` with your wallet

**Option 3: Manual wallet.json**
- Place your wallet keypair JSON directly in `src/wallet.json`

---

## 📝 Manual Mode: Step-by-Step Guide

### Step 1: Configure Token Metadata

Edit `src/token-metadata.json` with your token details:

```json
{
  "name": "Dishwasher Token",
  "symbol": "DISH",
  "description": "Reward tokens for completing household chores like unloading the dishwasher.",
  "decimals": 6,
  "mintAmount": 1000000,
  "network": "devnet",
  "image": "Will be replaced automatically",
  "attributes": [
    {
      "trait_type": "Category",
      "value": "Household Chores"
    },
    {
      "trait_type": "Task Type",
      "value": "Dishwasher Unloading"
    }
  ]
}
```

**Configuration Options:**
- `network`: Set to `"devnet"` for testing or `"mainnet-beta"` for production
- `mintAmount`: Total supply of tokens to mint
- `decimals`: Number of decimal places (6-9 recommended)
- `attributes`: Custom metadata attributes for your token

### Step 2: Add Your Token Image

Replace `src/image.png` with your token image:
- **Recommended size:** 512x512px
- **Format:** PNG or JPG
- **Keep the filename as:** `image.png`

### Step 3: Generate Vanity Address (Optional)

Create a custom token address with a specific prefix (Linux/Mac only):

```bash
cd src
solana-keygen grind --starts-with MINT:1 | tee /dev/tty | grep -oE '[1-9A-HJ-NP-Za-km-z]{32,44}\.json' | head -n1 | xargs -I{} mv {} token-mint-address.json
```

**Tips:**
- Replace `MINT:1` with your desired prefix
- Prefixes longer than 4 characters may take significant time
- This overwrites `token-mint-address.json` - back it up if needed
- **Note:** This command is for Linux/Mac. Windows users should use the interactive mode for vanity addresses.

### Step 4: Create Your Token

Run the minting script:

```bash
node src/mint-token-with-metadata.js
```

This will:
1. Upload your image to a decentralized storage
2. Create metadata for your token
3. Mint the SPL token on Solana
4. Transfer the specified amount to your wallet
5. Return your token's mint address

### Step 5: Interact With Your Token

Transfer tokens to another wallet:

```bash
spl-token transfer <mint-address> <amount> <recipient-wallet> --fund-recipient
```

Add network flags:
- `-ud` for devnet
- `-um` for mainnet

For more operations, check the [Solana SPL Token CLI docs](https://solana.com/docs/tokens).

## 🛠️ Additional Commands

### Upload Metadata Only

If you only need the metadata URI without minting:

```bash
node src/upload-image-and-metadata.js
```

### Convert Base58 Private Key

Convert a base58 private key to wallet.json format:

```bash
node convert-key.js
```

## 💡 Usage Tips

- **Testing First:** Always test on devnet before deploying to mainnet
- **Backup Keys:** Keep secure backups of your wallet files and private keys
- **Network Fees:** Ensure you have enough SOL for transaction fees (~0.01 SOL on devnet, varies on mainnet)
- **Image Hosting:** Images are uploaded to decentralized storage (Arweave via Irys)
- **Token Amount:** Remember to account for decimals (e.g., 1,000,000 with 6 decimals = 1 token)

## ❓ Frequently Asked Questions

<details>
<summary><b>How do I get my private key from Phantom/Solflare?</b></summary>

**Phantom:**
1. Click the settings icon (⚙️)
2. Click "Security & Privacy"
3. Click "Export Private Key"
4. Enter your password
5. Copy the key shown (this is your base58 private key)

**Solflare:**
1. Click the menu (☰)
2. Click "Settings"
3. Click "Export Private Key"
4. Copy the key shown

⚠️ **Never share your private key with anyone!**
</details>

<details>
<summary><b>What network should I use?</b></summary>

- **Devnet**: Free testing environment. Use this first! Get free SOL from [faucet.solana.com](https://faucet.solana.com)
- **Mainnet**: Real Solana network. Costs real SOL. Only use after testing on devnet.
</details>

<details>
<summary><b>How much does it cost?</b></summary>

- **CLI Version (this tool)**: Only Solana network fees (~0.01 SOL ≈ $0.10-$2 depending on SOL price)
- **Web Version**: Network fees + small service fee
- **No hidden fees!**
</details>

<details>
<summary><b>Can I create tokens for free?</b></summary>

Yes! Use devnet for completely free testing. You can create unlimited test tokens with free devnet SOL from the faucet.
</details>

<details>
<summary><b>What's a vanity address?</b></summary>

A vanity address is a token address that starts with specific letters you choose (e.g., `MINTabc123...` instead of `7vfCXtU...`). It's purely cosmetic and completely optional. It can take a while to generate if you choose more than 4 characters.
</details>

<details>
<summary><b>Where is my token after creation?</b></summary>

Your token will be:
1. Created on the Solana blockchain
2. Automatically minted to your wallet
3. Viewable on [Solana Explorer](https://explorer.solana.com) (link provided after creation)

The CLI will give you the mint address - save this! It's your token's unique identifier.
</details>

<details>
<summary><b>Can I edit my token after creation?</b></summary>

Once created, you cannot change:
- Token name
- Token symbol  
- Token supply (but you can mint more if you control mint authority)
- Token decimals

You CAN update the metadata (image, description) if you have update authority.
</details>

## 🐛 Troubleshooting

### "Node.js not found" or "npm not found"
**Solution:** Install [Node.js](https://nodejs.org/) (v18 or higher) and restart your terminal.

### "wallet.json not found"
**Solution:** Use the interactive mode (`npm start`) and choose "Enter base58 private key" option to create the wallet automatically.

### "Insufficient funds" error
**Solutions:**
- **On devnet**: Get free SOL from [faucet.solana.com](https://faucet.solana.com)
- **On mainnet**: Add more SOL to your wallet (you need ~0.01-0.02 SOL for token creation)

### "Default Solana wallet not found"
**Solution:** Either:
1. Install [Solana CLI tools](https://solana.com/docs/intro/installation) and run `solana-keygen new`, OR
2. Use interactive mode and choose the "base58 private key" option instead

### Command window closes immediately
**Solution:** This is fixed in the latest version. Make sure you've pulled the latest changes. The window should now pause with "Press any key to exit..."

### Colors not displaying properly
**Solution:** Use Windows Terminal, PowerShell, or a modern terminal emulator. CMD may not support all colors.

### "Invalid base58 private key"
**Solution:** Make sure you:
- Copied the entire key (no spaces before/after)
- Used the private key, not the public key
- Exported from the correct wallet

### Image upload fails
**Solutions:**
- Check your internet connection
- Make sure the image file exists and is a valid PNG/JPG
- Try a smaller image (max 10MB recommended)
- Ensure the image path has no special characters

### Need More Help?
- [Open an issue](https://github.com/juliuspleunes4/mintly-cli/issues) on GitHub
- Check [Solana documentation](https://solana.com/docs)
- Visit [www.mintly.cc](https://www.mintly.cc) for the web version

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

This project is a fork of [create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata) by [Woody4618](https://github.com/Woody4618). Special thanks to the original creator for the foundation of this tool.

## 🔗 Links

- **Website:** [www.mintly.cc](https://www.mintly.cc)
- **GitHub:** [github.com/juliuspleunes4/mintly-cli](https://github.com/juliuspleunes4/mintly-cli)
- **Original Project:** [github.com/Woody4618/create-solana-token-with-metadata](https://github.com/Woody4618/create-solana-token-with-metadata)

---

<div align="center">

Made with ❤️ by the Mintly team

</div>