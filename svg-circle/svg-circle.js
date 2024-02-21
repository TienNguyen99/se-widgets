            let eventsLimit = 5,
            userLocale = "en-US",
            includeFollowers = true,
            includeRedemptions = true,
            includeHosts = true,
            minHost = 0,
            includeRaids = true,
            minRaid = 0,
            includeSubs = true,
            includeTips = true,
            minTip = 0,
            includeCheers = true,
            direction = "top",
            textOrder = "nameFirst",
            minCheer = 0;

            let userCurrency,
            totalEvents = 0;

            //Event Received
            window.addEventListener("onEventReceived", function (obj) {
            if (!obj.detail.event) {
                return;
            }
            if (typeof obj.detail.event.itemId !== "undefined") {
                obj.detail.listener = "redemption-latest";
            }
            const listener = obj.detail.listener.split("-")[0];
            const event = obj.detail.event;
            switch (listener) {
                case "follower":
                if (includeFollowers) {
                    addEvent("follower", "Follower", event.name);
                }
                break;
                case "redemption":
                if (includeRedemptions) {
                    addEvent("redemption", "Redeemed", event.name);
                }
                break;
                case "subscriber":
                if (includeSubs) {
                    if (event.gifted) {
                    addEvent("sub", `Sub gift`, event.name);
                    } else {
                    addEvent("sub", `Sub X${event.amount}`, event.name);
                    }
                }
                break;
                case "host":
                if (includeHosts && minHost <= event.amount) {
                    addEvent("host", `Host ${event.amount.toLocaleString()}`, event.name);
                }
                break;
                case "cheer":
                if (includeCheers && minCheer <= event.amount) {
                    addEvent("cheer", `${event.amount.toLocaleString()} Bits`, event.name);
                }
                break;
                case "tip":
                if (includeTips && minTip <= event.amount) {
                    if (event.amount === parseInt(event.amount)) {
                    addEvent(
                        "tip",
                        event.amount.toLocaleString(userLocale, {
                        style: "currency",
                        minimumFractionDigits: 0,
                        currency: userCurrency.code,
                        }),
                        event.name
                    );
                    } else {
                    addEvent(
                        "tip",
                        event.amount.toLocaleString(userLocale, {
                        style: "currency",
                        currency: userCurrency.code,
                        }),
                        event.name
                    );
                    }
                }
                break;
            }
            });
            //Widget load
            window.addEventListener("onWidgetLoad", function (obj) {
            let recents = obj.detail.recents;
            recents.sort(function (a, b) {
                return Date.parse(a.createdAt) - Date.parse(b.createdAt);
            });
            userCurrency = obj.detail.currency;
            const fieldData = obj.detail.fieldData;
            eventsLimit = fieldData.eventsLimit;
            includeFollowers = fieldData.includeFollowers === "yes";
            includeRedemptions = fieldData.includeRedemptions === "yes";
            includeHosts = fieldData.includeHosts === "yes";
            minHost = fieldData.minHost;
            includeRaids = fieldData.includeRaids === "yes";
            minRaid = fieldData.minRaid;
            includeSubs = fieldData.includeSubs === "yes";
            includeTips = fieldData.includeTips === "yes";
            minTip = fieldData.minTip;
            includeCheers = fieldData.includeCheers === "yes";
            minCheer = fieldData.minCheer;
            direction = fieldData.direction;
            userLocale = fieldData.locale;
            textOrder = fieldData.textOrder;
            fadeoutTime = fieldData.fadeoutTime;

            let eventIndex;
            for (eventIndex = 0; eventIndex < recents.length; eventIndex++) {
                const event = recents[eventIndex];
                switch (event.type) {
                case "follower":
                    if (includeFollowers) {
                    addEvent("follower", "Follower", event.name);
                    }
                    break;
                case "redemption":
                if (includeRedemptions) {
                    addEvent("redemption", "Redeemed", event.name);
                }
                    break;
                case "subscriber":
                if (!includeSubs) continue;
                if (event.amount === "gift") {
                    addEvent("sub", `Sub gift`, event.name);
                } else {
                    addEvent("sub", `Sub X${event.amount}`, event.name);
                }
                    break;
                case "host":
                if (includeHosts && minHost <= event.amount) {
                    addEvent("host", `Host ${event.amount.toLocaleString()}`, event.name);
                }
                    break;
                case "cheer":
                if (includeCheers && minCheer <= event.amount) {
                    addEvent("cheer", `${event.amount.toLocaleString()} Bits`, event.name);
                }
                    break;

                case "tip":
                if (includeTips && minTip <= event.amount) {
                    if (event.amount === parseInt(event.amount)) {
                    addEvent(
                        "tip",
                        event.amount.toLocaleString(userLocale, {
                        style: "currency",
                        minimumFractionDigits: 0,
                        currency: userCurrency.code,
                        }),
                        event.name
                    );
                    } else {
                    addEvent(
                        "tip",
                        event.amount.toLocaleString(userLocale, {
                        style: "currency",
                        currency: userCurrency.code,
                        }),
                        event.name
                    );
                    }
                }
                    break;
                case "cheer":
                if (includeCheers && minCheer <= event.amount) {
                    addEvent("cheer", `${event.amount.toLocaleString()} Bits`, event.name);
                }
                    break;
                }
            }
            });

            function addEvent(type, text, username) {
            totalEvents += 1;
            let element;
            if (textOrder === "actionFirst") {
                element = `
                                    <div class="event-container" id="event-${totalEvents}">
                                        <div class="backgroundsvg"></div>
                                        <div class="event-image event-${type}"></div>
                                        <div class="username-container">${text}</div>
                                    <div class="details-container">${username}</div>
                                    </div>`;
            } else {
                element = `
                                    <div class="event-container" id="event-${totalEvents}">
                                        <div class="backgroundsvg"></div>
                                        <div class="event-image event-${type}"></div>
                                        <div class="username-container">${username}</div>
                                    <div class="details-container">${text}</div>
                                    </div>`;
            }
            if (direction === "bottom") {
                $(".main-container").removeClass("fadeOutClass").show().append(element);
            } else {
                $(".main-container").removeClass("fadeOutClass").show().prepend(element);
            }
            if (fadeoutTime !== 999) {
                $(".main-container").addClass("fadeOutClass");
            }
            if (totalEvents > eventsLimit) {
                removeEvent(totalEvents - eventsLimit);
            }
            }

            function removeEvent(eventId) {
            $(`#event-${eventId}`).animate(
                {
                height: 0,
                opacity: 0,
                },
                "slow",
                function () {
                $(`#event-${eventId}`).remove();
                }
            );
            }


