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

    // Move randomly and auto-jump every 5 seconds
    const directions = ['forward', 'back', 'left', 'right'];
    setInterval(() => {
      if (!bot.player || !bot.player.entity) return;

      const direction = directions[Math.floor(Math.random() * directions.length)];
      const pos = bot.entity.position;
      const nextPos = pos.clone();

      if (direction === 'forward') nextPos.z -= 1;
      else if (direction === 'back') nextPos.z += 1;
      else if (direction === 'left') nextPos.x -= 1;
      else if (direction === 'right') nextPos.x += 1;

      const block = bot.blockAt(nextPos);
      const blockAbove = bot.blockAt(nextPos.offset(0, 1, 0));

      if ((!block || block.boundingBox === 'empty') && (!blockAbove || blockAbove.boundingBox === 'empty')) {
        console.log(`🚶 Bot is moving ${direction}...`);
        bot.setControlState('jump', true);
        bot.setControlState(direction, true);

        setTimeout(() => {
          bot.setControlState(direction, false);
          bot.setControlState('jump', false);
          console.log("🛑 Bot stopped.");
        }, 2000);
      } else {
        console.log(`⛔ Blocked when trying to move ${direction}, skipping.`);
      }
    }, 5000);
  });

  bot.on('end', () => {
    console.log("❌ Bot disconnected, trying to reconnect...");
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log(`❗ Error: ${err}`);
  });
}

createBot();
