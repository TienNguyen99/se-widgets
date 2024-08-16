const icons = {
  follower:
    '<path d="M32.294,5.434c-3.922,-3.239 -9.764,-2.656 -13.36,0.941l-0.934,0.933l-0.933,-0.933c-3.597,-3.597 -9.439,-4.18 -13.361,-0.941c-4.499,3.716 -4.736,10.391 -0.709,14.417l1.23,1.23l10.078,10.079c2.041,2.04 5.349,2.04 7.39,0l10.078,-10.079l1.23,-1.23c4.027,-4.026 3.79,-10.701 -0.709,-14.417" style="fill-rule:nonzero;"/>',
  cheer:
    '<path d="M14.27,4.598l-7.894,13.884c-0.917,1.614 -0.693,3.635 0.556,5.008l7.894,8.677c1.702,1.872 4.646,1.872 6.348,0l7.894,-8.677c1.249,-1.373 1.473,-3.394 0.556,-5.008l-7.894,-13.884c-1.645,-2.893 -5.815,-2.893 -7.46,0" style="fill-rule:nonzero;"/>',
  tip: '<path d="M26.899,22.449c0,3.679 -2.994,6.673 -6.674,6.673l0,2.225c0,1.23 -0.994,2.224 -2.224,2.224c-1.23,-0 -2.224,-0.994 -2.224,-2.224l0,-2.225l-0.597,-0c-2.373,-0 -4.589,-1.276 -5.779,-3.334c-0.616,-1.066 -0.251,-2.425 0.81,-3.039c1.065,-0.62 2.427,-0.251 3.038,0.81c0.399,0.69 1.137,1.114 1.929,1.114l5.045,-0c1.228,-0 2.225,-0.996 2.225,-2.224c-0,-0.841 -0.603,-1.553 -1.433,-1.691l-6.764,-1.127c-2.986,-0.497 -5.15,-3.055 -5.15,-6.08c-0,-3.679 2.994,-6.673 6.673,-6.673l-0,-2.225c-0,-1.228 0.995,-2.224 2.225,-2.224c1.23,-0 2.224,0.996 2.224,2.224l-0,2.225l0.596,-0c2.374,-0 4.59,1.279 5.78,3.336c0.616,1.064 0.251,2.423 -0.81,3.039c-1.068,0.616 -2.427,0.251 -3.039,-0.812c-0.398,-0.687 -1.136,-1.112 -1.928,-1.112l-5.045,-0c-1.228,-0 -2.225,0.999 -2.225,2.224c-0,0.841 0.603,1.553 1.433,1.691l6.764,1.128c2.986,0.496 5.15,3.054 5.15,6.079l-0,-0.002Z" style="fill-rule:nonzero;"/>',
  subscriber:
    '<path d="M21.376,4.733l2.016,4.085c0.548,1.111 1.608,1.881 2.835,2.059l4.508,0.655c3.087,0.449 4.32,4.244 2.086,6.422l-3.262,3.18c-0.887,0.864 -1.292,2.111 -1.083,3.332l0.77,4.49c0.528,3.075 -2.7,5.42 -5.462,3.968l-4.032,-2.12c-1.097,-0.576 -2.407,-0.576 -3.504,0l-4.032,2.12c-2.762,1.452 -5.99,-0.893 -5.462,-3.968l0.77,-4.49c0.209,-1.221 -0.196,-2.468 -1.083,-3.332l-3.262,-3.18c-2.234,-2.178 -1.001,-5.973 2.087,-6.422l4.508,-0.655c1.226,-0.178 2.286,-0.948 2.834,-2.059l2.016,-4.085c1.381,-2.798 5.371,-2.798 6.752,0" style="fill-rule:nonzero;"/>',
  host: '<path d="M24.648,17.724c1.803,-1.931 2.775,-4.649 2.343,-7.583c-0.587,-3.987 -3.899,-7.183 -7.901,-7.649c-5.509,-0.64 -10.182,3.649 -10.182,9.029c-0,2.419 0.945,4.617 2.485,6.245c0.77,0.814 0.376,2.128 -0.653,2.57c-4.08,1.752 -6.934,5.808 -6.913,10.535c0.007,1.485 1.262,2.701 2.746,2.701l22.855,-0c1.484,-0 2.739,-1.216 2.746,-2.701c0.021,-4.73 -2.836,-8.788 -6.921,-10.539c-1.053,-0.451 -1.387,-1.77 -0.605,-2.608" style="fill-rule:nonzero;"/>',
};

let fieldData = {};
let shownColors = [];

window.addEventListener("onEventReceived", (obj) => {
  if (!obj.detail.event) return;
  let event = obj.detail.listener;
  let data = obj.detail.event;
  switch (event) {
    case "message":
      addMessage(data.data);
      animateContainers();
      if (!fieldData.cacheAllMessages) clearMessageLog();
      break;
    case "delete-message":
      deleteMessage(data.data.msgId);
      break;
    case "delete-messages":
      deleteMessages(data.data.userId);
      break;
    case "event:test":
      if (data.field == "testMessage") testMessage();
      break;
    case "follower-latest":
    case "subscriber-latest":
    case "cheer-latest":
    case "tip-latest":
    case "raid-latest":
    case "host-latest":
      if (addAlert(data, event.split("-")[0])) {
        animateContainers();
        if (!fieldData.cacheAllMessages) clearMessageLog();
      }
      break;
  }
});

window.addEventListener("onWidgetLoad", (obj) => {
  const data = obj.detail.session.data;
  fieldData = obj.detail.fieldData;

  $(":root").css(
    "--background-color",
    fieldData.transparent ? "transparent" : "#221F2D80"
  );

  let colors = "";
  shownColors = Object.keys(fieldData)
    .filter((p) => p.startsWith("color") && p.endsWith("Show") && fieldData[p])
    .map((p) => p.slice(0, -4));
  for (let i = 0; i < shownColors.length; i++)
    colors += `.container:nth-last-of-type(${shownColors.length}n+${
      i + 1
    }) svg { fill: ${fieldData[shownColors[i]]} }.container:nth-last-of-type(${
      shownColors.length
    }n+${i + 1}) .message-name, .container:nth-last-of-type(${
      shownColors.length
    }n+${i + 1}) .alert-name { color: ${fieldData[shownColors[i]]} }`;
  $(`<style>${colors}</style>`).appendTo("head");
});

const testMessage = () =>
  window.dispatchEvent(
    new CustomEvent("onEventReceived", {
      detail: {
        listener: "message",
        event: {
          data: {
            time: Date.now(),
            displayName: [
              "numiieo",
              "dunkston",
              "randomname",
              "TwitchUser12",
              "Chatter",
              "SUPERLONGUSERNAME",
            ][Math.floor(Math.random() * 6 + 0)],
            text: "Ut enim ad minim, sed love eiusmod. Consectetur adipiscing elit! tempor incididunt ut labore et dolore magna aliqua."
              .split(" ")
              .slice(0, Math.floor(Math.random() * 18 + 1))
              .join(" "),
            msgId: "1",
            userId: "1",
            tags: { badges: "" },
          },
        },
      },
    })
  );

const addMessage = (data) =>
  $("body").prepend(
    `<div class="message-container container" data-msgId="${
      data.msgId
    }" data-userId="${
      data.userId
    }"><p class="message-name">${data.displayName.toUpperCase()}</p>${
      fieldData.transparent
        ? ""
        : '<div class="bell-container"><svg class="bell" viewBox="0 0 60 66"><path d="M19.998,54.82c-1.771,-0 -3.075,1.858 -2.279,3.441c2.712,5.388 8.779,8.521 14.97,7.263c4.071,-0.825 7.471,-3.429 9.363,-6.975c0.9,-1.684 -0.242,-3.729 -2.15,-3.729l-19.904,-0Z" style="fill-rule:nonzero;"/><path d="M8.221,49.338l42.913,-0.001c4.542,0 8.225,-3.683 8.225,-8.22c-0,-0.955 -0.167,-1.905 -0.492,-2.8l-7.816,-21.613c-2.746,-9.871 -11.734,-16.704 -21.98,-16.704c-10.687,-0 -19.945,7.425 -22.262,17.858l-6.442,20.834c-1.337,4.341 1.092,8.941 5.434,10.279c0.783,0.242 1.6,0.366 2.42,0.366" style="fill-rule:nonzero;"/></svg></div>'
    }<p class="message-text">${handleEmotes(
      fieldData.allCaps ? data.text.toUpperCase() : data.text,
      data.emotes
    )}</p></div>`
  );

const deleteMessage = (msgId) => {
  let target = $(`.message-container[data-msgId="${msgId}"]`);
  if (target.length) {
    target.remove();
    fixSpacing();
  }
};

const deleteMessages = (userId) => {
  let targets = $(`.message-container[data-userId="${userId}"]`);
  if (targets.length) {
    targets.each((index, value) => value.remove());
    fixSpacing();
  }
};

const fixSpacing = () => {
  $(".container").each((index, value) => {
    if (index <= 5) value.style.marginBottom = 0;
  });
  hideMessageOverflow();
};

const handleEmotes = (text, emotes) => {
  if (!emotes) return text;
  emotes.sort((a, b) => a.start - b.start);
  let offset = 0;
  for (let emote of emotes) {
    let replacementText = `<img src="${Object.values(emote.urls).pop()}">`;
    text = `${text.slice(
      0,
      emote.start - offset
    )}${replacementText}${text.slice(emote.end - offset + 1)}`;
    offset += emote.end + 1 - emote.start - replacementText.length;
  }
  return text;
};

const clearMessageLog = () => {
  if (document.body.children.length > 19 + shownColors.length)
    for (let i = 19 + shownColors.length; i > 19; i--)
      document.body.children[i].remove();
};

const animateContainers = () => {
  let newContainer = $(".container")[0];
  newContainer.style.marginBottom = `-${
    newContainer.scrollHeight +
    parseFloat(getComputedStyle(newContainer).marginTop)
  }px`;

  setTimeout(
    (container) => {
      container.classList.add("transition");
      container.style.marginBottom = 0;

      hideMessageOverflow();
    },
    5,
    newContainer
  );
};

const hideMessageOverflow = () => {
  if (fieldData.hideMessageOverflow) {
    let alreadyPushed = false;
    let stackHeight = 0;
    $(".container").each((index, value) => {
      if (index > 5 || alreadyPushed) return;
      stackHeight +=
        value.scrollHeight + parseFloat(getComputedStyle(value).marginTop);
      let offset =
        stackHeight -
        window.innerHeight -
        parseFloat(getComputedStyle(value).marginTop);

      if (offset > 2) {
        value.style.marginBottom = `${
          value.scrollHeight -
          offset +
          parseFloat(getComputedStyle(value).marginTop) +
          1
        }px`;
        alreadyPushed = true;
      }
    });
  }
};

const addAlert = (data, event) => {
  let action = "";
  let name = data.name;
  switch (event) {
    case "follower":
      action = "Just Followed";
      break;
    case "subscriber":
      if (data.bulkGifted) {
        name = data.sender;
        action = `Just Gifted ${data.amount} Sub${data.amount == 1 ? "" : "s"}`;
      } else if (data.isCommunityGift) return false;
      else if (data.gifted) {
        action = "Just Gifted 1 Sub";
        name = data.sender;
      } else action = "Just Subscribed";
      break;
    case "cheer":
      action = `Just Sent ${data.amount} Bit${data.amount == 1 ? "" : "s"}`;
      break;
    case "tip":
      action = `Just Donated $${
        (data.amount * 100) % 100 != 0 ? data.amount.toFixed(2) : data.amount
      }`;
      break;
    case "raid":
      action = "Just Raided";
      event = "host";
      break;
    case "host":
      action = "Just Hosted";
      break;
  }

  $("body").prepend(
    `<div class="alert-container container"><div class="icon-container"><svg class="icon" viewBox="0 0 36 36">${
      icons[event]
    }</svg></div>${
      fieldData.transparent
        ? ""
        : '<div class="bell-container"><svg class="bell" viewBox="0 0 60 66"><path d="M19.998,54.82c-1.771,-0 -3.075,1.858 -2.279,3.441c2.712,5.388 8.779,8.521 14.97,7.263c4.071,-0.825 7.471,-3.429 9.363,-6.975c0.9,-1.684 -0.242,-3.729 -2.15,-3.729l-19.904,-0Z" style="fill-rule:nonzero;"/><path d="M8.221,49.338l42.913,-0.001c4.542,0 8.225,-3.683 8.225,-8.22c-0,-0.955 -0.167,-1.905 -0.492,-2.8l-7.816,-21.613c-2.746,-9.871 -11.734,-16.704 -21.98,-16.704c-10.687,-0 -19.945,7.425 -22.262,17.858l-6.442,20.834c-1.337,4.341 1.092,8.941 5.434,10.279c0.783,0.242 1.6,0.366 2.42,0.366" style="fill-rule:nonzero;"/></svg></div>'
    }<p class="alert-name">${name.toUpperCase()}</p><p class="alert-text">${
      fieldData.allCaps ? action.toUpperCase() : action
    }</p></div>`
  );
  return true;
};
