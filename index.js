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
    host: "letmecookVN.aternos.me",
    port: 46967,
    username: "TuanDev",
    version: false
  });

  bot.on('spawn', () => {
    console.log("✅ Bot đã vào server!");

    // 🧭 Di chuyển ngẫu nhiên
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

    // 👀 Nhìn xung quanh
    function randomLook() {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = Math.random() * 0.5 - 0.25;
      bot.look(yaw, pitch, true);
      console.log("👀 Nhìn hướng khác.");
      setTimeout(randomLook, 8000 + Math.random() * 4000);
    }

    // 🧍 Fake hành vi nhẹ: sneak / sprint / jump
    function fakeIdleAction() {
      const actions = ['sneak', 'sprint', 'jump'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      bot.setControlState(action, true);
      console.log(`🎭 Giả vờ ${action}...`);

      setTimeout(() => {
        bot.setControlState(action, false);
        console.log(`🔚 Dừng ${action}`);
        setTimeout(fakeIdleAction, 12000 + Math.random() * 10000);
      }, 1000 + Math.random() * 2000);
    }

    // 🔁 Đổi slot hotbar ngẫu nhiên
    function changeHotbarSlot() {
      const slot = Math.floor(Math.random() * 9);
      bot.setQuickBarSlot(slot);
      console.log(`🎯 Chuyển slot sang ${slot}`);
      setTimeout(changeHotbarSlot, 15000 + Math.random() * 10000);
    }

    // Bắt đầu các hành vi
    setTimeout(randomMove, 5000);
    setTimeout(randomLook, 3000);
    setTimeout(fakeIdleAction, 10000);
    setTimeout(changeHotbarSlot, 20000);
  });

  bot.on('end', () => {
    console.log("❌ Mất kết nối, thử lại sau 5s...");
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log(`❗ Lỗi: ${err.message}`);
    if (err.code === 'ECONNRESET') {
      console.log("🔁 Kết nối bị reset. Thử lại sau 5s...");
      setTimeout(createBot, 5000);
    }
  });

  bot.on('kicked', (reason) => {
    console.log(`💥 Bị kick: ${reason}`);
    if (reason.toLowerCase().includes("ban")) {
      console.warn("🚨 Có thể bị ban! Không reconnect nữa.");
    } else {
      setTimeout(createBot, 5000);
    }
  });
}

// Giữ app sống (Replit/Railway)
setInterval(() => {
  require('http').get("http://localhost:3000");
}, 280000);

createBot();
