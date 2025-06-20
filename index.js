const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send("✅ Bot is running..."));
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
    console.log("✅ Bot has joined the server!");

    const directions = ['forward', 'back', 'left', 'right'];
    let moving = false;

    setInterval(() => {
      if (!bot.player || !bot.player.entity || moving) return;

      const direction = directions[Math.floor(Math.random() * directions.length)];
      const pos = bot.entity.position.clone();
      let offset = { x: 0, z: 0 };

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
        console.log(`🚶 Moving ${direction}...`);
        bot.setControlState('jump', true);
        bot.setControlState(direction, true);

        setTimeout(() => {
          bot.setControlState(direction, false);
          bot.setControlState('jump', false);
          moving = false;
          console.log("🛑 Stopped.");
        }, 2000);
      } else {
        console.log(`⛔ Blocked moving ${direction}, skipping.`);
      }
    }, 5000);
  });

  bot.on('end', () => {
    console.log("❌ Bot disconnected (maybe Aternos server offline), retrying...");
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log(`❗ Error: ${err.message}`);
  });
}

createBot();
