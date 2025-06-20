const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send("✅ Bot đang chạy..."));
app.listen(3000, () => console.log("🌐 Web server online."));

let bot; // khai báo ngoài để kiểm soát reconnect

function createBot() {
  bot = mineflayer.createBot({
    host: "letmecookVN.aternos.me",
    port: 46967,
    username: "AFK_Bot",
    version: false
  });

  bot.on('spawn', () => {
    console.log("✅ Bot đã vào server!");
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

// Kiểm tra bot còn online và chống AFK
setInterval(() => {
  if (!bot || !bot.player || !bot.player.entity) {
    console.log("⚠️ Bot không còn trong server, sẽ tự reconnect nếu chưa.");
    // Nếu bot đã bị disconnect mà chưa tự reconnect thì gọi lại
    if (!bot || bot._client?.state !== 'connected') {
      console.log("🔁 Đang khởi động lại bot...");
      createBot();
    }
    return;
  }

  // Nếu bot còn trong server, thực hiện nhảy
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 300);
  console.log("⬆️ Nhảy chống AFK...");
}, 10000);
