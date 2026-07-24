# 🤖 MG AI - Discord Bot

<div align="center">
  <p><strong>بوت ذكاء اصطناعي متكامل لدسكورد | Complete Discord AI Bot</strong></p>
  <p>
    <img src="https://img.shields.io/badge/version-1.0.0-444.svg" alt="Version">
    <img src="https://img.shields.io/badge/language-JavaScript-yellow.svg" alt="Language">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
  </p>
</div>

---

## ✨ المميزات | Features

- 🤖 **AI Assistant** - ذكاء اصطناعي للإجابة على الأسئلة (يدعم العربية والإنجليزية)
- ⚙️ **Admin Commands** - أوامر إدارية متكاملة (طرد، حظر، كتم، تحذير، مسح، قفل، فتح، إعلان...)
- 🛠️ **Utility Commands** - أوامر عامة (معلومات العضو، معلومات السيرفر، سرعة الاتصال...)
- 🌐 **Bilingual Support** - دعم كامل للغتين العربية والإنجليزية
- 🛡️ **Content Filter** - نظام فلترة للمحتوى الضار
- ⏰ **Cooldown System** - نظام مهلة لمنع الإرسال المتكرر
- 📊 **Dashboard** - لوحة تحكم عبر الموقع الإلكتروني مع تسجيل الدخول عبر Discord

---

## 📋 الأوامر | Commands

### 🤖 AI
| الأمر | الوصف |
|------|-------|
| `/ask` | اسأل البوت سؤالاً |

### ⚙️ Admin
| الأمر | الوصف |
|------|-------|
| `/clear` | مسح الرسائل في الروم |
| `/kick` | طرد عضو من السيرفر |
| `/ban` | حظر عضو من السيرفر |
| `/timeout` | كتم عضو مؤقتاً |
| `/warn` | إرسال تحذير لعضو |
| `/lock` | قفل الروم |
| `/unlock` | فتح الروم |
| `/slowmode` | تعديل الوضع البطيء |
| `/announce` | إرسال إعلان |
| `/say` | جعل البوت يقول شيئاً |

### 🛠️ Utility
| الأمر | الوصف |
|------|-------|
| `/help` | عرض قائمة الأوامر المتاحة |
| `/ping` | عرض سرعة الاتصال |
| `/userinfo` | معلومات العضو |
| `/serverinfo` | معلومات السيرفر |
| `/botinfo` | معلومات البوت |
| `/invite` | رابط دعوة البوت |
| `/language` | تغيير لغة البوت |
| `/report` | الإبلاغ عن مستخدم |

---

## 🚀 طريقة التثبيت | Installation

### المتطلبات الأساسية | Prerequisites
- [Node.js](https://nodejs.org/) v16.9.0 أو أحدث
- [Discord Bot Token](https://discord.com/developers/applications)

### الخطوات | Steps

1. **استنساخ المشروع | Clone the repository**
```bash
git clone https://github.com/yourusername/mg-ai-discord-bot.git
cd mg-ai-discord-bot
```

2. **تثبيت الاعتماديات | Install dependencies**
```bash
npm install
```

3. **إعداد المتغيرات البيئية | Setup environment variables**
انسخ ملف `.env.example` إلى `.env` وعبئه بمعلوماتك:
```bash
cp .env.example .env
```
ثم عدل ملف `.env`:
```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
DISCORD_CLIENT_SECRET=your_client_secret_here
GUILD_ID=your_guild_id_here
OWNER_ID=your_discord_user_id_here
SUPPORT_SERVER=https://discord.gg/yourserver
WEBSITE_PORT=3000
```

4. **تشغيل البوت | Run the bot**
```bash
npm start
```

5. **تشغيل الموقع (اختياري) | Run the website (optional)**
```bash
npm run website
```

---

## 🌐 الموقع الإلكتروني | Website

الموقع يتيح:
- تسجيل الدخول عبر Discord (OAuth2)
- عرض سيرفراتك التي تمتلك فيها صلاحية الإدارة
- إضافة البوت إلى سيرفراتك بنقرة واحدة
- دعم اللغتين العربية والإنجليزية

لفتح الموقع: `http://localhost:3000`

---

## 🛠️ التقنيات المستخدمة | Built With

- **[Discord.js v14](https://discord.js.org/)** - مكتبة Discord API
- **[Express.js](https://expressjs.com/)** - إطار عمل لخادم الويب
- **[EJS](https://ejs.co/)** - محرك قوالب
- **[Axios](https://axios-http.com/)** - مكتبة طلبات HTTP
- **[dotenv](https://github.com/motdotla/dotenv)** - إدارة المتغيرات البيئية

---

## 📁 هيكل المشروع | Project Structure

```
discord-ai-bot/
├── bot.js              # ملف البوت الرئيسي
├── config.js           # الإعدادات
├── package.json        # الاعتماديات
├── .env.example        # مثال المتغيرات البيئية
├── commands/           # الأوامر
│   ├── admin.js        # الأوامر الإدارية
│   ├── ai.js           # أوامر الذكاء الاصطناعي
│   └── utility.js      # الأوامر العامة
├── languages/          # ملفات الترجمة
│   ├── ar.json         # العربية
│   └── en.json         # English
├── utils/              # الأدوات المساعدة
│   ├── language.js     # إدارة اللغات
│   ├── filter.js       # فلترة المحتوى
│   ├── embedBuilder.js # بناء الـ Embeds
│   └── cooldown.js     # نظام المهلة
└── website/            # الموقع الإلكتروني
    ├── server.js       # خادم الويب
    ├── views/          # القوالب
    │   ├── index.ejs   # الصفحة الرئيسية
    │   └── dashboard.ejs # لوحة التحكم
    └── public/         # الملفات الثابتة
        ├── css/
        │   └── style.css
        ├── js/
        │   └── main.js
        └── img/
            └── default-avatar.svg
```

---

## 📜 الترخيص | License

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للمزيد.

---

## 👨‍💻 المطور | Developer

**MG CoDe**

---

<div align="center">
  <strong>MG AI - Version 1.0.0</strong>
  <br>
  <span>بوت ذكاء اصطناعي متكامل | Complete AI Discord Bot</span>
</div>

