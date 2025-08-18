import {
  Keypair,
  Connection,
  clusterApiUrl,
  sendAndConfirmTransaction,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import pkg from "@metaplex-foundation/mpl-token-metadata";
const { createCreateMetadataAccountV3Instruction } = pkg;
import { uploadImageAndMetadata } from "./upload-image-and-metadata.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load metadata from JSON file
const TOKEN_METADATA = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "token-metadata.json"), "utf8")
);
// Configuration
const NETWORK = TOKEN_METADATA.network || "devnet"; // Read from metadata, fallback to devnet
const TOKEN_NAME = TOKEN_METADATA.name;
const TOKEN_SYMBOL = TOKEN_METADATA.symbol;
const TOKEN_DECIMALS = TOKEN_METADATA.decimals || 9; // Default to 9 if not specified
const MINT_AMOUNT = TOKEN_METADATA.mintAmount || 1000; // Default to 1000 if not specified

function loadKeypairFromFile(filename) {
  try {
    const keypairData = JSON.parse(fs.readFileSync(filename, "utf8"));
    return Keypair.fromSecretKey(new Uint8Array(keypairData));
  } catch (error) {
    console.error(`❌ Error loading keypair from ${filename}:`, error.message);
    return null;
  }
}

function loadOrCreateMintKeypair() {
  const MINT_ADDRESS_FILE = path.resolve(__dirname, "token-mint-address.json");

  try {
    // Check if token mint address file exists
    if (fs.existsSync(MINT_ADDRESS_FILE)) {
      console.log(
        "📁 Found existing token mint address file, using saved keypair..."
      );
      return loadKeypairFromFile(MINT_ADDRESS_FILE);
    } else {
      // Create new keypair for minting
      console.log(
        "🆕 No existing token mint address found, creating new keypair..."
      );
      const newKeypair = Keypair.generate();

      // Save the new keypair to file (as a proper keypair file)
      const keypairData = Array.from(newKeypair.secretKey);
      fs.writeFileSync(MINT_ADDRESS_FILE, JSON.stringify(keypairData, null, 2));

      console.log(
        `✅ Created new mint keypair: ${newKeypair.publicKey.toString()}`
      );
      console.log(`💾 Saved to: ${MINT_ADDRESS_FILE}`);

      return newKeypair;
    }
  } catch (error) {
    console.error("❌ Error in loadOrCreateMintKeypair:", error.message);
    return null;
  }
}

const MINT_KEYPAIR = loadOrCreateMintKeypair();

function loadWalletKeypair() {
  try {
    // First try to load wallet.json if it exists
    const localWalletPath = path.resolve(__dirname, "wallet.json");
    if (fs.existsSync(localWalletPath)) {
      console.log("📁 Found wallet.json, using it for transactions...");
      const keypairData = JSON.parse(fs.readFileSync(localWalletPath, "utf8"));
      return Keypair.fromSecretKey(new Uint8Array(keypairData));
    } else {
      // Fall back to default Solana keypair
      console.log("📁 No wallet.json found, using default Solana keypair...");
      const homedir = process.env.HOME || process.env.USERPROFILE;
      const configPath = `${homedir}/.config/solana/id.json`;
      const keypairData = JSON.parse(fs.readFileSync(configPath, "utf8"));
      return Keypair.fromSecretKey(new Uint8Array(keypairData));
    }
  } catch (error) {
    console.error("❌ Could not load any keypair.");
    console.error(
      "   Make sure you have either wallet.json or a default Solana keypair configured."
    );
    console.error("   Run: solana-keygen new");
    return null;
  }
}

async function getOrCreateAtaWithRetry(connection, payer, mint, owner) {
  const confirmOptions = { commitment: "finalized" };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        owner,
        false,
        "finalized",
        confirmOptions
      );
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 700));
    }
  }
}

async function mintTokenWithMetadata() {
  console.log("🚀 Starting token minting process...\n");

  try {
    // Load wallet keypair for paying transactions
    const walletKeypair = loadWalletKeypair();
    if (!walletKeypair) {
      console.error("❌ Could not load any keypair. Cannot proceed.");
      return;
    }

    // Now proceed with token creation
    console.log("\n🪙 Step 1: Checking if token already exists...");

    if (!MINT_KEYPAIR) {
      console.error("❌ Could not load mint keypair. Cannot proceed.");
      return;
    }

    // Connect to Solana
    const connection = new Connection(clusterApiUrl(NETWORK), "confirmed");

    // Check wallet balance
    const balance = await connection.getBalance(walletKeypair.publicKey);
    console.log(`💰 Wallet balance: ${balance / 1e9} SOL`);

    if (balance < 0.1 * 1e9) {
      console.log(
        "⚠️  Low balance! You might need more SOL for this operation."
      );
      console.log(
        `If you are on devnet you can get devnet SOL from: https://faucet.solana.com/`
      );
    }

    // Check if token already exists by looking at the mint keypair
    console.log("🔍 Checking if token already exists...");
    try {
      const mintAccountInfo = await connection.getAccountInfo(
        MINT_KEYPAIR.publicKey
      );
      if (mintAccountInfo && mintAccountInfo.data.length > 0) {
        console.log("🔄 Token already exists!");
        console.log(`✅ Mint address: ${MINT_KEYPAIR.publicKey.toString()}`);
        console.log("💡 To create a new token:");
        console.log(
          "   1. Delete or rename the token-mint-address.json file or replace the content with a new keypair. See readme.md"
        );
        console.log("   2. Run this script again");
        console.log(
          "   3. A new token will be created with a different address"
        );
        return;
      }
    } catch (error) {
      console.log(
        "⚠️  Could not check existing token, proceeding with creation..."
      );
    }

    console.log("✅ Token doesn't exist, proceeding with creation...");

    // Step 2: Upload image and metadata to get the metadata URI
    console.log("\n📤 Step 2: Uploading image and metadata...");
    const metadataUri = await uploadImageAndMetadata();

    if (!metadataUri) {
      console.error(
        "❌ Failed to upload image and metadata. Cannot proceed with minting."
      );
      return;
    }

    console.log(`✅ Got metadata URI: ${metadataUri}`);

    // Step 3: Create and mint the token
    console.log("\n🪙 Step 3: Creating and minting token...");

    // Create the mint
    console.log("Creating token mint...");
    const mint = await createMint(
      connection,
      walletKeypair, // Use wallet keypair as payer
      walletKeypair.publicKey, // Mint authority
      walletKeypair.publicKey, // Freeze authority
      TOKEN_DECIMALS,
      MINT_KEYPAIR,
      { commitment: "confirmed" }
    );

    console.log(`✅ Token mint created: ${mint.toString()}`);

    // Wait briefly to ensure the mint is visible at 'confirmed'
    //await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create associated token account for the wallet
    console.log("Creating associated token account...");
    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletKeypair, // Use wallet keypair as payer
      mint,
      walletKeypair.publicKey, // Owner is the wallet,
      false,
      "confirmed"
    );

    console.log(
      `✅ Associated token account: ${associatedTokenAccount.address.toString()}`
    );

    // Mint tokens to the wallet
    console.log(`Minting ${MINT_AMOUNT} tokens...`);
    const mintTx = await mintTo(
      connection,
      walletKeypair, // Use wallet keypair as payer
      mint,
      associatedTokenAccount.address,
      walletKeypair, // Mint authority
      MINT_AMOUNT * Math.pow(10, TOKEN_DECIMALS)
    );

    console.log(`✅ Tokens minted successfully! Transaction: ${mintTx}`);

    // Create metadata account
    console.log("Creating metadata account...");
    const metadataAccount = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
        mint.toBuffer(),
      ],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    )[0];

    const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataAccount,
        mint: mint,
        mintAuthority: walletKeypair.publicKey,
        payer: walletKeypair.publicKey, // Use wallet keypair as payer
        updateAuthority: walletKeypair.publicKey,
      },
      {
        createMetadataAccountArgsV3: {
          data: {
            name: TOKEN_NAME,
            symbol: TOKEN_SYMBOL,
            uri: metadataUri,
            sellerFeeBasisPoints: 0,
            creators: [
              {
                address: walletKeypair.publicKey, // Use wallet keypair as creator
                verified: true,
                share: 100,
              },
            ],
            collection: null,
            uses: null,
          },
          isMutable: true,
          collectionDetails: null,
        },
      }
    );

    const transaction = new Transaction().add(createMetadataInstruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      walletKeypair,
    ]);

    console.log(`✅ Metadata account created! Transaction: ${signature}`);

    // Summary
    console.log("\n🎉 Token creation completed successfully!");
    console.log("=".repeat(60));
    console.log(`Token Name: ${TOKEN_NAME}`);
    console.log(`Token Symbol: ${TOKEN_SYMBOL}`);
    console.log(`Token Mint: ${mint.toString()}`);
    console.log(`Metadata URI: ${metadataUri}`);
    console.log(`Network: ${NETWORK}`);
    console.log(`Initial Supply: ${MINT_AMOUNT} tokens`);
    console.log("=".repeat(60));
    const clusterParam = NETWORK === "mainnet-beta" ? "" : `?cluster=${NETWORK}`;
    console.log(
      `🔎 View on Explorer: https://explorer.solana.com/address/${mint.toString()}${clusterParam}`
    );
    console.log("💡 Your token is now ready to use!");

  } catch (error) {
    console.error("❌ Error during token creation:", error);
    if (error.message.includes("insufficient funds")) {
      console.log(
        "\n💡 Tip: You need more SOL in your wallet. Get devnet SOL from:"
      );
      console.log("   https://faucet.solana.com/");
    }
  }
}

// Run the script
mintTokenWithMetadata().catch(console.error);
