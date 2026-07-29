import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import api from './api'; // 🟢 သင့်ရဲ့ မူရင်း api.js (Token အလိုအလျောက် ပါမည့်အရာ) ကို ပြန်သုံးပါမည်

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.VUE_APP_REVERB_APP_KEY,
    wsHost: process.env.VUE_APP_REVERB_HOST,
    wsPort: process.env.VUE_APP_REVERB_PORT ?? 80,
    wssPort: process.env.VUE_APP_REVERB_PORT ?? 443,
    forceTLS: process.env.VUE_APP_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    
    authorizer: (channel, options) => {
    return {
        authorize: (socketId, callback) => {
            // 🟢 Sanctum သုံးထားသဖြင့် /api/ ရဲ့အောက်မှာပဲ သွားစေရန် 'broadcasting/auth' ဟု ရိုးရိုးပဲ ခေါ်ပေးပါ
            api.post('broadcasting/auth', { 
                socket_id: socketId,
                channel_name: channel.name
            })
            .then(response => {
                callback(false, response.data);
            })
            .catch(error => {
                console.error("Auth Base Error:", error.response ? error.response.data : error);
                callback(true, error);
            });
        }
    };
},
});

export default echo;