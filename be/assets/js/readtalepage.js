"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(function () {
    let tale = window.rto.getTale();
    let customizable = false;
    let twindow = window;
    const SESSION_KEY = 'RTLSESSION';
    const CONST_SESSION_USER = 'SESSION_AUTH_DATA';
    const userAuthData = twindow.rto.getLoggedInUserAuthData();
    let timelineConfig = {
        timelineDidRender
    };
    init();
    function init() {
        renderReactale();
        makeGiftATaleModal();
        initBindings();
        setupDisqus();
    }
    function renderReactale() {
        if (tale.reactos && tale.reactos.vars) {
            let vars = {};
            let customizableVars = {};
            Object.values(tale.reactos.vars).map(v => {
                vars[v.name] = v.val;
                if (v.userCustomizable) {
                    customizableVars[v.name] = v;
                }
            });
            twindow.rto.setAllVars(vars);
        }
        checkURLForReactos();
        let preselectCIDs = checkURLForChoicePath();
        twindow.rto.createTimeline('timelineContainer', tale, Object.assign(Object.assign({}, timelineConfig), { preselectCIDs }));
    }
    function checkURLForReactos() {
        let customVarsString = getQueryParamValFromUrl('rtov2');
        if (customVarsString) {
            let customVars = JSON.parse(decodeURIComponent(atob(customVarsString)));
            twindow.rto.setAllVars(customVars);
        }
    }
    function checkURLForChoicePath() {
        let choicepath = getQueryParamValFromUrl('choicepath');
        let choiceIDs = [];
        if (choicepath) {
            choiceIDs = choicepath.split('a');
        }
        return choiceIDs;
    }
    function getQueryParamValFromUrl(paramName) {
        let val = '';
        if (window.location.search) {
            let temp = window.location.search.substr(1).split('&');
            for (let kv of temp) {
                if (kv.split('=')[0] === paramName) {
                    val = kv.split('=')[1];
                    break;
                }
            }
        }
        return val;
    }
    function initBindings() {
        if (!customizable) {
            $('#btn-show-customizemodal').hide();
        }
        else {
            $('#btn-show-customizemodal').on('click', function () {
                $("#giftatale .newval").val('');
                $("#giftatale .generated-url-op").val('');
                $('#custom-url-section').hide();
                $("#giftatale").modal('open');
                $('#giftatale').scrollTop(0);
            });
        }
        $('.popup .header .close').on('click', function () {
            $(this).closest('.popup-mask').hide();
        });
        $('body').on('click', '.acc .header', function () {
            $(this).closest('.acc').toggleClass('closed');
        });
        $('body').on('click', '.st-menu .toggler', function () {
            $(this).closest('.st-menu').toggleClass('visible');
        });
        $('body').on('click', '.btn-link-a-tale', function () {
            const Sbi = $(this).closest('.storyboard-item');
            const stID = Sbi.find('.storylet').attr('data-stid');
            const sbIndx = parseInt(Sbi.attr('data-sbindx'));
            const sbItems = $('.storyboard-item');
            let selectedChoicesTillLinkST = [];
            for (let i = 0; i < sbIndx; ++i) {
                selectedChoicesTillLinkST.push(sbItems.eq(i).find('.choice.selected').attr('data-cid'));
            }
            $('#linkatale').attr({
                'data-stid': stID,
                'data-choice-path': selectedChoicesTillLinkST.join('a')
            });
            $('#linkatale').modal('open');
        });
        $('body').on('click', '#linkatalecontainer .send', function () {
            const stID = $('#linkatale').attr('data-stid');
            const choicePath = $('#linkatale').attr('data-choice-path');
            if (!stID) {
                console.log('Error: data-stid not found on #linkatale, which should have been set when user opened the link-a-tale modal');
                twindow.notify('Some error occured. Couldnot find source storylet ID.');
                return;
            }
            const choiceText = $('#linkatalecontainer .choicetext').val().trim();
            const toRtlUrl = $('#linkatalecontainer .tortlurl').val().trim();
            if (!choiceText || !toRtlUrl) {
                twindow.notify('All fields mandatory ...');
                return;
            }
            try {
                const destURL = new URL(toRtlUrl);
                const validhosts = ['reactale.com', 'localhost:9090', 'reactale.tech'];
                if (!validhosts.includes(destURL.host))
                    throw 'Wrong host in destination url';
            }
            catch (err) {
                twindow.notify('Pleae fix the destination URL. Only Reactale URLs are valid ...');
                return;
            }
            const fromUrl = window.location.origin + window.location.pathname + '?choicepath=' + choicePath;
            sendLinkRequest(fromUrl, stID, choiceText, toRtlUrl);
        });
        $('body').on('click', '.st-menu .copy-link-to-st', function () {
            let index = parseInt($(this).closest('.storyboard-item').attr('data-sbindx'));
            copyLinkTillSbiIndex(index);
        });
        $('#applycustomizatn').on('click', function () {
            let newVars = getNewCustomizedVars();
            if (Object.values(newVars).length > 0) {
                twindow.rto.setAllVars(newVars);
                twindow.rto.createTimeline('timelineContainer', tale, timelineConfig);
                alert('Customization successful ...');
                $("#giftatale").modal('close');
            }
            else {
                alert("Please enter some new values to replace the old ones ...");
            }
        });
        $('#createcustomurl').on('click', function () {
            let newVars = getNewCustomizedVars();
            if (Object.values(newVars).length > 0) {
                let params = btoa(encodeURIComponent(JSON.stringify(newVars)));
                let url = removeQueryParam(window.location.href, 'rtov2');
                let nUrl = (url.indexOf('?') > -1) ? `${url}&rtov2=${params}` : `${url}?rtov2=${params}`;
                $('#custom-url-section a').attr('href', nUrl);
                $('#generated-url-op').val(nUrl);
                $('#custom-url-section').show();
                $('#giftatale').scrollTop(1000);
            }
            else {
                alert("Please enter some new values to customize the Reactale ...");
            }
        });
        $('#copycustomurl').on('click', function () {
            copyClipboardInput('generated-url-op');
        });
    }
    function copyLinkTillSbiIndex(index) {
        const { origin, pathname } = window.location;
        let url = origin + pathname;
        let choices = [];
        for (let i = 0; i < index; ++i) {
            let cid = $('.storyboard-item').eq(i).find('.choice.selected').attr('data-cid');
            choices.push(cid);
        }
        if (choices.length > 0) {
            url += '?choicepath=' + choices.join('a');
        }
        twindow.rto.copyToClipboard(url, 'Url copied to clipboard ...');
    }
    function removeQueryParam(url, paramName) {
        let newUrl = url;
        if (url.indexOf('?') > -1) {
            let temp = url.split('?');
            newUrl = temp[0] + '?';
            temp = temp[1];
            temp = temp.split('&');
            for (let part of temp) {
                if (part.substr(0, 5) !== paramName) {
                    newUrl += '&' + part;
                }
            }
        }
        return newUrl;
    }
    function sendLinkRequest(fromUrl, stID, choiceText, toRtlUrl) {
        if (!userAuthData || !userAuthData.user || !userAuthData.user.email) {
            return twindow.notify('Please login to send a link request');
        }
        else if (userAuthData.user.email === tale.info.authorEmail) {
            return twindow.notify('You need not send a request to yourself. Just edit and add the choice with link.');
        }
        else {
            twindow.showLoader('Sending request ...');
            const linkReqObj = {
                fromUrl,
                fromStoryName: tale.info.name,
                fromStoryUrl: tale.info.storyUrl,
                fromStID: stID,
                toUrl: toRtlUrl,
                choiceTxt: choiceText,
                authorEmailEnc: tale.info.authorEmailEnc
            };
            const url = '/rtale/api/v2/requestlinkatale';
            ajaxPost(url, JSON.stringify(linkReqObj))
                .then(r => r.json())
                .then(r => {
                const { status, msg } = r;
                twindow.notify(msg);
            })
                .catch(err => twindow.notify('Some error occurred ...'))
                .finally(() => twindow.hideLoader());
        }
    }
    function getNewCustomizedVars() {
        let newVars = {};
        $('#giftatale .body .newval').each(function () {
            var _a;
            let v = (_a = $(this).val()) === null || _a === void 0 ? void 0 : _a.toString().trim();
            if (v) {
                let k = $(this).attr('data-var-name');
                newVars[k] = v;
            }
        });
        console.log(newVars);
        return newVars;
    }
    function copyClipboardInput(id) {
        let el = $('#' + id);
        el.select();
        el[0].setSelectionRange(0, 99999);
        document.execCommand("copy");
        alert("Copied ...");
    }
    function makeGiftATaleModal() {
        let vars = tale.reactos && tale.reactos.vars ? Object.values(tale.reactos.vars) : null;
        if (!vars || vars.length < 1)
            return;
        customizable = true;
        vars = vars.filter(function (v) {
            return v.userCustomizable;
        });
        console.log(vars);
        let htm = vars.reduce(function (htm, v, i) {
            return htm +
                `
    <li>
        <div class="collapsible-header">
            <i class="fas fa-paint-brush ico"></i> Custom Field ${i + 1}
        </div>
        <div class="collapsible-body">
            <p>${v.helptext}</p>
            <p class="mt-10">Default Value: ${v.val}</p>
            <div class="mt-10">
                <div>New Value</div>
                <textarea rows="3" class="newval form-control" data-var-name="${v.name}"></textarea>
            </div>
        </div>
    </li>
    `;
        }, '');
        htm = '<ul class="collapsible">' + htm + '</ul>';
        $('#giftatale .dynamic-accordion').html(htm);
    }
    function setupDisqus() {
        var disqus_config = function () {
            this.page.url = window.location.href;
            this.page.identifier = "STORY-URL-" + tale.info.storyUrl;
        };
        (function () {
            var d = document, s = d.createElement('script');
            s.src = 'https://reactale.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    }
    if (userAuthData && userAuthData.user) {
        if (userAuthData.user.history
            && userAuthData.user.history.length > 0
            && userAuthData.user.history[userAuthData.user.history.length - 1].storyUrl === tale.info.storyUrl) {
        }
        else {
            const url = '/rtale/api/v2/updatemyreadhistory';
            const data = JSON.stringify({
                "historyObj": {
                    "storyName": tale.info.name,
                    "storyUrl": tale.info.storyUrl
                },
                "email": userAuthData.user.email
            });
            ajaxPost(url, data)
                .then(r => r.json())
                .then(res => {
                const { status, history } = res;
                if (status === 200) {
                    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                        [CONST_SESSION_USER]: Object.assign(Object.assign({}, userAuthData), { user: Object.assign(Object.assign({}, userAuthData.user), { history }) })
                    }));
                }
            });
        }
    }
    function timelineDidRender() {
        addForkHTML();
        addSTMenu();
    }
    function addForkHTML() {
        $('.choices.component-box').each(function () {
            if (!$(this).hasClass('fork-added')) {
                $(this)
                    .addClass('fork-added')
                    .append(`
            <a class="modal-trigger ico-fork icofn-btn btn-link-a-tale" title="Link-a-tale" href="javascript:void(0)">
                <i class="fas fa-code-branch ico"></i>
            </a>
            `);
            }
        });
    }
    function addSTMenu() {
        $('.storylet.component-box').each(function () {
            let el = $(this);
            if (!el.hasClass('stmenu-added')) {
                el.append($('.st-menu').clone().eq(0));
                el.addClass('stmenu-added');
            }
        });
    }
    function ajaxPost(url, stringifiedData) {
        return fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userAuthData.tok
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: stringifiedData
        });
    }
})();
//# sourceMappingURL=readtalepage.js.map