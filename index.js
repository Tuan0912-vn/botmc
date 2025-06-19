const mineflayer = require('mineflayer');
const Vec3 = require('vec3');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send("✅ Bot đang chạy..."));
app.listen(3000, () => console.log("🌐 Web server online."));

function createBot() {
  const bot = mineflayer.createBot({
    host: "letmecookVN.aternos.me",
    port: 46967,
    username: "AFK_Bot",
    version: false
  });

  bot.on('spawn', () => {
    console.log("✅ Bot đã vào server!");

    // Nhảy nhẹ chống AFK
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 300);
      console.log("⬆️ Nhảy chống AFK...");
    }, 10000);
  });

  bot.on('end', () => {
    console.log("❌ Bot bị disconnect, đang reconnect...");
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log(`❗ Lỗi: ${err}`);
  });
}

createBot();
