    let fieldData = {};
    let cur = { follower: 0, subscriber: 0, tip: 0 };

    window.addEventListener('onEventReceived', obj => {
        if(!obj.detail.event) return;
        let event = obj.detail.listener.split('-')[0];
        let data = obj.detail.event;
        if(data.bulkGifted) return;
        handleIncrease(event, data.gifted || event == 'follower' || (event == 'subscriber' && !data.isCommunityGift) ? 1 : data.amount);
    });

    window.addEventListener('onWidgetLoad', obj => {
        let data = obj.detail.session.data;
        fieldData = obj.detail.fieldData;

        cur.follower = data['follower-goal'].amount;
        cur.subscriber = data['subscriber-goal'].amount;
        cur.tip = data['tip-goal'].amount;

        $('img').css('left', `${(window.innerWidth - $('img')[0].scrollWidth) / 2}px`);

        handleIncrease('follower', 0)
    });

    const handleIncrease = (event, amount) => {
        switch(event) {
            case 'follower':
                $('#filled-bar').css('stroke', fieldData.followerColor);
                $('#count').css('color', fieldData.followerColor);
                $('#box').css('left', '32px');
                break;
            case 'subscriber':
                $('#filled-bar').css('stroke', fieldData.subscriberColor);
                $('#count').css('color', fieldData.subscriberColor);
                $('#box').css('left', '95px');
                break;
            case 'tip':
                $('#filled-bar').css('stroke', fieldData.tipColor);
                $('#count').css('color', fieldData.tipColor);
                $('#box').css('left', '159px');
                break;
            default: return;
        }

        cur[event] += amount;
        let percent = Math.min(100, Math.round(100 * cur[event] / fieldData[`${event}Goal`]));
        if(fieldData.displayType == 'count') $('#count').text(event == 'tip' ? `$${(cur[event] * 100 % 100 == 0 ? cur[event].toFixed(0) : cur[event].toFixed(2))}/$${(fieldData[`${event}Goal`] * 100 % 100 == 0 ? fieldData[`${event}Goal`].toFixed(0) : fieldData[`${event}Goal`].toFixed(2))}` : `${cur[event]}/${parseInt(fieldData[`${event}Goal`])}`);
        else $('#count').text(`${percent == 100 && cur[event] < fieldData[`${event}Goal`] ? 99 : percent}%`);
        $('#filled-bar').css('transform', `rotate(${1.8 * percent - 180}deg)`);
        $('#fill-container').css('width', percent < 5 ? '50px' : '235px');
    }