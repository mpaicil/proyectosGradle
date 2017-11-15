edge = window.edge || {};
edge.Lottery = edge.Lottery || {};
edge.Lottery.Common = edge.Lottery.Common || {};
edge.Lottery.BaseModel = function (data, view) {
    data = data || {};
    for (var key in data) {
        if (typeof data[key] != "object" || data[key] === null) {
            this[key] = data[key] || "";
        }
    }
    this.view = view;
    this.widgetIdentifier = data.widgetIdentifier || null;
}
edge.Lottery.BaseModel.prototype.init = function () {
    if (this.container) {
        var _element = document.querySelector('.' + this.container) || document.querySelector('#' + this.container);
        if (_element) {
            ko.applyBindings(this, _element);
        }
    }
}
edge.Lottery.BaseModel.prototype.abSelector = function () {
    if (this.widgetUpdate && this.widgetUpdate.id) {
        return 'ab-widget-' + this.widgetUpdate.id;
    }
    return null;
}
edge.Lottery.BaseModel.prototype.onRender = function () {
}
edge.Lottery.BaseModel.prototype.onViewShow = function () {
}
edge.Lottery.BaseModel.prototype.pageTitle = function () {
}
edge.Lottery.Desktop = edge.Desktop || {};
edge.Lottery.BaseChannelModel = function (data) {
    edge.Lottery.BaseModel.apply(this, arguments);
}
edge.Lottery.BaseChannelModel.prototype = Object.create(edge.Lottery.BaseModel.prototype);
edge.Animations = {
    animations: ["noAnimation", "bounce", "flash", "pulse", "rubberBand", "shake", "swing", "tada", "wobble", "bounceIn", "bounceInDown", "bounceInLeft", "bounceInRight", "bounceInUp", "bounceOut", "bounceOutDown", "bounceOutLeft", "bounceOutRight", "bounceOutUp", "fadeIn", "fadeInDown", "fadeInDownBig", "fadeInLeft", "fadeInLeftBig", "fadeInRight", "fadeInRightBig", "fadeInUp", "fadeInUpBig", "fadeOut", "fadeOutDown", "fadeOutDownBig", "fadeOutLeft", "fadeOutLeftBig", "fadeOutRight", "fadeOutRightBig", "fadeOutUp", "fadeOutUpBig", "flip", "flipInX", "flipInY", "flipOutX", "flipOutY", "lightSpeedIn", "lightSpeedOut", "rotateIn", "rotateInDownLeft", "rotateInDownRight", "rotateInUpLeft", "rotateInUpRight", "rotateOut", "rotateOutDownLeft", "rotateOutDownRight", "rotateOutUpLeft", "rotateOutUpRight", "hinge", "rollIn", "rollOut", "zoomIn", "zoomInDown", "zoomInLeft", "zoomInRight", "zoomInUp", "zoomOut", "zoomOutDown", "zoomOutLeft", "zoomOutRight", "zoomOutUp"],
    baseAnimateClass: "animated",
    animate: function (jqElement, animationType, callback) {
        var self = this;
        jqElement.one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function (event) {
            jqElement.removeClass(self.baseAnimateClass);
            jqElement.removeClass(animationType);
            callback.call(this, event, animationType);
        });
        jqElement.addClass(this.baseAnimateClass).addClass(animationType);
    }
}
edge.Lottery.Common.App = function (applicationMode, lang, settings) {
    this.user = ko.observable(null);
    this._customDialogInstances = {};
    this._lang = lang || '';
    this._applicationMode = applicationMode || 'development';
    this._pageId = null;
    this._pageIdentifier = null;
    this.getFunction = function (name) {
        var fn;
        if (window[name]) {
            fn = window[name];
        }
        else {
            name = name.split(".");
            fn = window;
            for (var i = 0; i < name.length; i++) {
                if (!fn[name[i]]) {
                    return false;
                }
                fn = fn[name[i]];
            }
        }
        return typeof fn == 'function' ? fn : false;
    };
    if (app) {
        for (var key in app) {
            if (!this[key]) {
                this[key] = app[key];
            }
        }
    }
    window.app = this;
}
edge.Lottery.Common.App.prototype.currency = function (num, currencyFormat, noSymbol) {
    var currencyFormat = currencyFormat || this.settings.currency.format || "#,##0.00##";
    var format = function (b, a) {
        function toFixed(a, d) {
            return (parseInt((+a) * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
        }

        if (!b || isNaN(+a)) return a;
        var a = b.charAt(0) == "-" ? -a : +a, j = a < 0 ? a = -a : 0, e = b.match(/[^\d\-\+#]/g),
            h = e && e[e.length - 1] || ".", e = e && e[1] && e[0] || ",", b = b.split(h),
            a = toFixed(a, b[1] && b[1].length), a = +a + "", d = b[1] && b[1].lastIndexOf("0"), c = a.split(".");
        if (!c[1] || c[1] && c[1].length <= d) a = toFixed(a, d + 1).toString();
        d = b[0].split(e);
        b[0] = d.join("");
        var f = b[0] && b[0].indexOf("0");
        if (f > -1) for (; c[0].length < b[0].length - f;) c[0] = "0" + c[0]; else +c[0] == 0 && (c[0] = "");
        a = a.split(".");
        a[0] = c[0];
        if (c = d[1] && d[d.length -
            1].length) {
            for (var d = a[0], f = "", k = d.length % c, g = 0, i = d.length; g < i; g++) f += d.charAt(g), !((g - k + 1) % c) && g < i - c && (f += e);
            a[0] = f
        }
        a[1] = b[1] && a[1] ? h + a[1] : "";
        return (j ? "-" : "") + a[0] + a[1]
    };
    num = parseFloat(num || 0);
    if (noSymbol) {
        return format(currencyFormat, num);
    }
    return this.settings.currency.displayFormat.replace("%amount", format(currencyFormat, num));
};
edge.Lottery.Common.App.prototype.getHost = function () {
    return location.protocol + '//' + window.location.host;
}
edge.Lottery.Common.App.prototype.init = function (settings) {
    this.settings = settings || {currency: {symbol: "$", format: "#,##0.00##", displayFormat: "%symbol%amount"}};
    this.settings.currency.displayFormat = this.settings.currency.displayFormat.replace("%symbol", this.settings.currency.symbol);
    $.validator.addMethod("regex", function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    }, "Please check your input.");
}
edge.Lottery.Common.App.prototype.setUser = function (user) {
    this.user(new edge.Lottery.Common.User(user));
}
edge.Lottery.Common.App.prototype.getInstanceModel = function (modelName) {
    throw new edge.Exception("each channel must implement its own get instance model");
}
edge.Lottery.Common.App.prototype.getInstances = function () {
    throw new edge.Exception("each channel must implement its own get instances");
}
edge.Lottery.Common.App.prototype.getModelsList = function () {
    throw new edge.Exception("each channel must implement its own get models list");
}
edge.Lottery.Common.App.prototype.include = function (scriptUrl) {
    document.includedScripts = document.includedScripts || {};
    if (!document.includedScripts[scriptUrl]) {
        document.write('<script src="' + scriptUrl + '"></script>');
        document.includedScripts[scriptUrl] = true;
    }
}
edge.Lottery.Common.App.prototype.navigation = {
    urls: {}, setKeys: function (keys) {
        for (var key in keys) {
            this.set(key, keys[key]);
        }
    }, set: function (key, text) {
        this.urls[key] = text;
    }, get: function (key) {
        return this.urls[key] ? this.urls[key] : key;
    }, getActionUrl: function (key) {
        return this.get(key);
    }
};
edge.Lottery.Common.App.prototype.session = (function () {
    return sessionStorage ? {
        data: sessionStorage, set: function (key, value) {
            if (typeof value == 'object') {
                value = JSON.stringify(value);
            }
            this.data[key] = value;
        }, get: function (key) {
            if (!this.data[key]) {
                return null;
            }
            return JSON.parse(this.data[key]);
        }, delete: function (key) {
            delete(this.data[key]);
        }
    } : null;
})();
edge.Lottery.Common.App.prototype.cookie = {
    exists: function getCookie(sKey) {
        if (!sKey) {
            return false;
        }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }, get: function (sKey) {
        var cookieMatch = document.cookie.match(new RegExp(sKey + '=([^;]+)'));
        if (cookieMatch) {
            return cookieMatch[1];
        }
        else {
            return null;
        }
    }, set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
            return false;
        }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    }, keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
            aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
        }
        return aKeys;
    }
};
edge.Lottery.Common.App.prototype.request = function (url, data, options) {
    var settings = {
        skipLanguage: false,
        type: "POST",
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        data: data ? JSON.stringify(data) : '',
        url: ((options && options.skipLanguage) ? url : "/" + this._lang + url)
    }
    $.extend(settings, options, true);
    return $.ajax(settings);
};
edge.Lottery.Common.App.prototype.i18n = {
    localized: {}, setKeys: function (keys) {
        for (var key in keys) {
            this.set(key, keys[key]);
        }
    }, set: function (key, text) {
        this.localized[key] = text;
    }, get: function (key, objectValues) {
        if (!this.localized[key]) {
            return key;
        }
        var objectValues = objectValues || false;
        if (objectValues) {
            var localized = this.localized[key];
            var regex = /(:([\w\d\-_]+))|(\{(.+?\|\|.+?\|\|.+?)\})/gim;
            var found = localized.match(regex);
            if (found.length == 0) {
                return localized;
            }
            var variables = [];
            var pluralsAndSingularReplacements = [];
            found.forEach(function (item) {
                if (item.charAt(0) == ":") {
                    variables.push(item.slice(1));
                }
                else {
                    var text = item;
                    item = item.replace("{", "").replace("}", "").split("||");
                    var obj = {"text": text, "singular": item[0], "plural": item[1], "variable": item[2]};
                    pluralsAndSingularReplacements.push(obj);
                }
            }, this);
            for (var i = 0; i < variables.length; i++) {
                var key = ":" + variables[i];
                if (objectValues[variables[i]] != undefined) {
                    var val = objectValues[variables[i]];
                    localized = localized.replace(key, val);
                }
            }
            for (var i = 0; i < pluralsAndSingularReplacements.length; i++) {
                var key = pluralsAndSingularReplacements[i].text;
                if (objectValues[pluralsAndSingularReplacements[i].variable] != undefined) {
                    var replace = parseFloat(objectValues[pluralsAndSingularReplacements[i].variable]) != 1 ? pluralsAndSingularReplacements[i].plural : pluralsAndSingularReplacements[i].singular;
                    localized = localized.replace(key, replace);
                }
            }
            return localized;
        }
        else {
            return this.localized[key];
        }
    }
}
edge.Lottery.Common.App.prototype.dialog = function (id, title, text, buttons, error, customClass, callbackObject, dialogSettings) {
    var modalElement = null;
    var _customDialogInstances = this._customDialogInstances;
    var clickEventName = this.clickEventName || "click";
    var defaultDialogSettings = {modalTemplate: "#modalTemplate"};
    dialogSettings = dialogSettings ? $.extend(defaultDialogSettings, dialogSettings) : defaultDialogSettings;
    if (!id) {
        throw"dialog called without an id";
    }
    if (!this._customDialogInstances[id]) {
        if ($(dialogSettings.modalTemplate).length == 0) {
            throw"modal template with id \"modalTemplate\" for modal is not set";
        }
        _customDialogInstances[id] = $(dialogSettings.modalTemplate).clone().prop('id', id);
        $("body").append(_customDialogInstances[id]);
    }
    var modalElement = _customDialogInstances[id];
    if (!modalElement.$remove) {
        modalElement.$remove = modalElement.remove;
    }
    modalElement = $.extend(modalElement, {
        'backdropElement': null, 'id': id, 'customClass': '', 'setWidth': function (width) {
            this.find('.modal-dialog').css('width', width + 'px');
            return this;
        }, 'setHeight': function (height) {
            this.css('height', (height + 60) + 'px');
            this.find('.modal-dialog').css('height', height + 'px');
            this.find('.modal-body').css('height', (height - 62) + 'px');
            return this;
        }, 'setZindex': function (zIndex) {
            var zIndex = parseInt(zIndex);
            this.css("z-index", zIndex);
            this.backdropElement.css("z-index", zIndex - 1);
        }, 'setBinding': function (elementSelector, modelData) {
            var domElement = this.find(elementSelector).get(0);
            ko.applyBindings(modelData, domElement);
            ko.utils.domNodeDisposal.addDisposeCallback(domElement, function () {
                ko.cleanNode(domElement);
            });
        }, 'open': function () {
            var defaultZindex = parseInt($("#modalTemplate").css("z-index"));
            for (dialogInstanceKey in _customDialogInstances) {
                if (dialogInstanceKey != this.id) {
                    _customDialogInstances[dialogInstanceKey].setZindex(defaultZindex);
                }
            }
            this.setZindex(defaultZindex + 5);
            this.cmd('show');
        }, 'close': function () {
            this.on('hidden.bs.modal', function (event) {
                this.remove();
            }.bind(this));
            this.modal('hide');
        }, 'remove': function () {
            this.$remove();
            this.backdropElement.remove();
            delete(_customDialogInstances[id]);
        }, 'setTitle': function (title) {
            title && this.find(".modal-header").find('.modal-title').html(title).show() || this.find(".modal-header").find('.modal-title').html(title);
        }, 'setBody': function (text) {
            var getBody = function (text) {
                switch (typeof text) {
                    case"string":
                        return text;
                        break;
                    case"object":
                        if (text.html) {
                            return text.html();
                        }
                        if (text.message) {
                            return text.message;
                        }
                }
            }
            var body = getBody(text);
            this.find(".modal-body").html(body);
        }, 'setButtons': function (buttons) {
            var closeButon = this.find(".modal-header button.close");
            if (closeButon.length) {
                closeButon[clickEventName](this.close.bind(this));
            }
            var footer = this.find('.modal-footer');
            footer.empty();
            if (buttons) {
                buttons.forEach(function (button, index, array) {
                    var cssClass = ' ' + (button.cssClass || '');
                    var bindings = button.bindings && button.bindings != '' ? 'data-bind="' + button.bindings + '"' : '';
                    $(footer).append(' <button type="button" ' + bindings + ' class="formBtn modalFormBtn' + cssClass + '" >' + button.title + '</button>');
                    if (button.func) {
                        $(footer).find("button:last")[clickEventName](function () {
                            button.func.call(this);
                        });
                    }
                });
            }
        }, 'isErrorDialog': function (isErrorDialog) {
            if (isErrorDialog) {
                this.addClass("modal-error");
            }
            else {
                this.removeClass("modal-error");
            }
        }, 'registerCallbacks': function (callbacks) {
            if (callbacks) {
                if (callbacks.shown) {
                    this.callbacks.shown.call(this, callbacks.shown);
                }
                if (callbacks.hidden) {
                    this.callbacks.hidden.call(this, callbacks.hidden);
                }
                if (callbacks.hide) {
                    this.callbacks.hide.call(this, callbacks.hide);
                }
                if (callbacks.beforeShow) {
                    callbacks.beforeShow.call(this);
                }
            }
        }, 'callbacks': {
            'shown': function (callback) {
                this.off('shown.bs.modal').on('shown.bs.modal', function (event) {
                    callback.call(modalElement, event);
                });
            }, 'hidden': function (callback) {
                this.off('hidden.bs.modal').on('hidden.bs.modal', function (event) {
                    callback.call(modalElement, event);
                });
            }, 'hide': function (callback) {
                this.off('hide.bs.modal').on('hide.bs.modal', function (event) {
                    callback.call(modalElement, event);
                });
            }
        }, 'cmd': function (cmd) {
            this.modal(cmd);
        }, 'associateBackdrop': function () {
            var zIndex = this.css("z-index");
            this.backdropElement = $('.modal-backdrop').last();
            this.backdropElement.css("z-index", parseInt(zIndex) - 1);
        }
    }, true);
    modalElement.setTitle(title);
    modalElement.setBody(text);
    modalElement.setButtons(buttons);
    modalElement.isErrorDialog(error);
    modalElement.registerCallbacks(callbackObject);
    modalElement.removeClass(modalElement.customClass);
    if (customClass) {
        modalElement.addClass(customClass);
    }
    if (!$.isEmptyObject(dialogSettings)) {
        modalElement.cmd(dialogSettings);
    }
    else {
        modalElement.cmd({'show': false});
    }
    modalElement.associateBackdrop();
    if (dialogSettings.show == undefined || dialogSettings.show == true) {
        modalElement.open();
    }
    return modalElement;
};
edge.Lottery.Common.App.prototype.showMessage = function (title, text, buttons, error, customClass, callback) {
    return this.dialog("genericModalDialog", title, text, buttons, error, customClass, callback);
};
edge.Lottery.Common.App.prototype.showError = function (response) {
    var errorMessage = 'An error occured';
    if (response && response.responseText && typeof response.responseText == "string") {
        try {
            var responseData = JSON.parse(response.responseText);
            errorMessage = '<h1> ' + responseData.error + '</h1><h3>debug data</h3>';
            if (this._applicationMode == "development") {
                console.log(responseData);
            }
            errorMessage += '<div style="max-height:500px;overflow:auto"><pre>' + JSON.stringify(responseData.debug, null, 2) + '</pre></div>';
        }
        catch (err) {
        }
    }
    this.errorMessage(errorMessage);
};
edge.Lottery.Common.App.prototype.navigateToPage = function (url) {
    throw new edge.Exception("each channel must implement its own navigateToPage method");
}
edge.Lottery.Common.App.prototype.errorMessage = function (message, callback) {
    if (message instanceof edge.Exception) {
        message = message.getMessage()
    }
    this.showMessage("Error", message, null, true, null, callback ? {hidden: callback} : undefined);
};
edge.Lottery.Common.App.prototype.fillZeros = function (value, length) {
    var _length = (length != undefined) ? length : 2;
    return Array(Math.max(_length - String(value).length + 1, 0)).join(0) + value;
};
edge.Lottery.Common.App.prototype.fillDashes = function (number) {
    while (number.length < 3) {
        number = '-' + number;
    }
    return number;
};
edge.Lottery.Common.App.prototype.addPaginatedData = function (elementObject, results) {
    elementObject.pagination().items([]);
    var offset = (elementObject.pagination().page() - 1) * elementObject.pagination().resultsPerPage,
        limit = (elementObject.pagination().page() * elementObject.pagination().resultsPerPage) - 1;
    if (typeof elementObject.pagination().callback === 'function') {
        elementObject.pagination().callback(results, offset, limit);
    } else {
        if (results.length > 0) {
            for (var i = offset; i <= limit; i++) {
                results[i] && elementObject.pagination().items.push(results[i]);
            }
        }
    }
};
edge.Lottery.Common.App.prototype.createPagination = function (elementObject, results, resultsPerPage, callback) {
    elementObject.showPagination && elementObject.showPagination(true);
    elementObject.pagination({
        page: ko.observable(1),
        totalPages: ko.observable(),
        resultsPerPage: resultsPerPage,
        items: ko.observableArray(),
        callback: callback
    });
    !(results.length % elementObject.pagination().resultsPerPage) && elementObject.pagination().totalPages(results.length / elementObject.pagination().resultsPerPage) || elementObject.pagination().totalPages(parseInt(results.length / elementObject.pagination().resultsPerPage) + 1);
    elementObject.pagination().page.subscribe(function (value) {
        this.addPaginatedData(elementObject, results);
    }, this);
    this.addPaginatedData(elementObject, results);
};
edge.Lottery.Common.App.prototype.formatDate = function (date, type) {
    if (date == "") {
        return " - ";
    }
    var temDate = new Date(date);
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthNamesSmall = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ordinalNumberSuffix = ["st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th", "th", "st"];
    if (!type) {
        var formatedDate = dayNames[temDate.getDay()] + " " + monthNames[(temDate.getMonth() + 1)] + " " + temDate.getDate() + " , " + temDate.getFullYear();
    } else if (type == "dayNameDate") {
        var mm = ('0' + (temDate.getMonth() + 1)).slice(-2), dd = ('0' + temDate.getDate()).slice(-2),
            yy = String(temDate.getYear()).slice(-2);
        var formatedDate = dayNames[temDate.getDay()] + " " + dd + "/" + mm + "/" + yy;
    } else if (type == "dateOfMonth") {
        var formatedDate = temDate.getDate() + ordinalNumberSuffix[temDate.getDate() - 1] + " of " + monthNames[(temDate.getMonth() + 1)] + " " + temDate.getFullYear();
    } else if (type == "dateOfMonthReverse") {
        var formatedDate = monthNames[(temDate.getMonth() + 1)] + " " + temDate.getDate() + ", " + temDate.getFullYear();
    } else if (type == "monthSmall") {
        var formatedDate = temDate.getDate() + "-" + monthNamesSmall[(temDate.getMonth() + 1)] + "-" + temDate.getFullYear();
    } else if (type == "hour") {
        var formatedDate = ("0" + temDate.getHours()).slice(-2) + ":" + ("0" + temDate.getMinutes()).slice(-2);
    } else if (type == "dayDateMonth") {
        var formatedDate = dayNames[temDate.getDay()] + " " + temDate.getDate() + ordinalNumberSuffix[temDate.getDate() - 1] + " " + monthNames[(temDate.getMonth() + 1)];
    } else if (type == "dayDateMonth2") {
        var formatedDate = dayNames[temDate.getDay()] + ", " + monthNames[(temDate.getMonth() + 1)] + " " + temDate.getDate() + ordinalNumberSuffix[temDate.getDate() - 1];
    } else if (type == "dd/mm/yyyy hh:mm") {
        var yyyy = temDate.getFullYear();
        var mm = ('0' + (temDate.getMonth() + 1)).slice(-2);
        var dd = ('0' + temDate.getDate()).slice(-2);
        var formatedDate = dd + "/" + mm + "/" + yyyy + " " + ("0" + temDate.getHours()).slice(-2) + ":" + ("0" + temDate.getMinutes()).slice(-2);
    } else if (type == "yyyy-mm-dd") {
        var yyyy = temDate.getFullYear();
        var mm = ('0' + (temDate.getMonth() + 1)).slice(-2);
        var dd = ('0' + temDate.getDate()).slice(-2);
        var formatedDate = yyyy + "-" + mm + "-" + dd;
    } else if (type == "dd/mm/yyyy") {
        var yyyy = temDate.getFullYear();
        var mm = ('0' + (temDate.getMonth() + 1)).slice(-2);
        var dd = ('0' + temDate.getDate()).slice(-2);
        var formatedDate = dd + "/" + mm + "/" + yyyy;
    } else {
        var yyyy = temDate.getFullYear(), mm = ('0' + (temDate.getMonth() + 1)).slice(-2),
            dd = ('0' + temDate.getDate()).slice(-2);
        formatedDate = dd + "/" + mm + "/" + yyyy;
    }
    return formatedDate;
}
edge.Lottery.Common.App.prototype.getAllDates = function (from, to) {
    var start = new Date(from);
    var end = new Date(to);
    var temp = [];
    while (start <= end) {
        temp.push(start.getTime());
        var newDate = start.setDate(start.getDate() + 1);
        start = new Date(newDate);
    }
    return temp;
}
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
$.validator.methods.range = function (value, element, param) {
    var globalizedValue = value.replace(",", ".");
    return this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);
}
$.validator.methods.number = function (value, element) {
    return this.optional(element) || /^\+?(?:\d+|\d{1,3}(?:[\\.\\]\d{3})*|(\\d+))(?:[\\,\\]\d{2})?$/.test(value);
}
edge.Exception = function (message, data, code) {
    this.message = message;
    this.data = data || null;
    this.code = code || null;
    this.error = null;
    if (typeof Error == 'function') {
        this.error = new Error();
    }
}
edge.Exception.prototype.getMessage = function () {
    var message = '<span class="exceptionMessage">' + this.message + '</span><br/>';
    if (this.data) {
        message += "<br/><strong>Debug Data:</strong>" + "<pre>" + JSON.stringify(this.data, null, 2) + "</pre>";
    }
    message += this.stackTrace();
    return message;
}
edge.Exception.prototype.getCode = function () {
    return this.code;
}
edge.Exception.prototype.stackTrace = function () {
    if (this.error) {
        return '<br/><strong>Stack Trace</strong><pre>' + this.error.stack + '</pre>';
    }
    return '';
}
edge.LinkManager = function (data) {
    for (linkCategory in data) {
        this[linkCategory] = new edge.LinkManager.LinksCategory(data[linkCategory]);
    }
}
edge.LinkManager.prototype.setActiveLinkByNavigationId = function (navigationId) {
    for (var prop in this) {
        if (this[prop] instanceof edge.LinkManager.LinksCategory) {
            this[prop].setActiveLinkByNavigationId(navigationId);
        }
    }
}
edge.LinkManager.ItemCreator = function (linkData, parent, itemsMap) {
    var cls = false, parent = parent || null;
    linkData.type = linkData.type || 'not specified';
    this.itemsMap = itemsMap || {
        "js": edge.LinkManager.JsItem,
        "dialog": edge.LinkManager.DialogItem,
        "popUp": edge.LinkManager.popUp,
        "iframeDialog": edge.LinkManager.iframeDialogItem,
    };
    if ((cls = this.itemsMap[linkData.type])) {
        return new cls(linkData, parent);
    }
    else {
        return new edge.LinkManager.Item(linkData, parent);
    }
    throw new edge.Exception("linkData type:" + linkData.type + " has no reference in itemsMap", linkData);
}
edge.LinkManager.LinksCategory = function (data, categoryName) {
    this.name = data.name;
    this.links = [];
    this.activeLink = ko.observable();
    this.itemCreator = this.getItemCreator();
    data.links.forEach(function (item) {
        try {
            this.links.push(this.itemCreator(item, this));
        }
        catch (e) {
            app.errorMessage(e.getMessage());
        }
    }, this);
}
edge.LinkManager.LinksCategory.prototype.getItemCreator = function () {
    return edge.LinkManager.ItemCreator;
}
edge.LinkManager.LinksCategory.prototype.setActiveLinkByPosition = function (i) {
    this.links[i].isActive(true);
}
edge.LinkManager.LinksCategory.prototype.setActiveLinkByNavigationId = function (navigationId) {
    if (app.navigation && app.navigation.urls[navigationId]) {
        var url = app.navigation.urls[navigationId];
        this.links.forEach(function (link) {
            if (link.url == url) {
                link.isActive(true);
            }
        });
    }
}
edge.LinkManager.LinksCategory.prototype.deactivateLinks = function () {
    this.links.forEach(function (link) {
        if (link != this.activeLink()) {
            link.isActive(false);
        }
    }, this);
}
edge.LinkManager.Item = function (data, parent) {
    this.parent = parent;
    this.name = data.name;
    this.type = data.type;
    this.url = data.url;
    this.openIn = data.openIn;
    this.isActive = ko.observable(null);
    this.isActive.subscribe(function (value) {
        if (value && this.parent) {
            this.parent.activeLink(this);
            this.parent.deactivateLinks();
        }
    }, this);
    this.isActive(data.isActive);
}
edge.LinkManager.Item.prototype.performAction = function () {
    this.isActive(true);
    switch (this.openIn) {
        case"_self":
            app.navigateToPage(this.url);
            break;
        case"_blank":
            window.open(this.url);
            break;
    }
}
edge.LinkManager.Item.prototype.getUrl = function () {
    return this.url;
}
edge.LinkManager.JsItem = function (data, parent) {
    edge.LinkManager.Item.apply(this, arguments);
}
edge.LinkManager.JsItem.prototype = Object.create(edge.LinkManager.Item.prototype);
edge.LinkManager.JsItem.prototype.getUrl = function () {
    return "javascript:void(0)";
}
edge.LinkManager.JsItem.prototype.performAction = function () {
    this.isActive(true);
    eval(this.url);
}
edge.LinkManager.DialogItem = function (data, parent) {
    edge.LinkManager.Item.apply(this, arguments);
    this.dialogOptions = data.dialogOptions || null;
};
edge.LinkManager.DialogItem.prototype = Object.create(edge.LinkManager.Item.prototype);
edge.LinkManager.DialogItem.prototype.getUrl = function () {
    return "javascript:void(0)";
};
edge.LinkManager.DialogItem.prototype.performAction = function () {
    if (!app.pageDialog) {
        throw new edge.Exception("no dialog method is defined in app");
    }
    var dialog = app.pageDialog(this.url, this.dialogOptions);
};
edge.LinkManager.iframeDialogItem = function (data, parent) {
    edge.LinkManager.DialogItem.apply(this, arguments);
    this.height = data.height || function () {
        return $(window).height() * 0.9;
    };
    this.width = data.width || function () {
        return $(window).width() * 0.9
    }
}
edge.LinkManager.iframeDialogItem.prototype = Object.create(edge.LinkManager.DialogItem.prototype);
edge.LinkManager.iframeDialogItem.prototype.performAction = function () {
    var loadingHtml = '<div class="loadingDialog" style="z-index: 1">\
        <div class="sk-fading-circle">\
        <div class="sk-circle1 sk-circle"></div>\
        <div class="sk-circle2 sk-circle"></div>\
        <div class="sk-circle3 sk-circle"></div>\
        <div class="sk-circle4 sk-circle"></div>\
        <div class="sk-circle5 sk-circle"></div>\
        <div class="sk-circle6 sk-circle"></div>\
        <div class="sk-circle7 sk-circle"></div>\
        <div class="sk-circle8 sk-circle"></div>\
        <div class="sk-circle9 sk-circle"></div>\
        <div class="sk-circle10 sk-circle"></div>\
        <div class="sk-circle11 sk-circle"></div>\
        <div class="sk-circle12 sk-circle"></div>\
        </div>\
        </div>';
    var dialog = app.dialog('iframeDialog', '', loadingHtml + "<iframe sandbox='allow-forms allow-scripts allow-same-origin' frameborder='0' src='" + this.url + "' style='z-index:2;width:100%;height:100%;position:relative'></iframe>");
    height = function () {
        return $(window).height() * 0.9;
    };
    dialog.setHeight(this.height);
    dialog.setWidth(this.width);
    dialog.find("iframe").css('height', this.height);
    dialog.find('.modal-content').css('height', this.height);
    $(window).resize(function () {
        dialog.setHeight(height());
        dialog.setWidth($(window).width() * 0.9);
        dialog.find("iframe").css('height', height());
    });
};
edge.LinkManager.popUp = function (data, parent) {
    edge.LinkManager.Item.apply(this, arguments);
    this.width = data.width || 500;
    this.height = data.height || 500;
    this.onClose = data.onClose || null;
};
edge.LinkManager.popUp.prototype = Object.create(edge.LinkManager.Item.prototype);
edge.LinkManager.popUp.prototype.getUrl = function () {
    return "javascript:void(0)";
};
edge.LinkManager.popUp.prototype.performAction = function () {
    var intv,
        w = window.open(this.url, '_blank', 'width=' + this.width + ',height=' + this.height + ',left=0,top=0,status=no,toolbar=no');
    intv = setInterval(function () {
        if (!w.window) {
            if (this.onClose) {
                this.onClose();
            }
            clearInterval(intv);
        }
    }.bind(this), 1000);
};
!function (a, b) {
    "function" == typeof define && define.amd ? define([], function () {
        return a.Chartist = b()
    }) : "object" == typeof exports ? module.exports = b() : a.Chartist = b()
}(this, function () {
    var a = {version: "0.9.8"};
    return function (a, b, c) {
        "use strict";
        c.namespaces = {
            svg: "http://www.w3.org/2000/svg",
            xmlns: "http://www.w3.org/2000/xmlns/",
            xhtml: "http://www.w3.org/1999/xhtml",
            xlink: "http://www.w3.org/1999/xlink",
            ct: "http://gionkunz.github.com/chartist-js/ct"
        }, c.noop = function (a) {
            return a
        }, c.alphaNumerate = function (a) {
            return String.fromCharCode(97 + a % 26)
        }, c.extend = function (a) {
            a = a || {};
            var b = Array.prototype.slice.call(arguments, 1);
            return b.forEach(function (b) {
                for (var d in b) "object" != typeof b[d] || null === b[d] || b[d] instanceof Array ? a[d] = b[d] : a[d] = c.extend({}, a[d], b[d])
            }), a
        }, c.replaceAll = function (a, b, c) {
            return a.replace(new RegExp(b, "g"), c)
        }, c.ensureUnit = function (a, b) {
            return "number" == typeof a && (a += b), a
        }, c.quantity = function (a) {
            if ("string" == typeof a) {
                var b = /^(\d+)\s*(.*)$/g.exec(a);
                return {value: +b[1], unit: b[2] || void 0}
            }
            return {value: a}
        }, c.querySelector = function (a) {
            return a instanceof Node ? a : b.querySelector(a)
        }, c.times = function (a) {
            return Array.apply(null, new Array(a))
        }, c.sum = function (a, b) {
            return a + (b ? b : 0)
        }, c.mapMultiply = function (a) {
            return function (b) {
                return b * a
            }
        }, c.mapAdd = function (a) {
            return function (b) {
                return b + a
            }
        }, c.serialMap = function (a, b) {
            var d = [], e = Math.max.apply(null, a.map(function (a) {
                return a.length
            }));
            return c.times(e).forEach(function (c, e) {
                var f = a.map(function (a) {
                    return a[e]
                });
                d[e] = b.apply(null, f)
            }), d
        }, c.roundWithPrecision = function (a, b) {
            var d = Math.pow(10, b || c.precision);
            return Math.round(a * d) / d
        }, c.precision = 8, c.escapingMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }, c.serialize = function (a) {
            return null === a || void 0 === a ? a : ("number" == typeof a ? a = "" + a : "object" == typeof a && (a = JSON.stringify({data: a})), Object.keys(c.escapingMap).reduce(function (a, b) {
                return c.replaceAll(a, b, c.escapingMap[b])
            }, a))
        }, c.deserialize = function (a) {
            if ("string" != typeof a) return a;
            a = Object.keys(c.escapingMap).reduce(function (a, b) {
                return c.replaceAll(a, c.escapingMap[b], b)
            }, a);
            try {
                a = JSON.parse(a), a = void 0 !== a.data ? a.data : a
            } catch (b) {
            }
            return a
        }, c.createSvg = function (a, b, d, e) {
            var f;
            return b = b || "100%", d = d || "100%", Array.prototype.slice.call(a.querySelectorAll("svg")).filter(function (a) {
                return a.getAttributeNS(c.namespaces.xmlns, "ct")
            }).forEach(function (b) {
                a.removeChild(b)
            }), f = new c.Svg("svg").attr({
                width: b,
                height: d
            }).addClass(e).attr({style: "width: " + b + "; height: " + d + ";"}), a.appendChild(f._node), f
        }, c.normalizeData = function (a) {
            if (a = a || {
                    series: [],
                    labels: []
                }, a.series = a.series || [], a.labels = a.labels || [], a.series.length > 0 && 0 === a.labels.length) {
                var b, d = c.getDataArray(a);
                b = d.every(function (a) {
                    return a instanceof Array
                }) ? Math.max.apply(null, d.map(function (a) {
                    return a.length
                })) : d.length, a.labels = c.times(b).map(function () {
                    return ""
                })
            }
            return a
        }, c.reverseData = function (a) {
            a.labels.reverse(), a.series.reverse();
            for (var b = 0; b < a.series.length; b++) "object" == typeof a.series[b] && void 0 !== a.series[b].data ? a.series[b].data.reverse() : a.series[b] instanceof Array && a.series[b].reverse()
        }, c.getDataArray = function (a, b, d) {
            function e(a) {
                if (!c.isFalseyButZero(a)) {
                    if ((a.data || a) instanceof Array) return (a.data || a).map(e);
                    if (a.hasOwnProperty("value")) return e(a.value);
                    if (d) {
                        var b = {};
                        return "string" == typeof d ? b[d] = c.getNumberOrUndefined(a) : b.y = c.getNumberOrUndefined(a), b.x = a.hasOwnProperty("x") ? c.getNumberOrUndefined(a.x) : b.x, b.y = a.hasOwnProperty("y") ? c.getNumberOrUndefined(a.y) : b.y, b
                    }
                    return c.getNumberOrUndefined(a)
                }
            }

            return (b && !a.reversed || !b && a.reversed) && (c.reverseData(a), a.reversed = !a.reversed), a.series.map(e)
        }, c.normalizePadding = function (a, b) {
            return b = b || 0, "number" == typeof a ? {
                top: a,
                right: a,
                bottom: a,
                left: a
            } : {
                top: "number" == typeof a.top ? a.top : b,
                right: "number" == typeof a.right ? a.right : b,
                bottom: "number" == typeof a.bottom ? a.bottom : b,
                left: "number" == typeof a.left ? a.left : b
            }
        }, c.getMetaData = function (a, b) {
            var d = a.data ? a.data[b] : a[b];
            return d ? c.serialize(d.meta) : void 0
        }, c.orderOfMagnitude = function (a) {
            return Math.floor(Math.log(Math.abs(a)) / Math.LN10)
        }, c.projectLength = function (a, b, c) {
            return b / c.range * a
        }, c.getAvailableHeight = function (a, b) {
            return Math.max((c.quantity(b.height).value || a.height()) - (b.chartPadding.top + b.chartPadding.bottom) - b.axisX.offset, 0)
        }, c.getHighLow = function (a, b, d) {
            function e(a) {
                if (void 0 !== a) if (a instanceof Array) for (var b = 0; b < a.length; b++) e(a[b]); else {
                    var c = d ? +a[d] : +a;
                    g && c > f.high && (f.high = c), h && c < f.low && (f.low = c)
                }
            }

            b = c.extend({}, b, d ? b["axis" + d.toUpperCase()] : {});
            var f = {
                high: void 0 === b.high ? -Number.MAX_VALUE : +b.high,
                low: void 0 === b.low ? Number.MAX_VALUE : +b.low
            }, g = void 0 === b.high, h = void 0 === b.low;
            return (g || h) && e(a), (b.referenceValue || 0 === b.referenceValue) && (f.high = Math.max(b.referenceValue, f.high), f.low = Math.min(b.referenceValue, f.low)), f.high <= f.low && (0 === f.low ? f.high = 1 : f.low < 0 ? f.high = 0 : f.high > 0 ? f.low = 0 : (f.high = 1, f.low = 0)), f
        }, c.isNum = function (a) {
            return !isNaN(a) && isFinite(a)
        }, c.isFalseyButZero = function (a) {
            return !a && 0 !== a
        }, c.getNumberOrUndefined = function (a) {
            return isNaN(+a) ? void 0 : +a
        }, c.getMultiValue = function (a, b) {
            return c.isNum(a) ? +a : a ? a[b || "y"] || 0 : 0
        }, c.rho = function (a) {
            function b(a, c) {
                return a % c === 0 ? c : b(c, a % c)
            }

            function c(a) {
                return a * a + 1
            }

            if (1 === a) return a;
            var d, e = 2, f = 2;
            if (a % 2 === 0) return 2;
            do e = c(e) % a, f = c(c(f)) % a, d = b(Math.abs(e - f), a); while (1 === d);
            return d
        }, c.getBounds = function (a, b, d, e) {
            var f, g, h, i = 0, j = {high: b.high, low: b.low};
            j.valueRange = j.high - j.low, j.oom = c.orderOfMagnitude(j.valueRange), j.step = Math.pow(10, j.oom), j.min = Math.floor(j.low / j.step) * j.step, j.max = Math.ceil(j.high / j.step) * j.step, j.range = j.max - j.min, j.numberOfSteps = Math.round(j.range / j.step);
            var k = c.projectLength(a, j.step, j), l = k < d, m = e ? c.rho(j.range) : 0;
            if (e && c.projectLength(a, 1, j) >= d) j.step = 1; else if (e && m < j.step && c.projectLength(a, m, j) >= d) j.step = m; else for (; ;) {
                if (l && c.projectLength(a, j.step, j) <= d) j.step *= 2; else {
                    if (l || !(c.projectLength(a, j.step / 2, j) >= d)) break;
                    if (j.step /= 2, e && j.step % 1 !== 0) {
                        j.step *= 2;
                        break
                    }
                }
                if (i++ > 1e3) throw new Error("Exceeded maximum number of iterations while optimizing scale step!")
            }
            var n = 2.221e-16;
            for (j.step = Math.max(j.step, n), g = j.min, h = j.max; g + j.step <= j.low;) g += j.step;
            for (; h - j.step >= j.high;) h -= j.step;
            j.min = g, j.max = h, j.range = j.max - j.min;
            var o = [];
            for (f = j.min; f <= j.max; f += j.step) {
                var p = c.roundWithPrecision(f);
                p !== o[o.length - 1] && o.push(f)
            }
            return j.values = o, j
        }, c.polarToCartesian = function (a, b, c, d) {
            var e = (d - 90) * Math.PI / 180;
            return {x: a + c * Math.cos(e), y: b + c * Math.sin(e)}
        }, c.createChartRect = function (a, b, d) {
            var e = !(!b.axisX && !b.axisY), f = e ? b.axisY.offset : 0, g = e ? b.axisX.offset : 0,
                h = a.width() || c.quantity(b.width).value || 0, i = a.height() || c.quantity(b.height).value || 0,
                j = c.normalizePadding(b.chartPadding, d);
            h = Math.max(h, f + j.left + j.right), i = Math.max(i, g + j.top + j.bottom);
            var k = {
                padding: j, width: function () {
                    return this.x2 - this.x1
                }, height: function () {
                    return this.y1 - this.y2
                }
            };
            return e ? ("start" === b.axisX.position ? (k.y2 = j.top + g, k.y1 = Math.max(i - j.bottom, k.y2 + 1)) : (k.y2 = j.top, k.y1 = Math.max(i - j.bottom - g, k.y2 + 1)), "start" === b.axisY.position ? (k.x1 = j.left + f, k.x2 = Math.max(h - j.right, k.x1 + 1)) : (k.x1 = j.left, k.x2 = Math.max(h - j.right - f, k.x1 + 1))) : (k.x1 = j.left, k.x2 = Math.max(h - j.right, k.x1 + 1), k.y2 = j.top, k.y1 = Math.max(i - j.bottom, k.y2 + 1)), k
        }, c.createGrid = function (a, b, d, e, f, g, h, i) {
            var j = {};
            j[d.units.pos + "1"] = a, j[d.units.pos + "2"] = a, j[d.counterUnits.pos + "1"] = e, j[d.counterUnits.pos + "2"] = e + f;
            var k = g.elem("line", j, h.join(" "));
            i.emit("draw", c.extend({type: "grid", axis: d, index: b, group: g, element: k}, j))
        }, c.createLabel = function (a, b, d, e, f, g, h, i, j, k, l) {
            var m, n = {};
            if (n[f.units.pos] = a + h[f.units.pos], n[f.counterUnits.pos] = h[f.counterUnits.pos], n[f.units.len] = b, n[f.counterUnits.len] = Math.max(0, g - 10), k) {
                var o = '<span class="' + j.join(" ") + '" style="' + f.units.len + ": " + Math.round(n[f.units.len]) + "px; " + f.counterUnits.len + ": " + Math.round(n[f.counterUnits.len]) + 'px">' + e[d] + "</span>";
                m = i.foreignObject(o, c.extend({style: "overflow: visible;"}, n))
            } else m = i.elem("text", n, j.join(" ")).text(e[d]);
            l.emit("draw", c.extend({type: "label", axis: f, index: d, group: i, element: m, text: e[d]}, n))
        }, c.getSeriesOption = function (a, b, c) {
            if (a.name && b.series && b.series[a.name]) {
                var d = b.series[a.name];
                return d.hasOwnProperty(c) ? d[c] : b[c]
            }
            return b[c]
        }, c.optionsProvider = function (b, d, e) {
            function f(b) {
                var f = h;
                if (h = c.extend({}, j), d) for (i = 0; i < d.length; i++) {
                    var g = a.matchMedia(d[i][0]);
                    g.matches && (h = c.extend(h, d[i][1]))
                }
                e && b && e.emit("optionsChanged", {previousOptions: f, currentOptions: h})
            }

            function g() {
                k.forEach(function (a) {
                    a.removeListener(f)
                })
            }

            var h, i, j = c.extend({}, b), k = [];
            if (!a.matchMedia) throw"window.matchMedia not found! Make sure you're using a polyfill.";
            if (d) for (i = 0; i < d.length; i++) {
                var l = a.matchMedia(d[i][0]);
                l.addListener(f), k.push(l)
            }
            return f(), {
                removeMediaQueryListeners: g, getCurrentOptions: function () {
                    return c.extend({}, h)
                }
            }
        }, c.splitIntoSegments = function (a, b, d) {
            var e = {increasingX: !1, fillHoles: !1};
            d = c.extend({}, e, d);
            for (var f = [], g = !0, h = 0; h < a.length; h += 2) void 0 === b[h / 2].value ? d.fillHoles || (g = !0) : (d.increasingX && h >= 2 && a[h] <= a[h - 2] && (g = !0), g && (f.push({
                pathCoordinates: [],
                valueData: []
            }), g = !1), f[f.length - 1].pathCoordinates.push(a[h], a[h + 1]), f[f.length - 1].valueData.push(b[h / 2]));
            return f
        }
    }(window, document, a), function (a, b, c) {
        "use strict";
        c.Interpolation = {}, c.Interpolation.none = function (a) {
            var b = {fillHoles: !1};
            return a = c.extend({}, b, a), function (b, d) {
                for (var e = new c.Svg.Path, f = !0, g = 0; g < b.length; g += 2) {
                    var h = b[g], i = b[g + 1], j = d[g / 2];
                    void 0 !== j.value ? (f ? e.move(h, i, !1, j) : e.line(h, i, !1, j), f = !1) : a.fillHoles || (f = !0)
                }
                return e
            }
        }, c.Interpolation.simple = function (a) {
            var b = {divisor: 2, fillHoles: !1};
            a = c.extend({}, b, a);
            var d = 1 / Math.max(1, a.divisor);
            return function (b, e) {
                for (var f, g, h, i = new c.Svg.Path, j = 0; j < b.length; j += 2) {
                    var k = b[j], l = b[j + 1], m = (k - f) * d, n = e[j / 2];
                    void 0 !== n.value ? (void 0 === h ? i.move(k, l, !1, n) : i.curve(f + m, g, k - m, l, k, l, !1, n), f = k, g = l, h = n) : a.fillHoles || (f = k = h = void 0)
                }
                return i
            }
        }, c.Interpolation.cardinal = function (a) {
            var b = {tension: 1, fillHoles: !1};
            a = c.extend({}, b, a);
            var d = Math.min(1, Math.max(0, a.tension)), e = 1 - d;
            return function f(b, g) {
                var h = c.splitIntoSegments(b, g, {fillHoles: a.fillHoles});
                if (h.length) {
                    if (h.length > 1) {
                        var i = [];
                        return h.forEach(function (a) {
                            i.push(f(a.pathCoordinates, a.valueData))
                        }), c.Svg.Path.join(i)
                    }
                    if (b = h[0].pathCoordinates, g = h[0].valueData, b.length <= 4) return c.Interpolation.none()(b, g);
                    for (var j, k = (new c.Svg.Path).move(b[0], b[1], !1, g[0]), l = 0, m = b.length; m - 2 * !j > l; l += 2) {
                        var n = [{x: +b[l - 2], y: +b[l - 1]}, {x: +b[l], y: +b[l + 1]}, {
                            x: +b[l + 2],
                            y: +b[l + 3]
                        }, {x: +b[l + 4], y: +b[l + 5]}];
                        j ? l ? m - 4 === l ? n[3] = {x: +b[0], y: +b[1]} : m - 2 === l && (n[2] = {
                            x: +b[0],
                            y: +b[1]
                        }, n[3] = {x: +b[2], y: +b[3]}) : n[0] = {
                            x: +b[m - 2],
                            y: +b[m - 1]
                        } : m - 4 === l ? n[3] = n[2] : l || (n[0] = {
                            x: +b[l],
                            y: +b[l + 1]
                        }), k.curve(d * (-n[0].x + 6 * n[1].x + n[2].x) / 6 + e * n[2].x, d * (-n[0].y + 6 * n[1].y + n[2].y) / 6 + e * n[2].y, d * (n[1].x + 6 * n[2].x - n[3].x) / 6 + e * n[2].x, d * (n[1].y + 6 * n[2].y - n[3].y) / 6 + e * n[2].y, n[2].x, n[2].y, !1, g[(l + 2) / 2])
                    }
                    return k
                }
                return c.Interpolation.none()([])
            }
        }, c.Interpolation.monotoneCubic = function (a) {
            var b = {fillHoles: !1};
            return a = c.extend({}, b, a), function d(b, e) {
                var f = c.splitIntoSegments(b, e, {fillHoles: a.fillHoles, increasingX: !0});
                if (f.length) {
                    if (f.length > 1) {
                        var g = [];
                        return f.forEach(function (a) {
                            g.push(d(a.pathCoordinates, a.valueData))
                        }), c.Svg.Path.join(g)
                    }
                    if (b = f[0].pathCoordinates, e = f[0].valueData, b.length <= 4) return c.Interpolation.none()(b, e);
                    var h, i, j = [], k = [], l = b.length / 2, m = [], n = [], o = [], p = [];
                    for (h = 0; h < l; h++) j[h] = b[2 * h], k[h] = b[2 * h + 1];
                    for (h = 0; h < l - 1; h++) o[h] = k[h + 1] - k[h], p[h] = j[h + 1] - j[h], n[h] = o[h] / p[h];
                    for (m[0] = n[0], m[l - 1] = n[l - 2], h = 1; h < l - 1; h++) 0 === n[h] || 0 === n[h - 1] || n[h - 1] > 0 != n[h] > 0 ? m[h] = 0 : (m[h] = 3 * (p[h - 1] + p[h]) / ((2 * p[h] + p[h - 1]) / n[h - 1] + (p[h] + 2 * p[h - 1]) / n[h]), isFinite(m[h]) || (m[h] = 0));
                    for (i = (new c.Svg.Path).move(j[0], k[0], !1, e[0]), h = 0; h < l - 1; h++) i.curve(j[h] + p[h] / 3, k[h] + m[h] * p[h] / 3, j[h + 1] - p[h] / 3, k[h + 1] - m[h + 1] * p[h] / 3, j[h + 1], k[h + 1], !1, e[h + 1]);
                    return i
                }
                return c.Interpolation.none()([])
            }
        }, c.Interpolation.step = function (a) {
            var b = {postpone: !0, fillHoles: !1};
            return a = c.extend({}, b, a), function (b, d) {
                for (var e, f, g, h = new c.Svg.Path, i = 0; i < b.length; i += 2) {
                    var j = b[i], k = b[i + 1], l = d[i / 2];
                    void 0 !== l.value ? (void 0 === g ? h.move(j, k, !1, l) : (a.postpone ? h.line(j, f, !1, g) : h.line(e, k, !1, l), h.line(j, k, !1, l)), e = j, f = k, g = l) : a.fillHoles || (e = f = g = void 0)
                }
                return h
            }
        }
    }(window, document, a), function (a, b, c) {
        "use strict";
        c.EventEmitter = function () {
            function a(a, b) {
                d[a] = d[a] || [], d[a].push(b)
            }

            function b(a, b) {
                d[a] && (b ? (d[a].splice(d[a].indexOf(b), 1), 0 === d[a].length && delete d[a]) : delete d[a])
            }

            function c(a, b) {
                d[a] && d[a].forEach(function (a) {
                    a(b)
                }), d["*"] && d["*"].forEach(function (c) {
                    c(a, b)
                })
            }

            var d = [];
            return {addEventHandler: a, removeEventHandler: b, emit: c}
        }
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a) {
            var b = [];
            if (a.length) for (var c = 0; c < a.length; c++) b.push(a[c]);
            return b
        }

        function e(a, b) {
            var d = b || this.prototype || c.Class, e = Object.create(d);
            c.Class.cloneDefinitions(e, a);
            var f = function () {
                var a, b = e.constructor || function () {
                };
                return a = this === c ? Object.create(e) : this, b.apply(a, Array.prototype.slice.call(arguments, 0)), a
            };
            return f.prototype = e, f["super"] = d, f.extend = this.extend, f
        }

        function f() {
            var a = d(arguments), b = a[0];
            return a.splice(1, a.length - 1).forEach(function (a) {
                Object.getOwnPropertyNames(a).forEach(function (c) {
                    delete b[c], Object.defineProperty(b, c, Object.getOwnPropertyDescriptor(a, c))
                })
            }), b
        }

        c.Class = {extend: e, cloneDefinitions: f}
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a, b, d) {
            return a && (this.data = a, this.eventEmitter.emit("data", {
                type: "update",
                data: this.data
            })), b && (this.options = c.extend({}, d ? this.options : this.defaultOptions, b), this.initializeTimeoutId || (this.optionsProvider.removeMediaQueryListeners(), this.optionsProvider = c.optionsProvider(this.options, this.responsiveOptions, this.eventEmitter))), this.initializeTimeoutId || this.createChart(this.optionsProvider.getCurrentOptions()), this
        }

        function e() {
            return this.initializeTimeoutId ? a.clearTimeout(this.initializeTimeoutId) : (a.removeEventListener("resize", this.resizeListener), this.optionsProvider.removeMediaQueryListeners()), this
        }

        function f(a, b) {
            return this.eventEmitter.addEventHandler(a, b), this
        }

        function g(a, b) {
            return this.eventEmitter.removeEventHandler(a, b), this
        }

        function h() {
            a.addEventListener("resize", this.resizeListener), this.optionsProvider = c.optionsProvider(this.options, this.responsiveOptions, this.eventEmitter), this.eventEmitter.addEventHandler("optionsChanged", function () {
                this.update()
            }.bind(this)), this.options.plugins && this.options.plugins.forEach(function (a) {
                a instanceof Array ? a[0](this, a[1]) : a(this)
            }.bind(this)), this.eventEmitter.emit("data", {
                type: "initial",
                data: this.data
            }), this.createChart(this.optionsProvider.getCurrentOptions()), this.initializeTimeoutId = void 0
        }

        function i(a, b, d, e, f) {
            this.container = c.querySelector(a), this.data = b, this.defaultOptions = d, this.options = e, this.responsiveOptions = f, this.eventEmitter = c.EventEmitter(), this.supportsForeignObject = c.Svg.isSupported("Extensibility"), this.supportsAnimations = c.Svg.isSupported("AnimationEventsAttribute"), this.resizeListener = function () {
                this.update()
            }.bind(this), this.container && (this.container.__chartist__ && this.container.__chartist__.detach(), this.container.__chartist__ = this), this.initializeTimeoutId = setTimeout(h.bind(this), 0)
        }

        c.Base = c.Class.extend({
            constructor: i,
            optionsProvider: void 0,
            container: void 0,
            svg: void 0,
            eventEmitter: void 0,
            createChart: function () {
                throw new Error("Base chart type can't be instantiated!")
            },
            update: d,
            detach: e,
            on: f,
            off: g,
            version: c.version,
            supportsForeignObject: !1
        })
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a, d, e, f, g) {
            a instanceof Element ? this._node = a : (this._node = b.createElementNS(c.namespaces.svg, a), "svg" === a && this.attr({"xmlns:ct": c.namespaces.ct})), d && this.attr(d), e && this.addClass(e), f && (g && f._node.firstChild ? f._node.insertBefore(this._node, f._node.firstChild) : f._node.appendChild(this._node))
        }

        function e(a, b) {
            return "string" == typeof a ? b ? this._node.getAttributeNS(b, a) : this._node.getAttribute(a) : (Object.keys(a).forEach(function (b) {
                if (void 0 !== a[b]) if (b.indexOf(":") !== -1) {
                    var d = b.split(":");
                    this._node.setAttributeNS(c.namespaces[d[0]], b, a[b])
                } else this._node.setAttribute(b, a[b])
            }.bind(this)), this)
        }

        function f(a, b, d, e) {
            return new c.Svg(a, b, d, this, e)
        }

        function g() {
            return this._node.parentNode instanceof SVGElement ? new c.Svg(this._node.parentNode) : null
        }

        function h() {
            for (var a = this._node; "svg" !== a.nodeName;) a = a.parentNode;
            return new c.Svg(a)
        }

        function i(a) {
            var b = this._node.querySelector(a);
            return b ? new c.Svg(b) : null
        }

        function j(a) {
            var b = this._node.querySelectorAll(a);
            return b.length ? new c.Svg.List(b) : null
        }

        function k(a, d, e, f) {
            if ("string" == typeof a) {
                var g = b.createElement("div");
                g.innerHTML = a, a = g.firstChild
            }
            a.setAttribute("xmlns", c.namespaces.xmlns);
            var h = this.elem("foreignObject", d, e, f);
            return h._node.appendChild(a), h
        }

        function l(a) {
            return this._node.appendChild(b.createTextNode(a)), this
        }

        function m() {
            for (; this._node.firstChild;) this._node.removeChild(this._node.firstChild);
            return this
        }

        function n() {
            return this._node.parentNode.removeChild(this._node), this.parent()
        }

        function o(a) {
            return this._node.parentNode.replaceChild(a._node, this._node), a
        }

        function p(a, b) {
            return b && this._node.firstChild ? this._node.insertBefore(a._node, this._node.firstChild) : this._node.appendChild(a._node), this
        }

        function q() {
            return this._node.getAttribute("class") ? this._node.getAttribute("class").trim().split(/\s+/) : []
        }

        function r(a) {
            return this._node.setAttribute("class", this.classes(this._node).concat(a.trim().split(/\s+/)).filter(function (a, b, c) {
                return c.indexOf(a) === b
            }).join(" ")), this
        }

        function s(a) {
            var b = a.trim().split(/\s+/);
            return this._node.setAttribute("class", this.classes(this._node).filter(function (a) {
                return b.indexOf(a) === -1
            }).join(" ")), this
        }

        function t() {
            return this._node.setAttribute("class", ""), this
        }

        function u() {
            return this._node.getBoundingClientRect().height
        }

        function v() {
            return this._node.getBoundingClientRect().width
        }

        function w(a, b, d) {
            return void 0 === b && (b = !0), Object.keys(a).forEach(function (e) {
                function f(a, b) {
                    var f, g, h, i = {};
                    a.easing && (h = a.easing instanceof Array ? a.easing : c.Svg.Easing[a.easing], delete a.easing), a.begin = c.ensureUnit(a.begin, "ms"), a.dur = c.ensureUnit(a.dur, "ms"), h && (a.calcMode = "spline", a.keySplines = h.join(" "), a.keyTimes = "0;1"), b && (a.fill = "freeze", i[e] = a.from, this.attr(i), g = c.quantity(a.begin || 0).value, a.begin = "indefinite"), f = this.elem("animate", c.extend({attributeName: e}, a)), b && setTimeout(function () {
                        try {
                            f._node.beginElement()
                        } catch (b) {
                            i[e] = a.to, this.attr(i), f.remove()
                        }
                    }.bind(this), g), d && f._node.addEventListener("beginEvent", function () {
                        d.emit("animationBegin", {element: this, animate: f._node, params: a})
                    }.bind(this)), f._node.addEventListener("endEvent", function () {
                        d && d.emit("animationEnd", {
                            element: this,
                            animate: f._node,
                            params: a
                        }), b && (i[e] = a.to, this.attr(i), f.remove())
                    }.bind(this))
                }

                a[e] instanceof Array ? a[e].forEach(function (a) {
                    f.bind(this)(a, !1)
                }.bind(this)) : f.bind(this)(a[e], b)
            }.bind(this)), this
        }

        function x(a) {
            var b = this;
            this.svgElements = [];
            for (var d = 0; d < a.length; d++) this.svgElements.push(new c.Svg(a[d]));
            Object.keys(c.Svg.prototype).filter(function (a) {
                return ["constructor", "parent", "querySelector", "querySelectorAll", "replace", "append", "classes", "height", "width"].indexOf(a) === -1
            }).forEach(function (a) {
                b[a] = function () {
                    var d = Array.prototype.slice.call(arguments, 0);
                    return b.svgElements.forEach(function (b) {
                        c.Svg.prototype[a].apply(b, d)
                    }), b
                }
            })
        }

        c.Svg = c.Class.extend({
            constructor: d,
            attr: e,
            elem: f,
            parent: g,
            root: h,
            querySelector: i,
            querySelectorAll: j,
            foreignObject: k,
            text: l,
            empty: m,
            remove: n,
            replace: o,
            append: p,
            classes: q,
            addClass: r,
            removeClass: s,
            removeAllClasses: t,
            height: u,
            width: v,
            animate: w
        }), c.Svg.isSupported = function (a) {
            return b.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#" + a, "1.1")
        };
        var y = {
            easeInSine: [.47, 0, .745, .715],
            easeOutSine: [.39, .575, .565, 1],
            easeInOutSine: [.445, .05, .55, .95],
            easeInQuad: [.55, .085, .68, .53],
            easeOutQuad: [.25, .46, .45, .94],
            easeInOutQuad: [.455, .03, .515, .955],
            easeInCubic: [.55, .055, .675, .19],
            easeOutCubic: [.215, .61, .355, 1],
            easeInOutCubic: [.645, .045, .355, 1],
            easeInQuart: [.895, .03, .685, .22],
            easeOutQuart: [.165, .84, .44, 1],
            easeInOutQuart: [.77, 0, .175, 1],
            easeInQuint: [.755, .05, .855, .06],
            easeOutQuint: [.23, 1, .32, 1],
            easeInOutQuint: [.86, 0, .07, 1],
            easeInExpo: [.95, .05, .795, .035],
            easeOutExpo: [.19, 1, .22, 1],
            easeInOutExpo: [1, 0, 0, 1],
            easeInCirc: [.6, .04, .98, .335],
            easeOutCirc: [.075, .82, .165, 1],
            easeInOutCirc: [.785, .135, .15, .86],
            easeInBack: [.6, -.28, .735, .045],
            easeOutBack: [.175, .885, .32, 1.275],
            easeInOutBack: [.68, -.55, .265, 1.55]
        };
        c.Svg.Easing = y, c.Svg.List = c.Class.extend({constructor: x})
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a, b, d, e, f, g) {
            var h = c.extend({command: f ? a.toLowerCase() : a.toUpperCase()}, b, g ? {data: g} : {});
            d.splice(e, 0, h)
        }

        function e(a, b) {
            a.forEach(function (c, d) {
                u[c.command.toLowerCase()].forEach(function (e, f) {
                    b(c, e, d, f, a)
                })
            })
        }

        function f(a, b) {
            this.pathElements = [], this.pos = 0, this.close = a, this.options = c.extend({}, v, b)
        }

        function g(a) {
            return void 0 !== a ? (this.pos = Math.max(0, Math.min(this.pathElements.length, a)), this) : this.pos
        }

        function h(a) {
            return this.pathElements.splice(this.pos, a), this
        }

        function i(a, b, c, e) {
            return d("M", {x: +a, y: +b}, this.pathElements, this.pos++, c, e), this
        }

        function j(a, b, c, e) {
            return d("L", {x: +a, y: +b}, this.pathElements, this.pos++, c, e), this
        }

        function k(a, b, c, e, f, g, h, i) {
            return d("C", {x1: +a, y1: +b, x2: +c, y2: +e, x: +f, y: +g}, this.pathElements, this.pos++, h, i), this
        }

        function l(a, b, c, e, f, g, h, i, j) {
            return d("A", {
                rx: +a,
                ry: +b,
                xAr: +c,
                lAf: +e,
                sf: +f,
                x: +g,
                y: +h
            }, this.pathElements, this.pos++, i, j), this
        }

        function m(a) {
            var b = a.replace(/([A-Za-z])([0-9])/g, "$1 $2").replace(/([0-9])([A-Za-z])/g, "$1 $2").split(/[\s,]+/).reduce(function (a, b) {
                return b.match(/[A-Za-z]/) && a.push([]), a[a.length - 1].push(b), a
            }, []);
            "Z" === b[b.length - 1][0].toUpperCase() && b.pop();
            var d = b.map(function (a) {
                var b = a.shift(), d = u[b.toLowerCase()];
                return c.extend({command: b}, d.reduce(function (b, c, d) {
                    return b[c] = +a[d], b
                }, {}))
            }), e = [this.pos, 0];
            return Array.prototype.push.apply(e, d), Array.prototype.splice.apply(this.pathElements, e), this.pos += d.length, this
        }

        function n() {
            var a = Math.pow(10, this.options.accuracy);
            return this.pathElements.reduce(function (b, c) {
                var d = u[c.command.toLowerCase()].map(function (b) {
                    return this.options.accuracy ? Math.round(c[b] * a) / a : c[b]
                }.bind(this));
                return b + c.command + d.join(",")
            }.bind(this), "") + (this.close ? "Z" : "")
        }

        function o(a, b) {
            return e(this.pathElements, function (c, d) {
                c[d] *= "x" === d[0] ? a : b
            }), this
        }

        function p(a, b) {
            return e(this.pathElements, function (c, d) {
                c[d] += "x" === d[0] ? a : b
            }), this
        }

        function q(a) {
            return e(this.pathElements, function (b, c, d, e, f) {
                var g = a(b, c, d, e, f);
                (g || 0 === g) && (b[c] = g)
            }), this
        }

        function r(a) {
            var b = new c.Svg.Path(a || this.close);
            return b.pos = this.pos, b.pathElements = this.pathElements.slice().map(function (a) {
                return c.extend({}, a)
            }), b.options = c.extend({}, this.options), b
        }

        function s(a) {
            var b = [new c.Svg.Path];
            return this.pathElements.forEach(function (d) {
                d.command === a.toUpperCase() && 0 !== b[b.length - 1].pathElements.length && b.push(new c.Svg.Path), b[b.length - 1].pathElements.push(d)
            }), b
        }

        function t(a, b, d) {
            for (var e = new c.Svg.Path(b, d), f = 0; f < a.length; f++) for (var g = a[f], h = 0; h < g.pathElements.length; h++) e.pathElements.push(g.pathElements[h]);
            return e
        }

        var u = {
            m: ["x", "y"],
            l: ["x", "y"],
            c: ["x1", "y1", "x2", "y2", "x", "y"],
            a: ["rx", "ry", "xAr", "lAf", "sf", "x", "y"]
        }, v = {accuracy: 3};
        c.Svg.Path = c.Class.extend({
            constructor: f,
            position: g,
            remove: h,
            move: i,
            line: j,
            curve: k,
            arc: l,
            scale: o,
            translate: p,
            transform: q,
            parse: m,
            stringify: n,
            clone: r,
            splitByCommand: s
        }), c.Svg.Path.elementDescriptions = u, c.Svg.Path.join = t
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a, b, c, d) {
            this.units = a, this.counterUnits = a === f.x ? f.y : f.x, this.chartRect = b, this.axisLength = b[a.rectEnd] - b[a.rectStart], this.gridOffset = b[a.rectOffset], this.ticks = c, this.options = d
        }

        function e(a, b, d, e, f) {
            var g = e["axis" + this.units.pos.toUpperCase()], h = this.ticks.map(this.projectValue.bind(this)),
                i = this.ticks.map(g.labelInterpolationFnc);
            h.forEach(function (j, k) {
                var l, m = {x: 0, y: 0};
                l = h[k + 1] ? h[k + 1] - j : Math.max(this.axisLength - j, 30), c.isFalseyButZero(i[k]) && "" !== i[k] || ("x" === this.units.pos ? (j = this.chartRect.x1 + j, m.x = e.axisX.labelOffset.x, "start" === e.axisX.position ? m.y = this.chartRect.padding.top + e.axisX.labelOffset.y + (d ? 5 : 20) : m.y = this.chartRect.y1 + e.axisX.labelOffset.y + (d ? 5 : 20)) : (j = this.chartRect.y1 - j, m.y = e.axisY.labelOffset.y - (d ? l : 0), "start" === e.axisY.position ? m.x = d ? this.chartRect.padding.left + e.axisY.labelOffset.x : this.chartRect.x1 - 10 : m.x = this.chartRect.x2 + e.axisY.labelOffset.x + 10), g.showGrid && c.createGrid(j, k, this, this.gridOffset, this.chartRect[this.counterUnits.len](), a, [e.classNames.grid, e.classNames[this.units.dir]], f), g.showLabel && c.createLabel(j, l, k, i, this, g.offset, m, b, [e.classNames.label, e.classNames[this.units.dir], e.classNames[g.position]], d, f))
            }.bind(this))
        }

        var f = {
            x: {pos: "x", len: "width", dir: "horizontal", rectStart: "x1", rectEnd: "x2", rectOffset: "y2"},
            y: {pos: "y", len: "height", dir: "vertical", rectStart: "y2", rectEnd: "y1", rectOffset: "x1"}
        };
        c.Axis = c.Class.extend({
            constructor: d, createGridAndLabels: e, projectValue: function (a, b, c) {
                throw new Error("Base axis can't be instantiated!")
            }
        }), c.Axis.units = f
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a, b, d, e) {
            var f = e.highLow || c.getHighLow(b.normalized, e, a.pos);
            this.bounds = c.getBounds(d[a.rectEnd] - d[a.rectStart], f, e.scaleMinSpace || 20, e.onlyInteger), this.range = {
                min: this.bounds.min,
                max: this.bounds.max
            }, c.AutoScaleAxis["super"].constructor.call(this, a, d, this.bounds.values, e)
        }

        function e(a) {
            return this.axisLength * (+c.getMultiValue(a, this.units.pos) - this.bounds.min) / this.bounds.range
        }

        c.AutoScaleAxis = c.Axis.extend({constructor: d, projectValue: e})
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a, b, d, e) {
            var f = e.highLow || c.getHighLow(b.normalized, e, a.pos);
            this.divisor = e.divisor || 1, this.ticks = e.ticks || c.times(this.divisor).map(function (a, b) {
                return f.low + (f.high - f.low) / this.divisor * b
            }.bind(this)), this.ticks.sort(function (a, b) {
                return a - b
            }), this.range = {
                min: f.low,
                max: f.high
            }, c.FixedScaleAxis["super"].constructor.call(this, a, d, this.ticks, e), this.stepLength = this.axisLength / this.divisor
        }

        function e(a) {
            return this.axisLength * (+c.getMultiValue(a, this.units.pos) - this.range.min) / (this.range.max - this.range.min)
        }

        c.FixedScaleAxis = c.Axis.extend({constructor: d, projectValue: e})
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a, b, d, e) {
            c.StepAxis["super"].constructor.call(this, a, d, e.ticks, e), this.stepLength = this.axisLength / (e.ticks.length - (e.stretch ? 1 : 0))
        }

        function e(a, b) {
            return this.stepLength * b
        }

        c.StepAxis = c.Axis.extend({constructor: d, projectValue: e})
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a) {
            this.data = c.normalizeData(this.data);
            var b = {raw: this.data, normalized: c.getDataArray(this.data, a.reverseData, !0)};
            this.svg = c.createSvg(this.container, a.width, a.height, a.classNames.chart);
            var d, e, g = this.svg.elem("g").addClass(a.classNames.gridGroup), h = this.svg.elem("g"),
                i = this.svg.elem("g").addClass(a.classNames.labelGroup), j = c.createChartRect(this.svg, a, f.padding);
            d = void 0 === a.axisX.type ? new c.StepAxis(c.Axis.units.x, b, j, c.extend({}, a.axisX, {
                ticks: b.raw.labels,
                stretch: a.fullWidth
            })) : a.axisX.type.call(c, c.Axis.units.x, b, j, a.axisX), e = void 0 === a.axisY.type ? new c.AutoScaleAxis(c.Axis.units.y, b, j, c.extend({}, a.axisY, {
                high: c.isNum(a.high) ? a.high : a.axisY.high,
                low: c.isNum(a.low) ? a.low : a.axisY.low
            })) : a.axisY.type.call(c, c.Axis.units.y, b, j, a.axisY), d.createGridAndLabels(g, i, this.supportsForeignObject, a, this.eventEmitter), e.createGridAndLabels(g, i, this.supportsForeignObject, a, this.eventEmitter), b.raw.series.forEach(function (f, g) {
                var i = h.elem("g");
                i.attr({
                    "ct:series-name": f.name,
                    "ct:meta": c.serialize(f.meta)
                }), i.addClass([a.classNames.series, f.className || a.classNames.series + "-" + c.alphaNumerate(g)].join(" "));
                var k = [], l = [];
                b.normalized[g].forEach(function (a, h) {
                    var i = {
                        x: j.x1 + d.projectValue(a, h, b.normalized[g]),
                        y: j.y1 - e.projectValue(a, h, b.normalized[g])
                    };
                    k.push(i.x, i.y), l.push({value: a, valueIndex: h, meta: c.getMetaData(f, h)})
                }.bind(this));
                var m = {
                        lineSmooth: c.getSeriesOption(f, a, "lineSmooth"),
                        showPoint: c.getSeriesOption(f, a, "showPoint"),
                        showLine: c.getSeriesOption(f, a, "showLine"),
                        showArea: c.getSeriesOption(f, a, "showArea"),
                        areaBase: c.getSeriesOption(f, a, "areaBase")
                    },
                    n = "function" == typeof m.lineSmooth ? m.lineSmooth : m.lineSmooth ? c.Interpolation.monotoneCubic() : c.Interpolation.none(),
                    o = n(k, l);
                if (m.showPoint && o.pathElements.forEach(function (b) {
                        var h = i.elem("line", {
                            x1: b.x,
                            y1: b.y,
                            x2: b.x + .01,
                            y2: b.y
                        }, a.classNames.point).attr({
                            "ct:value": [b.data.value.x, b.data.value.y].filter(c.isNum).join(","),
                            "ct:meta": b.data.meta
                        });
                        this.eventEmitter.emit("draw", {
                            type: "point",
                            value: b.data.value,
                            index: b.data.valueIndex,
                            meta: b.data.meta,
                            series: f,
                            seriesIndex: g,
                            axisX: d,
                            axisY: e,
                            group: i,
                            element: h,
                            x: b.x,
                            y: b.y
                        })
                    }.bind(this)), m.showLine) {
                    var p = i.elem("path", {d: o.stringify()}, a.classNames.line, !0);
                    this.eventEmitter.emit("draw", {
                        type: "line",
                        values: b.normalized[g],
                        path: o.clone(),
                        chartRect: j,
                        index: g,
                        series: f,
                        seriesIndex: g,
                        axisX: d,
                        axisY: e,
                        group: i,
                        element: p
                    })
                }
                if (m.showArea && e.range) {
                    var q = Math.max(Math.min(m.areaBase, e.range.max), e.range.min), r = j.y1 - e.projectValue(q);
                    o.splitByCommand("M").filter(function (a) {
                        return a.pathElements.length > 1
                    }).map(function (a) {
                        var b = a.pathElements[0], c = a.pathElements[a.pathElements.length - 1];
                        return a.clone(!0).position(0).remove(1).move(b.x, r).line(b.x, b.y).position(a.pathElements.length + 1).line(c.x, r)
                    }).forEach(function (c) {
                        var h = i.elem("path", {d: c.stringify()}, a.classNames.area, !0);
                        this.eventEmitter.emit("draw", {
                            type: "area",
                            values: b.normalized[g],
                            path: c.clone(),
                            series: f,
                            seriesIndex: g,
                            axisX: d,
                            axisY: e,
                            chartRect: j,
                            index: g,
                            group: i,
                            element: h
                        })
                    }.bind(this))
                }
            }.bind(this)), this.eventEmitter.emit("created", {
                bounds: e.bounds,
                chartRect: j,
                axisX: d,
                axisY: e,
                svg: this.svg,
                options: a
            })
        }

        function e(a, b, d, e) {
            c.Line["super"].constructor.call(this, a, b, f, c.extend({}, f, d), e)
        }

        var f = {
            axisX: {
                offset: 30,
                position: "end",
                labelOffset: {x: 0, y: 0},
                showLabel: !0,
                showGrid: !0,
                labelInterpolationFnc: c.noop,
                type: void 0
            },
            axisY: {
                offset: 40,
                position: "start",
                labelOffset: {x: 0, y: 0},
                showLabel: !0,
                showGrid: !0,
                labelInterpolationFnc: c.noop,
                type: void 0,
                scaleMinSpace: 20,
                onlyInteger: !1
            },
            width: void 0,
            height: void 0,
            showLine: !0,
            showPoint: !0,
            showArea: !1,
            areaBase: 0,
            lineSmooth: !0,
            low: void 0,
            high: void 0,
            chartPadding: {top: 15, right: 15, bottom: 5, left: 10},
            fullWidth: !1,
            reverseData: !1,
            classNames: {
                chart: "ct-chart-line",
                label: "ct-label",
                labelGroup: "ct-labels",
                series: "ct-series",
                line: "ct-line",
                point: "ct-point",
                area: "ct-area",
                grid: "ct-grid",
                gridGroup: "ct-grids",
                vertical: "ct-vertical",
                horizontal: "ct-horizontal",
                start: "ct-start",
                end: "ct-end"
            }
        };
        c.Line = c.Base.extend({constructor: e, createChart: d})
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a) {
            this.data = c.normalizeData(this.data);
            var b, d = {
                raw: this.data,
                normalized: a.distributeSeries ? c.getDataArray(this.data, a.reverseData, a.horizontalBars ? "x" : "y").map(function (a) {
                    return [a]
                }) : c.getDataArray(this.data, a.reverseData, a.horizontalBars ? "x" : "y")
            };
            this.svg = c.createSvg(this.container, a.width, a.height, a.classNames.chart + (a.horizontalBars ? " " + a.classNames.horizontalBars : ""));
            var e = this.svg.elem("g").addClass(a.classNames.gridGroup), g = this.svg.elem("g"),
                h = this.svg.elem("g").addClass(a.classNames.labelGroup);
            if (a.stackBars && 0 !== d.normalized.length) {
                var i = c.serialMap(d.normalized, function () {
                    return Array.prototype.slice.call(arguments).map(function (a) {
                        return a
                    }).reduce(function (a, b) {
                        return {x: a.x + (b && b.x) || 0, y: a.y + (b && b.y) || 0}
                    }, {x: 0, y: 0})
                });
                b = c.getHighLow([i], c.extend({}, a, {referenceValue: 0}), a.horizontalBars ? "x" : "y")
            } else b = c.getHighLow(d.normalized, c.extend({}, a, {referenceValue: 0}), a.horizontalBars ? "x" : "y");
            b.high = +a.high || (0 === a.high ? 0 : b.high), b.low = +a.low || (0 === a.low ? 0 : b.low);
            var j, k, l, m, n, o = c.createChartRect(this.svg, a, f.padding);
            k = a.distributeSeries && a.stackBars ? d.raw.labels.slice(0, 1) : d.raw.labels, a.horizontalBars ? (j = m = void 0 === a.axisX.type ? new c.AutoScaleAxis(c.Axis.units.x, d, o, c.extend({}, a.axisX, {
                highLow: b,
                referenceValue: 0
            })) : a.axisX.type.call(c, c.Axis.units.x, d, o, c.extend({}, a.axisX, {
                highLow: b,
                referenceValue: 0
            })), l = n = void 0 === a.axisY.type ? new c.StepAxis(c.Axis.units.y, d, o, {ticks: k}) : a.axisY.type.call(c, c.Axis.units.y, d, o, a.axisY)) : (l = m = void 0 === a.axisX.type ? new c.StepAxis(c.Axis.units.x, d, o, {ticks: k}) : a.axisX.type.call(c, c.Axis.units.x, d, o, a.axisX), j = n = void 0 === a.axisY.type ? new c.AutoScaleAxis(c.Axis.units.y, d, o, c.extend({}, a.axisY, {
                highLow: b,
                referenceValue: 0
            })) : a.axisY.type.call(c, c.Axis.units.y, d, o, c.extend({}, a.axisY, {highLow: b, referenceValue: 0})));
            var p = a.horizontalBars ? o.x1 + j.projectValue(0) : o.y1 - j.projectValue(0), q = [];
            l.createGridAndLabels(e, h, this.supportsForeignObject, a, this.eventEmitter), j.createGridAndLabels(e, h, this.supportsForeignObject, a, this.eventEmitter), d.raw.series.forEach(function (b, e) {
                var f, h, i = e - (d.raw.series.length - 1) / 2;
                f = a.distributeSeries && !a.stackBars ? l.axisLength / d.normalized.length / 2 : a.distributeSeries && a.stackBars ? l.axisLength / 2 : l.axisLength / d.normalized[e].length / 2, h = g.elem("g"), h.attr({
                    "ct:series-name": b.name,
                    "ct:meta": c.serialize(b.meta)
                }), h.addClass([a.classNames.series, b.className || a.classNames.series + "-" + c.alphaNumerate(e)].join(" ")), d.normalized[e].forEach(function (g, k) {
                    var r, s, t, u;
                    if (u = a.distributeSeries && !a.stackBars ? e : a.distributeSeries && a.stackBars ? 0 : k, r = a.horizontalBars ? {
                            x: o.x1 + j.projectValue(g && g.x ? g.x : 0, k, d.normalized[e]),
                            y: o.y1 - l.projectValue(g && g.y ? g.y : 0, u, d.normalized[e])
                        } : {
                            x: o.x1 + l.projectValue(g && g.x ? g.x : 0, u, d.normalized[e]),
                            y: o.y1 - j.projectValue(g && g.y ? g.y : 0, k, d.normalized[e])
                        }, l instanceof c.StepAxis && (l.options.stretch || (r[l.units.pos] += f * (a.horizontalBars ? -1 : 1)), r[l.units.pos] += a.stackBars || a.distributeSeries ? 0 : i * a.seriesBarDistance * (a.horizontalBars ? -1 : 1)), t = q[k] || p, q[k] = t - (p - r[l.counterUnits.pos]), void 0 !== g) {
                        var v = {};
                        v[l.units.pos + "1"] = r[l.units.pos], v[l.units.pos + "2"] = r[l.units.pos], !a.stackBars || "accumulate" !== a.stackMode && a.stackMode ? (v[l.counterUnits.pos + "1"] = p, v[l.counterUnits.pos + "2"] = r[l.counterUnits.pos]) : (v[l.counterUnits.pos + "1"] = t, v[l.counterUnits.pos + "2"] = q[k]), v.x1 = Math.min(Math.max(v.x1, o.x1), o.x2), v.x2 = Math.min(Math.max(v.x2, o.x1), o.x2), v.y1 = Math.min(Math.max(v.y1, o.y2), o.y1), v.y2 = Math.min(Math.max(v.y2, o.y2), o.y1), s = h.elem("line", v, a.classNames.bar).attr({
                            "ct:value": [g.x, g.y].filter(c.isNum).join(","),
                            "ct:meta": c.getMetaData(b, k)
                        }), this.eventEmitter.emit("draw", c.extend({
                            type: "bar",
                            value: g,
                            index: k,
                            meta: c.getMetaData(b, k),
                            series: b,
                            seriesIndex: e,
                            axisX: m,
                            axisY: n,
                            chartRect: o,
                            group: h,
                            element: s
                        }, v))
                    }
                }.bind(this))
            }.bind(this)), this.eventEmitter.emit("created", {
                bounds: j.bounds,
                chartRect: o,
                axisX: m,
                axisY: n,
                svg: this.svg,
                options: a
            })
        }

        function e(a, b, d, e) {
            c.Bar["super"].constructor.call(this, a, b, f, c.extend({}, f, d), e)
        }

        var f = {
            axisX: {
                offset: 30,
                position: "end",
                labelOffset: {x: 0, y: 0},
                showLabel: !0,
                showGrid: !0,
                labelInterpolationFnc: c.noop,
                scaleMinSpace: 30,
                onlyInteger: !1
            },
            axisY: {
                offset: 40,
                position: "start",
                labelOffset: {x: 0, y: 0},
                showLabel: !0,
                showGrid: !0,
                labelInterpolationFnc: c.noop,
                scaleMinSpace: 20,
                onlyInteger: !1
            },
            width: void 0,
            height: void 0,
            high: void 0,
            low: void 0,
            chartPadding: {top: 15, right: 15, bottom: 5, left: 10},
            seriesBarDistance: 15,
            stackBars: !1,
            stackMode: "accumulate",
            horizontalBars: !1,
            distributeSeries: !1,
            reverseData: !1,
            classNames: {
                chart: "ct-chart-bar",
                horizontalBars: "ct-horizontal-bars",
                label: "ct-label",
                labelGroup: "ct-labels",
                series: "ct-series",
                bar: "ct-bar",
                grid: "ct-grid",
                gridGroup: "ct-grids",
                vertical: "ct-vertical",
                horizontal: "ct-horizontal",
                start: "ct-start",
                end: "ct-end"
            }
        };
        c.Bar = c.Base.extend({constructor: e, createChart: d})
    }(window, document, a), function (a, b, c) {
        "use strict";

        function d(a, b, c) {
            var d = b.x > a.x;
            return d && "explode" === c || !d && "implode" === c ? "start" : d && "implode" === c || !d && "explode" === c ? "end" : "middle"
        }

        function e(a) {
            this.data = c.normalizeData(this.data);
            var b, e, f, h, i, j = [], k = a.startAngle, l = c.getDataArray(this.data, a.reverseData);
            this.svg = c.createSvg(this.container, a.width, a.height, a.donut ? a.classNames.chartDonut : a.classNames.chartPie), e = c.createChartRect(this.svg, a, g.padding), f = Math.min(e.width() / 2, e.height() / 2), i = a.total || l.reduce(function (a, b) {
                return a + b
            }, 0);
            var m = c.quantity(a.donutWidth);
            "%" === m.unit && (m.value *= f / 100), f -= a.donut ? m.value / 2 : 0, h = "outside" === a.labelPosition || a.donut ? f : "center" === a.labelPosition ? 0 : f / 2, h += a.labelOffset;
            var n = {x: e.x1 + e.width() / 2, y: e.y2 + e.height() / 2},
                o = 1 === this.data.series.filter(function (a) {
                    return a.hasOwnProperty("value") ? 0 !== a.value : 0 !== a
                }).length;
            a.showLabel && (b = this.svg.elem("g", null, null, !0));
            for (var p = 0; p < this.data.series.length; p++) if (0 !== l[p] || !a.ignoreEmptyValues) {
                var q = this.data.series[p];
                j[p] = this.svg.elem("g", null, null, !0), j[p].attr({"ct:series-name": q.name}), j[p].addClass([a.classNames.series, q.className || a.classNames.series + "-" + c.alphaNumerate(p)].join(" "));
                var r = k + l[p] / i * 360, s = Math.max(0, k - (0 === p || o ? 0 : .2));
                r - s >= 359.99 && (r = s + 359.99);
                var t = c.polarToCartesian(n.x, n.y, f, s), u = c.polarToCartesian(n.x, n.y, f, r),
                    v = new c.Svg.Path((!a.donut)).move(u.x, u.y).arc(f, f, 0, r - k > 180, 0, t.x, t.y);
                a.donut || v.line(n.x, n.y);
                var w = j[p].elem("path", {d: v.stringify()}, a.donut ? a.classNames.sliceDonut : a.classNames.slicePie);
                if (w.attr({
                        "ct:value": l[p],
                        "ct:meta": c.serialize(q.meta)
                    }), a.donut && w.attr({style: "stroke-width: " + m.value + "px"}), this.eventEmitter.emit("draw", {
                        type: "slice",
                        value: l[p],
                        totalDataSum: i,
                        index: p,
                        meta: q.meta,
                        series: q,
                        group: j[p],
                        element: w,
                        path: v.clone(),
                        center: n,
                        radius: f,
                        startAngle: k,
                        endAngle: r
                    }), a.showLabel) {
                    var x = c.polarToCartesian(n.x, n.y, h, k + (r - k) / 2),
                        y = a.labelInterpolationFnc(this.data.labels && !c.isFalseyButZero(this.data.labels[p]) ? this.data.labels[p] : l[p], p);
                    if (y || 0 === y) {
                        var z = b.elem("text", {
                            dx: x.x,
                            dy: x.y,
                            "text-anchor": d(n, x, a.labelDirection)
                        }, a.classNames.label).text("" + y);
                        this.eventEmitter.emit("draw", {
                            type: "label",
                            index: p,
                            group: b,
                            element: z,
                            text: "" + y,
                            x: x.x,
                            y: x.y
                        })
                    }
                }
                k = r
            }
            this.eventEmitter.emit("created", {chartRect: e, svg: this.svg, options: a})
        }

        function f(a, b, d, e) {
            c.Pie["super"].constructor.call(this, a, b, g, c.extend({}, g, d), e)
        }

        var g = {
            width: void 0,
            height: void 0,
            chartPadding: 5,
            classNames: {
                chartPie: "ct-chart-pie",
                chartDonut: "ct-chart-donut",
                series: "ct-series",
                slicePie: "ct-slice-pie",
                sliceDonut: "ct-slice-donut",
                label: "ct-label"
            },
            startAngle: 0,
            total: void 0,
            donut: !1,
            donutWidth: 60,
            showLabel: !0,
            labelOffset: 0,
            labelPosition: "inside",
            labelInterpolationFnc: c.noop,
            labelDirection: "neutral",
            reverseData: !1,
            ignoreEmptyValues: !1
        };
        c.Pie = c.Base.extend({constructor: f, createChart: e, determineAnchorPosition: d})
    }(window, document, a), a
});
!function (a) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}(function (a) {
    "use strict";

    function b(a) {
        if (a instanceof Date) return a;
        if (String(a).match(g)) return String(a).match(/^[0-9]*$/) && (a = Number(a)), String(a).match(/\-/) && (a = String(a).replace(/\-/g, "/")), new Date(a);
        throw new Error("Couldn't cast `" + a + "` to a date object.")
    }

    function c(a) {
        var b = a.toString().replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
        return new RegExp(b)
    }

    function d(a) {
        return function (b) {
            var d = b.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
            if (d) for (var f = 0, g = d.length; f < g; ++f) {
                var h = d[f].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/), j = c(h[0]), k = h[1] || "", l = h[3] || "",
                    m = null;
                h = h[2], i.hasOwnProperty(h) && (m = i[h], m = Number(a[m])), null !== m && ("!" === k && (m = e(l, m)), "" === k && m < 10 && (m = "0" + m.toString()), b = b.replace(j, m.toString()))
            }
            return b = b.replace(/%%/, "%")
        }
    }

    function e(a, b) {
        var c = "s", d = "";
        return a && (a = a.replace(/(:|;|\s)/gi, "").split(/\,/), 1 === a.length ? c = a[0] : (d = a[0], c = a[1])), Math.abs(b) > 1 ? c : d
    }

    var f = [], g = [], h = {precision: 100, elapse: !1, defer: !1};
    g.push(/^[0-9]*$/.source), g.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source), g.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source), g = new RegExp(g.join("|"));
    var i = {
        Y: "years",
        m: "months",
        n: "daysToMonth",
        d: "daysToWeek",
        w: "weeks",
        W: "weeksToMonth",
        H: "hours",
        M: "minutes",
        S: "seconds",
        D: "totalDays",
        I: "totalHours",
        N: "totalMinutes",
        T: "totalSeconds"
    }, j = function (b, c, d) {
        this.el = b, this.$el = a(b), this.interval = null, this.offset = {}, this.options = a.extend({}, h), this.instanceNumber = f.length, f.push(this), this.$el.data("countdown-instance", this.instanceNumber), d && ("function" == typeof d ? (this.$el.on("update.countdown", d), this.$el.on("stoped.countdown", d), this.$el.on("finish.countdown", d)) : this.options = a.extend({}, h, d)), this.setFinalDate(c), this.options.defer === !1 && this.start()
    };
    a.extend(j.prototype, {
        start: function () {
            null !== this.interval && clearInterval(this.interval);
            var a = this;
            this.update(), this.interval = setInterval(function () {
                a.update.call(a)
            }, this.options.precision)
        }, stop: function () {
            clearInterval(this.interval), this.interval = null, this.dispatchEvent("stoped")
        }, toggle: function () {
            this.interval ? this.stop() : this.start()
        }, pause: function () {
            this.stop()
        }, resume: function () {
            this.start()
        }, remove: function () {
            this.stop.call(this), f[this.instanceNumber] = null, delete this.$el.data().countdownInstance
        }, setFinalDate: function (a) {
            this.finalDate = b(a)
        }, update: function () {
            if (0 === this.$el.closest("html").length) return void this.remove();
            var b, c = void 0 !== a._data(this.el, "events"), d = new Date;
            b = this.finalDate.getTime() - d.getTime(), b = Math.ceil(b / 1e3), b = !this.options.elapse && b < 0 ? 0 : Math.abs(b), this.totalSecsLeft !== b && c && (this.totalSecsLeft = b, this.elapsed = d >= this.finalDate, this.offset = {
                seconds: this.totalSecsLeft % 60,
                minutes: Math.floor(this.totalSecsLeft / 60) % 60,
                hours: Math.floor(this.totalSecsLeft / 60 / 60) % 24,
                days: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
                daysToWeek: Math.floor(this.totalSecsLeft / 60 / 60 / 24) % 7,
                daysToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 % 30.4368),
                weeks: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7),
                weeksToMonth: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 7) % 4,
                months: Math.floor(this.totalSecsLeft / 60 / 60 / 24 / 30.4368),
                years: Math.abs(this.finalDate.getFullYear() - d.getFullYear()),
                totalDays: Math.floor(this.totalSecsLeft / 60 / 60 / 24),
                totalHours: Math.floor(this.totalSecsLeft / 60 / 60),
                totalMinutes: Math.floor(this.totalSecsLeft / 60),
                totalSeconds: this.totalSecsLeft
            }, this.options.elapse || 0 !== this.totalSecsLeft ? this.dispatchEvent("update") : (this.stop(), this.dispatchEvent("finish")))
        }, dispatchEvent: function (b) {
            var c = a.Event(b + ".countdown");
            c.finalDate = this.finalDate, c.elapsed = this.elapsed, c.offset = a.extend({}, this.offset), c.strftime = d(this.offset), this.$el.trigger(c)
        }
    }), a.fn.countdown = function () {
        var b = Array.prototype.slice.call(arguments, 0);
        return this.each(function () {
            var c = a(this).data("countdown-instance");
            if (void 0 !== c) {
                var d = f[c], e = b[0];
                j.prototype.hasOwnProperty(e) ? d[e].apply(d, b.slice(1)) : null === String(e).match(/^[$A-Z_][0-9A-Z_$]*$/i) ? (d.setFinalDate.call(d, e), d.start()) : a.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi, e))
            } else new j(this, b[0], b[1])
        })
    }
});
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
}(function ($) {
    var ua = navigator.userAgent, iPhone = /iphone/i.test(ua), chrome = /chrome/i.test(ua),
        android = /android/i.test(ua), caretTimeoutId;
    $.mask = {
        definitions: {'9': "[0-9]", 'a': "[A-Za-z]", '*': "[A-Za-z0-9]"},
        autoclear: true,
        dataName: "rawMaskFn",
        placeholder: '_'
    };
    $.fn.extend({
        caret: function (begin, end) {
            var range;
            if (this.length === 0 || this.is(":hidden") || this.get(0) !== document.activeElement) {
                return;
            }
            if (typeof begin == 'number') {
                end = (typeof end === 'number') ? end : begin;
                return this.each(function () {
                    if (this.setSelectionRange) {
                        this.setSelectionRange(begin, end);
                    } else if (this.createTextRange) {
                        range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', begin);
                        range.select();
                    }
                });
            } else {
                if (this[0].setSelectionRange) {
                    begin = this[0].selectionStart;
                    end = this[0].selectionEnd;
                } else if (document.selection && document.selection.createRange) {
                    range = document.selection.createRange();
                    begin = 0 - range.duplicate().moveStart('character', -100000);
                    end = begin + range.text.length;
                }
                return {begin: begin, end: end};
            }
        }, unmask: function () {
            return this.trigger("unmask");
        }, mask: function (mask, settings) {
            var input, defs, tests, partialPosition, firstNonMaskPos, lastRequiredNonMaskPos, len, oldVal;
            if (!mask && this.length > 0) {
                input = $(this[0]);
                var fn = input.data($.mask.dataName)
                return fn ? fn() : undefined;
            }
            settings = $.extend({
                autoclear: $.mask.autoclear,
                placeholder: $.mask.placeholder,
                completed: null
            }, settings);
            defs = $.mask.definitions;
            tests = [];
            partialPosition = len = mask.length;
            firstNonMaskPos = null;
            mask = String(mask);
            $.each(mask.split(""), function (i, c) {
                if (c == '?') {
                    len--;
                    partialPosition = i;
                } else if (defs[c]) {
                    tests.push(new RegExp(defs[c]));
                    if (firstNonMaskPos === null) {
                        firstNonMaskPos = tests.length - 1;
                    }
                    if (i < partialPosition) {
                        lastRequiredNonMaskPos = tests.length - 1;
                    }
                } else {
                    tests.push(null);
                }
            });
            return this.trigger("unmask").each(function () {
                var input = $(this), buffer = $.map(mask.split(""), function (c, i) {
                    if (c != '?') {
                        return defs[c] ? getPlaceholder(i) : c;
                    }
                }), defaultBuffer = buffer.join(''), focusText = input.val();

                function tryFireCompleted() {
                    if (!settings.completed) {
                        return;
                    }
                    for (var i = firstNonMaskPos; i <= lastRequiredNonMaskPos; i++) {
                        if (tests[i] && buffer[i] === getPlaceholder(i)) {
                            return;
                        }
                    }
                    settings.completed.call(input);
                }

                function getPlaceholder(i) {
                    if (i < settings.placeholder.length)
                        return settings.placeholder.charAt(i);
                    return settings.placeholder.charAt(0);
                }

                function seekNext(pos) {
                    while (++pos < len && !tests[pos]) ;
                    return pos;
                }

                function seekPrev(pos) {
                    while (--pos >= 0 && !tests[pos]) ;
                    return pos;
                }

                function shiftL(begin, end) {
                    var i, j;
                    if (begin < 0) {
                        return;
                    }
                    for (i = begin, j = seekNext(end); i < len; i++) {
                        if (tests[i]) {
                            if (j < len && tests[i].test(buffer[j])) {
                                buffer[i] = buffer[j];
                                buffer[j] = getPlaceholder(j);
                            } else {
                                break;
                            }
                            j = seekNext(j);
                        }
                    }
                    writeBuffer();
                    input.caret(Math.max(firstNonMaskPos, begin));
                }

                function shiftR(pos) {
                    var i, c, j, t;
                    for (i = pos, c = getPlaceholder(pos); i < len; i++) {
                        if (tests[i]) {
                            j = seekNext(i);
                            t = buffer[i];
                            buffer[i] = c;
                            if (j < len && tests[j].test(t)) {
                                c = t;
                            } else {
                                break;
                            }
                        }
                    }
                }

                function androidInputEvent(e) {
                    var curVal = input.val();
                    var pos = input.caret();
                    if (oldVal && oldVal.length && oldVal.length > curVal.length) {
                        checkVal(true);
                        while (pos.begin > 0 && !tests[pos.begin - 1])
                            pos.begin--;
                        if (pos.begin === 0) {
                            while (pos.begin < firstNonMaskPos && !tests[pos.begin])
                                pos.begin++;
                        }
                        input.caret(pos.begin, pos.begin);
                    } else {
                        var pos2 = checkVal(true);
                        var lastEnteredValue = curVal.charAt(pos.begin);
                        if (pos.begin < len) {
                            if (!tests[pos.begin]) {
                                pos.begin++;
                                if (tests[pos.begin].test(lastEnteredValue)) {
                                    pos.begin++;
                                }
                            } else {
                                if (tests[pos.begin].test(lastEnteredValue)) {
                                    pos.begin++;
                                }
                            }
                        }
                        input.caret(pos.begin, pos.begin);
                    }
                    tryFireCompleted();
                }

                function blurEvent(e) {
                    checkVal();
                    if (input.val() != focusText)
                        input.change();
                }

                function keydownEvent(e) {
                    if (input.prop("readonly")) {
                        return;
                    }
                    var k = e.which || e.keyCode, pos, begin, end;
                    oldVal = input.val();
                    if (k === 8 || k === 46 || (iPhone && k === 127)) {
                        pos = input.caret();
                        begin = pos.begin;
                        end = pos.end;
                        if (end - begin === 0) {
                            begin = k !== 46 ? seekPrev(begin) : (end = seekNext(begin - 1));
                            end = k === 46 ? seekNext(end) : end;
                        }
                        clearBuffer(begin, end);
                        shiftL(begin, end - 1);
                        e.preventDefault();
                    } else if (k === 13) {
                        blurEvent.call(this, e);
                    } else if (k === 27) {
                        input.val(focusText);
                        input.caret(0, checkVal());
                        e.preventDefault();
                    }
                }

                function keypressEvent(e) {
                    if (input.prop("readonly")) {
                        return;
                    }
                    var k = e.which || e.keyCode, pos = input.caret(), p, c, next;
                    if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {
                        return;
                    } else if (k && k !== 13) {
                        if (pos.end - pos.begin !== 0) {
                            clearBuffer(pos.begin, pos.end);
                            shiftL(pos.begin, pos.end - 1);
                        }
                        p = seekNext(pos.begin - 1);
                        if (p < len) {
                            c = String.fromCharCode(k);
                            if (tests[p].test(c)) {
                                shiftR(p);
                                buffer[p] = c;
                                writeBuffer();
                                next = seekNext(p);
                                if (android) {
                                    var proxy = function () {
                                        $.proxy($.fn.caret, input, next)();
                                    };
                                    setTimeout(proxy, 0);
                                } else {
                                    input.caret(next);
                                }
                                if (pos.begin <= lastRequiredNonMaskPos) {
                                    tryFireCompleted();
                                }
                            }
                        }
                        e.preventDefault();
                    }
                }

                function clearBuffer(start, end) {
                    var i;
                    for (i = start; i < end && i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = getPlaceholder(i);
                        }
                    }
                }

                function writeBuffer() {
                    input.val(buffer.join(''));
                }

                function checkVal(allow) {
                    var test = input.val(), lastMatch = -1, i, c, pos;
                    for (i = 0, pos = 0; i < len; i++) {
                        if (tests[i]) {
                            buffer[i] = getPlaceholder(i);
                            while (pos++ < test.length) {
                                c = test.charAt(pos - 1);
                                if (tests[i].test(c)) {
                                    buffer[i] = c;
                                    lastMatch = i;
                                    break;
                                }
                            }
                            if (pos > test.length) {
                                clearBuffer(i + 1, len);
                                break;
                            }
                        } else {
                            if (buffer[i] === test.charAt(pos)) {
                                pos++;
                            }
                            if (i < partialPosition) {
                                lastMatch = i;
                            }
                        }
                    }
                    if (allow) {
                        writeBuffer();
                    } else if (lastMatch + 1 < partialPosition) {
                        if (settings.autoclear || buffer.join('') === defaultBuffer) {
                            if (input.val()) input.val("");
                            clearBuffer(0, len);
                        } else {
                            writeBuffer();
                        }
                    } else {
                        writeBuffer();
                        input.val(input.val().substring(0, lastMatch + 1));
                    }
                    return (partialPosition ? i : firstNonMaskPos);
                }

                input.data($.mask.dataName, function () {
                    return $.map(buffer, function (c, i) {
                        return tests[i] && c != getPlaceholder(i) ? c : null;
                    }).join('');
                });
                input.one("unmask", function () {
                    input.off(".mask").removeData($.mask.dataName);
                }).on("focus.mask", function () {
                    if (input.prop("readonly")) {
                        return;
                    }
                    clearTimeout(caretTimeoutId);
                    var pos;
                    focusText = input.val();
                    pos = checkVal();
                    caretTimeoutId = setTimeout(function () {
                        if (input.get(0) !== document.activeElement) {
                            return;
                        }
                        writeBuffer();
                        if (pos == mask.replace("?", "").length) {
                            input.caret(0, pos);
                        } else {
                            input.caret(pos);
                        }
                    }, 10);
                }).on("blur.mask", blurEvent).on("keydown.mask", keydownEvent).on("keypress.mask", keypressEvent).on("input.mask paste.mask", function () {
                    if (input.prop("readonly")) {
                        return;
                    }
                    setTimeout(function () {
                        var pos = checkVal(true);
                        input.caret(pos);
                        tryFireCompleted();
                    }, 0);
                });
                if (chrome && android) {
                    input.off('input.mask').on('input.mask', androidInputEvent);
                }
                checkVal();
            });
        }
    });
}));
;(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : global.moment = factory()
}(this, function () {
    'use strict';
    var hookCallback;

    function utils_hooks__hooks() {
        return hookCallback.apply(null, arguments);
    }

    function setHookCallback(callback) {
        hookCallback = callback;
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]';
    }

    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }

    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }

    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }

    function extend(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }
        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }
        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }
        return a;
    }

    function create_utc__createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
    }

    function defaultParsingFlags() {
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false
        };
    }

    function getParsingFlags(m) {
        if (m._pf == null) {
            m._pf = defaultParsingFlags();
        }
        return m._pf;
    }

    function valid__isValid(m) {
        if (m._isValid == null) {
            var flags = getParsingFlags(m);
            m._isValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidMonth && !flags.invalidWeekday && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated;
            if (m._strict) {
                m._isValid = m._isValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
            }
        }
        return m._isValid;
    }

    function valid__createInvalid(flags) {
        var m = create_utc__createUTC(NaN);
        if (flags != null) {
            extend(getParsingFlags(m), flags);
        }
        else {
            getParsingFlags(m).userInvalidated = true;
        }
        return m;
    }

    function isUndefined(input) {
        return input === void 0;
    }

    var momentProperties = utils_hooks__hooks.momentProperties = [];

    function copyConfig(to, from) {
        var i, prop, val;
        if (!isUndefined(from._isAMomentObject)) {
            to._isAMomentObject = from._isAMomentObject;
        }
        if (!isUndefined(from._i)) {
            to._i = from._i;
        }
        if (!isUndefined(from._f)) {
            to._f = from._f;
        }
        if (!isUndefined(from._l)) {
            to._l = from._l;
        }
        if (!isUndefined(from._strict)) {
            to._strict = from._strict;
        }
        if (!isUndefined(from._tzm)) {
            to._tzm = from._tzm;
        }
        if (!isUndefined(from._isUTC)) {
            to._isUTC = from._isUTC;
        }
        if (!isUndefined(from._offset)) {
            to._offset = from._offset;
        }
        if (!isUndefined(from._pf)) {
            to._pf = getParsingFlags(from);
        }
        if (!isUndefined(from._locale)) {
            to._locale = from._locale;
        }
        if (momentProperties.length > 0) {
            for (i in momentProperties) {
                prop = momentProperties[i];
                val = from[prop];
                if (!isUndefined(val)) {
                    to[prop] = val;
                }
            }
        }
        return to;
    }

    var updateInProgress = false;

    function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(config._d != null ? config._d.getTime() : NaN);
        if (updateInProgress === false) {
            updateInProgress = true;
            utils_hooks__hooks.updateOffset(this);
            updateInProgress = false;
        }
    }

    function isMoment(obj) {
        return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
    }

    function absFloor(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }

    function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion, value = 0;
        if (coercedNumber !== 0 && isFinite(coercedNumber)) {
            value = absFloor(coercedNumber);
        }
        return value;
    }

    function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length),
            diffs = 0, i;
        for (i = 0; i < len; i++) {
            if ((dontConvert && array1[i] !== array2[i]) || (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }

    function Locale() {
    }

    var locales = {};
    var globalLocale;

    function normalizeLocale(key) {
        return key ? key.toLowerCase().replace('_', '-') : key;
    }

    function chooseLocale(names) {
        var i = 0, j, next, locale, split;
        while (i < names.length) {
            split = normalizeLocale(names[i]).split('-');
            j = split.length;
            next = normalizeLocale(names[i + 1]);
            next = next ? next.split('-') : null;
            while (j > 0) {
                locale = loadLocale(split.slice(0, j).join('-'));
                if (locale) {
                    return locale;
                }
                if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                    break;
                }
                j--;
            }
            i++;
        }
        return null;
    }

    function loadLocale(name) {
        var oldLocale = null;
        if (!locales[name] && !isUndefined(module) && module && module.exports) {
            try {
                oldLocale = globalLocale._abbr;
                require('./locale/' + name);
                locale_locales__getSetGlobalLocale(oldLocale);
            } catch (e) {
            }
        }
        return locales[name];
    }

    function locale_locales__getSetGlobalLocale(key, values) {
        var data;
        if (key) {
            if (isUndefined(values)) {
                data = locale_locales__getLocale(key);
            }
            else {
                data = defineLocale(key, values);
            }
            if (data) {
                globalLocale = data;
            }
        }
        return globalLocale._abbr;
    }

    function defineLocale(name, values) {
        if (values !== null) {
            values.abbr = name;
            locales[name] = locales[name] || new Locale();
            locales[name].set(values);
            locale_locales__getSetGlobalLocale(name);
            return locales[name];
        } else {
            delete locales[name];
            return null;
        }
    }

    function locale_locales__getLocale(key) {
        var locale;
        if (key && key._locale && key._locale._abbr) {
            key = key._locale._abbr;
        }
        if (!key) {
            return globalLocale;
        }
        if (!isArray(key)) {
            locale = loadLocale(key);
            if (locale) {
                return locale;
            }
            key = [key];
        }
        return chooseLocale(key);
    }

    var aliases = {};

    function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
    }

    function normalizeUnits(units) {
        return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
    }

    function normalizeObjectUnits(inputObject) {
        var normalizedInput = {}, normalizedProp, prop;
        for (prop in inputObject) {
            if (hasOwnProp(inputObject, prop)) {
                normalizedProp = normalizeUnits(prop);
                if (normalizedProp) {
                    normalizedInput[normalizedProp] = inputObject[prop];
                }
            }
        }
        return normalizedInput;
    }

    function isFunction(input) {
        return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
    }

    function makeGetSet(unit, keepTime) {
        return function (value) {
            if (value != null) {
                get_set__set(this, unit, value);
                utils_hooks__hooks.updateOffset(this, keepTime);
                return this;
            } else {
                return get_set__get(this, unit);
            }
        };
    }

    function get_set__get(mom, unit) {
        return mom.isValid() ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
    }

    function get_set__set(mom, unit, value) {
        if (mom.isValid()) {
            mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
        }
    }

    function getSet(units, value) {
        var unit;
        if (typeof units === 'object') {
            for (unit in units) {
                this.set(unit, units[unit]);
            }
        } else {
            units = normalizeUnits(units);
            if (isFunction(this[units])) {
                return this[units](value);
            }
        }
        return this;
    }

    function zeroFill(number, targetLength, forceSign) {
        var absNumber = '' + Math.abs(number), zerosToFill = targetLength - absNumber.length, sign = number >= 0;
        return (sign ? (forceSign ? '+' : '') : '-') +
            Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
    }

    var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
    var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;
    var formatFunctions = {};
    var formatTokenFunctions = {};

    function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        if (typeof callback === 'string') {
            func = function () {
                return this[callback]();
            };
        }
        if (token) {
            formatTokenFunctions[token] = func;
        }
        if (padded) {
            formatTokenFunctions[padded[0]] = function () {
                return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
            };
        }
        if (ordinal) {
            formatTokenFunctions[ordinal] = function () {
                return this.localeData().ordinal(func.apply(this, arguments), token);
            };
        }
    }

    function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) {
            return input.replace(/^\[|\]$/g, '');
        }
        return input.replace(/\\/g, '');
    }

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;
        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }
        return function (mom) {
            var output = '';
            for (i = 0; i < length; i++) {
                output += array[i] instanceof Function ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }

    function formatMoment(m, format) {
        if (!m.isValid()) {
            return m.localeData().invalidDate();
        }
        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);
        return formatFunctions[format](m);
    }

    function expandFormat(format, locale) {
        var i = 5;

        function replaceLongDateFormatTokens(input) {
            return locale.longDateFormat(input) || input;
        }

        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
            localFormattingTokens.lastIndex = 0;
            i -= 1;
        }
        return format;
    }

    var match1 = /\d/;
    var match2 = /\d\d/;
    var match3 = /\d{3}/;
    var match4 = /\d{4}/;
    var match6 = /[+-]?\d{6}/;
    var match1to2 = /\d\d?/;
    var match3to4 = /\d\d\d\d?/;
    var match5to6 = /\d\d\d\d\d\d?/;
    var match1to3 = /\d{1,3}/;
    var match1to4 = /\d{1,4}/;
    var match1to6 = /[+-]?\d{1,6}/;
    var matchUnsigned = /\d+/;
    var matchSigned = /[+-]?\d+/;
    var matchOffset = /Z|[+-]\d\d:?\d\d/gi;
    var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi;
    var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/;
    var matchWord = /[0-9]*(a[mn]\s?)?['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\-]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
    var regexes = {};

    function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function (isStrict) {
            return (isStrict && strictRegex) ? strictRegex : regex;
        };
    }

    function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) {
            return new RegExp(unescapeFormat(token));
        }
        return regexes[token](config._strict, config._locale);
    }

    function unescapeFormat(s) {
        return s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
            return p1 || p2 || p3 || p4;
        }).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    var tokens = {};

    function addParseToken(token, callback) {
        var i, func = callback;
        if (typeof token === 'string') {
            token = [token];
        }
        if (typeof callback === 'number') {
            func = function (input, array) {
                array[callback] = toInt(input);
            };
        }
        for (i = 0; i < token.length; i++) {
            tokens[token[i]] = func;
        }
    }

    function addWeekParseToken(token, callback) {
        addParseToken(token, function (input, array, config, token) {
            config._w = config._w || {};
            callback(input, config._w, config, token);
        });
    }

    function addTimeToArrayFromToken(token, input, config) {
        if (input != null && hasOwnProp(tokens, token)) {
            tokens[token](input, config._a, config, token);
        }
    }

    var YEAR = 0;
    var MONTH = 1;
    var DATE = 2;
    var HOUR = 3;
    var MINUTE = 4;
    var SECOND = 5;
    var MILLISECOND = 6;
    var WEEK = 7;
    var WEEKDAY = 8;

    function daysInMonth(year, month) {
        return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    }

    addFormatToken('M', ['MM', 2], 'Mo', function () {
        return this.month() + 1;
    });
    addFormatToken('MMM', 0, 0, function (format) {
        return this.localeData().monthsShort(this, format);
    });
    addFormatToken('MMMM', 0, 0, function (format) {
        return this.localeData().months(this, format);
    });
    addUnitAlias('month', 'M');
    addRegexToken('M', match1to2);
    addRegexToken('MM', match1to2, match2);
    addRegexToken('MMM', matchWord);
    addRegexToken('MMMM', matchWord);
    addParseToken(['M', 'MM'], function (input, array) {
        array[MONTH] = toInt(input) - 1;
    });
    addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        if (month != null) {
            array[MONTH] = month;
        } else {
            getParsingFlags(config).invalidMonth = input;
        }
    });
    var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');

    function localeMonths(m, format) {
        return isArray(this._months) ? this._months[m.month()] : this._months[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sept_Oct_Nov_Dec'.split('_');

    function localeMonthsShort(m, format) {
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
    }

    function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }
        for (i = 0; i < 12; i++) {
            mom = create_utc__createUTC([2000, i]);
            if (strict && !this._longMonthsParse[i]) {
                this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
            }
            if (!strict && !this._monthsParse[i]) {
                regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                return i;
            } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                return i;
            } else if (!strict && this._monthsParse[i].test(monthName)) {
                return i;
            }
        }
    }

    function setMonth(mom, value) {
        var dayOfMonth;
        if (!mom.isValid()) {
            return mom;
        }
        if (typeof value === 'string') {
            value = mom.localeData().monthsParse(value);
            if (typeof value !== 'number') {
                return mom;
            }
        }
        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
        return mom;
    }

    function getSetMonth(value) {
        if (value != null) {
            setMonth(this, value);
            utils_hooks__hooks.updateOffset(this, true);
            return this;
        } else {
            return get_set__get(this, 'Month');
        }
    }

    function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
    }

    function checkOverflow(m) {
        var overflow;
        var a = m._a;
        if (a && getParsingFlags(m).overflow === -2) {
            overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
            if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                overflow = DATE;
            }
            if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                overflow = WEEK;
            }
            if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                overflow = WEEKDAY;
            }
            getParsingFlags(m).overflow = overflow;
        }
        return m;
    }

    function warn(msg) {
        if (utils_hooks__hooks.suppressDeprecationWarnings === false && !isUndefined(console) && console.warn) {
            console.warn('Deprecation warning: ' + msg);
        }
    }

    function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function () {
            if (firstTime) {
                warn(msg + '\nArguments: ' + Array.prototype.slice.call(arguments).join(', ') + '\n' + (new Error()).stack);
                firstTime = false;
            }
            return fn.apply(this, arguments);
        }, fn);
    }

    var deprecations = {};

    function deprecateSimple(name, msg) {
        if (!deprecations[name]) {
            warn(msg);
            deprecations[name] = true;
        }
    }

    utils_hooks__hooks.suppressDeprecationWarnings = false;
    var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;
    var isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/], ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/], ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/], ['GGGG-[W]WW', /\d{4}-W\d\d/, false], ['YYYY-DDD', /\d{4}-\d{3}/], ['YYYY-MM', /\d{4}-\d\d/, false], ['YYYYYYMMDD', /[+-]\d{10}/], ['YYYYMMDD', /\d{8}/], ['GGGG[W]WWE', /\d{4}W\d{3}/], ['GGGG[W]WW', /\d{4}W\d{2}/, false], ['YYYYDDD', /\d{7}/]];
    var isoTimes = [['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/], ['HH:mm:ss', /\d\d:\d\d:\d\d/], ['HH:mm', /\d\d:\d\d/], ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/], ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/], ['HHmmss', /\d\d\d\d\d\d/], ['HHmm', /\d\d\d\d/], ['HH', /\d\d/]];
    var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

    function configFromISO(config) {
        var i, l, string = config._i, match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string), allowTime,
            dateFormat, timeFormat, tzFormat;
        if (match) {
            getParsingFlags(config).iso = true;
            for (i = 0, l = isoDates.length; i < l; i++) {
                if (isoDates[i][1].exec(match[1])) {
                    dateFormat = isoDates[i][0];
                    allowTime = isoDates[i][2] !== false;
                    break;
                }
            }
            if (dateFormat == null) {
                config._isValid = false;
                return;
            }
            if (match[3]) {
                for (i = 0, l = isoTimes.length; i < l; i++) {
                    if (isoTimes[i][1].exec(match[3])) {
                        timeFormat = (match[2] || ' ') + isoTimes[i][0];
                        break;
                    }
                }
                if (timeFormat == null) {
                    config._isValid = false;
                    return;
                }
            }
            if (!allowTime && timeFormat != null) {
                config._isValid = false;
                return;
            }
            if (match[4]) {
                if (tzRegex.exec(match[4])) {
                    tzFormat = 'Z';
                } else {
                    config._isValid = false;
                    return;
                }
            }
            config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
            configFromStringAndFormat(config);
        } else {
            config._isValid = false;
        }
    }

    function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (matched !== null) {
            config._d = new Date(+matched[1]);
            return;
        }
        configFromISO(config);
        if (config._isValid === false) {
            delete config._isValid;
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    utils_hooks__hooks.createFromInputFallback = deprecate('moment construction falls back to js Date. This is ' + 'discouraged and will be removed in upcoming major ' + 'release. Please refer to ' + 'https://github.com/moment/moment/issues/1407 for more info.', function (config) {
        config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
    });

    function createDate(y, m, d, h, M, s, ms) {
        var date = new Date(y, m, d, h, M, s, ms);
        if (y < 100 && y >= 0 && isFinite(date.getFullYear())) {
            date.setFullYear(y);
        }
        return date;
    }

    function createUTCDate(y) {
        var date = new Date(Date.UTC.apply(null, arguments));
        if (y < 100 && y >= 0 && isFinite(date.getUTCFullYear())) {
            date.setUTCFullYear(y);
        }
        return date;
    }

    addFormatToken(0, ['YY', 2], 0, function () {
        return this.year() % 100;
    });
    addFormatToken(0, ['YYYY', 4], 0, 'year');
    addFormatToken(0, ['YYYYY', 5], 0, 'year');
    addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');
    addUnitAlias('year', 'y');
    addRegexToken('Y', matchSigned);
    addRegexToken('YY', match1to2, match2);
    addRegexToken('YYYY', match1to4, match4);
    addRegexToken('YYYYY', match1to6, match6);
    addRegexToken('YYYYYY', match1to6, match6);
    addParseToken(['YYYYY', 'YYYYYY'], YEAR);
    addParseToken('YYYY', function (input, array) {
        array[YEAR] = input.length === 2 ? utils_hooks__hooks.parseTwoDigitYear(input) : toInt(input);
    });
    addParseToken('YY', function (input, array) {
        array[YEAR] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
    }

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    }

    utils_hooks__hooks.parseTwoDigitYear = function (input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
    };
    var getSetYear = makeGetSet('FullYear', false);

    function getIsLeapYear() {
        return isLeapYear(this.year());
    }

    function firstWeekOffset(year, dow, doy) {
        var
            fwd = 7 + dow - doy, fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
        return -fwdlw + fwd - 1;
    }

    function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7, weekOffset = firstWeekOffset(year, dow, doy),
            dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset, resYear, resDayOfYear;
        if (dayOfYear <= 0) {
            resYear = year - 1;
            resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
            resYear = year + 1;
            resDayOfYear = dayOfYear - daysInYear(year);
        } else {
            resYear = year;
            resDayOfYear = dayOfYear;
        }
        return {year: resYear, dayOfYear: resDayOfYear};
    }

    function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy),
            week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1, resWeek, resYear;
        if (week < 1) {
            resYear = mom.year() - 1;
            resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
            resWeek = week - weeksInYear(mom.year(), dow, doy);
            resYear = mom.year() + 1;
        } else {
            resYear = mom.year();
            resWeek = week;
        }
        return {week: resWeek, year: resYear};
    }

    function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
    }

    function defaults(a, b, c) {
        if (a != null) {
            return a;
        }
        if (b != null) {
            return b;
        }
        return c;
    }

    function currentDateArray(config) {
        var nowValue = new Date(utils_hooks__hooks.now());
        if (config._useUTC) {
            return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
        }
        return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
    }

    function configFromArray(config) {
        var i, date, input = [], currentDate, yearToUse;
        if (config._d) {
            return;
        }
        currentDate = currentDateArray(config);
        if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
            dayOfYearFromWeekInfo(config);
        }
        if (config._dayOfYear) {
            yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
            if (config._dayOfYear > daysInYear(yearToUse)) {
                getParsingFlags(config)._overflowDayOfYear = true;
            }
            date = createUTCDate(yearToUse, 0, config._dayOfYear);
            config._a[MONTH] = date.getUTCMonth();
            config._a[DATE] = date.getUTCDate();
        }
        for (i = 0; i < 3 && config._a[i] == null; ++i) {
            config._a[i] = input[i] = currentDate[i];
        }
        for (; i < 7; i++) {
            config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
        }
        if (config._a[HOUR] === 24 && config._a[MINUTE] === 0 && config._a[SECOND] === 0 && config._a[MILLISECOND] === 0) {
            config._nextDay = true;
            config._a[HOUR] = 0;
        }
        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        if (config._tzm != null) {
            config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        }
        if (config._nextDay) {
            config._a[HOUR] = 24;
        }
    }

    function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;
        w = config._w;
        if (w.GG != null || w.W != null || w.E != null) {
            dow = 1;
            doy = 4;
            weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(local__createLocal(), 1, 4).year);
            week = defaults(w.W, 1);
            weekday = defaults(w.E, 1);
            if (weekday < 1 || weekday > 7) {
                weekdayOverflow = true;
            }
        } else {
            dow = config._locale._week.dow;
            doy = config._locale._week.doy;
            weekYear = defaults(w.gg, config._a[YEAR], weekOfYear(local__createLocal(), dow, doy).year);
            week = defaults(w.w, 1);
            if (w.d != null) {
                weekday = w.d;
                if (weekday < 0 || weekday > 6) {
                    weekdayOverflow = true;
                }
            } else if (w.e != null) {
                weekday = w.e + dow;
                if (w.e < 0 || w.e > 6) {
                    weekdayOverflow = true;
                }
            } else {
                weekday = dow;
            }
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
            getParsingFlags(config)._overflowWeeks = true;
        } else if (weekdayOverflow != null) {
            getParsingFlags(config)._overflowWeekday = true;
        } else {
            temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
            config._a[YEAR] = temp.year;
            config._dayOfYear = temp.dayOfYear;
        }
    }

    utils_hooks__hooks.ISO_8601 = function () {
    };

    function configFromStringAndFormat(config) {
        if (config._f === utils_hooks__hooks.ISO_8601) {
            configFromISO(config);
            return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;
        var string = '' + config._i, i, parsedInput, tokens, token, skipped, stringLength = string.length,
            totalParsedInputLength = 0;
        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
            if (parsedInput) {
                skipped = string.substr(0, string.indexOf(parsedInput));
                if (skipped.length > 0) {
                    getParsingFlags(config).unusedInput.push(skipped);
                }
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                totalParsedInputLength += parsedInput.length;
            }
            if (formatTokenFunctions[token]) {
                if (parsedInput) {
                    getParsingFlags(config).empty = false;
                }
                else {
                    getParsingFlags(config).unusedTokens.push(token);
                }
                addTimeToArrayFromToken(token, parsedInput, config);
            }
            else if (config._strict && !parsedInput) {
                getParsingFlags(config).unusedTokens.push(token);
            }
        }
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        if (string.length > 0) {
            getParsingFlags(config).unusedInput.push(string);
        }
        if (getParsingFlags(config).bigHour === true && config._a[HOUR] <= 12 && config._a[HOUR] > 0) {
            getParsingFlags(config).bigHour = undefined;
        }
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);
        configFromArray(config);
        checkOverflow(config);
    }

    function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;
        if (meridiem == null) {
            return hour;
        }
        if (locale.meridiemHour != null) {
            return locale.meridiemHour(hour, meridiem);
        } else if (locale.isPM != null) {
            isPm = locale.isPM(meridiem);
            if (isPm && hour < 12) {
                hour += 12;
            }
            if (!isPm && hour === 12) {
                hour = 0;
            }
            return hour;
        } else {
            return hour;
        }
    }

    function configFromStringAndArray(config) {
        var tempConfig, bestMoment, scoreToBeat, i, currentScore;
        if (config._f.length === 0) {
            getParsingFlags(config).invalidFormat = true;
            config._d = new Date(NaN);
            return;
        }
        for (i = 0; i < config._f.length; i++) {
            currentScore = 0;
            tempConfig = copyConfig({}, config);
            if (config._useUTC != null) {
                tempConfig._useUTC = config._useUTC;
            }
            tempConfig._f = config._f[i];
            configFromStringAndFormat(tempConfig);
            if (!valid__isValid(tempConfig)) {
                continue;
            }
            currentScore += getParsingFlags(tempConfig).charsLeftOver;
            currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;
            getParsingFlags(tempConfig).score = currentScore;
            if (scoreToBeat == null || currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempConfig;
            }
        }
        extend(config, bestMoment || tempConfig);
    }

    function configFromObject(config) {
        if (config._d) {
            return;
        }
        var i = normalizeObjectUnits(config._i);
        config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
            return obj && parseInt(obj, 10);
        });
        configFromArray(config);
    }

    function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
            res.add(1, 'd');
            res._nextDay = undefined;
        }
        return res;
    }

    function prepareConfig(config) {
        var input = config._i, format = config._f;
        config._locale = config._locale || locale_locales__getLocale(config._l);
        if (input === null || (format === undefined && input === '')) {
            return valid__createInvalid({nullInput: true});
        }
        if (typeof input === 'string') {
            config._i = input = config._locale.preparse(input);
        }
        if (isMoment(input)) {
            return new Moment(checkOverflow(input));
        } else if (isArray(format)) {
            configFromStringAndArray(config);
        } else if (format) {
            configFromStringAndFormat(config);
        } else if (isDate(input)) {
            config._d = input;
        } else {
            configFromInput(config);
        }
        if (!valid__isValid(config)) {
            config._d = null;
        }
        return config;
    }

    function configFromInput(config) {
        var input = config._i;
        if (input === undefined) {
            config._d = new Date(utils_hooks__hooks.now());
        } else if (isDate(input)) {
            config._d = new Date(+input);
        } else if (typeof input === 'string') {
            configFromString(config);
        } else if (isArray(input)) {
            config._a = map(input.slice(0), function (obj) {
                return parseInt(obj, 10);
            });
            configFromArray(config);
        } else if (typeof(input) === 'object') {
            configFromObject(config);
        } else if (typeof(input) === 'number') {
            config._d = new Date(input);
        } else {
            utils_hooks__hooks.createFromInputFallback(config);
        }
    }

    function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};
        if (typeof(locale) === 'boolean') {
            strict = locale;
            locale = undefined;
        }
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        return createFromConfig(c);
    }

    function local__createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
    }

    var prototypeMin = deprecate('moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548', function () {
        var other = local__createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other < this ? this : other;
        } else {
            return valid__createInvalid();
        }
    });
    var prototypeMax = deprecate('moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548', function () {
        var other = local__createLocal.apply(null, arguments);
        if (this.isValid() && other.isValid()) {
            return other > this ? this : other;
        } else {
            return valid__createInvalid();
        }
    });

    function pickBy(fn, moments) {
        var res, i;
        if (moments.length === 1 && isArray(moments[0])) {
            moments = moments[0];
        }
        if (!moments.length) {
            return local__createLocal();
        }
        res = moments[0];
        for (i = 1; i < moments.length; ++i) {
            if (!moments[i].isValid() || moments[i][fn](res)) {
                res = moments[i];
            }
        }
        return res;
    }

    function min() {
        var args = [].slice.call(arguments, 0);
        return pickBy('isBefore', args);
    }

    function max() {
        var args = [].slice.call(arguments, 0);
        return pickBy('isAfter', args);
    }

    var now = Date.now || function () {
        return +(new Date());
    };

    function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration), years = normalizedInput.year || 0,
            quarters = normalizedInput.quarter || 0, months = normalizedInput.month || 0,
            weeks = normalizedInput.week || 0, days = normalizedInput.day || 0, hours = normalizedInput.hour || 0,
            minutes = normalizedInput.minute || 0, seconds = normalizedInput.second || 0,
            milliseconds = normalizedInput.millisecond || 0;
        this._milliseconds = +milliseconds +
            seconds * 1e3 +
            minutes * 6e4 +
            hours * 36e5;
        this._days = +days +
            weeks * 7;
        this._months = +months +
            quarters * 3 +
            years * 12;
        this._data = {};
        this._locale = locale_locales__getLocale();
        this._bubble();
    }

    function isDuration(obj) {
        return obj instanceof Duration;
    }

    function offset(token, separator) {
        addFormatToken(token, 0, 0, function () {
            var offset = this.utcOffset();
            var sign = '+';
            if (offset < 0) {
                offset = -offset;
                sign = '-';
            }
            return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
        });
    }

    offset('Z', ':');
    offset('ZZ', '');
    addRegexToken('Z', matchShortOffset);
    addRegexToken('ZZ', matchShortOffset);
    addParseToken(['Z', 'ZZ'], function (input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
    });
    var chunkOffset = /([\+\-]|\d\d)/gi;

    function offsetFromString(matcher, string) {
        var matches = ((string || '').match(matcher) || []);
        var chunk = matches[matches.length - 1] || [];
        var parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
        var minutes = +(parts[1] * 60) + toInt(parts[2]);
        return parts[0] === '+' ? minutes : -minutes;
    }

    function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
            res = model.clone();
            diff = (isMoment(input) || isDate(input) ? +input : +local__createLocal(input)) - (+res);
            res._d.setTime(+res._d + diff);
            utils_hooks__hooks.updateOffset(res, false);
            return res;
        } else {
            return local__createLocal(input).local();
        }
    }

    function getDateOffset(m) {
        return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
    }

    utils_hooks__hooks.updateOffset = function () {
    };

    function getSetOffset(input, keepLocalTime) {
        var offset = this._offset || 0, localAdjust;
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        if (input != null) {
            if (typeof input === 'string') {
                input = offsetFromString(matchShortOffset, input);
            } else if (Math.abs(input) < 16) {
                input = input * 60;
            }
            if (!this._isUTC && keepLocalTime) {
                localAdjust = getDateOffset(this);
            }
            this._offset = input;
            this._isUTC = true;
            if (localAdjust != null) {
                this.add(localAdjust, 'm');
            }
            if (offset !== input) {
                if (!keepLocalTime || this._changeInProgress) {
                    add_subtract__addSubtract(this, create__createDuration(input - offset, 'm'), 1, false);
                } else if (!this._changeInProgress) {
                    this._changeInProgress = true;
                    utils_hooks__hooks.updateOffset(this, true);
                    this._changeInProgress = null;
                }
            }
            return this;
        } else {
            return this._isUTC ? offset : getDateOffset(this);
        }
    }

    function getSetZone(input, keepLocalTime) {
        if (input != null) {
            if (typeof input !== 'string') {
                input = -input;
            }
            this.utcOffset(input, keepLocalTime);
            return this;
        } else {
            return -this.utcOffset();
        }
    }

    function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
    }

    function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
            this.utcOffset(0, keepLocalTime);
            this._isUTC = false;
            if (keepLocalTime) {
                this.subtract(getDateOffset(this), 'm');
            }
        }
        return this;
    }

    function setOffsetToParsedOffset() {
        if (this._tzm) {
            this.utcOffset(this._tzm);
        } else if (typeof this._i === 'string') {
            this.utcOffset(offsetFromString(matchOffset, this._i));
        }
        return this;
    }

    function hasAlignedHourOffset(input) {
        if (!this.isValid()) {
            return false;
        }
        input = input ? local__createLocal(input).utcOffset() : 0;
        return (this.utcOffset() - input) % 60 === 0;
    }

    function isDaylightSavingTime() {
        return (this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset());
    }

    function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) {
            return this._isDSTShifted;
        }
        var c = {};
        copyConfig(c, this);
        c = prepareConfig(c);
        if (c._a) {
            var other = c._isUTC ? create_utc__createUTC(c._a) : local__createLocal(c._a);
            this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else {
            this._isDSTShifted = false;
        }
        return this._isDSTShifted;
    }

    function isLocal() {
        return this.isValid() ? !this._isUTC : false;
    }

    function isUtcOffset() {
        return this.isValid() ? this._isUTC : false;
    }

    function isUtc() {
        return this.isValid() ? this._isUTC && this._offset === 0 : false;
    }

    var aspNetRegex = /(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/;
    var isoRegex = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;

    function create__createDuration(input, key) {
        var duration = input, match = null, sign, ret, diffRes;
        if (isDuration(input)) {
            duration = {ms: input._milliseconds, d: input._days, M: input._months};
        } else if (typeof input === 'number') {
            duration = {};
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        } else if (!!(match = aspNetRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: 0,
                d: toInt(match[DATE]) * sign,
                h: toInt(match[HOUR]) * sign,
                m: toInt(match[MINUTE]) * sign,
                s: toInt(match[SECOND]) * sign,
                ms: toInt(match[MILLISECOND]) * sign
            };
        } else if (!!(match = isoRegex.exec(input))) {
            sign = (match[1] === '-') ? -1 : 1;
            duration = {
                y: parseIso(match[2], sign),
                M: parseIso(match[3], sign),
                d: parseIso(match[4], sign),
                h: parseIso(match[5], sign),
                m: parseIso(match[6], sign),
                s: parseIso(match[7], sign),
                w: parseIso(match[8], sign)
            };
        } else if (duration == null) {
            duration = {};
        } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
            diffRes = momentsDifference(local__createLocal(duration.from), local__createLocal(duration.to));
            duration = {};
            duration.ms = diffRes.milliseconds;
            duration.M = diffRes.months;
        }
        ret = new Duration(duration);
        if (isDuration(input) && hasOwnProp(input, '_locale')) {
            ret._locale = input._locale;
        }
        return ret;
    }

    create__createDuration.fn = Duration.prototype;

    function parseIso(inp, sign) {
        var res = inp && parseFloat(inp.replace(',', '.'));
        return (isNaN(res) ? 0 : res) * sign;
    }

    function positiveMomentsDifference(base, other) {
        var res = {milliseconds: 0, months: 0};
        res.months = other.month() - base.month() +
            (other.year() - base.year()) * 12;
        if (base.clone().add(res.months, 'M').isAfter(other)) {
            --res.months;
        }
        res.milliseconds = +other - +(base.clone().add(res.months, 'M'));
        return res;
    }

    function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) {
            return {milliseconds: 0, months: 0};
        }
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) {
            res = positiveMomentsDifference(base, other);
        } else {
            res = positiveMomentsDifference(other, base);
            res.milliseconds = -res.milliseconds;
            res.months = -res.months;
        }
        return res;
    }

    function createAdder(direction, name) {
        return function (val, period) {
            var dur, tmp;
            if (period !== null && !isNaN(+period)) {
                deprecateSimple(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period).');
                tmp = val;
                val = period;
                period = tmp;
            }
            val = typeof val === 'string' ? +val : val;
            dur = create__createDuration(val, period);
            add_subtract__addSubtract(this, dur, direction);
            return this;
        };
    }

    function add_subtract__addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds, days = duration._days, months = duration._months;
        if (!mom.isValid()) {
            return;
        }
        updateOffset = updateOffset == null ? true : updateOffset;
        if (milliseconds) {
            mom._d.setTime(+mom._d + milliseconds * isAdding);
        }
        if (days) {
            get_set__set(mom, 'Date', get_set__get(mom, 'Date') + days * isAdding);
        }
        if (months) {
            setMonth(mom, get_set__get(mom, 'Month') + months * isAdding);
        }
        if (updateOffset) {
            utils_hooks__hooks.updateOffset(mom, days || months);
        }
    }

    var add_subtract__add = createAdder(1, 'add');
    var add_subtract__subtract = createAdder(-1, 'subtract');

    function moment_calendar__calendar(time, formats) {
        var now = time || local__createLocal(), sod = cloneWithOffset(now, this).startOf('day'),
            diff = this.diff(sod, 'days', true),
            format = diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
        var output = formats && (isFunction(formats[format]) ? formats[format]() : formats[format]);
        return this.format(output || this.localeData().calendar(format, this, local__createLocal(now)));
    }

    function clone() {
        return new Moment(this);
    }

    function isAfter(input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this > +localInput;
        } else {
            return +localInput < +this.clone().startOf(units);
        }
    }

    function isBefore(input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input);
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(!isUndefined(units) ? units : 'millisecond');
        if (units === 'millisecond') {
            return +this < +localInput;
        } else {
            return +this.clone().endOf(units) < +localInput;
        }
    }

    function isBetween(from, to, units) {
        return this.isAfter(from, units) && this.isBefore(to, units);
    }

    function isSame(input, units) {
        var localInput = isMoment(input) ? input : local__createLocal(input), inputMs;
        if (!(this.isValid() && localInput.isValid())) {
            return false;
        }
        units = normalizeUnits(units || 'millisecond');
        if (units === 'millisecond') {
            return +this === +localInput;
        } else {
            inputMs = +localInput;
            return +(this.clone().startOf(units)) <= inputMs && inputMs <= +(this.clone().endOf(units));
        }
    }

    function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
    }

    function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
    }

    function diff(input, units, asFloat) {
        var that, zoneDelta, delta, output;
        if (!this.isValid()) {
            return NaN;
        }
        that = cloneWithOffset(input, this);
        if (!that.isValid()) {
            return NaN;
        }
        zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
        units = normalizeUnits(units);
        if (units === 'year' || units === 'month' || units === 'quarter') {
            output = monthDiff(this, that);
            if (units === 'quarter') {
                output = output / 3;
            } else if (units === 'year') {
                output = output / 12;
            }
        } else {
            delta = this - that;
            output = units === 'second' ? delta / 1e3 : units === 'minute' ? delta / 6e4 : units === 'hour' ? delta / 36e5 : units === 'day' ? (delta - zoneDelta) / 864e5 : units === 'week' ? (delta - zoneDelta) / 6048e5 : delta;
        }
        return asFloat ? output : absFloor(output);
    }

    function monthDiff(a, b) {
        var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
            anchor = a.clone().add(wholeMonthDiff, 'months'), anchor2, adjust;
        if (b - anchor < 0) {
            anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
            adjust = (b - anchor) / (anchor - anchor2);
        } else {
            anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
            adjust = (b - anchor) / (anchor2 - anchor);
        }
        return -(wholeMonthDiff + adjust);
    }

    utils_hooks__hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';

    function toString() {
        return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
    }

    function moment_format__toISOString() {
        var m = this.clone().utc();
        if (0 < m.year() && m.year() <= 9999) {
            if (isFunction(Date.prototype.toISOString)) {
                return this.toDate().toISOString();
            } else {
                return formatMoment(m, 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
            }
        } else {
            return formatMoment(m, 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
        }
    }

    function format(inputString) {
        var output = formatMoment(this, inputString || utils_hooks__hooks.defaultFormat);
        return this.localeData().postformat(output);
    }

    function from(time, withoutSuffix) {
        if (this.isValid() && ((isMoment(time) && time.isValid()) || local__createLocal(time).isValid())) {
            return create__createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function fromNow(withoutSuffix) {
        return this.from(local__createLocal(), withoutSuffix);
    }

    function to(time, withoutSuffix) {
        if (this.isValid() && ((isMoment(time) && time.isValid()) || local__createLocal(time).isValid())) {
            return create__createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
        } else {
            return this.localeData().invalidDate();
        }
    }

    function toNow(withoutSuffix) {
        return this.to(local__createLocal(), withoutSuffix);
    }

    function locale(key) {
        var newLocaleData;
        if (key === undefined) {
            return this._locale._abbr;
        } else {
            newLocaleData = locale_locales__getLocale(key);
            if (newLocaleData != null) {
                this._locale = newLocaleData;
            }
            return this;
        }
    }

    var lang = deprecate('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
        if (key === undefined) {
            return this.localeData();
        } else {
            return this.locale(key);
        }
    });

    function localeData() {
        return this._locale;
    }

    function startOf(units) {
        units = normalizeUnits(units);
        switch (units) {
            case'year':
                this.month(0);
            case'quarter':
            case'month':
                this.date(1);
            case'week':
            case'isoWeek':
            case'day':
                this.hours(0);
            case'hour':
                this.minutes(0);
            case'minute':
                this.seconds(0);
            case'second':
                this.milliseconds(0);
        }
        if (units === 'week') {
            this.weekday(0);
        }
        if (units === 'isoWeek') {
            this.isoWeekday(1);
        }
        if (units === 'quarter') {
            this.month(Math.floor(this.month() / 3) * 3);
        }
        return this;
    }

    function endOf(units) {
        units = normalizeUnits(units);
        if (units === undefined || units === 'millisecond') {
            return this;
        }
        return this.startOf(units).add(1, (units === 'isoWeek' ? 'week' : units)).subtract(1, 'ms');
    }

    function to_type__valueOf() {
        return +this._d - ((this._offset || 0) * 60000);
    }

    function unix() {
        return Math.floor(+this / 1000);
    }

    function toDate() {
        return this._offset ? new Date(+this) : this._d;
    }

    function toArray() {
        var m = this;
        return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
    }

    function toObject() {
        var m = this;
        return {
            years: m.year(),
            months: m.month(),
            date: m.date(),
            hours: m.hours(),
            minutes: m.minutes(),
            seconds: m.seconds(),
            milliseconds: m.milliseconds()
        };
    }

    function toJSON() {
        return this.isValid() ? this.toISOString() : 'null';
    }

    function moment_valid__isValid() {
        return valid__isValid(this);
    }

    function parsingFlags() {
        return extend({}, getParsingFlags(this));
    }

    function invalidAt() {
        return getParsingFlags(this).overflow;
    }

    function creationData() {
        return {input: this._i, format: this._f, locale: this._locale, isUTC: this._isUTC, strict: this._strict};
    }

    addFormatToken(0, ['gg', 2], 0, function () {
        return this.weekYear() % 100;
    });
    addFormatToken(0, ['GG', 2], 0, function () {
        return this.isoWeekYear() % 100;
    });

    function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [token, token.length], 0, getter);
    }

    addWeekYearFormatToken('gggg', 'weekYear');
    addWeekYearFormatToken('ggggg', 'weekYear');
    addWeekYearFormatToken('GGGG', 'isoWeekYear');
    addWeekYearFormatToken('GGGGG', 'isoWeekYear');
    addUnitAlias('weekYear', 'gg');
    addUnitAlias('isoWeekYear', 'GG');
    addRegexToken('G', matchSigned);
    addRegexToken('g', matchSigned);
    addRegexToken('GG', match1to2, match2);
    addRegexToken('gg', match1to2, match2);
    addRegexToken('GGGG', match1to4, match4);
    addRegexToken('gggg', match1to4, match4);
    addRegexToken('GGGGG', match1to6, match6);
    addRegexToken('ggggg', match1to6, match6);
    addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
    });
    addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
        week[token] = utils_hooks__hooks.parseTwoDigitYear(input);
    });

    function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }

    function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
    }

    function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
    }

    function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
    }

    function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (input == null) {
            return weekOfYear(this, dow, doy).year;
        } else {
            weeksTarget = weeksInYear(input, dow, doy);
            if (week > weeksTarget) {
                week = weeksTarget;
            }
            return setWeekAll.call(this, input, week, weekday, dow, doy);
        }
    }

    function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
            date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
    }

    addFormatToken('Q', 0, 'Qo', 'quarter');
    addUnitAlias('quarter', 'Q');
    addRegexToken('Q', match1);
    addParseToken('Q', function (input, array) {
        array[MONTH] = (toInt(input) - 1) * 3;
    });

    function getSetQuarter(input) {
        return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
    }

    addFormatToken('w', ['ww', 2], 'wo', 'week');
    addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');
    addUnitAlias('week', 'w');
    addUnitAlias('isoWeek', 'W');
    addRegexToken('w', match1to2);
    addRegexToken('ww', match1to2, match2);
    addRegexToken('W', match1to2);
    addRegexToken('WW', match1to2, match2);
    addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
    });

    function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
    }

    var defaultLocaleWeek = {dow: 0, doy: 6};

    function localeFirstDayOfWeek() {
        return this._week.dow;
    }

    function localeFirstDayOfYear() {
        return this._week.doy;
    }

    function getSetWeek(input) {
        var week = this.localeData().week(this);
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return input == null ? week : this.add((input - week) * 7, 'd');
    }

    addFormatToken('D', ['DD', 2], 'Do', 'date');
    addUnitAlias('date', 'D');
    addRegexToken('D', match1to2);
    addRegexToken('DD', match1to2, match2);
    addRegexToken('Do', function (isStrict, locale) {
        return isStrict ? locale._ordinalParse : locale._ordinalParseLenient;
    });
    addParseToken(['D', 'DD'], DATE);
    addParseToken('Do', function (input, array) {
        array[DATE] = toInt(input.match(match1to2)[0], 10);
    });
    var getSetDayOfMonth = makeGetSet('Date', true);
    addFormatToken('d', 0, 'do', 'day');
    addFormatToken('dd', 0, 0, function (format) {
        return this.localeData().weekdaysMin(this, format);
    });
    addFormatToken('ddd', 0, 0, function (format) {
        return this.localeData().weekdaysShort(this, format);
    });
    addFormatToken('dddd', 0, 0, function (format) {
        return this.localeData().weekdays(this, format);
    });
    addFormatToken('e', 0, 0, 'weekday');
    addFormatToken('E', 0, 0, 'isoWeekday');
    addUnitAlias('day', 'd');
    addUnitAlias('weekday', 'e');
    addUnitAlias('isoWeekday', 'E');
    addRegexToken('d', match1to2);
    addRegexToken('e', match1to2);
    addRegexToken('E', match1to2);
    addRegexToken('dd', matchWord);
    addRegexToken('ddd', matchWord);
    addRegexToken('dddd', matchWord);
    addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        if (weekday != null) {
            week.d = weekday;
        } else {
            getParsingFlags(config).invalidWeekday = input;
        }
    });
    addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
        week[token] = toInt(input);
    });

    function parseWeekday(input, locale) {
        if (typeof input !== 'string') {
            return input;
        }
        if (!isNaN(input)) {
            return parseInt(input, 10);
        }
        input = locale.weekdaysParse(input);
        if (typeof input === 'number') {
            return input;
        }
        return null;
    }

    var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');

    function localeWeekdays(m, format) {
        return isArray(this._weekdays) ? this._weekdays[m.day()] : this._weekdays[this._weekdays.isFormat.test(format) ? 'format' : 'standalone'][m.day()];
    }

    var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');

    function localeWeekdaysShort(m) {
        return this._weekdaysShort[m.day()];
    }

    var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');

    function localeWeekdaysMin(m) {
        return this._weekdaysMin[m.day()];
    }

    function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }
        for (i = 0; i < 7; i++) {
            mom = local__createLocal([2000, 1]).day(i);
            if (strict && !this._fullWeekdaysParse[i]) {
                this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\.?') + '$', 'i');
                this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\.?') + '$', 'i');
                this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\.?') + '$', 'i');
            }
            if (!this._weekdaysParse[i]) {
                regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
            }
            if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                return i;
            } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                return i;
            }
        }
    }

    function getSetDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (input != null) {
            input = parseWeekday(input, this.localeData());
            return this.add(input - day, 'd');
        } else {
            return day;
        }
    }

    function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return input == null ? weekday : this.add(input - weekday, 'd');
    }

    function getSetISODayOfWeek(input) {
        if (!this.isValid()) {
            return input != null ? this : NaN;
        }
        return input == null ? this.day() || 7 : this.day(this.day() % 7 ? input : input - 7);
    }

    addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');
    addUnitAlias('dayOfYear', 'DDD');
    addRegexToken('DDD', match1to3);
    addRegexToken('DDDD', match3);
    addParseToken(['DDD', 'DDDD'], function (input, array, config) {
        config._dayOfYear = toInt(input);
    });

    function getSetDayOfYear(input) {
        var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
        return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
    }

    function hFormat() {
        return this.hours() % 12 || 12;
    }

    addFormatToken('H', ['HH', 2], 0, 'hour');
    addFormatToken('h', ['hh', 2], 0, hFormat);
    addFormatToken('hmm', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
    });
    addFormatToken('hmmss', 0, 0, function () {
        return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });
    addFormatToken('Hmm', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2);
    });
    addFormatToken('Hmmss', 0, 0, function () {
        return '' + this.hours() + zeroFill(this.minutes(), 2) +
            zeroFill(this.seconds(), 2);
    });

    function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function () {
            return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
    }

    meridiem('a', true);
    meridiem('A', false);
    addUnitAlias('hour', 'h');

    function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
    }

    addRegexToken('a', matchMeridiem);
    addRegexToken('A', matchMeridiem);
    addRegexToken('H', match1to2);
    addRegexToken('h', match1to2);
    addRegexToken('HH', match1to2, match2);
    addRegexToken('hh', match1to2, match2);
    addRegexToken('hmm', match3to4);
    addRegexToken('hmmss', match5to6);
    addRegexToken('Hmm', match3to4);
    addRegexToken('Hmmss', match5to6);
    addParseToken(['H', 'HH'], HOUR);
    addParseToken(['a', 'A'], function (input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
    });
    addParseToken(['h', 'hh'], function (input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
    });
    addParseToken('Hmm', function (input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
    });
    addParseToken('Hmmss', function (input, array, config) {
        var pos1 = input.length - 4;
        var pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
    });

    function localeIsPM(input) {
        return ((input + '').toLowerCase().charAt(0) === 'p');
    }

    var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;

    function localeMeridiem(hours, minutes, isLower) {
        if (hours > 11) {
            return isLower ? 'pm' : 'PM';
        } else {
            return isLower ? 'am' : 'AM';
        }
    }

    var getSetHour = makeGetSet('Hours', true);
    addFormatToken('m', ['mm', 2], 0, 'minute');
    addUnitAlias('minute', 'm');
    addRegexToken('m', match1to2);
    addRegexToken('mm', match1to2, match2);
    addParseToken(['m', 'mm'], MINUTE);
    var getSetMinute = makeGetSet('Minutes', false);
    addFormatToken('s', ['ss', 2], 0, 'second');
    addUnitAlias('second', 's');
    addRegexToken('s', match1to2);
    addRegexToken('ss', match1to2, match2);
    addParseToken(['s', 'ss'], SECOND);
    var getSetSecond = makeGetSet('Seconds', false);
    addFormatToken('S', 0, 0, function () {
        return ~~(this.millisecond() / 100);
    });
    addFormatToken(0, ['SS', 2], 0, function () {
        return ~~(this.millisecond() / 10);
    });
    addFormatToken(0, ['SSS', 3], 0, 'millisecond');
    addFormatToken(0, ['SSSS', 4], 0, function () {
        return this.millisecond() * 10;
    });
    addFormatToken(0, ['SSSSS', 5], 0, function () {
        return this.millisecond() * 100;
    });
    addFormatToken(0, ['SSSSSS', 6], 0, function () {
        return this.millisecond() * 1000;
    });
    addFormatToken(0, ['SSSSSSS', 7], 0, function () {
        return this.millisecond() * 10000;
    });
    addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
        return this.millisecond() * 100000;
    });
    addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
        return this.millisecond() * 1000000;
    });
    addUnitAlias('millisecond', 'ms');
    addRegexToken('S', match1to3, match1);
    addRegexToken('SS', match1to3, match2);
    addRegexToken('SSS', match1to3, match3);
    var token;
    for (token = 'SSSS'; token.length <= 9; token += 'S') {
        addRegexToken(token, matchUnsigned);
    }

    function parseMs(input, array) {
        array[MILLISECOND] = toInt(('0.' + input) * 1000);
    }

    for (token = 'S'; token.length <= 9; token += 'S') {
        addParseToken(token, parseMs);
    }
    var getSetMillisecond = makeGetSet('Milliseconds', false);
    addFormatToken('z', 0, 0, 'zoneAbbr');
    addFormatToken('zz', 0, 0, 'zoneName');

    function getZoneAbbr() {
        return this._isUTC ? 'UTC' : '';
    }

    function getZoneName() {
        return this._isUTC ? 'Coordinated Universal Time' : '';
    }

    var momentPrototype__proto = Moment.prototype;
    momentPrototype__proto.add = add_subtract__add;
    momentPrototype__proto.calendar = moment_calendar__calendar;
    momentPrototype__proto.clone = clone;
    momentPrototype__proto.diff = diff;
    momentPrototype__proto.endOf = endOf;
    momentPrototype__proto.format = format;
    momentPrototype__proto.from = from;
    momentPrototype__proto.fromNow = fromNow;
    momentPrototype__proto.to = to;
    momentPrototype__proto.toNow = toNow;
    momentPrototype__proto.get = getSet;
    momentPrototype__proto.invalidAt = invalidAt;
    momentPrototype__proto.isAfter = isAfter;
    momentPrototype__proto.isBefore = isBefore;
    momentPrototype__proto.isBetween = isBetween;
    momentPrototype__proto.isSame = isSame;
    momentPrototype__proto.isSameOrAfter = isSameOrAfter;
    momentPrototype__proto.isSameOrBefore = isSameOrBefore;
    momentPrototype__proto.isValid = moment_valid__isValid;
    momentPrototype__proto.lang = lang;
    momentPrototype__proto.locale = locale;
    momentPrototype__proto.localeData = localeData;
    momentPrototype__proto.max = prototypeMax;
    momentPrototype__proto.min = prototypeMin;
    momentPrototype__proto.parsingFlags = parsingFlags;
    momentPrototype__proto.set = getSet;
    momentPrototype__proto.startOf = startOf;
    momentPrototype__proto.subtract = add_subtract__subtract;
    momentPrototype__proto.toArray = toArray;
    momentPrototype__proto.toObject = toObject;
    momentPrototype__proto.toDate = toDate;
    momentPrototype__proto.toISOString = moment_format__toISOString;
    momentPrototype__proto.toJSON = toJSON;
    momentPrototype__proto.toString = toString;
    momentPrototype__proto.unix = unix;
    momentPrototype__proto.valueOf = to_type__valueOf;
    momentPrototype__proto.creationData = creationData;
    momentPrototype__proto.year = getSetYear;
    momentPrototype__proto.isLeapYear = getIsLeapYear;
    momentPrototype__proto.weekYear = getSetWeekYear;
    momentPrototype__proto.isoWeekYear = getSetISOWeekYear;
    momentPrototype__proto.quarter = momentPrototype__proto.quarters = getSetQuarter;
    momentPrototype__proto.month = getSetMonth;
    momentPrototype__proto.daysInMonth = getDaysInMonth;
    momentPrototype__proto.week = momentPrototype__proto.weeks = getSetWeek;
    momentPrototype__proto.isoWeek = momentPrototype__proto.isoWeeks = getSetISOWeek;
    momentPrototype__proto.weeksInYear = getWeeksInYear;
    momentPrototype__proto.isoWeeksInYear = getISOWeeksInYear;
    momentPrototype__proto.date = getSetDayOfMonth;
    momentPrototype__proto.day = momentPrototype__proto.days = getSetDayOfWeek;
    momentPrototype__proto.weekday = getSetLocaleDayOfWeek;
    momentPrototype__proto.isoWeekday = getSetISODayOfWeek;
    momentPrototype__proto.dayOfYear = getSetDayOfYear;
    momentPrototype__proto.hour = momentPrototype__proto.hours = getSetHour;
    momentPrototype__proto.minute = momentPrototype__proto.minutes = getSetMinute;
    momentPrototype__proto.second = momentPrototype__proto.seconds = getSetSecond;
    momentPrototype__proto.millisecond = momentPrototype__proto.milliseconds = getSetMillisecond;
    momentPrototype__proto.utcOffset = getSetOffset;
    momentPrototype__proto.utc = setOffsetToUTC;
    momentPrototype__proto.local = setOffsetToLocal;
    momentPrototype__proto.parseZone = setOffsetToParsedOffset;
    momentPrototype__proto.hasAlignedHourOffset = hasAlignedHourOffset;
    momentPrototype__proto.isDST = isDaylightSavingTime;
    momentPrototype__proto.isDSTShifted = isDaylightSavingTimeShifted;
    momentPrototype__proto.isLocal = isLocal;
    momentPrototype__proto.isUtcOffset = isUtcOffset;
    momentPrototype__proto.isUtc = isUtc;
    momentPrototype__proto.isUTC = isUtc;
    momentPrototype__proto.zoneAbbr = getZoneAbbr;
    momentPrototype__proto.zoneName = getZoneName;
    momentPrototype__proto.dates = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
    momentPrototype__proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
    momentPrototype__proto.years = deprecate('years accessor is deprecated. Use year instead', getSetYear);
    momentPrototype__proto.zone = deprecate('moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779', getSetZone);
    var momentPrototype = momentPrototype__proto;

    function moment__createUnix(input) {
        return local__createLocal(input * 1000);
    }

    function moment__createInZone() {
        return local__createLocal.apply(null, arguments).parseZone();
    }

    var defaultCalendar = {
        sameDay: '[Today at] LT',
        nextDay: '[Tomorrow at] LT',
        nextWeek: 'dddd [at] LT',
        lastDay: '[Yesterday at] LT',
        lastWeek: '[Last] dddd [at] LT',
        sameElse: 'L'
    };

    function locale_calendar__calendar(key, mom, now) {
        var output = this._calendar[key];
        return isFunction(output) ? output.call(mom, now) : output;
    }

    var defaultLongDateFormat = {
        LTS: 'h:mm:ss A',
        LT: 'h:mm A',
        L: 'MM/DD/YYYY',
        LL: 'MMMM D, YYYY',
        LLL: 'MMMM D, YYYY h:mm A',
        LLLL: 'dddd, MMMM D, YYYY h:mm A'
    };

    function longDateFormat(key) {
        var format = this._longDateFormat[key], formatUpper = this._longDateFormat[key.toUpperCase()];
        if (format || !formatUpper) {
            return format;
        }
        this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
            return val.slice(1);
        });
        return this._longDateFormat[key];
    }

    var defaultInvalidDate = 'Invalid date';

    function invalidDate() {
        return this._invalidDate;
    }

    var defaultOrdinal = '%d';
    var defaultOrdinalParse = /\d{1,2}/;

    function ordinal(number) {
        return this._ordinal.replace('%d', number);
    }

    function preParsePostFormat(string) {
        return string;
    }

    var defaultRelativeTime = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
    };

    function relative__relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return (isFunction(output)) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
    }

    function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
    }

    function locale_set__set(config) {
        var prop, i;
        for (i in config) {
            prop = config[i];
            if (isFunction(prop)) {
                this[i] = prop;
            } else {
                this['_' + i] = prop;
            }
        }
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + '|' + (/\d{1,2}/).source);
    }

    var prototype__proto = Locale.prototype;
    prototype__proto._calendar = defaultCalendar;
    prototype__proto.calendar = locale_calendar__calendar;
    prototype__proto._longDateFormat = defaultLongDateFormat;
    prototype__proto.longDateFormat = longDateFormat;
    prototype__proto._invalidDate = defaultInvalidDate;
    prototype__proto.invalidDate = invalidDate;
    prototype__proto._ordinal = defaultOrdinal;
    prototype__proto.ordinal = ordinal;
    prototype__proto._ordinalParse = defaultOrdinalParse;
    prototype__proto.preparse = preParsePostFormat;
    prototype__proto.postformat = preParsePostFormat;
    prototype__proto._relativeTime = defaultRelativeTime;
    prototype__proto.relativeTime = relative__relativeTime;
    prototype__proto.pastFuture = pastFuture;
    prototype__proto.set = locale_set__set;
    prototype__proto.months = localeMonths;
    prototype__proto._months = defaultLocaleMonths;
    prototype__proto.monthsShort = localeMonthsShort;
    prototype__proto._monthsShort = defaultLocaleMonthsShort;
    prototype__proto.monthsParse = localeMonthsParse;
    prototype__proto.week = localeWeek;
    prototype__proto._week = defaultLocaleWeek;
    prototype__proto.firstDayOfYear = localeFirstDayOfYear;
    prototype__proto.firstDayOfWeek = localeFirstDayOfWeek;
    prototype__proto.weekdays = localeWeekdays;
    prototype__proto._weekdays = defaultLocaleWeekdays;
    prototype__proto.weekdaysMin = localeWeekdaysMin;
    prototype__proto._weekdaysMin = defaultLocaleWeekdaysMin;
    prototype__proto.weekdaysShort = localeWeekdaysShort;
    prototype__proto._weekdaysShort = defaultLocaleWeekdaysShort;
    prototype__proto.weekdaysParse = localeWeekdaysParse;
    prototype__proto.isPM = localeIsPM;
    prototype__proto._meridiemParse = defaultLocaleMeridiemParse;
    prototype__proto.meridiem = localeMeridiem;

    function lists__get(format, index, field, setter) {
        var locale = locale_locales__getLocale();
        var utc = create_utc__createUTC().set(setter, index);
        return locale[field](utc, format);
    }

    function list(format, index, field, count, setter) {
        if (typeof format === 'number') {
            index = format;
            format = undefined;
        }
        format = format || '';
        if (index != null) {
            return lists__get(format, index, field, setter);
        }
        var i;
        var out = [];
        for (i = 0; i < count; i++) {
            out[i] = lists__get(format, i, field, setter);
        }
        return out;
    }

    function lists__listMonths(format, index) {
        return list(format, index, 'months', 12, 'month');
    }

    function lists__listMonthsShort(format, index) {
        return list(format, index, 'monthsShort', 12, 'month');
    }

    function lists__listWeekdays(format, index) {
        return list(format, index, 'weekdays', 7, 'day');
    }

    function lists__listWeekdaysShort(format, index) {
        return list(format, index, 'weekdaysShort', 7, 'day');
    }

    function lists__listWeekdaysMin(format, index) {
        return list(format, index, 'weekdaysMin', 7, 'day');
    }

    locale_locales__getSetGlobalLocale('en', {
        monthsParse: [/^jan/i, /^feb/i, /^mar/i, /^apr/i, /^may/i, /^jun/i, /^jul/i, /^aug/i, /^sep/i, /^oct/i, /^nov/i, /^dec/i],
        longMonthsParse: [/^january$/i, /^february$/i, /^march$/i, /^april$/i, /^may$/i, /^june$/i, /^july$/i, /^august$/i, /^september$/i, /^october$/i, /^november$/i, /^december$/i],
        shortMonthsParse: [/^jan$/i, /^feb$/i, /^mar$/i, /^apr$/i, /^may$/i, /^jun$/i, /^jul$/i, /^aug/i, /^sept?$/i, /^oct$/i, /^nov$/i, /^dec$/i],
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function (number) {
            var b = number % 10,
                output = (toInt(number % 100 / 10) === 1) ? 'th' : (b === 1) ? 'st' : (b === 2) ? 'nd' : (b === 3) ? 'rd' : 'th';
            return number + output;
        }
    });
    utils_hooks__hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', locale_locales__getSetGlobalLocale);
    utils_hooks__hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', locale_locales__getLocale);
    var mathAbs = Math.abs;

    function duration_abs__abs() {
        var data = this._data;
        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);
        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);
        return this;
    }

    function duration_add_subtract__addSubtract(duration, input, value, direction) {
        var other = create__createDuration(input, value);
        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;
        return duration._bubble();
    }

    function duration_add_subtract__add(input, value) {
        return duration_add_subtract__addSubtract(this, input, value, 1);
    }

    function duration_add_subtract__subtract(input, value) {
        return duration_add_subtract__addSubtract(this, input, value, -1);
    }

    function absCeil(number) {
        if (number < 0) {
            return Math.floor(number);
        } else {
            return Math.ceil(number);
        }
    }

    function bubble() {
        var milliseconds = this._milliseconds;
        var days = this._days;
        var months = this._months;
        var data = this._data;
        var seconds, minutes, hours, years, monthsFromDays;
        if (!((milliseconds >= 0 && days >= 0 && months >= 0) || (milliseconds <= 0 && days <= 0 && months <= 0))) {
            milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
            days = 0;
            months = 0;
        }
        data.milliseconds = milliseconds % 1000;
        seconds = absFloor(milliseconds / 1000);
        data.seconds = seconds % 60;
        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;
        hours = absFloor(minutes / 60);
        data.hours = hours % 24;
        days += absFloor(hours / 24);
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));
        years = absFloor(months / 12);
        months %= 12;
        data.days = days;
        data.months = months;
        data.years = years;
        return this;
    }

    function daysToMonths(days) {
        return days * 4800 / 146097;
    }

    function monthsToDays(months) {
        return months * 146097 / 4800;
    }

    function as(units) {
        var days;
        var months;
        var milliseconds = this._milliseconds;
        units = normalizeUnits(units);
        if (units === 'month' || units === 'year') {
            days = this._days + milliseconds / 864e5;
            months = this._months + daysToMonths(days);
            return units === 'month' ? months : months / 12;
        } else {
            days = this._days + Math.round(monthsToDays(this._months));
            switch (units) {
                case'week':
                    return days / 7 + milliseconds / 6048e5;
                case'day':
                    return days + milliseconds / 864e5;
                case'hour':
                    return days * 24 + milliseconds / 36e5;
                case'minute':
                    return days * 1440 + milliseconds / 6e4;
                case'second':
                    return days * 86400 + milliseconds / 1000;
                case'millisecond':
                    return Math.floor(days * 864e5) + milliseconds;
                default:
                    throw new Error('Unknown unit ' + units);
            }
        }
    }

    function duration_as__valueOf() {
        return (this._milliseconds +
            this._days * 864e5 +
            (this._months % 12) * 2592e6 +
            toInt(this._months / 12) * 31536e6);
    }

    function makeAs(alias) {
        return function () {
            return this.as(alias);
        };
    }

    var asMilliseconds = makeAs('ms');
    var asSeconds = makeAs('s');
    var asMinutes = makeAs('m');
    var asHours = makeAs('h');
    var asDays = makeAs('d');
    var asWeeks = makeAs('w');
    var asMonths = makeAs('M');
    var asYears = makeAs('y');

    function duration_get__get(units) {
        units = normalizeUnits(units);
        return this[units + 's']();
    }

    function makeGetter(name) {
        return function () {
            return this._data[name];
        };
    }

    var milliseconds = makeGetter('milliseconds');
    var seconds = makeGetter('seconds');
    var minutes = makeGetter('minutes');
    var hours = makeGetter('hours');
    var days = makeGetter('days');
    var months = makeGetter('months');
    var years = makeGetter('years');

    function weeks() {
        return absFloor(this.days() / 7);
    }

    var round = Math.round;
    var thresholds = {s: 45, m: 45, h: 22, d: 26, M: 11};

    function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }

    function duration_humanize__relativeTime(posNegDuration, withoutSuffix, locale) {
        var duration = create__createDuration(posNegDuration).abs();
        var seconds = round(duration.as('s'));
        var minutes = round(duration.as('m'));
        var hours = round(duration.as('h'));
        var days = round(duration.as('d'));
        var months = round(duration.as('M'));
        var years = round(duration.as('y'));
        var a = seconds < thresholds.s && ['s', seconds] || minutes <= 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours <= 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days <= 1 && ['d'] || days < thresholds.d && ['dd', days] || months <= 1 && ['M'] || months < thresholds.M && ['MM', months] || years <= 1 && ['y'] || ['yy', years];
        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
    }

    function duration_humanize__getSetRelativeTimeThreshold(threshold, limit) {
        if (thresholds[threshold] === undefined) {
            return false;
        }
        if (limit === undefined) {
            return thresholds[threshold];
        }
        thresholds[threshold] = limit;
        return true;
    }

    function humanize(withSuffix) {
        var locale = this.localeData();
        var output = duration_humanize__relativeTime(this, !withSuffix, locale);
        if (withSuffix) {
            output = locale.pastFuture(+this, output);
        }
        return locale.postformat(output);
    }

    var iso_string__abs = Math.abs;

    function iso_string__toISOString() {
        var seconds = iso_string__abs(this._milliseconds) / 1000;
        var days = iso_string__abs(this._days);
        var months = iso_string__abs(this._months);
        var minutes, hours, years;
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;
        years = absFloor(months / 12);
        months %= 12;
        var Y = years;
        var M = months;
        var D = days;
        var h = hours;
        var m = minutes;
        var s = seconds;
        var total = this.asSeconds();
        if (!total) {
            return 'P0D';
        }
        return (total < 0 ? '-' : '') + 'P' +
            (Y ? Y + 'Y' : '') +
            (M ? M + 'M' : '') +
            (D ? D + 'D' : '') +
            ((h || m || s) ? 'T' : '') +
            (h ? h + 'H' : '') +
            (m ? m + 'M' : '') +
            (s ? s + 'S' : '');
    }

    var duration_prototype__proto = Duration.prototype;
    duration_prototype__proto.abs = duration_abs__abs;
    duration_prototype__proto.add = duration_add_subtract__add;
    duration_prototype__proto.subtract = duration_add_subtract__subtract;
    duration_prototype__proto.as = as;
    duration_prototype__proto.asMilliseconds = asMilliseconds;
    duration_prototype__proto.asSeconds = asSeconds;
    duration_prototype__proto.asMinutes = asMinutes;
    duration_prototype__proto.asHours = asHours;
    duration_prototype__proto.asDays = asDays;
    duration_prototype__proto.asWeeks = asWeeks;
    duration_prototype__proto.asMonths = asMonths;
    duration_prototype__proto.asYears = asYears;
    duration_prototype__proto.valueOf = duration_as__valueOf;
    duration_prototype__proto._bubble = bubble;
    duration_prototype__proto.get = duration_get__get;
    duration_prototype__proto.milliseconds = milliseconds;
    duration_prototype__proto.seconds = seconds;
    duration_prototype__proto.minutes = minutes;
    duration_prototype__proto.hours = hours;
    duration_prototype__proto.days = days;
    duration_prototype__proto.weeks = weeks;
    duration_prototype__proto.months = months;
    duration_prototype__proto.years = years;
    duration_prototype__proto.humanize = humanize;
    duration_prototype__proto.toISOString = iso_string__toISOString;
    duration_prototype__proto.toString = iso_string__toISOString;
    duration_prototype__proto.toJSON = iso_string__toISOString;
    duration_prototype__proto.locale = locale;
    duration_prototype__proto.localeData = localeData;
    duration_prototype__proto.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', iso_string__toISOString);
    duration_prototype__proto.lang = lang;
    addFormatToken('X', 0, 0, 'unix');
    addFormatToken('x', 0, 0, 'valueOf');
    addRegexToken('x', matchSigned);
    addRegexToken('X', matchTimestamp);
    addParseToken('X', function (input, array, config) {
        config._d = new Date(parseFloat(input, 10) * 1000);
    });
    addParseToken('x', function (input, array, config) {
        config._d = new Date(toInt(input));
    });
    utils_hooks__hooks.version = '2.11.0';
    setHookCallback(local__createLocal);
    utils_hooks__hooks.fn = momentPrototype;
    utils_hooks__hooks.min = min;
    utils_hooks__hooks.max = max;
    utils_hooks__hooks.now = now;
    utils_hooks__hooks.utc = create_utc__createUTC;
    utils_hooks__hooks.unix = moment__createUnix;
    utils_hooks__hooks.months = lists__listMonths;
    utils_hooks__hooks.isDate = isDate;
    utils_hooks__hooks.locale = locale_locales__getSetGlobalLocale;
    utils_hooks__hooks.invalid = valid__createInvalid;
    utils_hooks__hooks.duration = create__createDuration;
    utils_hooks__hooks.isMoment = isMoment;
    utils_hooks__hooks.weekdays = lists__listWeekdays;
    utils_hooks__hooks.parseZone = moment__createInZone;
    utils_hooks__hooks.localeData = locale_locales__getLocale;
    utils_hooks__hooks.isDuration = isDuration;
    utils_hooks__hooks.monthsShort = lists__listMonthsShort;
    utils_hooks__hooks.weekdaysMin = lists__listWeekdaysMin;
    utils_hooks__hooks.defineLocale = defineLocale;
    utils_hooks__hooks.weekdaysShort = lists__listWeekdaysShort;
    utils_hooks__hooks.normalizeUnits = normalizeUnits;
    utils_hooks__hooks.relativeTimeThreshold = duration_humanize__getSetRelativeTimeThreshold;
    utils_hooks__hooks.prototype = momentPrototype;
    var _moment = utils_hooks__hooks;
    return _moment;
}));
!function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define([], e) : "object" == typeof exports ? exports.io = e() : t.io = e()
}(this, function () {
    return function (t) {
        function e(n) {
            if (r[n]) return r[n].exports;
            var o = r[n] = {exports: {}, id: n, loaded: !1};
            return t[n].call(o.exports, o, o.exports, e), o.loaded = !0, o.exports
        }

        var r = {};
        return e.m = t, e.c = r, e.p = "", e(0)
    }([function (t, e, r) {
        "use strict";

        function n(t, e) {
            "object" === ("undefined" == typeof t ? "undefined" : i(t)) && (e = t, t = void 0), e = e || {};
            var r, n = s(t), a = n.source, u = n.id, f = n.path, l = h[u] && f in h[u].nsps,
                d = e.forceNew || e["force new connection"] || !1 === e.multiplex || l;
            return d ? (p("ignoring socket cache for %s", a), r = c(a, e)) : (h[u] || (p("new io instance for %s", a), h[u] = c(a, e)), r = h[u]), n.query && !e.query ? e.query = n.query : e && "object" === i(e.query) && (e.query = o(e.query)), r.socket(n.path, e)
        }

        function o(t) {
            var e = [];
            for (var r in t) t.hasOwnProperty(r) && e.push(encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
            return e.join("&")
        }

        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        }, s = r(1), a = r(6), c = r(13), p = r(3)("socket.io-client");
        t.exports = e = n;
        var h = e.managers = {};
        e.protocol = a.protocol, e.connect = n, e.Manager = r(13), e.Socket = r(40)
    }, function (t, e, r) {
        (function (e) {
            "use strict";

            function n(t, r) {
                var n = t;
                r = r || e.location, null == t && (t = r.protocol + "//" + r.host), "string" == typeof t && ("/" === t.charAt(0) && (t = "/" === t.charAt(1) ? r.protocol + t : r.host + t), /^(https?|wss?):\/\//.test(t) || (i("protocol-less url %s", t), t = "undefined" != typeof r ? r.protocol + "//" + t : "https://" + t), i("parse %s", t), n = o(t)), n.port || (/^(http|ws)$/.test(n.protocol) ? n.port = "80" : /^(http|ws)s$/.test(n.protocol) && (n.port = "443")), n.path = n.path || "/";
                var s = n.host.indexOf(":") !== -1, a = s ? "[" + n.host + "]" : n.host;
                return n.id = n.protocol + "://" + a + ":" + n.port, n.href = n.protocol + "://" + a + (r && r.port === n.port ? "" : ":" + n.port), n
            }

            var o = r(2), i = r(3)("socket.io-client:url");
            t.exports = n
        }).call(e, function () {
            return this
        }())
    }, function (t, e) {
        var r = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
            n = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
        t.exports = function (t) {
            var e = t, o = t.indexOf("["), i = t.indexOf("]");
            o != -1 && i != -1 && (t = t.substring(0, o) + t.substring(o, i).replace(/:/g, ";") + t.substring(i, t.length));
            for (var s = r.exec(t || ""), a = {}, c = 14; c--;) a[n[c]] = s[c] || "";
            return o != -1 && i != -1 && (a.source = e, a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"), a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), a.ipv6uri = !0), a
        }
    }, function (t, e, r) {
        function n() {
            return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
        }

        function o() {
            var t = arguments, r = this.useColors;
            if (t[0] = (r ? "%c" : "") + this.namespace + (r ? " %c" : " ") + t[0] + (r ? "%c " : " ") + "+" + e.humanize(this.diff), !r) return t;
            var n = "color: " + this.color;
            t = [t[0], n, "color: inherit"].concat(Array.prototype.slice.call(t, 1));
            var o = 0, i = 0;
            return t[0].replace(/%[a-z%]/g, function (t) {
                "%%" !== t && (o++, "%c" === t && (i = o))
            }), t.splice(i, 0, n), t
        }

        function i() {
            return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
        }

        function s(t) {
            try {
                null == t ? e.storage.removeItem("debug") : e.storage.debug = t
            } catch (t) {
            }
        }

        function a() {
            var t;
            try {
                t = e.storage.debug
            } catch (t) {
            }
            return t
        }

        function c() {
            try {
                return window.localStorage
            } catch (t) {
            }
        }

        e = t.exports = r(4), e.log = i, e.formatArgs = o, e.save = s, e.load = a, e.useColors = n, e.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : c(), e.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], e.formatters.j = function (t) {
            return JSON.stringify(t)
        }, e.enable(a())
    }, function (t, e, r) {
        function n() {
            return e.colors[h++ % e.colors.length]
        }

        function o(t) {
            function r() {
            }

            function o() {
                var t = o, r = +new Date, i = r - (p || r);
                t.diff = i, t.prev = p, t.curr = r, p = r, null == t.useColors && (t.useColors = e.useColors()), null == t.color && t.useColors && (t.color = n());
                var s = Array.prototype.slice.call(arguments);
                s[0] = e.coerce(s[0]), "string" != typeof s[0] && (s = ["%o"].concat(s));
                var a = 0;
                s[0] = s[0].replace(/%([a-z%])/g, function (r, n) {
                    if ("%%" === r) return r;
                    a++;
                    var o = e.formatters[n];
                    if ("function" == typeof o) {
                        var i = s[a];
                        r = o.call(t, i), s.splice(a, 1), a--
                    }
                    return r
                }), "function" == typeof e.formatArgs && (s = e.formatArgs.apply(t, s));
                var c = o.log || e.log || console.log.bind(console);
                c.apply(t, s)
            }

            r.enabled = !1, o.enabled = !0;
            var i = e.enabled(t) ? o : r;
            return i.namespace = t, i
        }

        function i(t) {
            e.save(t);
            for (var r = (t || "").split(/[\s,]+/), n = r.length, o = 0; o < n; o++) r[o] && (t = r[o].replace(/\*/g, ".*?"), "-" === t[0] ? e.skips.push(new RegExp("^" + t.substr(1) + "$")) : e.names.push(new RegExp("^" + t + "$")))
        }

        function s() {
            e.enable("")
        }

        function a(t) {
            var r, n;
            for (r = 0, n = e.skips.length; r < n; r++) if (e.skips[r].test(t)) return !1;
            for (r = 0, n = e.names.length; r < n; r++) if (e.names[r].test(t)) return !0;
            return !1
        }

        function c(t) {
            return t instanceof Error ? t.stack || t.message : t
        }

        e = t.exports = o, e.coerce = c, e.disable = s, e.enable = i, e.enabled = a, e.humanize = r(5), e.names = [], e.skips = [], e.formatters = {};
        var p, h = 0
    }, function (t, e) {
        function r(t) {
            if (t = "" + t, !(t.length > 1e4)) {
                var e = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);
                if (e) {
                    var r = parseFloat(e[1]), n = (e[2] || "ms").toLowerCase();
                    switch (n) {
                        case"years":
                        case"year":
                        case"yrs":
                        case"yr":
                        case"y":
                            return r * h;
                        case"days":
                        case"day":
                        case"d":
                            return r * p;
                        case"hours":
                        case"hour":
                        case"hrs":
                        case"hr":
                        case"h":
                            return r * c;
                        case"minutes":
                        case"minute":
                        case"mins":
                        case"min":
                        case"m":
                            return r * a;
                        case"seconds":
                        case"second":
                        case"secs":
                        case"sec":
                        case"s":
                            return r * s;
                        case"milliseconds":
                        case"millisecond":
                        case"msecs":
                        case"msec":
                        case"ms":
                            return r
                    }
                }
            }
        }

        function n(t) {
            return t >= p ? Math.round(t / p) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= s ? Math.round(t / s) + "s" : t + "ms"
        }

        function o(t) {
            return i(t, p, "day") || i(t, c, "hour") || i(t, a, "minute") || i(t, s, "second") || t + " ms"
        }

        function i(t, e, r) {
            if (!(t < e)) return t < 1.5 * e ? Math.floor(t / e) + " " + r : Math.ceil(t / e) + " " + r + "s"
        }

        var s = 1e3, a = 60 * s, c = 60 * a, p = 24 * c, h = 365.25 * p;
        t.exports = function (t, e) {
            return e = e || {}, "string" == typeof t ? r(t) : e.long ? o(t) : n(t)
        }
    }, function (t, e, r) {
        function n() {
        }

        function o(t) {
            var r = "", n = !1;
            return r += t.type, e.BINARY_EVENT != t.type && e.BINARY_ACK != t.type || (r += t.attachments, r += "-"), t.nsp && "/" != t.nsp && (n = !0, r += t.nsp), null != t.id && (n && (r += ",", n = !1), r += t.id), null != t.data && (n && (r += ","), r += f.stringify(t.data)), u("encoded %j as %s", t, r), r
        }

        function i(t, e) {
            function r(t) {
                var r = d.deconstructPacket(t), n = o(r.packet), i = r.buffers;
                i.unshift(n), e(i)
            }

            d.removeBlobs(t, r)
        }

        function s() {
            this.reconstructor = null
        }

        function a(t) {
            var r = {}, n = 0;
            if (r.type = Number(t.charAt(0)), null == e.types[r.type]) return h();
            if (e.BINARY_EVENT == r.type || e.BINARY_ACK == r.type) {
                for (var o = ""; "-" != t.charAt(++n) && (o += t.charAt(n), n != t.length);) ;
                if (o != Number(o) || "-" != t.charAt(n)) throw new Error("Illegal attachments");
                r.attachments = Number(o)
            }
            if ("/" == t.charAt(n + 1)) for (r.nsp = ""; ++n;) {
                var i = t.charAt(n);
                if ("," == i) break;
                if (r.nsp += i, n == t.length) break
            } else r.nsp = "/";
            var s = t.charAt(n + 1);
            if ("" !== s && Number(s) == s) {
                for (r.id = ""; ++n;) {
                    var i = t.charAt(n);
                    if (null == i || Number(i) != i) {
                        --n;
                        break
                    }
                    if (r.id += t.charAt(n), n == t.length) break
                }
                r.id = Number(r.id)
            }
            return t.charAt(++n) && (r = c(r, t.substr(n))), u("decoded %s as %j", t, r), r
        }

        function c(t, e) {
            try {
                t.data = f.parse(e)
            } catch (t) {
                return h()
            }
            return t
        }

        function p(t) {
            this.reconPack = t, this.buffers = []
        }

        function h(t) {
            return {type: e.ERROR, data: "parser error"}
        }

        var u = r(3)("socket.io-parser"), f = r(7), l = r(9), d = r(10), y = r(12);
        e.protocol = 4, e.types = ["CONNECT", "DISCONNECT", "EVENT", "ACK", "ERROR", "BINARY_EVENT", "BINARY_ACK"], e.CONNECT = 0, e.DISCONNECT = 1, e.EVENT = 2, e.ACK = 3, e.ERROR = 4, e.BINARY_EVENT = 5, e.BINARY_ACK = 6, e.Encoder = n, e.Decoder = s, n.prototype.encode = function (t, r) {
            if (u("encoding packet %j", t), e.BINARY_EVENT == t.type || e.BINARY_ACK == t.type) i(t, r); else {
                var n = o(t);
                r([n])
            }
        }, l(s.prototype), s.prototype.add = function (t) {
            var r;
            if ("string" == typeof t) r = a(t), e.BINARY_EVENT == r.type || e.BINARY_ACK == r.type ? (this.reconstructor = new p(r), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", r)) : this.emit("decoded", r); else {
                if (!y(t) && !t.base64) throw new Error("Unknown type: " + t);
                if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                r = this.reconstructor.takeBinaryData(t), r && (this.reconstructor = null, this.emit("decoded", r))
            }
        }, s.prototype.destroy = function () {
            this.reconstructor && this.reconstructor.finishedReconstruction()
        }, p.prototype.takeBinaryData = function (t) {
            if (this.buffers.push(t), this.buffers.length == this.reconPack.attachments) {
                var e = d.reconstructPacket(this.reconPack, this.buffers);
                return this.finishedReconstruction(), e
            }
            return null
        }, p.prototype.finishedReconstruction = function () {
            this.reconPack = null, this.buffers = []
        }
    }, function (t, e, r) {
        (function (t, r) {
            var n = !1;
            (function () {
                function o(t, e) {
                    function r(t) {
                        if (r[t] !== g) return r[t];
                        var o;
                        if ("bug-string-char-index" == t) o = "a" != "a"[0]; else if ("json" == t) o = r("json-stringify") && r("json-parse"); else {
                            var s, a = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                            if ("json-stringify" == t) {
                                var c = e.stringify, h = "function" == typeof c && b;
                                if (h) {
                                    (s = function () {
                                        return 1
                                    }).toJSON = s;
                                    try {
                                        h = "0" === c(0) && "0" === c(new n) && '""' == c(new i) && c(v) === g && c(g) === g && c() === g && "1" === c(s) && "[1]" == c([s]) && "[null]" == c([g]) && "null" == c(null) && "[null,null,null]" == c([g, v, null]) && c({a: [s, !0, !1, null, "\0\b\n\f\r\t"]}) == a && "1" === c(null, s) && "[\n 1,\n 2\n]" == c([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == c(new p(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == c(new p(864e13)) && '"-000001-01-01T00:00:00.000Z"' == c(new p(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == c(new p(-1))
                                    } catch (t) {
                                        h = !1
                                    }
                                }
                                o = h
                            }
                            if ("json-parse" == t) {
                                var u = e.parse;
                                if ("function" == typeof u) try {
                                    if (0 === u("0") && !u(!1)) {
                                        s = u(a);
                                        var f = 5 == s.a.length && 1 === s.a[0];
                                        if (f) {
                                            try {
                                                f = !u('"\t"')
                                            } catch (t) {
                                            }
                                            if (f) try {
                                                f = 1 !== u("01")
                                            } catch (t) {
                                            }
                                            if (f) try {
                                                f = 1 !== u("1.")
                                            } catch (t) {
                                            }
                                        }
                                    }
                                } catch (t) {
                                    f = !1
                                }
                                o = f
                            }
                        }
                        return r[t] = !!o
                    }

                    t || (t = c.Object()), e || (e = c.Object());
                    var n = t.Number || c.Number, i = t.String || c.String, a = t.Object || c.Object,
                        p = t.Date || c.Date, h = t.SyntaxError || c.SyntaxError, u = t.TypeError || c.TypeError,
                        f = t.Math || c.Math, l = t.JSON || c.JSON;
                    "object" == typeof l && l && (e.stringify = l.stringify, e.parse = l.parse);
                    var d, y, g, m = a.prototype, v = m.toString, b = new p(-0xc782b5b800cec);
                    try {
                        b = b.getUTCFullYear() == -109252 && 0 === b.getUTCMonth() && 1 === b.getUTCDate() && 10 == b.getUTCHours() && 37 == b.getUTCMinutes() && 6 == b.getUTCSeconds() && 708 == b.getUTCMilliseconds()
                    } catch (t) {
                    }
                    if (!r("json")) {
                        var k = "[object Function]", w = "[object Date]", x = "[object Number]", A = "[object String]",
                            B = "[object Array]", C = "[object Boolean]", S = r("bug-string-char-index");
                        if (!b) var _ = f.floor, E = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                            T = function (t, e) {
                                return E[e] + 365 * (t - 1970) + _((t - 1969 + (e = +(e > 1))) / 4) - _((t - 1901 + e) / 100) + _((t - 1601 + e) / 400)
                            };
                        if ((d = m.hasOwnProperty) || (d = function (t) {
                                var e, r = {};
                                return (r.__proto__ = null, r.__proto__ = {toString: 1}, r).toString != v ? d = function (t) {
                                    var e = this.__proto__, r = t in (this.__proto__ = null, this);
                                    return this.__proto__ = e, r
                                } : (e = r.constructor, d = function (t) {
                                    var r = (this.constructor || e).prototype;
                                    return t in this && !(t in r && this[t] === r[t])
                                }), r = null, d.call(this, t)
                            }), y = function (t, e) {
                                var r, n, o, i = 0;
                                (r = function () {
                                    this.valueOf = 0
                                }).prototype.valueOf = 0, n = new r;
                                for (o in n) d.call(n, o) && i++;
                                return r = n = null, i ? y = 2 == i ? function (t, e) {
                                    var r, n = {}, o = v.call(t) == k;
                                    for (r in t) o && "prototype" == r || d.call(n, r) || !(n[r] = 1) || !d.call(t, r) || e(r)
                                } : function (t, e) {
                                    var r, n, o = v.call(t) == k;
                                    for (r in t) o && "prototype" == r || !d.call(t, r) || (n = "constructor" === r) || e(r);
                                    (n || d.call(t, r = "constructor")) && e(r)
                                } : (n = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], y = function (t, e) {
                                    var r, o, i = v.call(t) == k,
                                        a = !i && "function" != typeof t.constructor && s[typeof t.hasOwnProperty] && t.hasOwnProperty || d;
                                    for (r in t) i && "prototype" == r || !a.call(t, r) || e(r);
                                    for (o = n.length; r = n[--o]; a.call(t, r) && e(r)) ;
                                }), y(t, e)
                            }, !r("json-stringify")) {
                            var j = {92: "\\\\", 34: '\\"', 8: "\\b", 12: "\\f", 10: "\\n", 13: "\\r", 9: "\\t"},
                                O = "000000", P = function (t, e) {
                                    return (O + (e || 0)).slice(-t)
                                }, N = "\\u00", R = function (t) {
                                    for (var e = '"', r = 0, n = t.length, o = !S || n > 10, i = o && (S ? t.split("") : t); r < n; r++) {
                                        var s = t.charCodeAt(r);
                                        switch (s) {
                                            case 8:
                                            case 9:
                                            case 10:
                                            case 12:
                                            case 13:
                                            case 34:
                                            case 92:
                                                e += j[s];
                                                break;
                                            default:
                                                if (s < 32) {
                                                    e += N + P(2, s.toString(16));
                                                    break
                                                }
                                                e += o ? i[r] : t.charAt(r)
                                        }
                                    }
                                    return e + '"'
                                }, D = function (t, e, r, n, o, i, s) {
                                    var a, c, p, h, f, l, m, b, k, S, E, j, O, N, U, q;
                                    try {
                                        a = e[t]
                                    } catch (t) {
                                    }
                                    if ("object" == typeof a && a) if (c = v.call(a), c != w || d.call(a, "toJSON")) "function" == typeof a.toJSON && (c != x && c != A && c != B || d.call(a, "toJSON")) && (a = a.toJSON(t)); else if (a > -1 / 0 && a < 1 / 0) {
                                        if (T) {
                                            for (f = _(a / 864e5), p = _(f / 365.2425) + 1970 - 1; T(p + 1, 0) <= f; p++) ;
                                            for (h = _((f - T(p, 0)) / 30.42); T(p, h + 1) <= f; h++) ;
                                            f = 1 + f - T(p, h), l = (a % 864e5 + 864e5) % 864e5, m = _(l / 36e5) % 24, b = _(l / 6e4) % 60, k = _(l / 1e3) % 60, S = l % 1e3
                                        } else p = a.getUTCFullYear(), h = a.getUTCMonth(), f = a.getUTCDate(), m = a.getUTCHours(), b = a.getUTCMinutes(), k = a.getUTCSeconds(), S = a.getUTCMilliseconds();
                                        a = (p <= 0 || p >= 1e4 ? (p < 0 ? "-" : "+") + P(6, p < 0 ? -p : p) : P(4, p)) + "-" + P(2, h + 1) + "-" + P(2, f) + "T" + P(2, m) + ":" + P(2, b) + ":" + P(2, k) + "." + P(3, S) + "Z"
                                    } else a = null;
                                    if (r && (a = r.call(e, t, a)), null === a) return "null";
                                    if (c = v.call(a), c == C) return "" + a;
                                    if (c == x) return a > -1 / 0 && a < 1 / 0 ? "" + a : "null";
                                    if (c == A) return R("" + a);
                                    if ("object" == typeof a) {
                                        for (N = s.length; N--;) if (s[N] === a) throw u();
                                        if (s.push(a), E = [], U = i, i += o, c == B) {
                                            for (O = 0, N = a.length; O < N; O++) j = D(O, a, r, n, o, i, s), E.push(j === g ? "null" : j);
                                            q = E.length ? o ? "[\n" + i + E.join(",\n" + i) + "\n" + U + "]" : "[" + E.join(",") + "]" : "[]"
                                        } else y(n || a, function (t) {
                                            var e = D(t, a, r, n, o, i, s);
                                            e !== g && E.push(R(t) + ":" + (o ? " " : "") + e)
                                        }), q = E.length ? o ? "{\n" + i + E.join(",\n" + i) + "\n" + U + "}" : "{" + E.join(",") + "}" : "{}";
                                        return s.pop(), q
                                    }
                                };
                            e.stringify = function (t, e, r) {
                                var n, o, i, a;
                                if (s[typeof e] && e) if ((a = v.call(e)) == k) o = e; else if (a == B) {
                                    i = {};
                                    for (var c, p = 0, h = e.length; p < h; c = e[p++], a = v.call(c), (a == A || a == x) && (i[c] = 1)) ;
                                }
                                if (r) if ((a = v.call(r)) == x) {
                                    if ((r -= r % 1) > 0) for (n = "", r > 10 && (r = 10); n.length < r; n += " ") ;
                                } else a == A && (n = r.length <= 10 ? r : r.slice(0, 10));
                                return D("", (c = {}, c[""] = t, c), o, i, n, "", [])
                            }
                        }
                        if (!r("json-parse")) {
                            var U, q, L = i.fromCharCode,
                                I = {92: "\\", 34: '"', 47: "/", 98: "\b", 116: "\t", 110: "\n", 102: "\f", 114: "\r"},
                                M = function () {
                                    throw U = q = null, h()
                                }, H = function () {
                                    for (var t, e, r, n, o, i = q, s = i.length; U < s;) switch (o = i.charCodeAt(U)) {
                                        case 9:
                                        case 10:
                                        case 13:
                                        case 32:
                                            U++;
                                            break;
                                        case 123:
                                        case 125:
                                        case 91:
                                        case 93:
                                        case 58:
                                        case 44:
                                            return t = S ? i.charAt(U) : i[U], U++, t;
                                        case 34:
                                            for (t = "@", U++; U < s;) if (o = i.charCodeAt(U), o < 32) M(); else if (92 == o) switch (o = i.charCodeAt(++U)) {
                                                case 92:
                                                case 34:
                                                case 47:
                                                case 98:
                                                case 116:
                                                case 110:
                                                case 102:
                                                case 114:
                                                    t += I[o], U++;
                                                    break;
                                                case 117:
                                                    for (e = ++U, r = U + 4; U < r; U++) o = i.charCodeAt(U), o >= 48 && o <= 57 || o >= 97 && o <= 102 || o >= 65 && o <= 70 || M();
                                                    t += L("0x" + i.slice(e, U));
                                                    break;
                                                default:
                                                    M()
                                            } else {
                                                if (34 == o) break;
                                                for (o = i.charCodeAt(U), e = U; o >= 32 && 92 != o && 34 != o;) o = i.charCodeAt(++U);
                                                t += i.slice(e, U)
                                            }
                                            if (34 == i.charCodeAt(U)) return U++, t;
                                            M();
                                        default:
                                            if (e = U, 45 == o && (n = !0, o = i.charCodeAt(++U)), o >= 48 && o <= 57) {
                                                for (48 == o && (o = i.charCodeAt(U + 1), o >= 48 && o <= 57) && M(), n = !1; U < s && (o = i.charCodeAt(U), o >= 48 && o <= 57); U++) ;
                                                if (46 == i.charCodeAt(U)) {
                                                    for (r = ++U; r < s && (o = i.charCodeAt(r), o >= 48 && o <= 57); r++) ;
                                                    r == U && M(), U = r
                                                }
                                                if (o = i.charCodeAt(U), 101 == o || 69 == o) {
                                                    for (o = i.charCodeAt(++U), 43 != o && 45 != o || U++, r = U; r < s && (o = i.charCodeAt(r), o >= 48 && o <= 57); r++) ;
                                                    r == U && M(), U = r
                                                }
                                                return +i.slice(e, U)
                                            }
                                            if (n && M(), "true" == i.slice(U, U + 4)) return U += 4, !0;
                                            if ("false" == i.slice(U, U + 5)) return U += 5, !1;
                                            if ("null" == i.slice(U, U + 4)) return U += 4, null;
                                            M()
                                    }
                                    return "$"
                                }, z = function (t) {
                                    var e, r;
                                    if ("$" == t && M(), "string" == typeof t) {
                                        if ("@" == (S ? t.charAt(0) : t[0])) return t.slice(1);
                                        if ("[" == t) {
                                            for (e = []; t = H(), "]" != t; r || (r = !0)) r && ("," == t ? (t = H(), "]" == t && M()) : M()), "," == t && M(), e.push(z(t));
                                            return e
                                        }
                                        if ("{" == t) {
                                            for (e = {}; t = H(), "}" != t; r || (r = !0)) r && ("," == t ? (t = H(), "}" == t && M()) : M()), "," != t && "string" == typeof t && "@" == (S ? t.charAt(0) : t[0]) && ":" == H() || M(), e[t.slice(1)] = z(H());
                                            return e
                                        }
                                        M()
                                    }
                                    return t
                                }, J = function (t, e, r) {
                                    var n = X(t, e, r);
                                    n === g ? delete t[e] : t[e] = n
                                }, X = function (t, e, r) {
                                    var n, o = t[e];
                                    if ("object" == typeof o && o) if (v.call(o) == B) for (n = o.length; n--;) J(o, n, r); else y(o, function (t) {
                                        J(o, t, r)
                                    });
                                    return r.call(t, e, o)
                                };
                            e.parse = function (t, e) {
                                var r, n;
                                return U = 0, q = "" + t, r = z(H()), "$" != H() && M(), U = q = null, e && v.call(e) == k ? X((n = {}, n[""] = r, n), "", e) : r
                            }
                        }
                    }
                    return e.runInContext = o, e
                }

                var i = "function" == typeof n && n.amd, s = {function: !0, object: !0},
                    a = s[typeof e] && e && !e.nodeType && e, c = s[typeof window] && window || this,
                    p = a && s[typeof t] && t && !t.nodeType && "object" == typeof r && r;
                if (!p || p.global !== p && p.window !== p && p.self !== p || (c = p), a && !i) o(c, a); else {
                    var h = c.JSON, u = c.JSON3, f = !1, l = o(c, c.JSON3 = {
                        noConflict: function () {
                            return f || (f = !0, c.JSON = h, c.JSON3 = u, h = u = null), l
                        }
                    });
                    c.JSON = {parse: l.parse, stringify: l.stringify}
                }
                i && n(function () {
                    return l
                })
            }).call(this)
        }).call(e, r(8)(t), function () {
            return this
        }())
    }, function (t, e) {
        t.exports = function (t) {
            return t.webpackPolyfill || (t.deprecate = function () {
            }, t.paths = [], t.children = [], t.webpackPolyfill = 1), t
        }
    }, function (t, e) {
        function r(t) {
            if (t) return n(t)
        }

        function n(t) {
            for (var e in r.prototype) t[e] = r.prototype[e];
            return t
        }

        t.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) {
            return this._callbacks = this._callbacks || {}, (this._callbacks[t] = this._callbacks[t] || []).push(e), this
        }, r.prototype.once = function (t, e) {
            function r() {
                n.off(t, r), e.apply(this, arguments)
            }

            var n = this;
            return this._callbacks = this._callbacks || {}, r.fn = e, this.on(t, r), this
        }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) {
            if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
            var r = this._callbacks[t];
            if (!r) return this;
            if (1 == arguments.length) return delete this._callbacks[t], this;
            for (var n, o = 0; o < r.length; o++) if (n = r[o], n === e || n.fn === e) {
                r.splice(o, 1);
                break
            }
            return this
        }, r.prototype.emit = function (t) {
            this._callbacks = this._callbacks || {};
            var e = [].slice.call(arguments, 1), r = this._callbacks[t];
            if (r) {
                r = r.slice(0);
                for (var n = 0, o = r.length; n < o; ++n) r[n].apply(this, e)
            }
            return this
        }, r.prototype.listeners = function (t) {
            return this._callbacks = this._callbacks || {}, this._callbacks[t] || []
        }, r.prototype.hasListeners = function (t) {
            return !!this.listeners(t).length
        }
    }, function (t, e, r) {
        (function (t) {
            var n = r(11), o = r(12);
            e.deconstructPacket = function (t) {
                function e(t) {
                    if (!t) return t;
                    if (o(t)) {
                        var i = {_placeholder: !0, num: r.length};
                        return r.push(t), i
                    }
                    if (n(t)) {
                        for (var s = new Array(t.length), a = 0; a < t.length; a++) s[a] = e(t[a]);
                        return s
                    }
                    if ("object" == typeof t && !(t instanceof Date)) {
                        var s = {};
                        for (var c in t) s[c] = e(t[c]);
                        return s
                    }
                    return t
                }

                var r = [], i = t.data, s = t;
                return s.data = e(i), s.attachments = r.length, {packet: s, buffers: r}
            }, e.reconstructPacket = function (t, e) {
                function r(t) {
                    if (t && t._placeholder) {
                        var o = e[t.num];
                        return o
                    }
                    if (n(t)) {
                        for (var i = 0; i < t.length; i++) t[i] = r(t[i]);
                        return t
                    }
                    if (t && "object" == typeof t) {
                        for (var s in t) t[s] = r(t[s]);
                        return t
                    }
                    return t
                }

                return t.data = r(t.data), t.attachments = void 0, t
            }, e.removeBlobs = function (e, r) {
                function i(e, c, p) {
                    if (!e) return e;
                    if (t.Blob && e instanceof Blob || t.File && e instanceof File) {
                        s++;
                        var h = new FileReader;
                        h.onload = function () {
                            p ? p[c] = this.result : a = this.result, --s || r(a)
                        }, h.readAsArrayBuffer(e)
                    } else if (n(e)) for (var u = 0; u < e.length; u++) i(e[u], u, e); else if (e && "object" == typeof e && !o(e)) for (var f in e) i(e[f], f, e)
                }

                var s = 0, a = e;
                i(a), s || r(a)
            }
        }).call(e, function () {
            return this
        }())
    }, function (t, e) {
        t.exports = Array.isArray || function (t) {
            return "[object Array]" == Object.prototype.toString.call(t)
        }
    }, function (t, e) {
        (function (e) {
            function r(t) {
                return e.Buffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer
            }

            t.exports = r
        }).call(e, function () {
            return this
        }())
    }, function (t, e, r) {
        "use strict";

        function n(t, e) {
            return this instanceof n ? (t && "object" === ("undefined" == typeof t ? "undefined" : o(t)) && (e = t, t = void 0), e = e || {}, e.path = e.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = e, this.reconnection(e.reconnection !== !1), this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0), this.reconnectionDelay(e.reconnectionDelay || 1e3), this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3), this.randomizationFactor(e.randomizationFactor || .5), this.backoff = new l({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor()
            }), this.timeout(null == e.timeout ? 2e4 : e.timeout), this.readyState = "closed", this.uri = t, this.connecting = [], this.lastPing = null, this.encoding = !1, this.packetBuffer = [], this.encoder = new c.Encoder, this.decoder = new c.Decoder, this.autoConnect = e.autoConnect !== !1, void(this.autoConnect && this.open())) : new n(t, e)
        }

        var o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
                return typeof t
            } : function (t) {
                return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
            }, i = r(14), s = r(40), a = r(41), c = r(6), p = r(43), h = r(44), u = r(3)("socket.io-client:manager"),
            f = r(38), l = r(46), d = Object.prototype.hasOwnProperty;
        t.exports = n, n.prototype.emitAll = function () {
            this.emit.apply(this, arguments);
            for (var t in this.nsps) d.call(this.nsps, t) && this.nsps[t].emit.apply(this.nsps[t], arguments)
        }, n.prototype.updateSocketIds = function () {
            for (var t in this.nsps) d.call(this.nsps, t) && (this.nsps[t].id = this.engine.id)
        }, a(n.prototype), n.prototype.reconnection = function (t) {
            return arguments.length ? (this._reconnection = !!t, this) : this._reconnection
        }, n.prototype.reconnectionAttempts = function (t) {
            return arguments.length ? (this._reconnectionAttempts = t, this) : this._reconnectionAttempts
        }, n.prototype.reconnectionDelay = function (t) {
            return arguments.length ? (this._reconnectionDelay = t, this.backoff && this.backoff.setMin(t), this) : this._reconnectionDelay
        }, n.prototype.randomizationFactor = function (t) {
            return arguments.length ? (this._randomizationFactor = t, this.backoff && this.backoff.setJitter(t), this) : this._randomizationFactor
        }, n.prototype.reconnectionDelayMax = function (t) {
            return arguments.length ? (this._reconnectionDelayMax = t, this.backoff && this.backoff.setMax(t), this) : this._reconnectionDelayMax
        }, n.prototype.timeout = function (t) {
            return arguments.length ? (this._timeout = t, this) : this._timeout
        }, n.prototype.maybeReconnectOnOpen = function () {
            !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
        }, n.prototype.open = n.prototype.connect = function (t, e) {
            if (u("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
            u("opening %s", this.uri), this.engine = i(this.uri, this.opts);
            var r = this.engine, n = this;
            this.readyState = "opening", this.skipReconnect = !1;
            var o = p(r, "open", function () {
                n.onopen(), t && t()
            }), s = p(r, "error", function (e) {
                if (u("connect_error"), n.cleanup(), n.readyState = "closed", n.emitAll("connect_error", e), t) {
                    var r = new Error("Connection error");
                    r.data = e, t(r)
                } else n.maybeReconnectOnOpen()
            });
            if (!1 !== this._timeout) {
                var a = this._timeout;
                u("connect attempt will timeout after %d", a);
                var c = setTimeout(function () {
                    u("connect attempt timed out after %d", a), o.destroy(), r.close(), r.emit("error", "timeout"), n.emitAll("connect_timeout", a)
                }, a);
                this.subs.push({
                    destroy: function () {
                        clearTimeout(c)
                    }
                })
            }
            return this.subs.push(o), this.subs.push(s), this
        }, n.prototype.onopen = function () {
            u("open"), this.cleanup(), this.readyState = "open", this.emit("open");
            var t = this.engine;
            this.subs.push(p(t, "data", h(this, "ondata"))), this.subs.push(p(t, "ping", h(this, "onping"))), this.subs.push(p(t, "pong", h(this, "onpong"))), this.subs.push(p(t, "error", h(this, "onerror"))), this.subs.push(p(t, "close", h(this, "onclose"))), this.subs.push(p(this.decoder, "decoded", h(this, "ondecoded")))
        }, n.prototype.onping = function () {
            this.lastPing = new Date, this.emitAll("ping")
        }, n.prototype.onpong = function () {
            this.emitAll("pong", new Date - this.lastPing)
        }, n.prototype.ondata = function (t) {
            this.decoder.add(t)
        }, n.prototype.ondecoded = function (t) {
            this.emit("packet", t)
        }, n.prototype.onerror = function (t) {
            u("error", t), this.emitAll("error", t)
        }, n.prototype.socket = function (t, e) {
            function r() {
                ~f(o.connecting, n) || o.connecting.push(n)
            }

            var n = this.nsps[t];
            if (!n) {
                n = new s(this, t, e), this.nsps[t] = n;
                var o = this;
                n.on("connecting", r), n.on("connect", function () {
                    n.id = o.engine.id
                }), this.autoConnect && r()
            }
            return n
        }, n.prototype.destroy = function (t) {
            var e = f(this.connecting, t);
            ~e && this.connecting.splice(e, 1), this.connecting.length || this.close()
        }, n.prototype.packet = function (t) {
            u("writing packet %j", t);
            var e = this;
            t.query && 0 === t.type && (t.nsp += "?" + t.query), e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0, this.encoder.encode(t, function (r) {
                for (var n = 0; n < r.length; n++) e.engine.write(r[n], t.options);
                e.encoding = !1, e.processPacketQueue()
            }))
        }, n.prototype.processPacketQueue = function () {
            if (this.packetBuffer.length > 0 && !this.encoding) {
                var t = this.packetBuffer.shift();
                this.packet(t)
            }
        }, n.prototype.cleanup = function () {
            u("cleanup");
            for (var t = this.subs.length, e = 0; e < t; e++) {
                var r = this.subs.shift();
                r.destroy()
            }
            this.packetBuffer = [], this.encoding = !1, this.lastPing = null, this.decoder.destroy()
        }, n.prototype.close = n.prototype.disconnect = function () {
            u("disconnect"), this.skipReconnect = !0, this.reconnecting = !1, "opening" === this.readyState && this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close()
        }, n.prototype.onclose = function (t) {
            u("onclose"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", t), this._reconnection && !this.skipReconnect && this.reconnect()
        }, n.prototype.reconnect = function () {
            if (this.reconnecting || this.skipReconnect) return this;
            var t = this;
            if (this.backoff.attempts >= this._reconnectionAttempts) u("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1; else {
                var e = this.backoff.duration();
                u("will wait %dms before reconnect attempt", e), this.reconnecting = !0;
                var r = setTimeout(function () {
                    t.skipReconnect || (u("attempting reconnect"), t.emitAll("reconnect_attempt", t.backoff.attempts), t.emitAll("reconnecting", t.backoff.attempts), t.skipReconnect || t.open(function (e) {
                        e ? (u("reconnect attempt error"), t.reconnecting = !1, t.reconnect(), t.emitAll("reconnect_error", e.data)) : (u("reconnect success"), t.onreconnect())
                    }))
                }, e);
                this.subs.push({
                    destroy: function () {
                        clearTimeout(r)
                    }
                })
            }
        }, n.prototype.onreconnect = function () {
            var t = this.backoff.attempts;
            this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", t)
        }
    }, function (t, e, r) {
        t.exports = r(15)
    }, function (t, e, r) {
        t.exports = r(16), t.exports.parser = r(23)
    }, function (t, e, r) {
        (function (e) {
            function n(t, r) {
                if (!(this instanceof n)) return new n(t, r);
                r = r || {}, t && "object" == typeof t && (r = t, t = null), t ? (t = h(t), r.hostname = t.host, r.secure = "https" === t.protocol || "wss" === t.protocol, r.port = t.port, t.query && (r.query = t.query)) : r.host && (r.hostname = h(r.host).host), this.secure = null != r.secure ? r.secure : e.location && "https:" === location.protocol, r.hostname && !r.port && (r.port = this.secure ? "443" : "80"), this.agent = r.agent || !1, this.hostname = r.hostname || (e.location ? location.hostname : "localhost"), this.port = r.port || (e.location && location.port ? location.port : this.secure ? 443 : 80), this.query = r.query || {}, "string" == typeof this.query && (this.query = f.decode(this.query)), this.upgrade = !1 !== r.upgrade, this.path = (r.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!r.forceJSONP, this.jsonp = !1 !== r.jsonp, this.forceBase64 = !!r.forceBase64, this.enablesXDR = !!r.enablesXDR, this.timestampParam = r.timestampParam || "t", this.timestampRequests = r.timestampRequests, this.transports = r.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.prevBufferLen = 0, this.policyPort = r.policyPort || 843, this.rememberUpgrade = r.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = r.onlyBinaryUpgrades, this.perMessageDeflate = !1 !== r.perMessageDeflate && (r.perMessageDeflate || {}), !0 === this.perMessageDeflate && (this.perMessageDeflate = {}), this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024), this.pfx = r.pfx || null, this.key = r.key || null, this.passphrase = r.passphrase || null, this.cert = r.cert || null, this.ca = r.ca || null, this.ciphers = r.ciphers || null, this.rejectUnauthorized = void 0 === r.rejectUnauthorized ? null : r.rejectUnauthorized;
                var o = "object" == typeof e && e;
                o.global === o && r.extraHeaders && Object.keys(r.extraHeaders).length > 0 && (this.extraHeaders = r.extraHeaders), this.id = null, this.upgrades = null, this.pingInterval = null, this.pingTimeout = null, this.pingIntervalTimer = null, this.pingTimeoutTimer = null, this.open()
            }

            function o(t) {
                var e = {};
                for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
                return e
            }

            var i = r(17), s = r(31), a = r(3)("engine.io-client:socket"), c = r(38), p = r(23), h = r(2), u = r(39),
                f = r(32);
            t.exports = n, n.priorWebsocketSuccess = !1, s(n.prototype), n.protocol = p.protocol, n.Socket = n, n.Transport = r(22), n.transports = r(17), n.parser = r(23), n.prototype.createTransport = function (t) {
                a('creating transport "%s"', t);
                var e = o(this.query);
                e.EIO = p.protocol, e.transport = t, this.id && (e.sid = this.id);
                var r = new i[t]({
                    agent: this.agent,
                    hostname: this.hostname,
                    port: this.port,
                    secure: this.secure,
                    path: this.path,
                    query: e,
                    forceJSONP: this.forceJSONP,
                    jsonp: this.jsonp,
                    forceBase64: this.forceBase64,
                    enablesXDR: this.enablesXDR,
                    timestampRequests: this.timestampRequests,
                    timestampParam: this.timestampParam,
                    policyPort: this.policyPort,
                    socket: this,
                    pfx: this.pfx,
                    key: this.key,
                    passphrase: this.passphrase,
                    cert: this.cert,
                    ca: this.ca,
                    ciphers: this.ciphers,
                    rejectUnauthorized: this.rejectUnauthorized,
                    perMessageDeflate: this.perMessageDeflate,
                    extraHeaders: this.extraHeaders
                });
                return r
            }, n.prototype.open = function () {
                var t;
                if (this.rememberUpgrade && n.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1) t = "websocket"; else {
                    if (0 === this.transports.length) {
                        var e = this;
                        return void setTimeout(function () {
                            e.emit("error", "No transports available")
                        }, 0)
                    }
                    t = this.transports[0]
                }
                this.readyState = "opening";
                try {
                    t = this.createTransport(t)
                } catch (t) {
                    return this.transports.shift(), void this.open()
                }
                t.open(), this.setTransport(t)
            }, n.prototype.setTransport = function (t) {
                a("setting transport %s", t.name);
                var e = this;
                this.transport && (a("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = t, t.on("drain", function () {
                    e.onDrain()
                }).on("packet", function (t) {
                    e.onPacket(t)
                }).on("error", function (t) {
                    e.onError(t)
                }).on("close", function () {
                    e.onClose("transport close")
                })
            }, n.prototype.probe = function (t) {
                function e() {
                    if (f.onlyBinaryUpgrades) {
                        var e = !this.supportsBinary && f.transport.supportsBinary;
                        u = u || e
                    }
                    u || (a('probe transport "%s" opened', t), h.send([{
                        type: "ping",
                        data: "probe"
                    }]), h.once("packet", function (e) {
                        if (!u) if ("pong" === e.type && "probe" === e.data) {
                            if (a('probe transport "%s" pong', t), f.upgrading = !0, f.emit("upgrading", h), !h) return;
                            n.priorWebsocketSuccess = "websocket" === h.name, a('pausing current transport "%s"', f.transport.name), f.transport.pause(function () {
                                u || "closed" !== f.readyState && (a("changing transport and sending upgrade packet"), p(), f.setTransport(h), h.send([{type: "upgrade"}]), f.emit("upgrade", h), h = null, f.upgrading = !1, f.flush())
                            })
                        } else {
                            a('probe transport "%s" failed', t);
                            var r = new Error("probe error");
                            r.transport = h.name, f.emit("upgradeError", r)
                        }
                    }))
                }

                function r() {
                    u || (u = !0, p(), h.close(), h = null)
                }

                function o(e) {
                    var n = new Error("probe error: " + e);
                    n.transport = h.name, r(), a('probe transport "%s" failed because of error: %s', t, e), f.emit("upgradeError", n)
                }

                function i() {
                    o("transport closed")
                }

                function s() {
                    o("socket closed")
                }

                function c(t) {
                    h && t.name !== h.name && (a('"%s" works - aborting "%s"', t.name, h.name), r())
                }

                function p() {
                    h.removeListener("open", e), h.removeListener("error", o), h.removeListener("close", i), f.removeListener("close", s), f.removeListener("upgrading", c)
                }

                a('probing transport "%s"', t);
                var h = this.createTransport(t, {probe: 1}), u = !1, f = this;
                n.priorWebsocketSuccess = !1, h.once("open", e), h.once("error", o), h.once("close", i), this.once("close", s), this.once("upgrading", c), h.open()
            }, n.prototype.onOpen = function () {
                if (a("socket open"), this.readyState = "open", n.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
                    a("starting upgrade probes");
                    for (var t = 0, e = this.upgrades.length; t < e; t++) this.probe(this.upgrades[t])
                }
            }, n.prototype.onPacket = function (t) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (a('socket receive: type "%s", data "%s"', t.type, t.data), this.emit("packet", t), this.emit("heartbeat"), t.type) {
                    case"open":
                        this.onHandshake(u(t.data));
                        break;
                    case"pong":
                        this.setPing(), this.emit("pong");
                        break;
                    case"error":
                        var e = new Error("server error");
                        e.code = t.data, this.onError(e);
                        break;
                    case"message":
                        this.emit("data", t.data), this.emit("message", t.data)
                } else a('packet received with socket readyState "%s"', this.readyState)
            }, n.prototype.onHandshake = function (t) {
                this.emit("handshake", t), this.id = t.sid, this.transport.query.sid = t.sid, this.upgrades = this.filterUpgrades(t.upgrades), this.pingInterval = t.pingInterval, this.pingTimeout = t.pingTimeout, this.onOpen(), "closed" !== this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
            }, n.prototype.onHeartbeat = function (t) {
                clearTimeout(this.pingTimeoutTimer);
                var e = this;
                e.pingTimeoutTimer = setTimeout(function () {
                    "closed" !== e.readyState && e.onClose("ping timeout")
                }, t || e.pingInterval + e.pingTimeout)
            }, n.prototype.setPing = function () {
                var t = this;
                clearTimeout(t.pingIntervalTimer), t.pingIntervalTimer = setTimeout(function () {
                    a("writing ping packet - expecting pong within %sms", t.pingTimeout), t.ping(), t.onHeartbeat(t.pingTimeout)
                }, t.pingInterval)
            }, n.prototype.ping = function () {
                var t = this;
                this.sendPacket("ping", function () {
                    t.emit("ping")
                })
            }, n.prototype.onDrain = function () {
                this.writeBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 === this.writeBuffer.length ? this.emit("drain") : this.flush()
            }, n.prototype.flush = function () {
                "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
            }, n.prototype.write = n.prototype.send = function (t, e, r) {
                return this.sendPacket("message", t, e, r), this
            }, n.prototype.sendPacket = function (t, e, r, n) {
                if ("function" == typeof e && (n = e, e = void 0), "function" == typeof r && (n = r, r = null), "closing" !== this.readyState && "closed" !== this.readyState) {
                    r = r || {}, r.compress = !1 !== r.compress;
                    var o = {type: t, data: e, options: r};
                    this.emit("packetCreate", o), this.writeBuffer.push(o), n && this.once("flush", n), this.flush()
                }
            }, n.prototype.close = function () {
                function t() {
                    n.onClose("forced close"), a("socket closing - telling transport to close"), n.transport.close()
                }

                function e() {
                    n.removeListener("upgrade", e), n.removeListener("upgradeError", e), t()
                }

                function r() {
                    n.once("upgrade", e), n.once("upgradeError", e)
                }

                if ("opening" === this.readyState || "open" === this.readyState) {
                    this.readyState = "closing";
                    var n = this;
                    this.writeBuffer.length ? this.once("drain", function () {
                        this.upgrading ? r() : t()
                    }) : this.upgrading ? r() : t()
                }
                return this
            }, n.prototype.onError = function (t) {
                a("socket error %j", t), n.priorWebsocketSuccess = !1, this.emit("error", t), this.onClose("transport error", t)
            }, n.prototype.onClose = function (t, e) {
                if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
                    a('socket close with reason: "%s"', t);
                    var r = this;
                    clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", t, e), r.writeBuffer = [], r.prevBufferLen = 0
                }
            }, n.prototype.filterUpgrades = function (t) {
                for (var e = [], r = 0, n = t.length; r < n; r++) ~c(this.transports, t[r]) && e.push(t[r]);
                return e
            }
        }).call(e, function () {
            return this
        }())
    }, function (t, e, r) {
        (function (t) {
            function n(e) {
                var r, n = !1, a = !1, c = !1 !== e.jsonp;
                if (t.location) {
                    var p = "https:" === location.protocol, h = location.port;
                    h || (h = p ? 443 : 80), n = e.hostname !== location.hostname || h !== e.port, a = e.secure !== p
                }
                if (e.xdomain = n, e.xscheme = a, r = new o(e), "open" in r && !e.forceJSONP) return new i(e);
                if (!c) throw new Error("JSONP disabled");
                return new s(e)
            }

            var o = r(18), i = r(20), s = r(35), a = r(36);
            e.polling = n, e.websocket = a
        }).call(e, function () {
            return this
        }())
    }, function (t, e, r) {
        (function (e) {
            var n = r(19);
            t.exports = function (t) {
                var r = t.xdomain, o = t.xscheme, i = t.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!r || n)) return new XMLHttpRequest
                } catch (t) {
                }
                try {
                    if ("undefined" != typeof XDomainRequest && !o && i) return new XDomainRequest
                } catch (t) {
                }
                if (!r) try {
                    return new (e[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                } catch (t) {
                }
            }
        }).call(e, function () {
            return this
        }())
    }, function (t, e) {
        try {
            t.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest
        } catch (e) {
            t.exports = !1
        }
    }, function (t, e, r) {
        (function (e) {
            function n() {
            }

            function o(t) {
                if (c.call(this, t), e.location) {
                    var r = "https:" === location.protocol, n = location.port;
                    n || (n = r ? 443 : 80), this.xd = t.hostname !== e.location.hostname || n !== t.port, this.xs = t.secure !== r
                } else this.extraHeaders = t.extraHeaders
            }

            function i(t) {
                this.method = t.method || "GET", this.uri = t.uri, this.xd = !!t.xd, this.xs = !!t.xs, this.async = !1 !== t.async, this.data = void 0 !== t.data ? t.data : null, this.agent = t.agent, this.isBinary = t.isBinary, this.supportsBinary = t.supportsBinary, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.extraHeaders = t.extraHeaders, this.create()
            }

            function s() {
                for (var t in i.requests) i.requests.hasOwnProperty(t) && i.requests[t].abort()
            }

            var a = r(18), c = r(21), p = r(31), h = r(33), u = r(3)("engine.io-client:polling-xhr");
            t.exports = o, t.exports.Request = i, h(o, c), o.prototype.supportsBinary = !0, o.prototype.request = function (t) {
                return t = t || {}, t.uri = this.uri(), t.xd = this.xd, t.xs = this.xs, t.agent = this.agent || !1, t.supportsBinary = this.supportsBinary, t.enablesXDR = this.enablesXDR, t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized, t.extraHeaders = this.extraHeaders, new i(t)
            }, o.prototype.doWrite = function (t, e) {
                var r = "string" != typeof t && void 0 !== t, n = this.request({method: "POST", data: t, isBinary: r}),
                    o = this;
                n.on("success", e), n.on("error", function (t) {
                    o.onError("xhr post error", t)
                }), this.sendXhr = n
            }, o.prototype.doPoll = function () {
                u("xhr poll");
                var t = this.request(), e = this;
                t.on("data", function (t) {
                    e.onData(t)
                }), t.on("error", function (t) {
                    e.onError("xhr poll error", t)
                }), this.pollXhr = t
            }, p(i.prototype), i.prototype.create = function () {
                var t = {agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR};
                t.pfx = this.pfx, t.key = this.key, t.passphrase = this.passphrase, t.cert = this.cert, t.ca = this.ca, t.ciphers = this.ciphers, t.rejectUnauthorized = this.rejectUnauthorized;
                var r = this.xhr = new a(t), n = this;
                try {
                    u("xhr open %s: %s", this.method, this.uri), r.open(this.method, this.uri, this.async);
                    try {
                        if (this.extraHeaders) {
                            r.setDisableHeaderCheck(!0);
                            for (var o in this.extraHeaders) this.extraHeaders.hasOwnProperty(o) && r.setRequestHeader(o, this.extraHeaders[o])
                        }
                    } catch (t) {
                    }
                    if (this.supportsBinary && (r.responseType = "arraybuffer"), "POST" === this.method) try {
                        this.isBinary ? r.setRequestHeader("Content-type", "application/octet-stream") : r.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                    } catch (t) {
                    }
                    try {
                        r.setRequestHeader("Accept", "*/*")
                    } catch (t) {
                    }
                    "withCredentials" in r && (r.withCredentials = !0), this.hasXDR() ? (r.onload = function () {
                        n.onLoad()
                    }, r.onerror = function () {
                        n.onError(r.responseText)
                    }) : r.onreadystatechange = function () {
                        4 === r.readyState && (200 === r.status || 1223 === r.status ? n.onLoad() : setTimeout(function () {
                            n.onError(r.status)
                        }, 0))
                    }, u("xhr data %s", this.data), r.send(this.data)
                } catch (t) {
                    return void setTimeout(function () {
                        n.onError(t)
                    }, 0)
                }
                e.document && (this.index = i.requestsCount++, i.requests[this.index] = this)
            }, i.prototype.onSuccess = function () {
                this.emit("success"), this.cleanup()
            }, i.prototype.onData = function (t) {
                this.emit("data", t), this.onSuccess()
            }, i.prototype.onError = function (t) {
                this.emit("error", t), this.cleanup(!0)
            }, i.prototype.cleanup = function (t) {
                if ("undefined" != typeof this.xhr && null !== this.xhr) {
                    if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = n : this.xhr.onreadystatechange = n, t) try {
                        this.xhr.abort()
                    } catch (t) {
                    }
                    e.document && delete i.requests[this.index], this.xhr = null
                }
            }, i.prototype.onLoad = function () {
                var t;
                try {
                    var e;
                    try {
                        e = this.xhr.getResponseHeader("Content-Type").split(";")[0]
                    } catch (t) {
                    }
                    if ("application/octet-stream" === e) t = this.xhr.response || this.xhr.responseText; else if (this.supportsBinary) try {
                        t = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response))
                    } catch (e) {
                        for (var r = new Uint8Array(this.xhr.response), n = [], o = 0, i = r.length; o < i; o++) n.push(r[o]);
                        t = String.fromCharCode.apply(null, n)
                    } else t = this.xhr.responseText
                } catch (t) {
                    this.onError(t)
                }
                null != t && this.onData(t)
            }, i.prototype.hasXDR = function () {
                return "undefined" != typeof e.XDomainRequest && !this.xs && this.enablesXDR
            }, i.prototype.abort = function () {
                this.cleanup()
            }, i.requestsCount = 0, i.requests = {}, e.document && (e.attachEvent ? e.attachEvent("onunload", s) : e.addEventListener && e.addEventListener("beforeunload", s, !1))
        }).call(e, function () {
            return this
        }())
    }, function (t, e, r) {
        function n(t) {
            var e = t && t.forceBase64;
            h && !e || (this.supportsBinary = !1), o.call(this, t)
        }

        var o = r(22), i = r(32), s = r(23), a = r(33), c = r(34), p = r(3)("engine.io-client:polling");
        t.exports = n;
        var h = function () {
            var t = r(18), e = new t({xdomain: !1});
            return null != e.responseType
        }();
        a(n, o), n.prototype.name = "polling", n.prototype.doOpen = function () {
            this.poll()
        }, n.prototype.pause = function (t) {
            function e() {
                p("paused"), r.readyState = "paused", t()
            }

            var r = this;
            if (this.readyState = "pausing", this.polling || !this.writable) {
                var n = 0;
                this.polling && (p("we are currently polling - waiting to pause"), n++, this.once("pollComplete", function () {
                    p("pre-pause polling complete"), --n || e()
                })), this.writable || (p("we are currently writing - waiting to pause"), n++, this.once("drain", function () {
                    p("pre-pause writing complete"), --n || e()
                }))
            } else e()
        }, n.prototype.poll = function () {
            p("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
        }, n.prototype.onData = function (t) {
            var e = this;
            p("polling got data %s", t);
            var r = function (t, r, n) {
                return "opening" === e.readyState && e.onOpen(), "close" === t.type ? (e.onClose(), !1) : void e.onPacket(t)
            };
            s.decodePayload(t, this.socket.binaryType, r), "closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState ? this.poll() : p('ignoring poll - transport state "%s"', this.readyState))
        }, n.prototype.doClose = function () {
            function t() {
                p("writing close packet"), e.write([{type: "close"}])
            }

            var e = this;
            "open" === this.readyState ? (p("transport open - closing"), t()) : (p("transport not open - deferring close"), this.once("open", t))
        }, n.prototype.write = function (t) {
            var e = this;
            this.writable = !1;
            var r = function () {
                e.writable = !0, e.emit("drain")
            };
            s.encodePayload(t, this.supportsBinary, function (t) {
                e.doWrite(t, r)
            })
        }, n.prototype.uri = function () {
            var t = this.query || {}, e = this.secure ? "https" : "http", r = "";
            !1 !== this.timestampRequests && (t[this.timestampParam] = c()), this.supportsBinary || t.sid || (t.b64 = 1), t = i.encode(t), this.port && ("https" === e && 443 !== this.port || "http" === e && 80 !== this.port) && (r = ":" + this.port), t.length && (t = "?" + t);
            var n = this.hostname.indexOf(":") !== -1;
            return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
        }
    }, function (t, e, r) {
        function n(t) {
            this.path = t.path, this.hostname = t.hostname, this.port = t.port, this.secure = t.secure, this.query = t.query, this.timestampParam = t.timestampParam, this.timestampRequests = t.timestampRequests, this.readyState = "", this.agent = t.agent || !1, this.socket = t.socket, this.enablesXDR = t.enablesXDR, this.pfx = t.pfx, this.key = t.key, this.passphrase = t.passphrase, this.cert = t.cert, this.ca = t.ca, this.ciphers = t.ciphers, this.rejectUnauthorized = t.rejectUnauthorized, this.extraHeaders = t.extraHeaders
        }

        var o = r(23), i = r(31);
        t.exports = n, i(n.prototype), n.prototype.onError = function (t, e) {
            var r = new Error(t);
            return r.type = "TransportError", r.description = e, this.emit("error", r), this
        }, n.prototype.open = function () {
            return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this
        }, n.prototype.close = function () {
            return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this
        }, n.prototype.send = function (t) {
            if ("open" !== this.readyState) throw new Error("Transport not open");
            this.write(t)
        }, n.prototype.onOpen = function () {
            this.readyState = "open", this.writable = !0, this.emit("open")
        }, n.prototype.onData = function (t) {
            var e = o.decodePacket(t, this.socket.binaryType);
            this.onPacket(e)
        }, n.prototype.onPacket = function (t) {
            this.emit("packet", t)
        }, n.prototype.onClose = function () {
            this.readyState = "closed", this.emit("close")
        }
    }, function (t, e, r) {
        (function (t) {
            function n(t, r) {
                var n = "b" + e.packets[t.type] + t.data.data;
                return r(n)
            }

            function o(t, r, n) {
                if (!r) return e.encodeBase64Packet(t, n);
                var o = t.data, i = new Uint8Array(o), s = new Uint8Array(1 + o.byteLength);
                s[0] = v[t.type];
                for (var a = 0; a < i.length; a++) s[a + 1] = i[a];
                return n(s.buffer)
            }

            function i(t, r, n) {
                if (!r) return e.encodeBase64Packet(t, n);
                var o = new FileReader;
                return o.onload = function () {
                    t.data = o.result, e.encodePacket(t, r, !0, n)
                }, o.readAsArrayBuffer(t.data)
            }

            function s(t, r, n) {
                if (!r) return e.encodeBase64Packet(t, n);
                if (m) return i(t, r, n);
                var o = new Uint8Array(1);
                o[0] = v[t.type];
                var s = new w([o.buffer, t.data]);
                return n(s)
            }

            function a(t) {
                try {
                    t = d.decode(t)
                } catch (t) {
                    return !1
                }
                return t
            }

            function c(t, e, r) {
                for (var n = new Array(t.length), o = l(t.length, r), i = function (t, r, o) {
                    e(r, function (e, r) {
                        n[t] = r, o(e, n)
                    })
                }, s = 0; s < t.length; s++) i(s, t[s], o)
            }

            var p, h = r(24), u = r(25), f = r(26), l = r(27), d = r(28);
            t && t.ArrayBuffer && (p = r(29));
            var y = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
                g = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent), m = y || g;
            e.protocol = 3;
            var v = e.packets = {open: 0, close: 1, ping: 2, pong: 3, message: 4, upgrade: 5, noop: 6}, b = h(v),
                k = {type: "error", data: "parser error"}, w = r(30);
            e.encodePacket = function (e, r, i, a) {
                "function" == typeof r && (a = r, r = !1), "function" == typeof i && (a = i, i = null);
                var c = void 0 === e.data ? void 0 : e.data.buffer || e.data;
                if (t.ArrayBuffer && c instanceof ArrayBuffer) return o(e, r, a);
                if (w && c instanceof t.Blob) return s(e, r, a);
                if (c && c.base64) return n(e, a);
                var p = v[e.type];
                return void 0 !== e.data && (p += i ? d.encode(String(e.data)) : String(e.data)), a("" + p)
            }, e.encodeBase64Packet = function (r, n) {
                var o = "b" + e.packets[r.type];
                if (w && r.data instanceof t.Blob) {
                    var i = new FileReader;
                    return i.onload = function () {
                        var t = i.result.split(",")[1];
                        n(o + t)
                    }, i.readAsDataURL(r.data)
                }
                var s;
                try {
                    s = String.fromCharCode.apply(null, new Uint8Array(r.data))
                } catch (t) {
                    for (var a = new Uint8Array(r.data), c = new Array(a.length), p = 0; p < a.length; p++) c[p] = a[p];
                    s = String.fromCharCode.apply(null, c)
                }
                return o += t.btoa(s), n(o)
            }, e.decodePacket = function (t, r, n) {
                if (void 0 === t) return k;
                if ("string" == typeof t) {
                    if ("b" == t.charAt(0)) return e.decodeBase64Packet(t.substr(1), r);
                    if (n && (t = a(t), t === !1)) return k;
                    var o = t.charAt(0);
                    return Number(o) == o && b[o] ? t.length > 1 ? {type: b[o], data: t.substring(1)} : {type: b[o]} : k
                }
                var i = new Uint8Array(t), o = i[0], s = f(t, 1);
                return w && "blob" === r && (s = new w([s])), {type: b[o], data: s}
            }, e.decodeBase64Packet = function (t, e) {
                var r = b[t.charAt(0)];
                if (!p) return {type: r, data: {base64: !0, data: t.substr(1)}};
                var n = p.decode(t.substr(1));
                return "blob" === e && w && (n = new w([n])), {type: r, data: n}
            }, e.encodePayload = function (t, r, n) {
                function o(t) {
                    return t.length + ":" + t
                }

                function i(t, n) {
                    e.encodePacket(t, !!s && r, !0, function (t) {
                        n(null, o(t))
                    })
                }

                "function" == typeof r && (n = r, r = null);
                var s = u(t);
                return r && s ? w && !m ? e.encodePayloadAsBlob(t, n) : e.encodePayloadAsArrayBuffer(t, n) : t.length ? void c(t, i, function (t, e) {
                    return n(e.join(""))
                }) : n("0:")
            }, e.decodePayload = function (t, r, n) {
                if ("string" != typeof t) return e.decodePayloadAsBinary(t, r, n);
                "function" == typeof r && (n = r, r = null);
                var o;
                if ("" == t) return n(k, 0, 1);
                for (var i, s, a = "", c = 0, p = t.length; c < p; c++) {
                    var h = t.charAt(c);
                    if (":" != h) a += h; else {
                        if ("" == a || a != (i = Number(a))) return n(k, 0, 1);
                        if (s = t.substr(c + 1, i), a != s.length) return n(k, 0, 1);
                        if (s.length) {
                            if (o = e.decodePacket(s, r, !0), k.type == o.type && k.data == o.data) return n(k, 0, 1);
                            var u = n(o, c + i, p);
                            if (!1 === u) return
                        }
                        c += i, a = ""
                    }
                }
                return "" != a ? n(k, 0, 1) : void 0
            }, e.encodePayloadAsArrayBuffer = function (t, r) {
                function n(t, r) {
                    e.encodePacket(t, !0, !0, function (t) {
                        return r(null, t)
                    })
                }

                return t.length ? void c(t, n, function (t, e) {
                    var n = e.reduce(function (t, e) {
                        var r;
                        return r = "string" == typeof e ? e.length : e.byteLength, t + r.toString().length + r + 2
                    }, 0), o = new Uint8Array(n), i = 0;
                    return e.forEach(function (t) {
                        var e = "string" == typeof t, r = t;
                        if (e) {
                            for (var n = new Uint8Array(t.length), s = 0; s < t.length; s++) n[s] = t.charCodeAt(s);
                            r = n.buffer
                        }
                        e ? o[i++] = 0 : o[i++] = 1;
                        for (var a = r.byteLength.toString(), s = 0; s < a.length; s++) o[i++] = parseInt(a[s]);
                        o[i++] = 255;
                        for (var n = new Uint8Array(r), s = 0; s < n.length; s++) o[i++] = n[s]
                    }), r(o.buffer)
                }) : r(new ArrayBuffer(0))
            }, e.encodePayloadAsBlob = function (t, r) {
                function n(t, r) {
                    e.encodePacket(t, !0, !0, function (t) {
                        var e = new Uint8Array(1);
                        if (e[0] = 1, "string" == typeof t) {
                            for (var n = new Uint8Array(t.length), o = 0; o < t.length; o++) n[o] = t.charCodeAt(o);
                            t = n.buffer, e[0] = 0
                        }
                        for (var i = t instanceof ArrayBuffer ? t.byteLength : t.size, s = i.toString(), a = new Uint8Array(s.length + 1), o = 0; o < s.length; o++) a[o] = parseInt(s[o]);
                        if (a[s.length] = 255, w) {
                            var c = new w([e.buffer, a.buffer, t]);
                            r(null, c)
                        }
                    })
                }

                c(t, n, function (t, e) {
                    return r(new w(e))
                })
            }, e.decodePayloadAsBinary = function (t, r, n) {
                "function" == typeof r && (n = r, r = null);
                for (var o = t, i = [], s = !1; o.byteLength > 0;) {
                    for (var a = new Uint8Array(o), c = 0 === a[0], p = "", h = 1; 255 != a[h]; h++) {
                        if (p.length > 310) {
                            s = !0;
                            break
                        }
                        p += a[h]
                    }
                    if (s) return n(k, 0, 1);
                    o = f(o, 2 + p.length), p = parseInt(p);
                    var u = f(o, 0, p);
                    if (c) try {
                        u = String.fromCharCode.apply(null, new Uint8Array(u))
                    } catch (t) {
                        var l = new Uint8Array(u);
                        u = "";
                        for (var h = 0; h < l.length; h++) u += String.fromCharCode(l[h])
                    }
                    i.push(u), o = f(o, p)
                }
                var d = i.length;
                i.forEach(function (t, o) {
                    n(e.decodePacket(t, r, !0), o, d)
                })
            }
        }).call(e, function () {
            return this
        }())
    }, function (t, e) {
        t.exports = Object.keys || function (t) {
            var e = [], r = Object.prototype.hasOwnProperty;
            for (var n in t) r.call(t, n) && e.push(n);
            return e
        }
    }, function (t, e, r) {
        (function (e) {
            function n(t) {
                function r(t) {
                    if (!t) return !1;
                    if (e.Buffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer || e.Blob && t instanceof Blob || e.File && t instanceof File) return !0;
                    if (o(t)) {
                        for (var n = 0; n < t.length; n++) if (r(t[n])) return !0
                    } else if (t && "object" == typeof t) {
                        t.toJSON && (t = t.toJSON());
                        for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i) && r(t[i])) return !0
                    }
                    return !1
                }

                return r(t)
            }

            var o = r(11);
            t.exports = n
        }).call(e, function () {
            return this
        }())
    }, function (t, e) {
        t.exports = function (t, e, r) {
            var n = t.byteLength;
            if (e = e || 0, r = r || n, t.slice) return t.slice(e, r);
            if (e < 0 && (e += n), r < 0 && (r += n), r > n && (r = n), e >= n || e >= r || 0 === n) return new ArrayBuffer(0);
            for (var o = new Uint8Array(t), i = new Uint8Array(r - e), s = e, a = 0; s < r; s++, a++) i[a] = o[s];
            return i.buffer
        }
    }, function (t, e) {
        function r(t, e, r) {
            function o(t, n) {
                if (o.count <= 0) throw new Error("after called too many times");
                --o.count, t ? (i = !0, e(t), e = r) : 0 !== o.count || i || e(null, n)
            }

            var i = !1;
            return r = r || n, o.count = t, 0 === t ? e() : o
        }

        function n() {
        }

        t.exports = r
    }, function (t, e, r) {
        var n;
        (function (t, o) {
            !function (i) {
                function s(t) {
                    for (var e, r, n = [], o = 0, i = t.length; o < i;) e = t.charCodeAt(o++), e >= 55296 && e <= 56319 && o < i ? (r = t.charCodeAt(o++), 56320 == (64512 & r) ? n.push(((1023 & e) << 10) + (1023 & r) + 65536) : (n.push(e), o--)) : n.push(e);
                    return n
                }

                function a(t) {
                    for (var e, r = t.length, n = -1, o = ""; ++n < r;) e = t[n], e > 65535 && (e -= 65536, o += b(e >>> 10 & 1023 | 55296), e = 56320 | 1023 & e), o += b(e);
                    return o
                }

                function c(t, e) {
                    return b(t >> e & 63 | 128)
                }

                function p(t) {
                    if (0 == (4294967168 & t)) return b(t);
                    var e = "";
                    return 0 == (4294965248 & t) ? e = b(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (e = b(t >> 12 & 15 | 224), e += c(t, 6)) : 0 == (4292870144 & t) && (e = b(t >> 18 & 7 | 240), e += c(t, 12), e += c(t, 6)), e += b(63 & t | 128)
                }

                function h(t) {
                    for (var e, r = s(t), n = r.length, o = -1, i = ""; ++o < n;) e = r[o], i += p(e);
                    return i
                }

                function u() {
                    if (v >= m) throw Error("Invalid byte index");
                    var t = 255 & g[v];
                    if (v++, 128 == (192 & t)) return 63 & t;
                    throw Error("Invalid continuation byte")
                }

                function f() {
                    var t, e, r, n, o;
                    if (v > m) throw Error("Invalid byte index");
                    if (v == m) return !1;
                    if (t = 255 & g[v], v++, 0 == (128 & t)) return t;
                    if (192 == (224 & t)) {
                        var e = u();
                        if (o = (31 & t) << 6 | e, o >= 128) return o;
                        throw Error("Invalid continuation byte")
                    }
                    if (224 == (240 & t)) {
                        if (e = u(), r = u(), o = (15 & t) << 12 | e << 6 | r, o >= 2048) return o;
                        throw Error("Invalid continuation byte")
                    }
                    if (240 == (248 & t) && (e = u(), r = u(), n = u(), o = (15 & t) << 18 | e << 12 | r << 6 | n, o >= 65536 && o <= 1114111)) return o;
                    throw Error("Invalid WTF-8 detected")
                }

                function l(t) {
                    g = s(t), m = g.length, v = 0;
                    for (var e, r = []; (e = f()) !== !1;) r.push(e);
                    return a(r)
                }

                var d = "object" == typeof e && e,
                    y = ("object" == typeof t && t && t.exports == d && t, "object" == typeof o && o);
                y.global !== y && y.window !== y || (i = y);
                var g, m, v, b = String.fromCharCode, k = {version: "1.0.0", encode: h, decode: l};
                n = function () {
                    return k
                }.call(e, r, e, t), !(void 0 !== n && (t.exports = n))
            }(this)
        }).call(e, r(8)(t), function () {
            return this
        }())
    }, function (t, e) {
        !function () {
            "use strict";
            for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", r = new Uint8Array(256), n = 0; n < t.length; n++) r[t.charCodeAt(n)] = n;
            e.encode = function (e) {
                var r, n = new Uint8Array(e), o = n.length, i = "";
                for (r = 0; r < o; r += 3) i += t[n[r] >> 2], i += t[(3 & n[r]) << 4 | n[r + 1] >> 4], i += t[(15 & n[r + 1]) << 2 | n[r + 2] >> 6], i += t[63 & n[r + 2]];
                return o % 3 === 2 ? i = i.substring(0, i.length - 1) + "=" : o % 3 === 1 && (i = i.substring(0, i.length - 2) + "=="), i
            }, e.decode = function (t) {
                var e, n, o, i, s, a = .75 * t.length, c = t.length, p = 0;
                "=" === t[t.length - 1] && (a--, "=" === t[t.length - 2] && a--);
                var h = new ArrayBuffer(a), u = new Uint8Array(h);
                for (e = 0; e < c; e += 4) n = r[t.charCodeAt(e)], o = r[t.charCodeAt(e + 1)], i = r[t.charCodeAt(e + 2)], s = r[t.charCodeAt(e + 3)], u[p++] = n << 2 | o >> 4, u[p++] = (15 & o) << 4 | i >> 2, u[p++] = (3 & i) << 6 | 63 & s;
                return h
            }
        }()
    }, function (t, e) {
        (function (e) {
            function r(t) {
                for (var e = 0; e < t.length; e++) {
                    var r = t[e];
                    if (r.buffer instanceof ArrayBuffer) {
                        var n = r.buffer;
                        if (r.byteLength !== n.byteLength) {
                            var o = new Uint8Array(r.byteLength);
                            o.set(new Uint8Array(n, r.byteOffset, r.byteLength)), n = o.buffer
                        }
                        t[e] = n
                    }
                }
            }

            function n(t, e) {
                e = e || {};
                var n = new i;
                r(t);
                for (var o = 0; o < t.length; o++) n.append(t[o]);
                return e.type ? n.getBlob(e.type) : n.getBlob()
            }

            function o(t, e) {
                return r(t), new Blob(t, e || {})
            }

            var i = e.BlobBuilder || e.WebKitBlobBuilder || e.MSBlobBuilder || e.MozBlobBuilder, s = function () {
                try {
                    var t = new Blob(["hi"]);
                    return 2 === t.size
                } catch (t) {
                    return !1
                }
            }(), a = s && function () {
                try {
                    var t = new Blob([new Uint8Array([1, 2])]);
                    return 2 === t.size
                } catch (t) {
                    return !1
                }
            }(), c = i && i.prototype.append && i.prototype.getBlob;
            t.exports = function () {
                return s ? a ? e.Blob : o : c ? n : void 0
            }()
        }).call(e, function () {
            return this
        }())
    }, function (t, e) {
        function r(t) {
            if (t) return n(t)
        }

        function n(t) {
            for (var e in r.prototype) t[e] = r.prototype[e];
            return t
        }

        t.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) {
            return this._callbacks = this._callbacks || {}, (this._callbacks[t] = this._callbacks[t] || []).push(e), this
        }, r.prototype.once = function (t, e) {
            function r() {
                n.off(t, r), e.apply(this, arguments)
            }

            var n = this;
            return this._callbacks = this._callbacks || {}, r.fn = e, this.on(t, r), this
        }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) {
            if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
            var r = this._callbacks[t];
            if (!r) return this;
            if (1 == arguments.length) return delete this._callbacks[t], this;
            for (var n, o = 0; o < r.length; o++) if (n = r[o], n === e || n.fn === e) {
                r.splice(o, 1);
                break
            }
            return this
        }, r.prototype.emit = function (t) {
            this._callbacks = this._callbacks || {};
            var e = [].slice.call(arguments, 1), r = this._callbacks[t];
            if (r) {
                r = r.slice(0);
                for (var n = 0, o = r.length; n < o; ++n) r[n].apply(this, e)
            }
            return this
        }, r.prototype.listeners = function (t) {
            return this._callbacks = this._callbacks || {}, this._callbacks[t] || []
        }, r.prototype.hasListeners = function (t) {
            return !!this.listeners(t).length
        }
    }, function (t, e) {
        e.encode = function (t) {
            var e = "";
            for (var r in t) t.hasOwnProperty(r) && (e.length && (e += "&"), e += encodeURIComponent(r) + "=" + encodeURIComponent(t[r]));
            return e
        }, e.decode = function (t) {
            for (var e = {}, r = t.split("&"), n = 0, o = r.length; n < o; n++) {
                var i = r[n].split("=");
                e[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
            }
            return e
        }
    }, function (t, e) {
        t.exports = function (t, e) {
            var r = function () {
            };
            r.prototype = e.prototype, t.prototype = new r, t.prototype.constructor = t
        }
    }, function (t, e) {
        "use strict";

        function r(t) {
            var e = "";
            do e = s[t % a] + e, t = Math.floor(t / a); while (t > 0);
            return e
        }

        function n(t) {
            var e = 0;
            for (h = 0; h < t.length; h++) e = e * a + c[t.charAt(h)];
            return e
        }

        function o() {
            var t = r(+new Date);
            return t !== i ? (p = 0, i = t) : t + "." + r(p++)
        }

        for (var i, s = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), a = 64, c = {}, p = 0, h = 0; h < a; h++) c[s[h]] = h;
        o.encode = r, o.decode = n, t.exports = o
    }, function (t, e, r) {
        (function (e) {
            function n() {
            }

            function o(t) {
                i.call(this, t), this.query = this.query || {}, a || (e.___eio || (e.___eio = []), a = e.___eio), this.index = a.length;
                var r = this;
                a.push(function (t) {
                    r.onData(t)
                }), this.query.j = this.index, e.document && e.addEventListener && e.addEventListener("beforeunload", function () {
                    r.script && (r.script.onerror = n)
                }, !1)
            }

            var i = r(21), s = r(33);
            t.exports = o;
            var a, c = /\n/g, p = /\\n/g;
            s(o, i), o.prototype.supportsBinary = !1, o.prototype.doClose = function () {
                this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), i.prototype.doClose.call(this)
            }, o.prototype.doPoll = function () {
                var t = this, e = document.createElement("script");
                this.script && (this.script.parentNode.removeChild(this.script), this.script = null), e.async = !0, e.src = this.uri(), e.onerror = function (e) {
                    t.onError("jsonp poll error", e)
                };
                var r = document.getElementsByTagName("script")[0];
                r ? r.parentNode.insertBefore(e, r) : (document.head || document.body).appendChild(e), this.script = e;
                var n = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                n && setTimeout(function () {
                    var t = document.createElement("iframe");
                    document.body.appendChild(t), document.body.removeChild(t)
                }, 100)
            }, o.prototype.doWrite = function (t, e) {
                function r() {
                    n(), e()
                }

                function n() {
                    if (o.iframe) try {
                        o.form.removeChild(o.iframe)
                    } catch (t) {
                        o.onError("jsonp polling iframe removal error", t)
                    }
                    try {
                        var t = '<iframe src="javascript:0" name="' + o.iframeId + '">';
                        i = document.createElement(t)
                    } catch (t) {
                        i = document.createElement("iframe"), i.name = o.iframeId, i.src = "javascript:0"
                    }
                    i.id = o.iframeId, o.form.appendChild(i), o.iframe = i
                }

                var o = this;
                if (!this.form) {
                    var i, s = document.createElement("form"), a = document.createElement("textarea"),
                        h = this.iframeId = "eio_iframe_" + this.index;
                    s.className = "socketio", s.style.position = "absolute", s.style.top = "-1000px", s.style.left = "-1000px", s.target = h, s.method = "POST", s.setAttribute("accept-charset", "utf-8"), a.name = "d", s.appendChild(a), document.body.appendChild(s), this.form = s, this.area = a
                }
                this.form.action = this.uri(), n(), t = t.replace(p, "\\\n"), this.area.value = t.replace(c, "\\n");
                try {
                    this.form.submit()
                } catch (t) {
                }
                this.iframe.attachEvent ? this.iframe.onreadystatechange = function () {
                    "complete" === o.iframe.readyState && r()
                } : this.iframe.onload = r
            }
        }).call(e, function () {
            return this
        }())
    }, function (t, e, r) {
        (function (e) {
            function n(t) {
                var e = t && t.forceBase64;
                e && (this.supportsBinary = !1), this.perMessageDeflate = t.perMessageDeflate, o.call(this, t)
            }

            var o = r(22), i = r(23), s = r(32), a = r(33), c = r(34), p = r(3)("engine.io-client:websocket"),
                h = e.WebSocket || e.MozWebSocket, u = h;
            if (!u && "undefined" == typeof window) try {
                u = r(37)
            } catch (t) {
            }
            t.exports = n, a(n, o), n.prototype.name = "websocket", n.prototype.supportsBinary = !0, n.prototype.doOpen = function () {
                if (this.check()) {
                    var t = this.uri(), e = void 0, r = {agent: this.agent, perMessageDeflate: this.perMessageDeflate};
                    r.pfx = this.pfx, r.key = this.key, r.passphrase = this.passphrase, r.cert = this.cert, r.ca = this.ca, r.ciphers = this.ciphers, r.rejectUnauthorized = this.rejectUnauthorized, this.extraHeaders && (r.headers = this.extraHeaders);
                    try {
                        this.ws = h ? new u(t) : new u(t, e, r)
                    } catch (t) {
                        return this.emit("error", t)
                    }
                    void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.supports && this.ws.supports.binary ? (this.supportsBinary = !0, this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer", this.addEventListeners()
                }
            }, n.prototype.addEventListeners = function () {
                var t = this;
                this.ws.onopen = function () {
                    t.onOpen()
                }, this.ws.onclose = function () {
                    t.onClose()
                }, this.ws.onmessage = function (e) {
                    t.onData(e.data)
                }, this.ws.onerror = function (e) {
                    t.onError("websocket error", e)
                }
            }, n.prototype.write = function (t) {
                function r() {
                    n.emit("flush"), setTimeout(function () {
                        n.writable = !0, n.emit("drain")
                    }, 0)
                }

                var n = this;
                this.writable = !1;
                for (var o = t.length, s = 0, a = o; s < a; s++) !function (t) {
                    i.encodePacket(t, n.supportsBinary, function (i) {
                        if (!h) {
                            var s = {};
                            if (t.options && (s.compress = t.options.compress), n.perMessageDeflate) {
                                var a = "string" == typeof i ? e.Buffer.byteLength(i) : i.length;
                                a < n.perMessageDeflate.threshold && (s.compress = !1)
                            }
                        }
                        try {
                            h ? n.ws.send(i) : n.ws.send(i, s)
                        } catch (t) {
                            p("websocket closed before onclose event")
                        }
                        --o || r()
                    })
                }(t[s])
            }, n.prototype.onClose = function () {
                o.prototype.onClose.call(this)
            }, n.prototype.doClose = function () {
                "undefined" != typeof this.ws && this.ws.close()
            }, n.prototype.uri = function () {
                var t = this.query || {}, e = this.secure ? "wss" : "ws", r = "";
                this.port && ("wss" === e && 443 !== this.port || "ws" === e && 80 !== this.port) && (r = ":" + this.port), this.timestampRequests && (t[this.timestampParam] = c()), this.supportsBinary || (t.b64 = 1), t = s.encode(t), t.length && (t = "?" + t);
                var n = this.hostname.indexOf(":") !== -1;
                return e + "://" + (n ? "[" + this.hostname + "]" : this.hostname) + r + this.path + t
            }, n.prototype.check = function () {
                return !(!u || "__initialize" in u && this.name === n.prototype.name)
            }
        }).call(e, function () {
            return this
        }())
    }, function (t, e) {
    }, function (t, e) {
        var r = [].indexOf;
        t.exports = function (t, e) {
            if (r) return t.indexOf(e);
            for (var n = 0; n < t.length; ++n) if (t[n] === e) return n;
            return -1
        }
    }, function (t, e) {
        (function (e) {
            var r = /^[\],:{}\s]*$/, n = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                o = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, i = /(?:^|:|,)(?:\s*\[)+/g,
                s = /^\s+/, a = /\s+$/;
            t.exports = function (t) {
                return "string" == typeof t && t ? (t = t.replace(s, "").replace(a, ""), e.JSON && JSON.parse ? JSON.parse(t) : r.test(t.replace(n, "@").replace(o, "]").replace(i, "")) ? new Function("return " + t)() : void 0) : null
            }
        }).call(e, function () {
            return this
        }())
    }, function (t, e, r) {
        "use strict";

        function n(t, e, r) {
            this.io = t, this.nsp = e, this.json = this, this.ids = 0, this.acks = {}, this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0, r && r.query && (this.query = r.query), this.io.autoConnect && this.open()
        }

        var o = r(6), i = r(41), s = r(42), a = r(43), c = r(44), p = r(3)("socket.io-client:socket"), h = r(45);
        t.exports = e = n;
        var u = {
            connect: 1,
            connect_error: 1,
            connect_timeout: 1,
            connecting: 1,
            disconnect: 1,
            error: 1,
            reconnect: 1,
            reconnect_attempt: 1,
            reconnect_failed: 1,
            reconnect_error: 1,
            reconnecting: 1,
            ping: 1,
            pong: 1
        }, f = i.prototype.emit;
        i(n.prototype), n.prototype.subEvents = function () {
            if (!this.subs) {
                var t = this.io;
                this.subs = [a(t, "open", c(this, "onopen")), a(t, "packet", c(this, "onpacket")), a(t, "close", c(this, "onclose"))]
            }
        }, n.prototype.open = n.prototype.connect = function () {
            return this.connected ? this : (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), this.emit("connecting"), this)
        }, n.prototype.send = function () {
            var t = s(arguments);
            return t.unshift("message"), this.emit.apply(this, t), this
        }, n.prototype.emit = function (t) {
            if (u.hasOwnProperty(t)) return f.apply(this, arguments), this;
            var e = s(arguments), r = o.EVENT;
            h(e) && (r = o.BINARY_EVENT);
            var n = {type: r, data: e};
            return n.options = {}, n.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof e[e.length - 1] && (p("emitting packet with ack id %d", this.ids), this.acks[this.ids] = e.pop(), n.id = this.ids++), this.connected ? this.packet(n) : this.sendBuffer.push(n), delete this.flags, this
        }, n.prototype.packet = function (t) {
            t.nsp = this.nsp, this.io.packet(t)
        }, n.prototype.onopen = function () {
            p("transport is open - connecting"), "/" !== this.nsp && (this.query ? this.packet({
                type: o.CONNECT,
                query: this.query
            }) : this.packet({type: o.CONNECT}))
        }, n.prototype.onclose = function (t) {
            p("close (%s)", t), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", t)
        }, n.prototype.onpacket = function (t) {
            if (t.nsp === this.nsp) switch (t.type) {
                case o.CONNECT:
                    this.onconnect();
                    break;
                case o.EVENT:
                    this.onevent(t);
                    break;
                case o.BINARY_EVENT:
                    this.onevent(t);
                    break;
                case o.ACK:
                    this.onack(t);
                    break;
                case o.BINARY_ACK:
                    this.onack(t);
                    break;
                case o.DISCONNECT:
                    this.ondisconnect();
                    break;
                case o.ERROR:
                    this.emit("error", t.data)
            }
        }, n.prototype.onevent = function (t) {
            var e = t.data || [];
            p("emitting event %j", e), null != t.id && (p("attaching ack callback to event"), e.push(this.ack(t.id))), this.connected ? f.apply(this, e) : this.receiveBuffer.push(e)
        }, n.prototype.ack = function (t) {
            var e = this, r = !1;
            return function () {
                if (!r) {
                    r = !0;
                    var n = s(arguments);
                    p("sending ack %j", n);
                    var i = h(n) ? o.BINARY_ACK : o.ACK;
                    e.packet({type: i, id: t, data: n})
                }
            }
        }, n.prototype.onack = function (t) {
            var e = this.acks[t.id];
            "function" == typeof e ? (p("calling ack %s with %j", t.id, t.data), e.apply(this, t.data), delete this.acks[t.id]) : p("bad ack %s", t.id)
        }, n.prototype.onconnect = function () {
            this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
        }, n.prototype.emitBuffered = function () {
            var t;
            for (t = 0; t < this.receiveBuffer.length; t++) f.apply(this, this.receiveBuffer[t]);
            for (this.receiveBuffer = [], t = 0; t < this.sendBuffer.length; t++) this.packet(this.sendBuffer[t]);
            this.sendBuffer = []
        }, n.prototype.ondisconnect = function () {
            p("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
        }, n.prototype.destroy = function () {
            if (this.subs) {
                for (var t = 0; t < this.subs.length; t++) this.subs[t].destroy();
                this.subs = null
            }
            this.io.destroy(this)
        }, n.prototype.close = n.prototype.disconnect = function () {
            return this.connected && (p("performing disconnect (%s)", this.nsp), this.packet({type: o.DISCONNECT})), this.destroy(), this.connected && this.onclose("io client disconnect"), this
        }, n.prototype.compress = function (t) {
            return this.flags = this.flags || {}, this.flags.compress = t, this
        }
    }, function (t, e) {
        function r(t) {
            if (t) return n(t)
        }

        function n(t) {
            for (var e in r.prototype) t[e] = r.prototype[e];
            return t
        }

        t.exports = r, r.prototype.on = r.prototype.addEventListener = function (t, e) {
            return this._callbacks = this._callbacks || {}, (this._callbacks["$" + t] = this._callbacks["$" + t] || []).push(e), this
        }, r.prototype.once = function (t, e) {
            function r() {
                this.off(t, r), e.apply(this, arguments)
            }

            return r.fn = e, this.on(t, r), this
        }, r.prototype.off = r.prototype.removeListener = r.prototype.removeAllListeners = r.prototype.removeEventListener = function (t, e) {
            if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
            var r = this._callbacks["$" + t];
            if (!r) return this;
            if (1 == arguments.length) return delete this._callbacks["$" + t], this;
            for (var n, o = 0; o < r.length; o++) if (n = r[o], n === e || n.fn === e) {
                r.splice(o, 1);
                break
            }
            return this
        }, r.prototype.emit = function (t) {
            this._callbacks = this._callbacks || {};
            var e = [].slice.call(arguments, 1), r = this._callbacks["$" + t];
            if (r) {
                r = r.slice(0);
                for (var n = 0, o = r.length; n < o; ++n) r[n].apply(this, e)
            }
            return this
        }, r.prototype.listeners = function (t) {
            return this._callbacks = this._callbacks || {}, this._callbacks["$" + t] || []
        }, r.prototype.hasListeners = function (t) {
            return !!this.listeners(t).length
        }
    }, function (t, e) {
        function r(t, e) {
            var r = [];
            e = e || 0;
            for (var n = e || 0; n < t.length; n++) r[n - e] = t[n];
            return r
        }

        t.exports = r
    }, function (t, e) {
        "use strict";

        function r(t, e, r) {
            return t.on(e, r), {
                destroy: function () {
                    t.removeListener(e, r)
                }
            }
        }

        t.exports = r
    }, function (t, e) {
        var r = [].slice;
        t.exports = function (t, e) {
            if ("string" == typeof e && (e = t[e]), "function" != typeof e) throw new Error("bind() requires a function");
            var n = r.call(arguments, 2);
            return function () {
                return e.apply(t, n.concat(r.call(arguments)))
            }
        }
    }, function (t, e, r) {
        (function (e) {
            function n(t) {
                function r(t) {
                    if (!t) return !1;
                    if (e.Buffer && e.Buffer.isBuffer && e.Buffer.isBuffer(t) || e.ArrayBuffer && t instanceof ArrayBuffer || e.Blob && t instanceof Blob || e.File && t instanceof File) return !0;
                    if (o(t)) {
                        for (var n = 0; n < t.length; n++) if (r(t[n])) return !0
                    } else if (t && "object" == typeof t) {
                        t.toJSON && "function" == typeof t.toJSON && (t = t.toJSON());
                        for (var i in t) if (Object.prototype.hasOwnProperty.call(t, i) && r(t[i])) return !0
                    }
                    return !1
                }

                return r(t)
            }

            var o = r(11);
            t.exports = n
        }).call(e, function () {
            return this
        }())
    }, function (t, e) {
        function r(t) {
            t = t || {}, this.ms = t.min || 100, this.max = t.max || 1e4, this.factor = t.factor || 2, this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0, this.attempts = 0
        }

        t.exports = r, r.prototype.duration = function () {
            var t = this.ms * Math.pow(this.factor, this.attempts++);
            if (this.jitter) {
                var e = Math.random(), r = Math.floor(e * this.jitter * t);
                t = 0 == (1 & Math.floor(10 * e)) ? t - r : t + r
            }
            return 0 | Math.min(t, this.max)
        }, r.prototype.reset = function () {
            this.attempts = 0
        }, r.prototype.setMin = function (t) {
            this.ms = t
        }, r.prototype.setMax = function (t) {
            this.max = t
        }, r.prototype.setJitter = function (t) {
            this.jitter = t
        }
    }])
});
ko.bindingHandlers.getDomElement = {
    init: function (element, valueAccessor, allBindings, item) {
        data = valueAccessor();
        if (data && data.target) {
            if (typeof item[data.target] != "function") {
                item[data.target] = element;
            }
            else {
                item[data.target].call(element);
            }
        }
        else {
            item.domElement = element;
        }
    }
}
ko.bindingHandlers.timer = {
    init: function (element, valueAccessor, allBindings, item) {
        var formatter = {
            format: ' %years %weeks %days %hours %minutes%seconds',
            attrs: {
                years: '%Y YEAR%!Y:S;',
                months: '',
                weeks: '%w WEEK%!w:S;',
                daysToMonth: '%-n DAY%!n:S;',
                daysToWeek: '',
                days: '%-d DAY%!d:S;',
                hours: '%-H HOUR%!H:S;',
                minutes: '%M MINUTE%!M:S;',
                seconds: '%S SECOND%!S:S;',
                totalDays: '%-D DAY%!D:S;'
            },
            applyFormatting: function (event) {
                var format = this.format;
                format = this.formatingCallback(format, event);
                for (key in this.attrs) {
                    format = format.replace("%" + key, this.attrs[key]);
                }
                return $.trim(format);
            },
            replaceZero: function (format, key, event) {
                if (event.offset[key] == 0) {
                    format = format.replace("%" + key, "");
                }
                return format;
            },
            formatingCallback: function (format, event) {
                format = this.replaceZero(format, 'years', event);
                format = this.replaceZero(format, 'months', event);
                format = this.replaceZero(format, 'weeks', event);
                format = this.replaceZero(format, 'daysToMonth', event);
                format = this.replaceZero(format, 'days', event);
                format = this.replaceZero(format, 'hours', event);
                format = this.replaceZero(format, 'minutes', event);
                format = this.replaceZero(format, 'totalDays', event);
                format = this.replaceZero(format, 'seconds', event);
                return format;
            }
        }
        var settings = {
            formatter: formatter, format: function (event) {
                var $this = $(this).html(event.strftime(attrs.formatter.applyFormatting(event)));
            }, finish: function (event) {
            }
        };
        var attrs = valueAccessor();
        attrs = $.extend(true, {}, settings, attrs);
        var selector = $(element);
        attrs = $.extend(true, {}, settings, attrs);
        var until = ko.utils.unwrapObservable(attrs.until);
        if (ko.isObservable(attrs.until)) {
            attrs.until.subscribe(function (value) {
                selector.countdown(value);
            }, this);
        }
        if (until) {
            selector.countdown(until).on('update.countdown', attrs.format).on('finish.countdown', attrs.finish).on('stop.countdown', attrs.stop);
        }
    }
};
ko.bindingHandlers.mouseEvent = ko.bindingHandlers.mouseEvent || {
    init: function (element, valueAccessor) {
        var _options = valueAccessor(), _enterFunction = _options.enter, _leaveFunction = _options.leave,
            _swipeRightFunction = _options.swipeRight, _swipeLeftFunction = _options.swipeLeft, _model = _options.model;
        if (_enterFunction) {
            $(element).on('mouseenter', _enterFunction.bind(_model));
        }
        if (_leaveFunction) {
            $(element).on('mouseleave', _leaveFunction.bind(_model));
        }
        if (_swipeRightFunction || _swipeLeftFunction) {
            $(element).draggable({
                revert: true, axis: "x", drag: function (event, ui) {
                    var _direction = ui.originalPosition.left > ui.position.left ? 'left' : 'right';
                    if (_direction === 'left') {
                        _swipeLeftFunction.call(_model);
                    }
                    if (_direction === 'right') {
                        _swipeRightFunction.call(_model);
                    }
                    return false;
                }
            });
        }
    }
}
ko.bindingHandlers.eachProp = {
    transformObject: function (obj) {
        var properties = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                properties.push({key: key, value: obj[key]});
            }
        }
        return ko.observableArray(properties);
    }, init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            properties = ko.bindingHandlers.eachProp.transformObject(value);
        ko.bindingHandlers['foreach'].init(element, properties, allBindingsAccessor, viewModel, bindingContext)
        return {controlsDescendantBindings: true};
    }, update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            properties = ko.bindingHandlers.eachProp.transformObject(value);
        ko.bindingHandlers['foreach'].update(element, properties, allBindingsAccessor, viewModel, bindingContext)
        return {controlsDescendantBindings: true};
    }
};
ko.virtualElements.allowedBindings.eachProp = true;
ko.bindingHandlers.currency = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        $(element).text(app.currency(ko.utils.unwrapObservable(valueAccessor())));
    }, update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        $(element).text(app.currency(ko.utils.unwrapObservable(valueAccessor())));
    }
}
ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor(), defaultOptions = {dateFormat: 'm.d.y'},
            options = allBindingsAccessor().datepickerOptions || defaultOptions;
        $(element).datepicker(options);
        $(element).datepicker('setDate', value());
        ko.utils.registerEventHandler(element, "change", function () {
            var datepickerDate = $(element).datepicker("getDate"), newValue = new Date(datepickerDate).getTime();
            value(moment(newValue).format('M.D.YY'));
        });
    }, update: function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        $(element).datepicker("setDate", value);
    }
};
ko.bindingHandlers.dateFormat = {
    update: function (element, valueAccessor, allBindings) {
        $(element).text(app.formatDate(valueAccessor(), allBindings().dateFormatType));
    }
};
ko.components.register('recaptcha', {
    viewModel: function (params) {
        this.recaptchaServiceSiteKey = params.value.recaptchaServiceSiteKey;
    }, template: (function () {
        var attr = '\'data-sitekey\'';
        var html = '<div class="g-recaptcha" data-bind="attr: { ' + attr + ' : recaptchaServiceSiteKey }"></div>';
        return html;
    })()
});
ko.components.register('box-pager', {
    viewModel: function (params) {
        var self = this;
        this.items = ko.isObservable(params.items) ? params.items : ko.observableArray(params.items);
        this.onClick = params.onClick;
        this.itemsPerPage = params.itemsPerPage;
        this.itemText = params.itemText || "name";
        this.emptyArrayText = params.emptyArrayText || "No Items";
        this.pageIndex = ko.observable(1);
        this.pageCount = ko.pureComputed(function () {
            return Math.ceil(this.items().length / this.itemsPerPage);
        }, this);
        this.previousPage = function () {
            if (!this.canGoPrevious()) return;
            if (self.pageIndex() > 1) {
                self.pageIndex(self.pageIndex() - 1);
            }
        }
        this.nextPage = function () {
            if (!this.canGoNext()) return;
            if (self.pageIndex() < self.pageCount()) {
                self.pageIndex(self.pageIndex() + 1);
            }
        }
        this.canGoPrevious = ko.pureComputed(function () {
            return this.pageIndex() > 1;
        }, this);
        this.canGoNext = ko.pureComputed(function () {
            return this.pageIndex() < this.pageCount();
        }, this);
        this.checkIfInPage = function (index) {
            var to = self.pageIndex() * self.itemsPerPage;
            var from = to - self.itemsPerPage;
            return index >= from && index < to;
        };
    }, template: {element: "boxPagerTemplate"}
});
edge.Lottery.Common.GenericModel = function (data, view) {
    edge.Lottery.BaseChannelModel.apply(this, arguments);
}
edge.Lottery.Common.GenericModel.prototype = Object.create(edge.Lottery.BaseChannelModel.prototype);
edge.Lottery.Common.User = function (data) {
    this.isLoggedIn = ko.observable(false);
    this.urls = {};
    this.profile = data.profile || {};
    if (data.urls) {
        this.urls = data.urls;
    }
    this.eWallet = {
        balance: ko.observable(0),
        realBalance: ko.observable(0),
        bonusBalance: ko.observable(0),
        maxAllowWithdraw: ko.observable(0),
    };
    this.cartCount = ko.observable(0);
    this.cartTotal = ko.observable(0);
    this.applyUserData(data);
}
edge.Lottery.Common.User.prototype.verifyLoggedIn = function () {
    return app.request(this.urls.verifyLoggedIn, {}, {skipLanguage: true});
}
edge.Lottery.Common.User.prototype.logout = function () {
    app.request(this.urls.logout, {}, {skipLanguage: true}).then(function (resp) {
        if (resp) {
            window.location.href = resp.redirectUrl || '/';
        }
    }).always(function () {
        this.isLoggedIn(false);
    }.bind(this));
}
edge.Lottery.Common.User.prototype.applyUserData = function (data) {
    this.cartCount(data.cart.count);
    this.cartTotal(data.cart.total);
    if (data.balance) {
        this.eWallet.balance(data.balance.CurrentBalance);
        this.eWallet.realBalance(data.balance.CurrentRealBalance);
        this.eWallet.bonusBalance(data.balance.CurrentBonusBalance);
        this.eWallet.maxAllowWithdraw(data.balance.MaxAllowedWithdrawals);
    }
    this.isLoggedIn(data.isLoggedIn || false);
}
edge.Lottery.Common.User.prototype.updateUserData = function () {
    if (arguments.length > 0) {
        var ev = arguments[arguments.length - 1];
        if (ev.stopPropagation) {
            ev.stopPropagation();
        }
    }
    var d = $.Deferred();
    app.request('/user/userdata', {}).then(function (resp) {
        this.applyUserData(resp);
        d.resolve(this);
    }.bind(this));
    return d.promise();
}
edge.Lottery.Desktop.GenericModel = function (data, view) {
    edge.Common.GenericModel.apply(this, arguments);
}
edge.Lottery.Desktop.GenericModel.prototype = Object.create(edge.Lottery.Common.GenericModel.prototype);
ko.bindingHandlers.gameCheckbox = ko.bindingHandlers.gameCheckbox || {
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var isChecked = allBindings().checked();
        if (allBindings.has("enable")) {
            var enable = ko.utils.unwrapObservable(allBindings().enable);
            $(element).parent().toggleClass('disabled', !enable);
        }
        $(element).parent().toggleClass(valueAccessor().onClass, isChecked);
    }
}
ko.bindingHandlers.selectPicker = ko.bindingHandlers.selectPicker || {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        $(element).selectpicker();
        if (allBindings.has("value") && ko.isObservable(allBindings().value)) {
            allBindings().value.subscribe(function () {
                $(element).selectpicker('refresh');
            });
        }
    }
}
ko.bindingHandlers.maskedInput = {
    init: function (element, valueAccessor, allBindings, item) {
        var settings = valueAccessor();
        var maskOptions = {
            placeholder: settings.placeholder, completed: function () {
                settings.value(this.val().replace(/[^0-9\s]/g, "").split(" "));
            }
        };
        $(element).mask(settings.mask, maskOptions);
        $(element).attr('placeholder', settings.placeholder);
    }
}
ko.bindingHandlers.customScroller = {
    init: function (element, valueAccessor, allBindings) {
        $(element).mCustomScrollbar({
            scrollButtons: {enable: true},
            mouseWheelPixels: 80,
            theme: "3d-thick",
            scrollInertia: 0
        });
    }
};
ko.bindingHandlers.tooltip = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var local = ko.utils.unwrapObservable(valueAccessor()), options = {show: "auto"}, tmr;
        ko.utils.extend(options, ko.bindingHandlers.tooltip.options);
        ko.utils.extend(options, local);
        $(element).tooltip(options);
        var showOption = ko.utils.unwrapObservable(options.show);
        $(element).on('mouseenter', function () {
            var show;
            if (showOption == "auto") {
                var ruler = $('<span />').addClass("text-ruler").html($(element).text());
                $(element).append(ruler);
                show = $(element).width() < ruler.width();
                ruler.remove();
            } else {
                if (typeof showOption == 'function') {
                    show = showOption.call(viewModel);
                } else {
                    show = showOption;
                }
            }
            if (show && !tmr) {
                tmr = setTimeout(function () {
                    $(element).tooltip("show");
                    tmr = null;
                }, 250);
            }
        }).on("mouseout click", function () {
            $(element).tooltip("hide");
            if (tmr) {
                clearTimeout(tmr);
                tmr = null;
            }
        });
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
            $(element).tooltip("destroy");
        });
    }, options: {placement: "top", trigger: "manual",}
};
ko.bindingHandlers.singleDigitInput = ko.bindingHandlers.singleDigitInput || {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var value, next = function () {
            $(element).parent().next().children().first().select();
        }, prev = function () {
            $(element).parent().prev().children().first().select();
        }, getEventKey = function (evt) {
            var key = evt.key, code = evt.charCode;
            if (key) {
                return key;
            }
            if (code >= 48 && code <= 57) {
                return code - 48;
            }
            switch (evt.keyCode) {
                case 8:
                    return "Backspace";
                case 37:
                    return "ArrowLeft";
                case 39:
                    return "ArrowRight";
            }
        };
        if (allBindings.has("value") && ko.isObservable(allBindings().value)) {
            value = allBindings().value;
        }
        $(element).on("keypress paste", function (evt) {
            var key = getEventKey(evt);
            if (evt.type == 'keypress' && (parseInt(key) >= 0 && parseInt(key) <= 9)) {
                $(element).val(key);
                if (value) {
                    value(key);
                    next();
                }
            }
            evt.preventDefault();
        }).on("keydown", function (evt) {
            switch (getEventKey(evt)) {
                case"ArrowLeft":
                    evt.preventDefault();
                    prev();
                    break;
                case"ArrowRight":
                    evt.preventDefault();
                    next();
                    break;
                case"Backspace":
                    if (value) {
                        if (value()) {
                            value("");
                        } else {
                            evt.preventDefault();
                            prev();
                        }
                    }
            }
        });
    }
};
ko.components.register('pagination', {
    viewModel: function (params) {
        this.currentPage = ko.isObservable(params.currentPage) ? params.currentPage : ko.observable(params.currentPage);
        this.totalPages = ko.isObservable(params.totalPages) ? params.totalPages : ko.observable(params.totalPages);
        this.noResults = params.noResults;
        this.app = app;
        this.paginationArray = ko.computed(function () {
            var _temp = [], _i;
            for (_i = 0; _i < this.totalPages(); _i++) {
                _temp.push({page: _i + 1});
            }
            return _temp;
        }.bind(this));
        this.goToFistPage = function () {
            this.currentPage(1);
        }
        this.goToLastPage = function () {
            this.currentPage(this.totalPages());
        }
        this.goToNextPage = function () {
            if (this.currentPage() < this.totalPages()) {
                this.currentPage(this.currentPage() + 1);
            }
        }
        this.goToPrevPage = function () {
            if (this.currentPage() > 1) {
                this.currentPage(this.currentPage() - 1);
            }
        }
        this.goToPage = function (page) {
            this.currentPage(page);
        }
    }, template: (function () {
        var html = "", i = 0;
        html += '<nav>';
        html += '<div class="pagination" data-bind="css: {hidden: totalPages() > 0}"><p class="title" data-bind="text: noResults">no results</p></div>';
        html += '<ul class="pagination" data-type="financial" data-bind="css: { hidden: totalPages() < 2 }">';
        html += '<li class="firstPage"><a data-bind="event: {click:  goToFistPage }, css: { inactive: currentPage() == 1 }" aria-label="Previous" class="inactive"><i class="fa fa-caret-left"></i></a></li>';
        html += '<li class="prevPage" data-type="prev">';
        html += '<a aria-label="Previous" data-bind="event: {click: goToPrevPage}, css: { inactive:  currentPage()  == 1 }">';
        html += '<div data-bind="text: app.i18n.get(\'previous_page\') "></div>';
        html += '</a></li>';
        html += '<!-- ko foreach: paginationArray() -->';
        html += '<li><a data-bind="text: $data.page, click: $parent.goToPage.bind($parent, $data.page), css: { active: $parent.currentPage() == $data.page }"></a></li>';
        html += '<!-- /ko -->';
        html += '<li class="nextPage" data-type="next">';
        html += '<a data-bind="event: {click:  goToNextPage }, css: { inactive: currentPage() == totalPages() }">';
        html += '<div data-bind="text: app.i18n.get(\'next_page\') "></div>';
        html += '</a></li>';
        html += '<li class="lastPage"><a data-bind="event: {click:  goToLastPage }, css: { inactive: currentPage() == totalPages() }"><i class="fa fa-caret-right"></i></a></li>';
        html += '</ul></nav>';
        return html;
    })()
});
ko.components.register('pc-pagination', {
    viewModel: function (params) {
        this.data = params.value;
        this.currentPage = this.data.currentPage;
        this.totalPages = this.data.totalPages;
        this.noResults = this.data.noResults;
        this.showMoreRight = ko.observable(false);
        this.showMoreLeft = ko.observable(false);
        this.paginationArray = ko.computed(function () {
            var _temp = [], _i = 0, _limit = 10, _limitCounter = 10, _median = (_limit / 2),
                _moreToRight = this.currentPage() > _median && this.totalPages() > _limit, _inRange = function (page) {
                    return page > (this.currentPage() - _median) && page < (this.currentPage() + _median);
                }.bind(this);
            for (_i; _i < this.totalPages(); _i++) {
                if (_moreToRight) {
                    if (_inRange(_i)) {
                        if (_limitCounter) {
                            _temp.push({page: _i + 1});
                            _limitCounter--;
                        }
                    }
                    else if (_i > (this.totalPages() - _median)) {
                        if (_limitCounter) {
                            _temp.push({page: _i + 1});
                            _limitCounter--;
                        }
                        this.showMoreLeft(false);
                    }
                }
                else {
                    if (_limitCounter) {
                        _temp.push({page: _i + 1});
                        _limitCounter--;
                    }
                }
            }
            if (_temp[0] && _temp[0].page !== 1) {
                this.showMoreLeft(true);
            }
            else {
                this.showMoreLeft(false);
            }
            if (_temp[_temp.length - 1] && _temp[_temp.length - 1].page !== this.totalPages()) {
                this.showMoreRight(true);
            }
            else {
                this.showMoreRight(false);
            }
            return _temp;
        }.bind(this));
        this.goToFistPage = function () {
            this.currentPage(1);
        };
        this.goToLastPage = function () {
            this.currentPage(this.totalPages());
        };
        this.goToNextPage = function () {
            if (this.currentPage() < this.totalPages()) {
                this.currentPage(this.currentPage() + 1);
            }
        };
        this.goToPrevPage = function () {
            if (this.currentPage() > 1) {
                this.currentPage(this.currentPage() - 1);
            }
        };
        this.goToPage = function (page) {
            this.currentPage(page)
        }
    }, template: {element: 'pc-pagination_template'}
});
ko.components.register('ionslider', {
    viewModel: function (params) {
        var self = this;
        var slider = null;
        this.sliderID = 'slider_' + Math.floor(Math.random() * 10001);
        if (params.value == undefined) params.value = ko.observable(params.min); else if (!ko.isObservable(params.value)) params.value = ko.observable(params.value);
        if (params.items == undefined) {
            if (params.min == undefined) params.min = 0; else if (ko.isObservable(params.min)) {
                this.observableMin = params.min;
                this.observableMin.subscribe(function (newValue) {
                    if (slider != undefined) {
                        slider.data("ionRangeSlider").update({min: newValue});
                        if (newValue > params.value()) {
                            params.value(newValue);
                        }
                    }
                });
                params.min = params.min();
            }
            if (params.max == undefined) params.max = 10; else if (ko.isObservable(params.max)) {
                this.observableMax = params.max;
                this.observableMax.subscribe(function (newValue) {
                    if (slider != undefined) {
                        slider.data("ionRangeSlider").update({max: newValue});
                        if (newValue < params.value()) {
                            params.value(newValue);
                        }
                    }
                });
                params.max = params.max();
            }
        } else {
            if (!ko.isObservable(params.items)) {
                this.observableItems = ko.observableArray(params.items);
            } else {
                this.observableItems = params.items;
            }
            this.observableItems.subscribe(function (newValues) {
                if (slider != undefined) {
                    slider.data("ionRangeSlider").update({values: newValues, from: 0});
                    params.value(slider.val());
                }
            });
            this.itemValue = $.inArray(params.value(), this.observableItems());
        }
        if (params.step == undefined) params.step = 1;
        params.value.subscribe(function (newValue) {
            if (slider != undefined) {
                if (params.items == undefined) {
                    slider.data("ionRangeSlider").update({from: newValue});
                } else {
                    self.itemValue = $.inArray(newValue, self.observableItems());
                    if (self.itemValue != -1) {
                        slider.data("ionRangeSlider").update({from: self.itemValue});
                    }
                }
            }
        });
        setTimeout(function () {
            slider = $("#" + self.sliderID);
            var settings = {
                type: 'single', step: params.step, force_edges: true, onFinish: function (data) {
                    params.value($(data.input).val());
                }
            };
            if (params.min != undefined) settings.min = params.min;
            if (params.max != undefined) settings.max = params.max;
            if (params.items != undefined) {
                settings.values = self.observableItems();
                settings.from = self.itemValue;
            } else {
                settings.from = params.value();
            }
            slider.ionRangeSlider(settings);
        }, 0);
    }, template: '<input type="text" data-bind="attr: {id: sliderID, name: sliderID}" value="" />'
});
ko.components.register('socialmedia', {
    viewModel: function (params) {
        var tagsToReplace = {
            genericTags: {regex: /(<([^>]+)>)/ig, replacement: ''},
            htmlSpace: {regex: /&([^\s]*);/g, replacement: ''}
        };

        function replaceTags(str) {
            for (var key in tagsToReplace) {
                str = str.replace(tagsToReplace[key].regex, tagsToReplace[key].replacement);
            }
            return str;
        }

        this.articleTitle = replaceTags(params.value.teaserText);
        var mainText = replaceTags(params.value.mainText);
        var blogAssetUrl = "http://montanalottery.com/images/logo.png";
        var articleShareUrl = location.protocol + "//" + window.location.hostname + params.value.articleUrl;
        this.twitterUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(this.articleTitle) + "\n" + encodeURIComponent(mainText) + "&url=" + encodeURIComponent(window.location.href) + "&via=montanalottery";
        this.emailUrl = "mailto:" + params.value.email + "?subject=MontanaLottery-Winner%20Stories - " + encodeURIComponent(this.articleTitle) + "&body=" + encodeURIComponent(mainText);
        this.shareEnabled = ko.observable();
        this.emailTo = ko.observable("");
        this.emailFrom = ko.observable("");
        this.emailText = ko.observable("");
        this.emailUrlField = articleShareUrl;
        this.recaptchaServiceSiteKey = params.value.recaptchaServiceSiteKey;
        this.captchaError = ko.observable("");
        this.captchaId = ko.observable();
        this.loadingAjax = ko.observable(false);
        this.openEmailModal = function () {
            var self = this;
            app.dialog("shareEmail", "", this.getEmailModalTemplate(), [], false, null, {
                'beforeShow': function () {
                    self.shareEnabled(true);
                    ko.cleanNode(this[0]);
                    ko.applyBindings(self, this[0]);
                    $("#shareViaEmail").validate();
                    grecaptcha.render("captcha", {sitekey: self.recaptchaServiceSiteKey});
                }
            }).on("hidden.bs.modal", function () {
            });
        };
        this.getEmailModalTemplate = function () {
            return "<h4 class='col-xs-10 col-xs-offset-2 mgb20' data-bind='text: articleTitle'></h4>" + "<form id='shareViaEmail' class='form-horizontal'>" + "<div class='form-group row'>" + "<label class='col-xs-2 control-label' for='emailTo'>To:</label>" + "<div class='col-xs-10 mgb10'>" + "<input type='email' class='form-control' id='emailTo' data-bind='textInput: emailTo' required >" + "</div>" + "<label class='col-xs-2 control-label' for='emailFrom'>From:</label>" + "<div class='col-xs-10 mgb10'>" + "<input type='email' class='form-control' id='emailFrom' data-bind='textInput: emailFrom' required >" + "</div>" + "<label class='col-xs-2 control-label' for='message'>Message:</label>" + "<div class='col-xs-10 mgb10'>" + "<textarea class='form-control' id='comment' data-bind='textInput: emailText' required></textarea>" + "</div>" + "<label class='col-xs-2 control-label' for='emailTo'>URL:</label>" + "<div class='col-xs-10 mgb20'>" + "<input type='text' disabled class='form-control' id='emailUrl' data-bind='textInput: emailUrlField' required >" + "</div>" + "</div>" + "<div id='captcha' class='g-recaptcha pull-right mgb20'></div>" + "<div data-bind='text: captchaError()'></div>" + "<img src='/static/ui/ds/ajax-loader.gif' data-bind='visible: loadingAjax()' />" + "<button class='bgr-main cw button text-center cl pull-right' data-bind='click: sendEmail'>SEND EMAIL</button>" + "</form>";
        };
        this.sendEmail = function () {
            if ($("#shareViaEmail").valid() && this.shareEnabled()) {
                this.captchaError("");
                this.shareEnabled(false);
                var emailData = {
                    emailTo: this.emailTo(),
                    emailFrom: this.emailFrom(),
                    emailText: this.emailText(),
                    emailUrlField: this.emailUrlField,
                    recaptchaResponse: this.getRecapthcaResponse()
                };
                this.loadingAjax(true);
                var self = this;
                app.request(params.value.ajaxUrl, emailData, {'skipLanguage': true}).then(function (response) {
                    self.loadingAjax(false);
                    if (!response.success) {
                        self.captchaError(response.message);
                        self.shareEnabled(true);
                    } else
                        self.mailSendResponse();
                });
            }
        };
        this.getRecapthcaResponse = function () {
            return $('.g-recaptcha-response').val();
        };
        this.mailSendResponse = function () {
            this.emailTo("");
            this.emailFrom("");
            this.emailText("");
            this.recaptchaServiceSiteKey = params.value.recaptchaServiceSiteKey;
            this.captchaError("");
            $("#shareEmail").find(".modal-body").fadeOut(function () {
                $(this).css("height", $(this).height());
                $(this).html("<h4>Message was sent successully</h4>");
                $(this).fadeIn();
            });
        };
    }, template: (function () {
        var html = "<ul class='list-inline pull-left socialmedia'>" + "<li class='cr-main'>Share This Post</li>" + "<li><a href='#'><img src='/static/imgs/icon_facebook.png' /></a></li>" + "<li><a data-bind='attr: { href: twitterUrl }'><img src='/static/imgs/icon_twitter.png' /></a></li>" + "<li><a data-bind='click: openEmailModal'><img src='/static/imgs/icon_mail.png' /></a></li>" + "</ul>";
        return html;
    })()
});
edge.Lottery.Desktop.App = function (applicationMode, lang, pageId, pageIdentifier) {
    edge.Lottery.Common.App.apply(this, arguments);
    var self = this;
    this._pageId = pageId;
    this._pageIdentifier = pageIdentifier;
    this.pageDialogPending = false;
    this.loader = {
        enabled: true, selector: '.loader', show: function () {
            if (this.enabled) {
                $(this.selector).show();
            }
            this.enabled = true;
            return this;
        }, hide: function () {
            $(this.selector).hide();
            return this;
        }
    };
    this.postMessageHandler = {
        callbacks: {}, initialize: function () {
            $(window).on('message', this.handler.bind(this));
        }, register: function (messageName, callback) {
            if (typeof callback == 'function') {
                this.callbacks[messageName] = callback;
            }
        }, send: function (iframeDomElement, message, targetHost) {
            if (targetHost == "") {
                targetHost = self.getHost();
            }
            console.log('sending message', message);
            if (iframeDomElement.contentWindow) {
                iframeDomElement.contentWindow.postMessage(message, targetHost);
            }
        }, isValidOrigin: function (origin) {
            return true;
        }, handler: function (e) {
            if (this.isValidOrigin(e.originalEvent.origin)) {
                if (typeof this.callbacks[e.originalEvent.data] == 'function') {
                    this.callbacks[e.originalEvent.data](e.originalEvent);
                }
            }
        }
    };
    this.postMessageHandler.initialize();
}
edge.Lottery.Desktop.App.prototype = Object.create(edge.Lottery.Common.App.prototype);
edge.Lottery.Desktop.App.prototype.ajaxSetup = function () {
    var showError = function (xhr) {
        var err = xhr.error();
        var responseData = err.responseText;
        try {
            var responseData = JSON.parse(responseData) || {error: ""};
        }
        catch (e) {
            responseData = {error: responseData};
        }
        var errorMessage = '<h3> ' + responseData.error + '</h3>';
        if (app._applicationMode == "development" && responseData.debug) {
            errorMessage += '<h4>debug data</h4>';
            if (typeof responseData.debug.raw == "string") {
                try {
                    var doc = $.parseXML(responseData.debug.raw);
                    responseData.debug.raw = xmlToJson(doc);
                }
                catch (err) {
                }
            }
            responseData.debug = JSON.stringify(responseData.debug, null, 2);
        }
        else {
            responseData.debug = "";
        }
        errorMessage += '<div style="max-height:500px;overflow:auto"><pre>' + responseData.debug + '</pre></div>';
        app.dialog("#errorDialog", app.i18n.get('error'), errorMessage, null, true);
    }
    $.ajaxSetup({
        statusCode: {
            401: function () {
            }, 403: function () {
                window.location.href = "/";
            }, 503: function () {
                window.location.href = "/static/maintenance-mobile.html";
            }, 404: showError, 500: showError, 502: showError,
        }
    });
}
edge.Lottery.Desktop.App.prototype.init = function (settings) {
    $(document).off("click", ".urlDialog").on("click", ".urlDialog", function (event) {
        event.preventDefault();
        var settings = $(this).data();
        var url = $(this).attr("href");
        app.urlDialog(url, settings);
    });
    this.ajaxSetup();
    this.setupAjaxLoader();
    window.onbeforeunload = function () {
        app.loader.show();
    };
    this.socketio = (function () {
        return {
            connect: function () {
                if (!this.server) {
                    this.server = io("", {path: "/" + settings.nodePath});
                }
            }, disconnect: function () {
                this.server.disconnect(true);
            }, events: {keno: {lastDraw: 'kenolive-lastdraw', nextDraw: 'kenolive-nextdraw'}}, server: null
        };
    })();
    edge.Lottery.Common.App.prototype.init.apply(this, arguments);
}
edge.Lottery.Desktop.App.prototype.setupAjaxLoader = function () {
    var self = this;
    var _ajaxStopTimeout = null;

    function ajaxEndFunction() {
        if (_ajaxStopTimeout) {
            window.clearTimeout(_ajaxStopTimeout);
        }
        _ajaxStopTimeout = window.setTimeout(function () {
            self.loader.hide();
        }, 500);
    }

    $(document).ajaxStart(function () {
        self.loader.show();
    });
    $(document).ajaxStop(ajaxEndFunction);
    $(document).ajaxError(ajaxEndFunction);
}
edge.Lottery.Desktop.App.prototype.getInstanceModel = function (modelName) {
    if (edge.observables[modelName]) {
        return edge.observables[modelName]();
    }
    throw new edge.Exception('get instance model modelName:' + modelName + ' doesn\'t exist', this.getModelsList());
}
edge.Lottery.Desktop.App.prototype.getInstances = function () {
    return edge.observables;
}
edge.Lottery.Desktop.App.prototype.getModelsList = function () {
    var list = [];
    for (var observable in edge.observables) {
        list.push(observable);
    }
    return list;
}
edge.Lottery.Desktop.App.prototype.urlDialog = function (url, settings) {
    var settings = settings || {};
    var shownCallback = null;
    var fn;
    if (settings.shown && (fn = this.getFunction(settings.shown)) !== false) {
        settings.callback = settings.callback || {};
        shownCallback = fn;
        delete(settings.shown);
    }
    if (settings.hidden && (fn = this.getFunction(settings.hidden)) !== false) {
        settings.callback = settings.callback || {};
        settings.callback.hidden = fn;
        delete(settings.hidden);
    }
    if (settings.beforeShow && (fn = this.getFunction(settings.beforeShow)) !== false) {
        settings.callback = settings.callback || {};
        settings.callback.beforeShow = fn;
        delete(settings.beforeShow);
    }
    var defaultSettings = {
        id: 'urlDialog',
        title: 'basic title',
        text: '<div class="loadingDialog"></div>',
        buttons: null,
        customClass: '',
        callback: {
            shown: function (event) {
                if (/\.(?:jpg|jpeg|gif|png)$/i.test(url)) {
                    this.setBody('<img src="' + url + '"/>');
                }
                else {
                    var dialog = this;
                    $.get(url).done(function (resp) {
                        dialog.setBody(resp);
                        if (shownCallback) {
                            shownCallback.call(dialog, event, resp);
                        }
                    }).fail(function (xhr) {
                        dialog.setBody(xhr.responseText);
                    });
                }
            }, hidden: null, beforeShow: null
        }
    };
    settings = $.extend(true, {}, defaultSettings, settings);
    this.dialog(settings.id, settings.title, settings.text, settings.buttons, false, settings.customClass, settings.callback);
};
edge.Lottery.Desktop.App.prototype.navigateToPage = function (url) {
    window.location.href = url;
}
edge.Lottery.Desktop.App.prototype.pageRequest = function (slug, requestCallback, settings) {
    var defaultSettings = {skipLanguage: true};
    settings = $.extend(true, {}, defaultSettings, settings || {});
    app.request(slug, {loadView: true}, settings).then(function (response) {
        if (requestCallback) {
            requestCallback(response);
        }
    });
}
edge.Lottery.Desktop.App.prototype.responseToDomElement = function (domElement, response) {
    var observables = {}, bindTo = domElement.get(0);
    for (var observableName in response.models) {
        var model = response.models[observableName];
        var data = model.model[observableName], view = $('[data-bind="with: ' + observableName + '"]');
        data.widgetUpdate = {arguments: model['arguments'], name: model['name'], id: model['id']};
        try {
            observables[observableName] = ko.observable(new (app.getFunction('edge.' + response.models[observableName].jsClass))(data, view));
        }
        catch (e) {
            app.errorMessage(e);
        }
    }
    edge.observables = $.extend(true, {}, edge.observables, observables);
    ko.applyBindings(observables, bindTo);
    return observables;
}
edge.Lottery.Desktop.App.prototype.pageDialog = function (url, dialogOptions) {
    var dialogOptions = $.extend({}, dialogOptions);
    if (this.pageDialogPending === true) {
        return;
    }
    this.pageDialogPending = true;
    var self = this;
    var dialogOptions = dialogOptions || {}, observables;
    var callbacks = $.extend(true, {}, dialogOptions.callbacks || {});
    var defaultDialogCallBacks = {
        hidden: function () {
            this.remove();
            if (callbacks.hidden) {
                callbacks.hidden.call(self);
            }
        }, beforeShow: function () {
            var self = this;
            app.pageRequest(url, function (response) {
                self.setBody(response.view);
                self.setTitle(response.page.title || '');
                var bindTo = $("#pageDialog .modal-content");
                if (bindTo) {
                    observables = app.responseToDomElement(bindTo, response);
                    self.open();
                }
                if (callbacks.beforeShow) {
                    callbacks.beforeShow.call(self);
                }
            }, {
                error: function () {
                    app.pageDialogPending = false;
                }
            });
        }, shown: function () {
            for (var key in observables) {
                var m = observables[key]();
                m.onRender();
                m.onViewShow();
            }
            self.pageDialogPending = false;
            if (callbacks.shown) {
                callbacks.shown.call(self);
            }
        }
    };
    if (dialogOptions.callbacks) {
        for (key in defaultDialogCallBacks) {
            if (dialogOptions.callbacks[key]) {
                delete dialogOptions.callbacks[key];
            }
        }
    }
    dialogOptions.callbacks = $.extend({}, defaultDialogCallBacks, dialogOptions.callbacks || {});
    return app.dialog("pageDialog", "loading", "loading", null, false, dialogOptions.class ? dialogOptions.class : '', dialogOptions.callbacks, {show: false});
}
edge.Lottery.Desktop.App.prototype.loginIfRequired = function () {
    var d = $.Deferred();
    if (this.user().isLoggedIn()) {
        d.resolve();
    }
    else {
        var dialog, onLogin = function (evt, resp) {
            dialog.close();
            d.resolve();
        };
        dialog = app.pageDialog(app.navigation.get("login_page"), {
            class: 'modalLoginTemplate',
            callbacks: {
                beforeShow: function () {
                    $(document).on("onLogin", onLogin);
                }, hidden: function () {
                    $(document).off("onLogin", onLogin);
                    if (!this.user().isLoggedIn()) {
                        d.reject();
                    }
                }
            }
        });
    }
    return d.promise();
}
edge.Lottery.Desktop.App.prototype.confirmationDialog = function (title, message) {
    var d = $.Deferred();
    var dialog = app.dialog("confirmationDialog", title, message, [{
        cssClass: 'btn btn-gray2 btn-white',
        title: app.i18n.get("yes"),
        func: function () {
            d.resolve();
            dialog.close();
        }
    }, {
        cssClass: 'btn btn-gray2 ', title: app.i18n.get("no"), func: function () {
            d.reject();
            dialog.close();
        }
    },], false, null);
    return d.promise();
}
edge.Lottery.Desktop.App.prototype.couponPlaySummaryDialog = function (resp) {
    var d = $.Deferred();
    var dialog = app.dialog('couponPlaySummary', "", $('#couponPlaySummaryDialog'), [{
        cssClass: 'btn btn-green2',
        title: app.i18n.get('continue'),
        func: function () {
            dialog.close();
        }
    }], false, null, {
        beforeShow: function () {
            ko.applyBindings(resp, this.get(0));
        }, hidden: function () {
            ko.cleanNode(this.get(0));
            d.resolve(resp);
        }
    });
    return d.promise();
}
edge.Lottery.Desktop.App.prototype.hexToRgb = function (hex) {
    hex = hex.replace("#", "");
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return r + "," + g + "," + b;
}
edge.Lottery.Desktop.App.Project = function (applicationMode, lang, pageId, pageIdentifier) {
    edge.Lottery.Desktop.App.apply(this, arguments);
    this.header = null;
    this.footer = null;
}
edge.Lottery.Desktop.App.Project.prototype = Object.create(edge.Lottery.Desktop.App.prototype);
edge.Lottery.Common.Results = function (data, view) {
    edge.Lottery.BaseChannelModel.apply(this, arguments);
    var self = this;
    this.games = data["games"];
    this.resultList = ko.observableArray([]);
    this.optionGame = ko.observable(data.selectedGame);
    this.optionDate = ko.observable(-1);
    this.optionDraw = ko.observable(-1);
    this.showDrawDetailsId = ko.observable();
    this.drawDetails = ko.observable();
    this.gameCssClass = ko.pureComputed(function () {
        return this.drawDetails() ? this.drawDetails().gameCssClass : null;
    }, this);
    this.initialDrawInfo = $.map(data.initialDrawInfo.results, function (value, index) {
        return [value];
    });
    var today = new Date();
    var pastDate = new Date();
    pastDate.setDate(today.getDate() - 365);
    this.optionDateList = app.getAllDates(pastDate, today);
    this.optionDateList.reverse();
}
edge.Lottery.Common.Results.prototype = Object.create(edge.Lottery.BaseChannelModel.prototype);
edge.Lottery.Common.Results.prototype.getDrawList = function (id) {
    if (id == undefined) {
        var allGames = [];
        for (var i = 0; i < this.games.length; i++) {
            allGames.push(this.games[i]["id"]);
        }
        app.request('/get/draw/multi/result', {"gameIds": allGames}).done(function (resp) {
            var draws = $.map(resp, function (value, index) {
                return [value];
            });
            this.resultList(this.formatMultiDrawResults(draws));
        }.bind(this));
    }
};
edge.Lottery.Common.Results.prototype.getDrawDetails = function (gameId, drawNumber) {
    function sortResultsOfAdditionalGames(results) {
        results.forEach(function (result) {
            result.areas.forEach(function (area) {
                if (area.winningNumbers) {
                    area.winningNumbers.sort(function (a, b) {
                        return parseInt(a.number) > parseInt(b.number);
                    });
                }
            });
        });
        return results;
    }

    var draw = ko.utils.arrayFirst(this.resultList(), function (item) {
        return item.drawNumber == drawNumber;
    });
    if (draw && draw._processed) {
        this.drawDetails(draw);
        this.showDrawDetailsId(drawNumber);
    }
    else {
        app.request('/get/draw/results', {"gameId": gameId, "drawId": drawNumber}).done(function (resp) {
            if (!resp.results.length && draw) {
                resp.results = draw.results;
            }
            resp.results = resp.results || draw.results;
            resp.files = resp.files || [];
            this.formatDrawResults(resp);
            this.addDivisionsToDrawDetails(resp);
            if (resp.gameSettings.hasAdditionalGames && resp.additionalGameResults) {
                sortResultsOfAdditionalGames(resp.additionalGameResults);
            }
            this.drawDetails(resp);
            resp._processed = true;
            if (draw) {
                this.resultList.replace(draw, resp);
            }
            this.showDrawDetailsId(drawNumber);
        }.bind(this));
    }
};
edge.Lottery.Common.Results.prototype.addDivisionsToDrawDetails = function (draw) {
    var game = ko.utils.arrayFirst(this.games, function (g) {
        return g.id == draw.gameId;
    });
    var divisions = game.divisions || [];
    if (!draw.prizes) {
        draw.prizes = [];
    }
    var max = Math.max(game.divisions.length, draw.prizes.length);
    for (i = 0; i < max; i++) {
        if (i >= draw.prizes.length) {
            draw.prizes[i] = {};
        }
        var prize = draw.prizes[i];
        prize.show = true;
        prize.divisionName = "";
        prize.divisionDesc = "";
        if (i < divisions.length) {
            prize.divisionName = divisions[i].divisionName;
            prize.divisionDesc = divisions[i].divisionDesc;
        }
        if (game.hasAdditionalGames && i > 10) {
            prize.divisionDesc = app.currency(prize.jubilazoCat);
            prize.show = !!prize.jubilazoCat;
        }
    }
    return draw;
}
edge.Lottery.Common.Results.prototype.showDrawDetails = function (draw) {
    if (draw.drawNumber == this.showDrawDetailsId() || !draw.results) {
        this.showDrawDetailsId(null);
    } else {
        this.getDrawDetails(draw.gameId, draw.drawNumber);
    }
};
edge.Lottery.Common.Results.prototype.getGameTemplate = function (model, drawNumber, gameType) {
    if (drawNumber == model.showDrawDetailsId()) {
        return "detailTemplate_" + (["lotto", "lotto3", "racha", "passive", "keno", "powerball", "cash3"].indexOf(gameType) != -1 ? 1 : 0);
    }
    return '';
};
edge.Lottery.Common.Results.prototype.checkIfSameDay = function (day1, day2) {
    day1 = new Date(day1).setHours(0, 0, 0, 0);
    day2 = new Date(day2).setHours(0, 0, 0, 0);
    return day1 === day2;
};
edge.Lottery.Common.Results.prototype.getResultNumbersString = function (winningNumbers, supNumbers, index) {
    var delimiter = this.resultList()[index].gameSettings.gameType !== "passive" ? ", " : "";
    if (!winningNumbers) return app.i18n.get("results_not_available");
    var numbersString = "";
    for (var i = 0; i < winningNumbers.length; i++) {
        numbersString += winningNumbers[i].number;
        if (i < winningNumbers.length - 1) {
            numbersString += delimiter;
        }
    }
    if (supNumbers.length > 0) {
        numbersString += " | ";
    }
    for (var i = 0; i < supNumbers.length; i++) {
        numbersString += supNumbers[i].number;
        if (i < supNumbers.length - 1) {
            numbersString += ',';
        }
        supNumberStart = true;
    }
    return numbersString;
};
edge.Lottery.Common.Results.prototype.formatMultiDrawResults = function (draws) {
    for (var i = 0; i < draws.length; i++) {
        this.formatDrawResults(draws[i]);
    }
    return draws;
}
edge.Lottery.Common.Results.prototype.formatDrawResults = function (draw) {
    var game = ko.utils.arrayFirst(this.games, function (g) {
        return g.id == (draw.gameId || draw.game.gameStateId);
    });
    draw.gameSettings = game;
    draw.gameId = game.id;
    draw.numberCategories = game.numberCategories;
    draw.winningNumbers = null;
    draw.supNumbers = null;
    if (draw.epochDrawDate) {
        draw.drawDate = draw.epochDrawDate * 1000;
    }
    if (draw.results) {
        if (typeof draw.results === 'string') {
            var results = draw.results.split(",");
            draw.results = [];
            $.each(results, function (i, num) {
                draw.results[i] = {number: num}
            });
        }
        draw.winningNumbers = draw.results.slice(0, game.numberCategories.mainNumbers);
        draw.supNumbers = draw.results.slice(game.numberCategories.mainNumbers, Number(game.numberCategories.mainNumbers + game.numberCategories.secondaryNumbers));
        if (["racha", "lotto", "powerball", "keno"].indexOf(game.gameType) != -1) {
            draw.winningNumbers.sort(function (a, b) {
                return parseInt(a.number) > parseInt(b.number);
            });
        }
    }
    return draw;
}
edge.Lottery.Desktop.Results = function (data, view) {
    edge.Lottery.Common.Results.apply(this, arguments);
    var self = this;
    self.currentPage = ko.observable(1);
    self.currentPage.subscribe(function (newValue) {
        if (!self.gameIsChanging()) {
            self.getGameDrawResults(self.optionGame(), self.pageSize, newValue);
        }
        self.gameIsChanging(false);
    }.bind(this));
    setTimeout(function () {
        if (data.selectedGame != -1) {
            self.optionGame(parseInt(data.selectedGame));
            $('#gameoption_' + parseInt(data.selectedGame)).attr('selected', true);
            $("#filterDate").selectpicker('refresh');
            $("#filterDraw").selectpicker('refresh');
        }
        self.isInitialCall(false);
    }, 1500);
    this.optionGame.subscribe(function (newValue) {
        if (newValue > -1) {
            if (!self.isInitialCall()) {
                self.gameIsChanging(true);
                self.currentPage(1);
                self.getGameDrawResults(newValue, self.pageSize, self.currentPage());
                self.gameIsChanging(false);
            }
            self.showPagination(true);
        }
        else if (newValue == -1) {
            self.showPagination(false);
            if (self.isInitialCall()) {
                self.resultList(self.formatMultiDrawResults(self.initialDrawInfo));
            } else {
                self.getDrawList();
            }
        }
        if ((newValue == 0 || newValue == -1) && !$("#filterDate").attr("disabled")) {
            $("#filterDate").val(0);
            $("#filterDate").attr("disabled", true);
            $("#filterDraw").val(0);
            $("#filterDraw").attr("disabled", true);
            self.optionDate(-1);
            self.optionDraw(-1);
        } else if ($("#filterDate").attr("disabled")) {
            $("#filterDate").attr("disabled", false);
            $("#filterDate").selectpicker('refresh');
            $("#filterDraw").attr("disabled", false);
            $("#filterDraw").selectpicker('refresh');
        }
        setTimeout(function () {
            $("#filterDate").selectpicker('refresh');
            $("#filterDraw").selectpicker('refresh');
        }, 0);
    });
    this.optionDate.subscribe(function (newValue) {
        if (newValue > -1) {
            var date = app.formatDate(newValue, "yyyy-mm-dd");
            var end = app.formatDate(newValue, "yyyy-mm-dd");
            var arguments = {
                'gameId': this.optionGame(),
                'start': date,
                'end': end,
                'extraArgs': {'pageSize': this.pageSize}
            };
            this.showDrawDetailsId(null);
            app.request('/get/draw/by/time', arguments).done(function (resp) {
                this.currentPage(1);
                this.totalPages(Math.ceil(resp.totalResults / this.pageSize));
                this.resultList(this.formatMultiDrawResults(resp['items']));
            }.bind(this));
        }
    }.bind(this));
    this.pageSize = data.pageSize;
    this.totalPages = ko.observable(Math.ceil(data.initialDrawInfo.totalResults / this.pageSize));
    this.isInitialCall = ko.observable(true);
    this.showPagination = ko.observable(false);
    this.gameIsChanging = ko.observable(false);
}
edge.Lottery.Desktop.Results.prototype = Object.create(edge.Lottery.Common.Results.prototype);
edge.Lottery.Desktop.Results.prototype.onViewShow = function () {
    if (app.genericSubHeader) {
        app.genericSubHeader.setGenericSubHeaderTitles(this.customPageTitle, this.customSubTitle);
    }
    if (app.breadcrumb) {
        app.breadcrumb.setPageBreadCrumb([{"title": app.i18n.get("results"), "func": null}]);
    }
}
edge.Lottery.Desktop.Results.prototype.getGameDrawResults = function (gameId, numDraws, currentPage) {
    var arguments = {'gameId': gameId, 'numDraws': numDraws, 'extraArgs': {'currentPage': currentPage,}};
    this.showDrawDetailsId(null);
    app.request('/get/draw/with/prizes', arguments).done(function (resp) {
        if (this.currentPage() == 1) {
            this.totalPages(Math.ceil(resp.totalResults / this.pageSize));
        }
        var draws = this.formatMultiDrawResults(resp.results);
        this.resultList(draws);
    }.bind(this));
}
edge.Lottery.Common.CompanyLogo = function (data, view) {
    edge.Lottery.BaseChannelModel.apply(this, arguments);
    this.assetUrl = data.assetUrl;
}
edge.Lottery.Common.CompanyLogo.prototype = Object.create(edge.Lottery.BaseChannelModel.prototype);
edge.Lottery.Common.CompanyLogo.prototype.navigateToHome = function () {
    app.navigateToPage(app.navigation.get("home_page"));
};
"use strict";
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
} : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

edge = window.edge || {};
edge.pam = edge.pam || {};
edge.pam.Common = edge.pam.Common || {};
edge.pam.Common.BaseModel = function () {
    function BaseModel(data, view) {
        _classCallCheck(this, BaseModel);
        for (var key in data) {
            if (_typeof(data[key]) != "object" || data[key] === null) {
                this[key] = data[key] || "";
            }
        }
        this.view = view;
        this.widgetUpdate = data ? data.widgetUpdate : false;
        this.hideModalTimer = null;
    }

    _createClass(BaseModel, [{
        key: "update", value: function update(data) {
            var _url = this.widgetUpdate ? '/updateWidgetData/' + this.widgetUpdate.id : false,
                _models = edge.observables || this.view._models, _modelName = this.widgetUpdate.jsClass,
                _showLoader = app.pam.showLoader || function () {
                    console.warn('loading...');
                }, _hideLoader = app.pam.hideLoader || function () {
                }, _args = data != undefined ? data : this.widgetUpdate.arguments;
            if (_url) {
                _showLoader(this.view.domElement || this.view);
                return app.pam.request(_url, _args, {skipLanguage: false}).done(function (resp) {
                    var evalModel = eval('edge.' + _modelName), _keyName = Object.keys(resp)[0], _view = this.view,
                        _updatedModel = new evalModel(resp[_keyName], _view);
                    _updatedModel.widgetUpdate = this.widgetUpdate;
                    _models[_keyName](_updatedModel);
                    _hideLoader();
                }.bind(this));
            }
        }
    }, {
        key: "showErrorMessage", value: function showErrorMessage(title, message, delay) {
            if (app && app.pam && app.errorMessage) {
                app.pam.errorMessage(title, message, delay);
            }
        }
    }, {
        key: "onRender", value: function onRender() {
        }
    }, {
        key: "onViewAfterShow", value: function onViewAfterShow() {
        }
    }, {
        key: "onViewShow", value: function onViewShow() {
            $(this.view).show();
        }
    }, {
        key: "pageTitle", value: function pageTitle() {
        }
    }, {
        key: "onViewHide", value: function onViewHide() {
        }
    }, {
        key: "onBeforeHide", value: function onBeforeHide() {
        }
    }]);
    return BaseModel;
}();
"use strict";
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();
var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;
        if (getter === undefined) {
            return undefined;
        }
        return getter.call(receiver);
    }
};

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

edge.pam.Common.BaseForm = function (_edge$pam$Common$Base) {
    _inherits(BaseForm, _edge$pam$Common$Base);

    function BaseForm(data, view) {
        _classCallCheck(this, BaseForm);
        var _data = data || {};
        var _this = _possibleConstructorReturn(this, (BaseForm.__proto__ || Object.getPrototypeOf(BaseForm)).call(this, _data, view));
        _this.dateData = {
            days: _this.getDateNumbers(1, 31),
            months: _this.getDateNumbers(1, 12),
            years: _this.getDateYears(100, 17)
        };
        _this.formClass = _data.formClass || "form";
        _this.prefix = _data.prefix || "form_";
        _this.actionUrl = '/';
        _this.steps = false;
        _this.registrationStep = ko.observable(1);
        _this.buttonText = ko.observable(_this.steps ? "Next" : "Submit");
        _this.backButtonText = 'Back';
        _this.validateOptions = {focusInvalid: false, errorElement: 'p', showErrors: _this.addCustomErrorClass};
        _this.registrationStep.subscribe(function (val) {
            if (val && this.steps) {
                this.buttonText(this.registrationStep() < this.steps ? "Next" : "Submit");
            }
        }, _this);
        _this.passwordRules = [{
            type: 'minChars',
            value: 8,
            message: app.pam.messages.register_min_chars,
            valid: ko.observable(false)
        }, {
            type: 'noSpaces',
            value: true,
            message: app.pam.messages.register_no_spaces,
            valid: ko.observable(false)
        }, {
            type: 'letter',
            value: 1,
            message: app.pam.messages.register_letter,
            valid: ko.observable(false)
        }, {type: 'digit', value: 1, message: app.pam.messages.register_digit, valid: ko.observable(false)}];
        return _this;
    }

    _createClass(BaseForm, [{
        key: "onRender", value: function onRender() {
            _get(BaseForm.prototype.__proto__ || Object.getPrototypeOf(BaseForm.prototype), "onRender", this).call(this);
            var _running = this.running, _cachedValues = this.cachedValues || {},
                _validator = this.customValidators.bind(this);
            $.validator.addMethod("uniqueField", function (value, element) {
                var _url = element.dataset.validation, _field = element.dataset.name, _result = false,
                    _data = {field: _field, value: value}, _options = {skipLanguage: true, async: false};
                if (_cachedValues[_field] == value) {
                    return $(element).hasClass('valid');
                }
                _cachedValues[_field] = value;
                if (_running) {
                    return;
                }
                _running = true;
                app.pam.request(_url, _data, _options).done(function (resp) {
                    _running = false;
                    _result = !resp.Exists ? true : false;
                });
                return _result;
            }, "Already in use");
            $.validator.addMethod("customRule", function (value, element, validator) {
                return _validator(validator)(value);
            }, app.pam.messages.register_invalid_custom);
            jQuery.validator.addMethod("alphabetic", function (value, element) {
                return this.optional(element) || /^[a-z]+$/i.test(value);
            }, app.pam.messages.register_letters_only);
            $.validator.addMethod("notEqualTo", function (value, element, target) {
                var $target = $(target);
                if (value) {
                    return value != $target.val();
                } else return this.optional(element);
            }, app.pam.messages.register_not_equal);
            $.validator.methods.email = function (value, element) {
                var _regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return this.optional(element) || _regex.test(value);
            };
            jQuery.extend(jQuery.validator.messages, {
                email: app.pam.messages.register_invalid_email,
                required: app.pam.messages.register_required_field
            });
        }
    }, {
        key: "onViewShow", value: function onViewShow() {
            this.init();
            $(this.view).show();
        }
    }, {
        key: "getDateNumbers", value: function getDateNumbers(start, end) {
            var i = start, arr = [];
            while (i <= end) {
                if (i < 10) {
                    arr.push('0' + i);
                } else {
                    arr.push(i);
                }
                i++;
            }
            return arr;
        }
    }, {
        key: "getDateYears", value: function getDateYears(startOffset, endOffset) {
            var limitDate = new Date().getFullYear() - endOffset, startDate = new Date().getFullYear() - startOffset,
                arr = [];
            while (startDate < limitDate) {
                arr.push(startDate);
                startDate++;
            }
            return arr;
        }
    }, {
        key: "addCustomErrorClass", value: function addCustomErrorClass() {
            this.defaultShowErrors();
            $('input.error, select.error').addClass('validation-error');
            $('p.error').addClass('help-block validation-msg');
        }
    }, {
        key: "ajaxRequest", value: function ajaxRequest(url, data, options) {
            app.pam.request(url, data, options).done(function (resp) {
                console.info(resp);
            });
        }
    }, {
        key: "init", value: function init() {
            var $form = $('.' + this.formClass), _messages = this.messages(), _rules = this.rules(),
                _url = this.actionUrl || $form.attr('action'), _handleSubmit = this.handleSubmit.bind(this, _url);
            this.validateForm($form, _rules, _handleSubmit, _messages);
        }
    }, {
        key: "validateForm", value: function validateForm($form, rules, handler, messages) {
            var _options = {
                rules: rules,
                messages: messages,
                debug: false,
                ignore: '.ignore',
                onkeyup: false,
                submitHandler: handler
            };
            $.extend(_options, this.validateOptions);
            this.clearValidator($form);
            return $form.validate(_options);
        }
    }, {
        key: "clearValidator", value: function clearValidator($form) {
            $form.off(".validate").removeData("validator").find(".validate-equalTo-blur").off(".validate-equalTo").removeClass("validate-equalTo-blur");
        }
    }, {
        key: "handleSubmit", value: function handleSubmit(url) {
            var _data = this.getFormData(), _url = url, _options = {skipLanguage: true};
            if (this.steps && this.registrationStep() < this.steps) {
                this.registrationStep(this.registrationStep() + 1);
                return false;
            }
            this.ajaxRequest(_url, _data, _options);
            return false;
        }
    }, {
        key: "backButtonVisible", value: function backButtonVisible() {
            return this.steps && this.registrationStep() > 1;
        }
    }, {
        key: "stepBack", value: function stepBack() {
            if (this.registrationStep() == 1) {
                return false;
            }
            this.registrationStep(this.registrationStep() - 1);
        }
    }, {
        key: "customValidators", value: function customValidators(key) {
            var _validator, _passwordRules = this.passwordRules;
            switch (key) {
                case'rut':
                    _validator = function _validator(value) {
                        var _text = value.trim(), _coefs = [3, 2, 7, 6, 5, 4, 3, 2], _length = _coefs.length,
                            _total = 0, _textParts = _text.split("-"), _hasSeparator = _textParts.length > 1,
                            _textBody = _hasSeparator ? app.pam.padLeft(_textParts[0], _length) : app.pam.padLeft(_textParts[0].substr(0, _textParts[0].length - 1), _length),
                            _textSum = _hasSeparator ? _textParts[1] : _textParts[0].substr(-1),
                            _digits = _textBody.split(''), _result = void 0;
                        if (_digits.length < 3 || _digits.length > 11) {
                            return false;
                        }
                        _coefs.forEach(function (coef, index) {
                            _total += coef * (_digits[index] ? _digits[index] : 0);
                        });
                        _result = 11 - _total % 11;
                        if (_result == 10) {
                            return _textSum == 'k' || _textSum == 'K';
                        } else if (_result == 11) {
                            return _textSum == 0;
                        }
                        return _textSum == _result;
                    };
                    break;
                case'password_strength':
                    _validator = function _validator(val) {
                        var _condition = true;
                        _passwordRules.forEach(function (rule) {
                            if (!_condition) {
                                return;
                            }
                            switch (rule.type) {
                                case'minChars':
                                    _condition = _condition && val.length > rule.value - 1;
                                    break;
                                case'noSpaces':
                                    _condition = _condition && /^\S*$/.test(val);
                                    break;
                                case'capital':
                                    _condition = _condition && /[A-Z]/.test(val) > rule.value - 1;
                                    break;
                                case'lowerCase':
                                    _condition = _condition && /[a-z]/.test(val) > rule.value - 1;
                                    break;
                                case'digit':
                                    _condition = _condition && /[0-9]/.test(val) > rule.value - 1;
                                    break;
                                case'letter':
                                    _condition = _condition && /[a-zA-z]/.test(val) > rule.value - 1;
                                    break;
                                case'specialChar':
                                    _condition = _condition && /[`~!@#\$%\^&\*\(\)\-=_+\\\[\]{}/\?,\.\<\>]/.test(val) > rule.value - 1;
                                    break;
                            }
                        });
                        return _condition;
                    };
                    break;
                default:
                    _validator = function _validator(value) {
                        return value;
                    };
                    break;
            }
            return _validator;
        }
    }, {
        key: "generators", value: function generators(key, inputId) {
            var _generator;
            switch (key) {
                case'rut':
                    _generator = function _generator() {
                        var _coefs = [3, 2, 7, 6, 5, 4, 3, 2], _total = 0, _digits = [];
                        _coefs.forEach(function (coef) {
                            var _digit = Math.floor(Math.random() * 9);
                            _total += coef * _digit;
                            _digits.push(_digit);
                        });
                        _digits.push('-');
                        _digits.push(11 - _total % 11);
                        return _digits.join('');
                    };
                    break;
                default:
                    _generator = function _generator() {
                        return '';
                    };
                    break;
            }
            $('#' + inputId).val(_generator()).focus().blur();
            return false;
        }
    }, {
        key: "rules", value: function rules() {
            return {};
        }
    }, {
        key: "messages", value: function messages() {
            return {};
        }
    }, {
        key: "getFormData", value: function getFormData() {
            return {};
        }
    }]);
    return BaseForm;
}(edge.pam.Common.BaseModel);
'use strict';
var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();
var _get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);
    if (desc === undefined) {
        var parent = Object.getPrototypeOf(object);
        if (parent === null) {
            return undefined;
        } else {
            return get(parent, property, receiver);
        }
    } else if ("value" in desc) {
        return desc.value;
    } else {
        var getter = desc.get;
        if (getter === undefined) {
            return undefined;
        }
        return getter.call(receiver);
    }
};

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

edge.pam.Common.Login = function (_edge$pam$Common$Base) {
    _inherits(Login, _edge$pam$Common$Base);

    function Login(data, view) {
        _classCallCheck(this, Login);
        var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, data, view));
        var _data = data || {};
        _this.forgotPasswordUrl = _data.forgotPasswordUrl;
        _this.formClass = _data.formClass || 'loginForm';
        _this.prefix = _data.prefix || "login_";
        _this.actionUrl = _data.loginUrl || '/es/user/login';
        _this.contact = _data.contact || '/es/view/contact';
        _this.username = {name: 'username', value: '', label: 'Username', prefix: _this.prefix};
        _this.password = {name: 'password', value: '', label: 'Password', prefix: _this.prefix};
        _this.trackedClick = false;
        return _this;
    }

    _createClass(Login, [{
        key: 'onRegisterClick', value: function onRegisterClick() {
            if (app.analytics && !this.trackedClick) {
                this.trackedClick = true;
                var refParamValue = app.pam.checkGetParameter('refId');
                app.analytics.trackEvent('affiliate_register', refParamValue);
                window.location.replace(this.register);
            }
        }
    }, {
        key: 'onRender', value: function onRender() {
            _get(Login.prototype.__proto__ || Object.getPrototypeOf(Login.prototype), 'onRender', this).call(this);
        }
    }, {
        key: 'handleExpiredPassword', value: function handleExpiredPassword(data) {
            var $form = $('#expiredAccountForm'), _options = {
                rules: {
                    newPassword: {
                        customRule: 'password_strength',
                        required: true,
                        notEqualTo: "#expiredAccountCurrent"
                    }, confirmPassword: {required: true, equalTo: "#expiredAccountNew"}
                },
                messages: {
                    newPassword: {
                        customRule: app.pam.messages.insufficient_password_strength,
                        required: app.pam.messages.required_field
                    },
                    confirmPassword: {required: app.pam.messages.required_field, equalTo: app.pam.messages.same_value}
                },
                ignore: '.ignore',
                onkeyup: false,
                submitHandler: function submitHandler() {
                    var _data = {
                        currentPassword: app.pam.expiredAccount().password,
                        newPassword: app.pam.expiredAccount().newPassword,
                        loginValue: app.pam.expiredAccount().loginValue
                    }, _url = data.changePasswordUrl;
                    app.pam.request(_url, _data, {skipLanguage: true}).done(function (resp) {
                        if (resp.error) {
                            var _message = resp.error.message || app.pam.messages.generic_error;
                            if (resp.error.debug && resp.error.debug.message) {
                                _message += ' - debug: ' + resp.error.debug.message.errorMessage;
                            }
                            app.pam.errorMessage(_message);
                        } else {
                            $('.modal').modal('hide');
                            app.pam.successMessage(resp.message);
                        }
                    });
                    return false;
                }
            };
            $('#expiredAccountModal').modal('show');
            this.clearValidator($form);
            $form.validate(_options);
            return false;
        }
    }, {
        key: 'ajaxRequest', value: function ajaxRequest(url, data, options) {
            app.pam.request(url, data, options).done(function (resp) {
                if (!resp.success) {
                    if (resp.handleError) {
                        $('.modal').modal('hide');
                        app.pam.expiredAccount({
                            password: '',
                            newPassword: '',
                            loginValue: resp.handleError.username,
                            passwordRules: this.passwordRules
                        });
                        return this.handleExpiredPassword(resp.handleError);
                    } else {
                        app.pam.errorMessage(resp.message);
                    }
                } else {
                    $('.modal').modal('hide');
                    window.location.href = resp.redirectUrl || '/';
                }
            }.bind(this));
        }
    }, {
        key: 'rules', value: function rules() {
            var _rules = {};
            _rules[this.prefix + 'username'] = {required: true};
            _rules[this.prefix + 'password'] = {required: true};
            return _rules;
        }
    }, {
        key: 'messages', value: function messages() {
            return {};
        }
    }, {
        key: 'getFormData', value: function getFormData() {
            return {username: this.username.value, password: this.password.value};
        }
    }, {
        key: 'popupFunction', value: function popupFunction(url) {
            app.pam.responsiveLoader(url);
        }
    }]);
    return Login;
}(edge.pam.Common.BaseForm);
edge.Lottery.Common.Login = function (data, view) {
    edge.pam.Common.Login.apply(this, arguments);
    this.depositLink = edge.LinkManager.ItemCreator(data.depositLink);
    if (data.links) {
        this.linksManager = new edge.LinkManager(data.links);
    }
    this.comesFromHomePage = data.comesFromHomePage;
    this.forgotPasswordPage = data.forgotPasswordPage;
    app.postMessageHandler.register('pcCloseModal', function (e) {
        if (app._customDialogInstances['iframeDialog']) {
            app._customDialogInstances['iframeDialog'].close();
        }
    }.bind(this));
};
edge.Lottery.Common.Login.prototype = Object.create(edge.pam.Common.Login.prototype);
edge.Lottery.Common.Login.prototype.ajaxRequest = function (url, data, options) {
    var self = this;
    app.request(url, data, options).done(function (resp) {
        if (!resp.success) {
            if (resp.passwordExpiredLink) {
                var link = edge.LinkManager.ItemCreator(resp.passwordExpiredLink);
                link.performAction();
                return;
            }
            app.showMessage(app.i18n.get('error_generic'), resp.message, null, true);
        }
        else {
            self.onLoginSuccess(resp);
        }
    });
};
edge.Lottery.Common.Login.prototype.onLoginSuccess = function (resp) {
    app.setUser(resp);
    if (this.comesFromHomePage) {
        if (app.navigation.get("home_page") != app.navigation.get("home_auth")) {
            window.location.reload();
        }
    }
    $(document).trigger("onLogin", [resp]);
};
edge.Lottery.Common.Login.prototype.navigateToCart = function () {
    app.navigateToPage(app.navigation.get("cart"));
};
edge.Lottery.Common.Login.prototype.popUpForgotPassword = function () {
    app.pageDialog(this.forgotPasswordPage, {dialogId: 'forgotPasswordDialog', backdrop: 'static'});
};
edge.Lottery.Desktop.Login = function (data, view) {
    edge.Lottery.Common.Login.apply(this, arguments);
    this.forgotPasswordUrl = data.forgotPasswordUrl;
    this.registerUrl = data.registerUrl;
    this.depositUrl = data.depositUrl;
    this.myAccountUrl = data.links.myAccountLinks.links[0].url;
}
edge.Lottery.Desktop.Login.prototype = Object.create(edge.Lottery.Common.Login.prototype);
edge.Lottery.Desktop.GenericSubHeader = function (data, view) {
    edge.Lottery.BaseChannelModel.apply(this, arguments);
    this.title = ko.observable("My Title");
    this.subTitle = ko.observable("My SubTitle");
    this.extraText = ko.observable('');
    this.gameName = ko.observable('');
    this.enhanceSubHeader = ko.observable(false);
    app.genericSubHeader = this;
}
edge.Lottery.Desktop.GenericSubHeader.prototype = Object.create(edge.Lottery.BaseChannelModel.prototype);
edge.Lottery.Desktop.GenericSubHeader.prototype.setGenericSubHeaderTitles = function (title, subTitle, gameName, extraText) {
    if (title) {
        this.title(title);
    } else {
        this.title("");
    }
    if (subTitle) {
        this.subTitle(subTitle);
    } else {
        this.subTitle("");
    }
    if (gameName) {
        this.gameName(gameName);
    }
    if (extraText) {
        this.extraText(extraText);
    }
}
edge.Lottery.Desktop.Breadcrumb = function (data, view) {
    edge.Lottery.BaseChannelModel.apply(this, arguments);
    this.breadcrumb = ko.observableArray();
    app.breadcrumb = this;
}
edge.Lottery.Desktop.Breadcrumb.prototype = Object.create(edge.Lottery.BaseChannelModel.prototype);
edge.Lottery.Desktop.Breadcrumb.prototype.setPageBreadCrumb = function (breadcrumb) {
    this.breadcrumb(breadcrumb)
}
edge.Lottery.Common.FooterLinks = function (data, view) {
    edge.Lottery.BaseChannelModel.apply(this, arguments);
    this.linkCategories = new edge.LinkManager(data.links);
    app.footerLinks = this;
}
edge.Lottery.Common.FooterLinks.prototype = Object.create(edge.Lottery.BaseChannelModel.prototype);
edge.Lottery.Common.FooterLinks.prototype.isAssets = function (linkArray) {
    if (linkArray.length > 0) {
        if (linkArray[0].type == 'asset') {
            return true;
        }
    }
    return false;
}
edge.Lottery.Common.CheckTicket = function (data, view) {
    this.state = ko.observable();
    this.message = ko.observable();
    this.state.subscribe(function (value) {
        if (value == "check") {
            this.buttonTitle(data.title);
        }
        else {
            this.buttonTitle(app.i18n.get('check_ticket_back'));
        }
    }, this);
    edge.Lottery.BaseChannelModel.apply(this, arguments);
    this.buttonTitle = ko.observable(this.title);
    this.ticketId = ko.observable('');
    this.init();
}
edge.Lottery.Common.CheckTicket.prototype = Object.create(edge.Lottery.BaseChannelModel.prototype);
edge.Lottery.Common.CheckTicket.prototype.init = function () {
    this.state('check');
    this.message('');
    this.ticketId('');
}
edge.Lottery.Common.CheckTicket.prototype.showDialog = function () {
    this.init();
    var dialog = app.dialog("checkTicket", this.title, $('#ticketCheckDialogBody').html(), [{
        title: this.buttonTitle(),
        cssClass: ' btn btn-more btn-checkTicket',
        bindings: 'click:stateFn, text:buttonTitle, attr:{disabled:ticketId()==\'\'}',
    }], null, 'footer-ticket-check', {
        'hidden': function () {
            this.remove();
        }
    }, {show: false})
    dialog.setWidth("300");
    dialog.setBinding('.modal-content', this);
    dialog.modal('show');
}
edge.Lottery.Common.CheckTicket.prototype.stateFn = function () {
    if (this.state() == "check") {
        app.request('/ticket/check/' + this.ticketId(), {}, {type: 'GET', data: {}}).done(function (response) {
            this.state("checking");
            if (response.error) {
                this.message(response.error.message);
            }
            else {
                if (response.status == 0) {
                    this.message('<p>' + app.i18n.get('check_ticket_success') + '</p>' +
                        app.i18n.get('check_ticket_gross') + ': ' + (app.currency(response.gross / 100)) + '<br/>' +
                        app.i18n.get('check_ticket_tax') + ': ' + (app.currency(response.tax / 100)) + '<br/>' +
                        app.i18n.get('check_ticket_net') + ': ' + (app.currency(response.net / 100)) +
                        ((response.giftId > 0) ? '<p>' + response.giftDesc + '</p>' : ""));
                }
            }
        }.bind(this));
    }
    else {
        this.state('check');
    }
}
edge.Lottery.Common.FooterLinkImage = function (data, view) {
    edge.Lottery.BaseChannelModel.apply(this, arguments);
    this.linkTitle = data.linkTitle;
    this.linkImage = data.linkImage;
    this.linkExtraImages = data.linkExtraImages;
    this.linkUrl = edge.LinkManager.ItemCreator(data.linkUrl);
};
edge.Lottery.Common.FooterLinkImage.prototype = Object.create(edge.Lottery.BaseChannelModel.prototype);
$(function () {
    app.cookie = app.cookie || {
        get: function (sKey) {
            if (!sKey) {
                return null;
            }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        }, exists: function getCookie(sKey) {
            if (!sKey) {
                return false;
            }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        }, set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
                return false;
            }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number:
                        sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                        break;
                    case String:
                        sExpires = "; expires=" + vEnd;
                        break;
                    case Date:
                        sExpires = "; expires=" + vEnd.toUTCString();
                        break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        }, keys: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) {
                aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]);
            }
            return aKeys;
        }, remove: function (sKey, sPath, sDomain) {
            if (!this.exists(sKey)) {
                return false;
            }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        }
    }
    app.ab = (function () {
        var cookieSchema = {gender: null, age: null, geolocation: {lat: null, lng: null, city: null, country: null}},
            cookieName = "personalizedrules";
        cookieDomain = app.cmsVariables.cookieDomain;
        getLocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var _data = {geolocation: {lat: position.coords.latitude, lng: position.coords.longitude}};
                    getReverseGeocodingData(position.coords.latitude, position.coords.longitude, function (position) {
                        $.extend(_data.geolocation, position);
                        $.extend(cookieSchema, _data);
                        setCookie(cookieSchema);
                    });
                }, function (failure) {
                    if (failure.message.indexOf("Only secure origins are allowed") == 0) {
                        console.log(failure.message);
                    }
                });
            }
        }
        checkCookie = function (name, wid) {
            if (typeof name != 'undefined') {
                cookieName = name;
            }
            var cookie = app.cookie.get(cookieName);
            if (cookie) {
                cookie = JSON.parse(cookie);
                for (var key in cookie) {
                    if (key == wid) {
                        return true;
                    }
                }
            }
            return false;
        }
        setCookie = function (data, name) {
            if (typeof name != 'undefined') {
                cookieName = name;
            }
            var cookie = app.cookie.get(cookieName), _time = 0;
            if (cookie) {
                cookie = JSON.parse(cookie);
                var id = Object.keys(data)[0];
                if (id in cookie) {
                    return;
                }
                data = $.extend(cookie, data);
            }
            app.cookie.set(cookieName, JSON.stringify(data), _time, '/', cookieDomain);
        }

        function getReverseGeocodingData(lat, lng, callback) {
            if (typeof google === 'object' && typeof google.maps === 'object') {
                var latlng = new google.maps.LatLng(lat, lng), geocoder = new google.maps.Geocoder();
                geocoder.geocode({latLng: latlng}, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var data = getCountryAndCity(results[2]);
                        callback(data);
                    }
                });
            }
        }

        function getCountryAndCity(location) {
            var ret = {country: null, city: null};
            var findCity = null;
            $.each(location.address_components, function (i, address_component) {
                if (address_component.types[0] == "locality") {
                    findCity = address_component.long_name;
                }
                if (!findCity && address_component.types[0] == "administrative_area_level_4") {
                    findCity = address_component.long_name;
                }
                if (address_component.types[0] == "country") {
                    ret.country = address_component.short_name;
                }
            });
            ret.city = findCity;
            return ret;
        }

        sendGoal = function (goal) {
            var data = app.cookie.get("ab_goals");
            if (data) {
                data = JSON.parse(data);
                for (var id in data) {
                    if (typeof data[id].v == 'undefined') {
                        if (data[id].g.indexOf(goal) != -1) {
                            app.analytics.trackPage(data[id].u.replace('[[goal]]', goal));
                            data[id].v = false;
                        }
                    }
                }
                app.cookie.set("ab_goals", JSON.stringify(data), 0, '/', cookieDomain);
            }
        }

        function increasePageViews() {
            var data = app.cookie.get("ab_goals");
            if (data) {
                data = JSON.parse(data);
                for (var id in data) {
                    if (data[id].m != "session") {
                        if (data[id].c < data[id].m) {
                            data[id].c++;
                        }
                        else {
                            data[id].v = false;
                        }
                    }
                }
                app.cookie.set("ab_goals", JSON.stringify(data), 0, '/', cookieDomain);
            }
        }

        if (!app.cookie.get(cookieName) && typeof setGeologation != 'undefined') {
            getLocation();
        }
        window.setTimeout(function () {
            if (app._router) {
                app._router.onPageChange(increasePageViews);
            }
            else {
                increasePageViews();
            }
        }, 500);
        return {sendGoal: sendGoal, getLocation: getLocation, setCookie: setCookie, checkCookie: checkCookie,}
    })();
});
$(function () {
    app.trigger = (function () {
        var cookieNames = 'triggerRulez';
        setTrigger = function (data) {
            app.ab.setCookie(data, cookieNames);
        }
        return {setTrigger: setTrigger}
    })();
});