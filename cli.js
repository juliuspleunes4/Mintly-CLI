#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bs58 from 'bs58';
import { Keypair } from '@solana/web3.js';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clear console
console.clear();

// Display ASCII art banner
console.log(
  chalk.magenta(
    figlet.textSync('MINTLY', {
      font: 'Standard',
      horizontalLayout: 'default',
    })
  )
);

console.log(chalk.gray('━'.repeat(60)));
console.log(chalk.magenta.bold('  🪙  Create Solana SPL Tokens with Metadata'));
console.log(chalk.gray('  Free & Open Source CLI Tool'));
console.log(chalk.gray('  https://www.mintly.cc'));
console.log(chalk.gray('  Version 1.0.0'));
console.log(chalk.gray('━'.repeat(60)));
console.log();

async function main() {
  try {
    // Welcome message
    console.log(chalk.green.bold('👋 Welcome to Mintly CLI!\n'));
    console.log(chalk.white('This interactive wizard will guide you through creating your SPL token.\n'));

    // Step 1: Wallet setup
    console.log(chalk.yellow.bold('📝 STEP 1: Wallet Setup\n'));
    
    const { walletChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'walletChoice',
        message: 'How would you like to provide your wallet?',
        choices: [
          { name: 'Use default Solana CLI wallet (~/.config/solana/id.json)', value: 'default' },
          { name: 'Enter base58 private key (from Phantom/Solflare)', value: 'base58' },
          { name: 'Use existing wallet.json file', value: 'existing' },
        ],
      },
    ]);

    if (walletChoice === 'base58') {
      const { privateKey } = await inquirer.prompt([
        {
          type: 'password',
          name: 'privateKey',
          message: 'Enter your base58 private key:',
          mask: '*',
          validate: (input) => {
            if (!input) return 'Private key cannot be empty';
            try {
              const decoded = bs58.decode(input);
              if (decoded.length !== 64) return 'Invalid private key length';
              return true;
            } catch (error) {
              return 'Invalid base58 private key';
            }
          },
        },
      ]);

      // Convert and save wallet
      try {
        const privateKeyBytes = bs58.decode(privateKey);
        const privateKeyArray = Array.from(privateKeyBytes);
        const walletPath = path.resolve(__dirname, 'src', 'wallet.json');
        fs.writeFileSync(walletPath, JSON.stringify(privateKeyArray, null, 2));
        console.log(chalk.green('✅ Wallet saved to src/wallet.json\n'));
      } catch (error) {
        console.log(chalk.red('❌ Error saving wallet:', error.message));
        return;
      }
    } else if (walletChoice === 'existing') {
      const walletPath = path.resolve(__dirname, 'src', 'wallet.json');
      if (!fs.existsSync(walletPath)) {
        console.log(chalk.red('❌ wallet.json not found in src/ directory'));
        console.log(chalk.yellow('💡 Please place your wallet.json in the src/ folder and try again\n'));
        return;
      }
      console.log(chalk.green('✅ Using existing wallet.json\n'));
    } else {
      const homedir = process.env.HOME || process.env.USERPROFILE;
      const defaultWalletPath = `${homedir}/.config/solana/id.json`;
      if (!fs.existsSync(defaultWalletPath)) {
        console.log(chalk.red('❌ Default Solana wallet not found'));
        console.log(chalk.yellow('💡 Run: solana-keygen new\n'));
        return;
      }
      console.log(chalk.green('✅ Using default Solana CLI wallet\n'));
    }

    // Step 2: Token metadata
    console.log(chalk.yellow.bold('📝 STEP 2: Token Metadata\n'));
    
    const metadata = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Token name:',
        default: 'My Token',
        validate: (input) => (input ? true : 'Token name is required'),
      },
      {
        type: 'input',
        name: 'symbol',
        message: 'Token symbol:',
        default: 'MTK',
        validate: (input) => (input ? true : 'Token symbol is required'),
        transformer: (input) => input.toUpperCase(),
      },
      {
        type: 'input',
        name: 'description',
        message: 'Token description:',
        default: 'A custom SPL token created with Mintly',
      },
      {
        type: 'number',
        name: 'decimals',
        message: 'Number of decimals:',
        default: 9,
        validate: (input) => (input >= 0 && input <= 9 ? true : 'Decimals must be between 0 and 9'),
      },
      {
        type: 'number',
        name: 'mintAmount',
        message: 'Total supply (amount to mint):',
        default: 1000000,
        validate: (input) => (input > 0 ? true : 'Amount must be greater than 0'),
      },
      {
        type: 'list',
        name: 'network',
        message: 'Select network:',
        choices: [
          { name: 'Devnet (for testing - free)', value: 'devnet' },
          { name: 'Mainnet-beta (production - costs real SOL)', value: 'mainnet-beta' },
        ],
        default: 'devnet',
      },
    ]);

    // Save metadata
    const metadataPath = path.resolve(__dirname, 'src', 'token-metadata.json');
    const metadataObject = {
      name: metadata.name,
      symbol: metadata.symbol.toUpperCase(),
      description: metadata.description,
      decimals: metadata.decimals,
      mintAmount: metadata.mintAmount,
      network: metadata.network,
      image: 'Will be replaced automatically',
      attributes: [],
    };
    fs.writeFileSync(metadataPath, JSON.stringify(metadataObject, null, 2));
    console.log(chalk.green('✅ Metadata saved to src/token-metadata.json\n'));

    // Step 3: Image
    console.log(chalk.yellow.bold('📝 STEP 3: Token Image\n'));
    
    const { imagePath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'imagePath',
        message: 'Enter path to your token image (or press Enter to use src/image.png):',
        default: '',
      },
    ]);

    const srcImagePath = path.resolve(__dirname, 'src', 'image.png');
    
    if (imagePath) {
      // Copy user's image to src/image.png
      try {
        const resolvedImagePath = path.resolve(imagePath);
        if (!fs.existsSync(resolvedImagePath)) {
          console.log(chalk.red('❌ Image file not found at:', resolvedImagePath));
          return;
        }
        fs.copyFileSync(resolvedImagePath, srcImagePath);
        console.log(chalk.green('✅ Image copied to src/image.png\n'));
      } catch (error) {
        console.log(chalk.red('❌ Error copying image:', error.message));
        return;
      }
    } else {
      if (!fs.existsSync(srcImagePath)) {
        console.log(chalk.red('❌ No image found at src/image.png'));
        console.log(chalk.yellow('💡 Please add an image to src/image.png and try again\n'));
        return;
      }
      console.log(chalk.green('✅ Using existing src/image.png\n'));
    }

    // Step 4: Vanity address (optional)
    console.log(chalk.yellow.bold('📝 STEP 4: Vanity Address (Optional)\n'));
    
    const { wantsVanity } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'wantsVanity',
        message: 'Would you like to create a vanity address (custom prefix)?',
        default: false,
      },
    ]);

    if (wantsVanity) {
      const { vanityPrefix } = await inquirer.prompt([
        {
          type: 'input',
          name: 'vanityPrefix',
          message: 'Enter desired prefix (2-4 characters recommended):',
          validate: (input) => {
            if (!input) return 'Prefix cannot be empty';
            if (input.length > 5) return 'Long prefixes may take a very long time to generate';
            return true;
          },
        },
      ]);

      console.log(chalk.cyan(`\n🔄 Generating vanity address starting with "${vanityPrefix}"...`));
      console.log(chalk.gray('This may take a while depending on the prefix length...\n'));

      try {
        // Generate vanity address
        const command = `cd src && solana-keygen grind --starts-with ${vanityPrefix}:1`;
        execSync(command, { stdio: 'inherit' });
        
        // Find the generated file and rename it
        const files = fs.readdirSync(path.resolve(__dirname, 'src'));
        const vanityFile = files.find(f => f.startsWith(vanityPrefix) && f.endsWith('.json'));
        
        if (vanityFile) {
          const vanityPath = path.resolve(__dirname, 'src', vanityFile);
          const targetPath = path.resolve(__dirname, 'src', 'token-mint-address.json');
          fs.renameSync(vanityPath, targetPath);
          console.log(chalk.green('\n✅ Vanity address created successfully!\n'));
        }
      } catch (error) {
        console.log(chalk.yellow('\n⚠️  Vanity address generation failed or was cancelled'));
        console.log(chalk.gray('Continuing with a random address...\n'));
      }
    } else {
      console.log(chalk.gray('ℹ️  Skipping vanity address - a random address will be generated\n'));
    }

    // Step 5: Final confirmation
    console.log(chalk.yellow.bold('📝 STEP 5: Review & Create\n'));
    console.log(chalk.white('Review your token details:\n'));
    console.log(chalk.cyan('  Name:        '), chalk.white(metadata.name));
    console.log(chalk.cyan('  Symbol:      '), chalk.white(metadata.symbol));
    console.log(chalk.cyan('  Description: '), chalk.white(metadata.description));
    console.log(chalk.cyan('  Decimals:    '), chalk.white(metadata.decimals));
    console.log(chalk.cyan('  Supply:      '), chalk.white(metadata.mintAmount.toLocaleString()));
    console.log(chalk.cyan('  Network:     '), chalk.white(metadata.network));
    console.log();

    const { confirmed } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmed',
        message: 'Ready to create your token?',
        default: true,
      },
    ]);

    if (!confirmed) {
      console.log(chalk.yellow('\n⚠️  Token creation cancelled\n'));
      return;
    }

    // Step 6: Create the token
    console.log(chalk.green.bold('\n🚀 Creating your token...\n'));
    console.log(chalk.gray('━'.repeat(60)));
    console.log();

    try {
      // Import and run the mint script
      const { default: mintToken } = await import('./src/mint-token-with-metadata.js');
      // The script will run automatically when imported
      
      console.log();
      console.log(chalk.gray('━'.repeat(60)));
      console.log(chalk.green.bold('\n🎉 Token created successfully!\n'));
      console.log(chalk.white('Your token has been minted and is ready to use.'));
      console.log(chalk.gray('\nThank you for using Mintly! 💚\n'));
    } catch (error) {
      console.log();
      console.log(chalk.gray('━'.repeat(60)));
      console.log(chalk.red.bold('\n❌ Token creation failed\n'));
      console.log(chalk.red('Error:', error.message));
      console.log();
    }

  } catch (error) {
    if (error.isTtyError) {
      console.log(chalk.red('\n❌ Prompt couldn\'t be rendered in the current environment'));
    } else {
      console.log(chalk.red('\n❌ An error occurred:', error.message));
    }
  }
}

// Run the interactive CLI
main();
