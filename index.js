const mineflayer = require('mineflayer');
const express = require('express');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const pvp = require('mineflayer-pvp').plugin;
const Vec3 = require('vec3').Vec3;

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

  bot.loadPlugin(pvp);
  bot.loadPlugin(pathfinder);

  bot.on('spawn', () => {
    console.log("✅ Bot has joined the server!");

    let moving = false;
    const directions = ['forward', 'back', 'left', 'right'];

    // 🔁 Anti-AFK movement
    setInterval(() => {
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
        console.log(`🚶 Moving ${direction}...`);

        setTimeout(() => {
          bot.setControlState(direction, false);
          bot.setControlState('jump', false);
          moving = false;
          console.log("🛑 Stopped.");
        }, 2000);
      } else {
        console.log(`⛔ Blocked moving ${direction}, skipping.`);
      }
    }, 8000);

    // 👀 Fake nhìn quanh để tránh AFK kick
    setInterval(() => {
      const yaw = Math.random() * Math.PI * 2;
      const pitch = Math.random() * 0.5 - 0.25;
      bot.look(yaw, pitch, true);
      console.log("👀 Bot changed look direction.");
    }, 10000);

    // ⚔️ Auto attack mob hostile gần bot
    setInterval(() => {
      if (!bot.entity || !bot.entities) return;

      const filterHostile = entity =>
        entity.type === 'mob' &&
        entity.position.distanceTo(bot.entity.position) < 4 &&
        ['zombie', 'skeleton', 'creeper', 'spider', 'enderman'].includes(entity.name);

      const target = Object.values(bot.entities).find(filterHostile);

      if (target) {
        bot.lookAt(target.position.offset(0, target.height, 0), true);
        bot.attack(target);
        console.log(`⚔️ Attacking ${target.name}!`);
      }
    }, 1000);
  });

  bot.on('end', () => {
    console.log("❌ Bot disconnected (maybe Aternos server offline), retrying...");
    setTimeout(createBot, 5000);
  });

  bot.on('error', (err) => {
    console.log(`❗ Error: ${err.message}`);
    if (err.code === 'ECONNRESET') {
      console.log("🔁 ECONNRESET! Reconnecting in 5s...");
      setTimeout(createBot, 5000);
    }
  });

  bot.on('kicked', (reason, loggedIn) => {
    console.log(`💥 Bot bị kick: ${reason}`);
    setTimeout(createBot, 5000);
  });
}

createBot();
