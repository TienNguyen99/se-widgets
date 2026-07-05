

let fieldData = {};
let shownColors = [];

// HTML chuông dùng lại nhiều chỗ — tách ra biến cho gọn
// 👉 ĐỂ THAY BẰNG SPRITE: đổi thẻ <svg> này thành <div class="bell-sprite"></div>
//    rồi style .bell-sprite bằng background-image + animation steps() trong CSS
const bellHTML = `
    <div class="bell-container">
        <svg class="bell" viewBox="0 0 60 66">
            <path d="M19.998,54.82c-1.771,-0 -3.075,1.858 -2.279,3.441c2.712,5.388 8.779,8.521 14.97,7.263c4.071,-0.825 7.471,-3.429 9.363,-6.975c0.9,-1.684 -0.242,-3.729 -2.15,-3.729l-19.904,-0Z" style="fill-rule:nonzero;"/>
            <path d="M8.221,49.338l42.913,-0.001c4.542,0 8.225,-3.683 8.225,-8.22c-0,-0.955 -0.167,-1.905 -0.492,-2.8l-7.816,-21.613c-2.746,-9.871 -11.734,-16.704 -21.98,-16.704c-10.687,-0 -19.945,7.425 -22.262,17.858l-6.442,20.834c-1.337,4.341 1.092,8.941 5.434,10.279c0.783,0.242 1.6,0.366 2.42,0.366" style="fill-rule:nonzero;"/>
        </svg>
    </div>`;

window.addEventListener('onWidgetLoad', obj => {
    fieldData = obj.detail.fieldData;
    $(':root').css('--background-color', fieldData.transparent ? 'transparent' : '#221F2D80');

    // Tạo CSS màu sắc xoay vòng cho các container
    shownColors = Object.keys(fieldData)
        .filter(p => p.startsWith('color') && p.endsWith('Show') && fieldData[p])
        .map(p => p.slice(0, -4));

    const colorCSS = shownColors.map((color, i) =>
        `.container:nth-last-of-type(${shownColors.length}n+${i + 1}) svg { fill: ${fieldData[color]} }
         .container:nth-last-of-type(${shownColors.length}n+${i + 1}) .message-name,
         .container:nth-last-of-type(${shownColors.length}n+${i + 1}) .alert-name { color: ${fieldData[color]} }`
    ).join('');
    $(`<style>${colorCSS}</style>`).appendTo('head');
});

window.addEventListener('onEventReceived', obj => {
    if (!obj.detail.event) return;
    const event = obj.detail.listener;
    const data  = obj.detail.event;

    switch (event) {
        case 'message':
            addMessage(data.data);
            updateSeparators();
            animateContainers();
            if (!fieldData.cacheAllMessages) clearMessageLog();
            break;
        case 'delete-message':  deleteMessage(data.data.msgId);   break;
        case 'delete-messages': deleteMessages(data.data.userId);  break;
        case 'event:test':
            if (data.field === 'testMessage') testMessage();
            break;
        case 'follower-latest': case 'subscriber-latest':
        case 'cheer-latest':    case 'tip-latest':
        case 'raid-latest':     case 'host-latest':
            if (addAlert(data, event.split('-')[0])) {
                updateSeparators();
                animateContainers();
                if (!fieldData.cacheAllMessages) clearMessageLog();
            }
            break;
    }
});

// Tin nhắn test ngẫu nhiên
const testMessage = () => window.dispatchEvent(new CustomEvent('onEventReceived', {
    detail: {
        listener: 'message',
        event: { data: {
            time: Date.now(),
            displayName: ['numiieo','dunkston','randomname','TwitchUser12','Chatter','SUPERLONGUSERNAME'][Math.floor(Math.random() * 6)],
            text: 'Ut enim ad minim, sed love eiusmod. Consectetur adipiscing elit! tempor incididunt ut labore et dolore magna aliqua.'.split(' ').slice(0, Math.floor(Math.random() * 18 + 1)).join(' '),
            msgId: '1', userId: '1', tags: { badges: '' }
        }}
    }
}));

const addMessage = data => $('body').prepend(`
    <div class="message-container container" data-msgId="${data.msgId}" data-userId="${data.userId}">
        <div class="chat-bg"></div>
        <div class="chat-border"></div>
        <div class="bunny-sprite"></div>
        <p class="message-name">${data.displayName.toUpperCase()}</p>
        ${fieldData.transparent ? '' : bellHTML}
        <p class="message-text">${handleEmotes(fieldData.allCaps ? data.text.toUpperCase() : data.text, data.emotes)}</p>
    </div>`);

// Thay thế emote text bằng thẻ <img>
const handleEmotes = (text, emotes) => {
    if (!emotes) return text;
    emotes.sort((a, b) => a.start - b.start);
    let offset = 0;
    for (const emote of emotes) {
        const img = `<img src="${Object.values(emote.urls).pop()}">`;
        text = text.slice(0, emote.start - offset) + img + text.slice(emote.end - offset + 1);
        offset += (emote.end + 1 - emote.start) - img.length;
    }
    return text;
};

const deleteMessage = msgId => {
    const el = $(`.message-container[data-msgId="${msgId}"]`);
    if (el.length) { el.remove(); updateSeparators(); fixSpacing(); }
};

const deleteMessages = userId => {
    const els = $(`.message-container[data-userId="${userId}"]`);
    if (els.length) { els.each((_, el) => el.remove()); updateSeparators(); fixSpacing(); }
};

const updateSeparators = () => {
    const containers = $('.container');
    containers.removeClass('has-separator');
    containers.slice(0, -1).addClass('has-separator');
};

// Sửa lại margin sau khi xóa tin nhắn
const fixSpacing = () => {
    $('.container').each((i, el) => { if (i <= 5) el.style.marginBottom = 0; });
    hideMessageOverflow();
};

// Giới hạn số tin nhắn trong DOM
const clearMessageLog = () => {
    const max = 19 + shownColors.length;
    while (document.body.children.length > max) document.body.children[max].remove();
    updateSeparators();
};

// Trượt tin nhắn mới vào từ dưới
const animateContainers = () => {
    const el = $('.container')[0];
    el.style.marginBottom = `-${el.scrollHeight + parseFloat(getComputedStyle(el).marginTop)}px`;
    setTimeout(el => {
        el.classList.add('transition');
        el.style.marginBottom = 0;
        hideMessageOverflow();
    }, 5, el);
};

// Ẩn tin nhắn tràn ra ngoài viewport
const hideMessageOverflow = () => {
    if (!fieldData.hideMessageOverflow) return;
    let pushed = false, stackH = 0;
    $('.container').each((i, el) => {
        if (i > 5 || pushed) return;
        stackH += el.scrollHeight + parseFloat(getComputedStyle(el).marginTop);
        const overflow = stackH - window.innerHeight - parseFloat(getComputedStyle(el).marginTop);
        if (overflow > 2) {
            el.style.marginBottom = `${el.scrollHeight - overflow + parseFloat(getComputedStyle(el).marginTop) + 1}px`;
            pushed = true;
        }
    });
};

const addAlert = (data, event) => {
    let name = data.name, action = '';
    switch (event) {
        case 'follower':    action = 'Just Followed'; break;
        case 'subscriber':
            if      (data.bulkGifted)     { name = data.sender; action = `Just Gifted ${data.amount} Sub${data.amount == 1 ? '' : 's'}`; }
            else if (data.isCommunityGift) return false;
            else if (data.gifted)         { name = data.sender; action = 'Just Gifted 1 Sub'; }
            else                            action = 'Just Subscribed';
            break;
        case 'cheer':  action = `Just Sent ${data.amount} Bit${data.amount == 1 ? '' : 's'}`; break;
        case 'tip':    action = `Just Donated $${(data.amount * 100) % 100 != 0 ? data.amount.toFixed(2) : data.amount}`; break;
        case 'raid':   action = 'Just Raided';  event = 'host'; break;
        case 'host':   action = 'Just Hosted';  break;
    }

    // 👉 ĐỂ THAY ICON SỰ KIỆN BẰNG SPRITE:
    //    Đổi thẻ <svg class="icon"> thành <div class="icon-sprite icon-sprite--${event}"></div>
    //    rồi dùng background-image + background-position theo từng loại event trong CSS
    $('body').prepend(`
        <div class="alert-container container">
            <div class="chat-bg"></div>
            <div class="chat-border"></div>
            <div class="bunny-sprite"></div>
            <div class="icon-container"></div>
            ${fieldData.transparent ? '' : bellHTML}
            <p class="alert-name">${name.toUpperCase()}</p>
            <p class="alert-text">${fieldData.allCaps ? action.toUpperCase() : action}</p>
        </div>`);
    return true;
};
