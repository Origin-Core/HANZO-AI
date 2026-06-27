// ============================================================
// تنظیمات API
// ============================================================
const API_KEY = 'sk-26ebbe7e345e45e3befd117e5ff54996';
const API_URL = 'https://api.openai.com/v1/chat/completions';

// ============================================================
// المان‌های DOM
// ============================================================
const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const micBtn = document.getElementById('micBtn');

let isListening = false;

// ============================================================
// تابع ارسال پیام به API
// ============================================================
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // نمایش پیام کاربر
    addMessage('user', message);
    userInput.value = '';
    userInput.disabled = true;

    // نمایش حالت بارگذاری
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = `
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <p>هانزو در حال فکر کردن...</p>
    `;
    chatBox.appendChild(loadingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        const data = await response.json();
        loadingDiv.remove();
        userInput.disabled = false;
        userInput.focus();

        if (data.choices && data.choices[0]) {
            addMessage('assistant', data.choices[0].message.content);
        } else {
            addMessage('assistant', '⚠️ خطا: پاسخی از سمت سرور دریافت نشد.');
        }
    } catch (error) {
        loadingDiv.remove();
        userInput.disabled = false;
        addMessage('assistant', '⚠️ خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
        console.error('❌ خطا:', error);
    }
}

// ============================================================
// تابع افزودن پیام به جعبه چت
// ============================================================
function addMessage(role, content) {
    // حذف پیام خالی (خوش‌آمدگویی)
    const emptyChat = chatBox.querySelector('.empty-chat');
    if (emptyChat) emptyChat.remove();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;

    const icon = role === 'user' ? '👤' : '🤖';
    const name = role === 'user' ? 'شما' : 'هانزو';

    messageDiv.innerHTML = `
        <div class="message-header">
            <span>${icon}</span>
            <strong>${name}</strong>
        </div>
        <div class="message-content">${content}</div>
    `;

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// ============================================================
// تابع ضبط صدا (شبیه‌سازی)
// ============================================================
function toggleMic() {
    isListening = !isListening;

    if (isListening) {
        micBtn.textContent = '⏹️';
        micBtn.classList.add('listening');
        userInput.placeholder = '🎤 در حال ضبط...';
        userInput.disabled = true;

        // شبیه‌سازی دریافت صدا بعد از ۲ ثانیه
        setTimeout(() => {
            userInput.value = 'سلام هانزو، چطوری؟';
            toggleMic(); // خاموش کردن حالت ضبط
            sendMessage();
        }, 2000);
    } else {
        micBtn.textContent = '🎤';
        micBtn.classList.remove('listening');
        userInput.placeholder = 'با هانزو صحبت کن...';
        userInput.disabled = false;
        userInput.focus();
    }
}

// ============================================================
// تابع نمایش/مخفی کردن منوی تنظیمات
// ============================================================
function toggleSettings() {
    const menu = document.getElementById('settingsMenu');
    menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
}

// ============================================================
// تابع پاک کردن تاریخچه چت
// ============================================================
function clearHistory() {
    chatBox.innerHTML = `
        <div class="empty-chat">
            <div style="font-size: 50px;">🤖</div>
            <h3>به هانزو خوش آمدید!</h3>
            <p>سوال خود را بپرسید یا با من چت کنید.</p>
        </div>
    `;
    document.getElementById('settingsMenu').style.display = 'none';
}

// ============================================================
// رویداد ارسال با کلید Enter
// ============================================================
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// ============================================================
// فوکوس اتوماتیک روی ورودی هنگام بارگذاری صفحه
// ============================================================
window.addEventListener('load', () => {
    userInput.focus();
});

// ============================================================
// لاگ خوش‌آمدگویی در کنسول
// ============================================================
console.log('🚀 HANZO-AI نسخه 0.2');
console.log('🤖اماده است!');
console.log('📌 برای شروع، پیام خود را تایپ کنید.');
