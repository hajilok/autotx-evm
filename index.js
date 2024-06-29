// const { ethers } = require("ethers");

import { ethers } from "ethers";
import dotenv from 'dotenv';
dotenv.config();

// Konfigurasi jaringan
const rpcUrl = "https://rpc-mokotow.data-lake.co";
const chainId = 2676;
const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

// Fungsi untuk mengirim mLAKE
async function sendMLAKE(fromPrivateKey, toAddress, amount, delay = 0) {
    // Buat wallet pengirim
    const senderWallet = new ethers.Wallet(fromPrivateKey, provider);

    // Periksa saldo pengirim sebelum mengirim
    const balance = await senderWallet.getBalance();
    console.log(`Saldo pengirim: ${ethers.utils.formatEther(balance)} mLAKE`);

    // Periksa jika saldo cukup
    if (balance.lt(ethers.utils.parseEther(amount.toString()))) {
        throw new Error("Saldo tidak cukup untuk mengirim transaksi");
    }

    // Buat transaksi
    const tx = {
        to: toAddress,
        value: ethers.utils.parseEther(amount.toString()), // Konversi ke wei
        gasPrice: ethers.utils.parseUnits('10', 'gwei'),   // Gas price dalam gwei
        gasLimit: 15476260, // Gas limit untuk transfer standar
        chainId: chainId,
    };

    // Tunggu delay (jika ada)
    if (delay > 0) {
        console.log(`Menunggu delay selama ${delay} detik...`);
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
    }

    // Kirim transaksi
    const txResponse = await senderWallet.sendTransaction(tx);
    console.log(`Transaksi terkirim dengan hash: ${txResponse.hash}`);
    return txResponse.hash;
}

// Fungsi untuk mengenerate wallet baru
function generateWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
        address: wallet.address,
        privateKey: wallet.privateKey,
    };
}

// Contoh penggunaan
(async () => {
    // Private key pengirim (misalnya dari dompet yang sudah ada)
    const fromPrivateKey = process.env.PRIVATE; // Ganti dengan private key pengirim

    // Generate alamat dompet baru untuk penerima
    const newWallet = generateWallet();
    const toAddress = newWallet.address;

    console.log(`Generated Wallet Address: ${toAddress}`);
    // console.log(`Private Key: ${newWallet.privateKey}`); // Simpan ini jika perlu

    // Jumlah mLAKE yang ingin dikirim (dalam ether, sesuaikan jika perlu)
    const amount = 0.01;

    setInterval(async () => {
        try {
            await sendMLAKE(fromPrivateKey, toAddress, amount);
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }, 10000); // Interval dalam milidetik (10 detik)

    // Anda dapat menambahkan logika lain di sini jika diperlukan
})();
