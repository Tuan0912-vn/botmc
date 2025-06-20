const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send("✅ Bot đang chạy..."));
app.listen(3000, () => console.log("🌐 Web server online."));

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: "letmecookVN.aternos.me",
    port: 46967,
    username: "AFK_Bot",
    version: false
  });

  bot.on('spawn', () => {
    console.log("✅ Bot đã vào server!");

    // Di chuyển ngẫu nhiên mỗi 5 giây để chống AFK
    const directions = ['forward', 'back', 'left', 'right'];
    setInterval(() => {
      if (!bot.player || !bot.player.entity) return;

      const direction = directions[Math.floor(Math.random() * directions.length)];
      console.log(`🚶 Bot đang đi ${direction}...`);

      bot.setControlState(direction, true);
      setTimeout(() => {
        bot.setControlState(direction, false);
        console.log("🛑 Bot dừng lại.");
      }, 2000);
    }, 5000);
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
