const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send("✅ Bot is running..."));
app.listen(3000, () => console.log("🌐 Web server online."));

let bot;
let moving = false;
const directions = ['forward', 'back', 'left', 'right'];

function createBot() {
  bot = mineflayer.createBot({
    host: "letmecookVN.aternos.me", // ← Server IP
    port: 46967,                    // ← Server port
    username: "TuanDev",           // ← Tên bot (nên đặt giống người chơi thật)
    version: false                 // ← Tự chọn version theo server
  });

  bot.on('spawn', () => {
    console.log("✅ Bot đã vào server!");

    // Di chuyển random để tránh AFK detect
    function randomMove() {
      if (!bot.player || !bot.player.entity || moving) return;

      const direction = directions[Math.floor(Math.random() * directions.length)];
      const pos = bot.entity.position.clone();
      const offset = { x: 0, z: 0 };

      if (direction === 'forward') offset.z = -1;
      else if (direction === 'back') offset.z = 1;
      else if (direction === 'left') offset.x = -1;
      else if (direction === 'right') offset.x = 1;

      const targetPos = pos.offset(offset.x, 0, offset.z);
      const block = bot.blockAt(targetPos);
      const blockAbove = bot.blockAt(targetPos.offset(0, 1, 0));

      const isClear = (!block || block.boundingBox === 'empty') &&
                      (!blockAbove || blockAbove.boundingBox === 'empty');

      if (isClear) {
        moving = true;
        bot.setControlState('jump', true);
        bot.setControlState(direction, true);
        console.log(`🚶 Di chuyển ${direction}...`);

        setTimeout(() => {
          bot.setControlState(direction, false);
          bot.setControlState('jump', false);
          moving = false;
          console.log("🛑 Dừng lại.");
          setTimeout(randomMove, 6000 + Math.random() * 6000);
        }, 1500 + Math.random() * 1000);
      } else {
        console.log(`⛔ Bị chặn khi đi ${direction}, bỏ qua.`);
        setTimeout(randomMove, 6000 + Math.random() * 6000);
      }
    }

    // Xoay đầu nhìn xung quanh ngẫu nhiên
    function randomLook() {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = Math.random() * 0.5 - 0.25;
      bot.look(yaw, pitch, true);
      console.log("👀 Bot nhìn hướng khác.");
      setTimeout(randomLook, 8000 + Math.random() * 4000);
    }

    setTimeout(randomMove, 5000);
    setTimeout(randomLook, 3000);
  });

  bot.on('end', () => {
    console.log("❌ Bot bị disconnect. Reconnect sau 5s...");
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log(`❗ Lỗi: ${err.message}`);
    if (err.code === 'ECONNRESET') {
      console.log("🔁 Lỗi mạng, thử lại sau 5s...");
      setTimeout(createBot, 5000);
    }
  });

  bot.on('kicked', (reason) => {
    console.log(`💥 Bot bị kick: ${reason}`);
    if (reason.toLowerCase().includes("ban")) {
      console.warn("🚨 Có thể bị ban vĩnh viễn, không reconnect.");
    } else {
      setTimeout(createBot, 5000);
    }
  });

  // Chat phản hồi nếu bị nghi là bot
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message.toLowerCase().includes('bot')) {
      bot.chat('Tớ không phải bot đâu nha 🤖👀');
    }
  });
}

// Giữ app sống (Replit/Railway)
setInterval(() => {
  require('http').get("http://localhost:3000");
}, 280000);

createBot();
