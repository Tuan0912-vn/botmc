const mineflayer = require('mineflayer');
const Vec3 = require('vec3');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send("✅ Bot đang chạy..."));
app.listen(3000, () => console.log("🌐 Web server online."));

function createBot() {
  const bot = mineflayer.createBot({
    host: "ntkzenz.aternos.me",
    port: 59277,
    username: "AFK_Bot",
    version: false
  });

  bot.on('spawn', () => {
    console.log("✅ Bot đã vào server!");
    let sleeping = false;

    bot.on('sleep', () => {
      console.log("🛌 Bot bắt đầu ngủ.");
      sleeping = true;
    });

    bot.on('wake', () => {
      console.log("⏰ Bot đã dậy.");
      sleeping = false;
    });

    function checkSleep() {
      // Sử dụng timeOfDay để check chính xác hơn (0-24000)
      const timeOfDay = bot.time.timeOfDay;

      // Xác định ban đêm: thời gian từ 13000 tới 23000 là đêm trong Minecraft
      const isNight = timeOfDay >= 13000 && timeOfDay <= 23000;

      console.log(`🕓 Thời gian trong game: ${timeOfDay} | Ban đêm? ${isNight} | Bot đang ngủ? ${sleeping}`);

      const bedBlock = bot.blockAt(new Vec3(999999, 100, 999999));

      if (isNight) {
        if (bedBlock && bedBlock.name.includes('bed') && !sleeping) {
          console.log(`🛏️ Giường được tìm thấy: ${bedBlock.name}`);
          bot.sleep(bedBlock, (err) => {
            if (err) {
              console.log(`❗ Không thể ngủ: ${err.message}`);
            } else {
              bot.chat("💤 Đang ngủ thôi...");
            }
          });
        } else {
          console.log("⚠️ Không tìm thấy giường hoặc bot đã ngủ.");
        }
      } else {
        if (sleeping) {
          bot.wake();
          bot.chat("🌞 Thức dậy rồi!");
        } else {
          // Nhảy nhẹ chống AFK
          bot.setControlState('jump', true);
          setTimeout(() => bot.setControlState('jump', false), 300);
          console.log("⬆️ Nhảy ban ngày...");
        }
      }
    }

    setInterval(checkSleep, 10000);
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
