const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// Web server để Railway không sleep
app.get('/', (req, res) => res.send("✅ Bot đang chạy..."));
app.listen(3000, () => console.log("🌐 Web server online."));

function createBot() {
  const bot = mineflayer.createBot({
    host: "letmecookVN.aternos.me", // đổi thành host server bạn
    port: 46967,                 // và đúng port Aternos
    username: "AFK_Bot",         // tên bot (TLauncher ok)
    version: false               // auto detect version
  });

  bot.on('spawn', () => {
    console.log("✅ Bot đã vào server!");

    // Nhảy mỗi 30 giây để chống AFK
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
      console.log("⬆️ Bot vừa nhảy để chống AFK...");
    }, 30000);
  });

  bot.on('end', () => {
    console.log("❌ Bot bị disconnect, đang reconnect...");
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log(`❗ Lỗi: ${err.message}`);
  });
}

createBot();
