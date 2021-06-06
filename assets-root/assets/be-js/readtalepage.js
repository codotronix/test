// import { TReactale, TReactoVar, TTimelineConfig } from '../../../be/types/TReactale'
// import { TWindow, TCustomReactoVars } from '../../../be/types/other-types'
// import { TPostParamLinkATale } from '../../../be/types/TAPIParams'

(function () {
    let tale = window.rto.getTale();
    let customizable = false;
    const SESSION_KEY = 'RTLSESSION'
    // const REDUXPERSIST_KEY = 'persist:rtlroot'
    const CONST_SESSION_USER = 'SESSION_AUTH_DATA';

    // console.log('tale', tale)

    /*
    * Check login info
    */
    // 
    // console.log('userAuthData = ', userAuthData)

    let timelineConfig = {
        // timelineWillRender: () => { console.log('timelineWillRender') },
        timelineDidRender
    }

    init();

    function init() {
        renderReactale();
        makeGiftATaleModal();
        initBindings();
        setupDisqus()
    }

    function renderReactale() {
        if (tale.reactos && tale.reactos.vars) {
            /**
             * tale.reactos.vars has a structure of
             * vars = {
             *  k1: {
             *       name: 'k1', value: 'v1', userCustomizable: true / false
             *      },
             *  k2: {
             *       name: 'k2', value: 'v2', userCustomizable: true / false
             *      }
             * 
             * we need to convert it to
             * vars = { k1: 'v1', k2: 'v2' }
             * 
             * type of customizableVars: { [reactoVarName: string]: TReactoVar } = {}
             */
            let vars = {}
            let customizableVars = {}
            Object.values(tale.reactos.vars).map(v => {
                vars[v.name] = v.val

                // also pickup the customizable vars
                if (v.userCustomizable) {
                    customizableVars[v.name] = v
                }
            })
            window.rto.setAllVars(vars);
        }

        checkURLForReactos()

        // Incase User has Deeplinked to a storylet
        // thru series of choices
        let preselectCIDs = checkURLForChoicePath()

        window.rto.createTimeline('timelineContainer', tale, { ...timelineConfig, preselectCIDs });
    }


    /**
     * Check for any reactos in URL and
     * set all vars in rto memory
     */
    function checkURLForReactos() {
        let customVarsString = getQueryParamValFromUrl('rtov2')

        if (customVarsString) {
            let customVars = JSON.parse(decodeURIComponent(atob(customVarsString)))
            // customVars = JSON.parse(decodeURIComponent(customVars));
            window.rto.setAllVars(customVars);
        }
    }

    /*
    * If URL has a choicepath,
    * then extract the choice IDs
    */
    function checkURLForChoicePath() {
        let choicepath = getQueryParamValFromUrl('choicepath')
        let choiceIDs = []
        if (choicepath) {
            choiceIDs = choicepath.split('a')
        }

        return choiceIDs
    }

    /*
    * Get the query param value from the current url
    */
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
        return val
    }


    function initBindings() {
        if (!customizable) {
            $('#btn-show-customizemodal').hide()
        }
        else {
            $('#btn-show-customizemodal').on('click', function () {
                //Init all fields to blank
                $("#giftatale .newval").val('')
                $("#giftatale .generated-url-op").val('')
                $('#custom-url-section').hide()
                $("#giftatale").modal('open');
                $('#giftatale').scrollTop(0);
            })
        }

        $('.popup .header .close').on('click', function () {
            $(this).closest('.popup-mask').hide();
        })

        $('body').on('click', '.acc .header', function () {
            $(this).closest('.acc').toggleClass('closed');
        })

        $('body').on('click', '.st-menu .toggler', function () {
            $(this).closest('.st-menu').toggleClass('visible');
        })

        // WHen another-author clicks on link-a-tale
        $('body').on('click', '.btn-link-a-tale', function () {
            const Sbi = $(this).closest('.storyboard-item')
            // Get the StId
            const stID = Sbi.find('.storylet').attr('data-stid')
            const sbIndx = parseInt(Sbi.attr('data-sbindx'))

            // Get the Choices that lead o the above Storylet
            const sbItems = $('.storyboard-item')
            let selectedChoicesTillLinkST = []
            for (let i = 0; i < sbIndx; ++i) {
                selectedChoicesTillLinkST.push(sbItems.eq(i).find('.choice.selected').attr('data-cid'))
            }

            $('#linkatale').attr({
                'data-stid': stID,
                'data-choice-path': selectedChoicesTillLinkST.join('a')
            })
            $('#linkatale').modal('open')
        })

        // When user submits the form to Link-a-Tale
        $('body').on('click', '#linkatalecontainer .send', function () {
            const stID = $('#linkatale').attr('data-stid')
            const choicePath = $('#linkatale').attr('data-choice-path')

            if (!stID) {
                console.log('Error: data-stid not found on #linkatale, which should have been set when user opened the link-a-tale modal')
                window.notify('Some error occured. Couldnot find source storylet ID.')
                return
            }

            const choiceText = $('#linkatalecontainer .choicetext').val().trim()
            const toRtlUrl = $('#linkatalecontainer .tortlurl').val().trim()

            if (!choiceText || !toRtlUrl) {
                window.notify('All fields mandatory ...')
                return
            }

            try {
                // Check the domain of the url
                const destURL = new URL(toRtlUrl)
                const validhosts = ['reactale.com', 'localhost:9090', 'reactale.site']

                if (!validhosts.includes(destURL.host)) throw 'Wrong host in destination url'
            }
            catch (err) {
                window.notify('Pleae fix the destination URL. Only Reactale URLs are valid ...')
                return
            }


            // Create FromUrl for showing the approver
            // where the link starts from, for convenience
            const fromUrl = window.location.origin + window.location.pathname + '?choicepath=' + choicePath


            sendLinkRequest(fromUrl, stID, choiceText, toRtlUrl)
        })

        //copylinktostorylet item is clicked
        $('body').on('click', '.st-menu .copy-link-to-st', function () {
            let index = parseInt($(this).closest('.storyboard-item').attr('data-sbindx'))
            copyLinkTillSbiIndex(index)
        })

        $('#applycustomizatn').on('click', function () {
            let newVars = getNewCustomizedVars();

            if (Object.values(newVars).length > 0) {
                window.rto.setAllVars(newVars)
                window.rto.createTimeline('timelineContainer', tale, timelineConfig);
                alert('Customization successful ...');
                $("#giftatale").modal('close');
            }
            else {
                alert("Please enter some new values to replace the old ones ...");
            }
        })

        $('#createcustomurl').on('click', function () {
            let newVars = getNewCustomizedVars();

            if (Object.values(newVars).length > 0) {
                let params = btoa(encodeURIComponent(JSON.stringify(newVars)))
                // let params = encodeURIComponent(JSON.stringify(newVars))
                let url = removeQueryParam(window.location.href, 'rtov2');

                let nUrl = (url.indexOf('?') > -1) ? `${url}&rtov2=${params}` : `${url}?rtov2=${params}`

                $('#custom-url-section a').attr('href', nUrl);
                $('#generated-url-op').val(nUrl);
                $('#custom-url-section').show();
                $('#giftatale').scrollTop(1000);
            }
            else {
                alert("Please enter some new values to customize the Reactale ...");
            }
        })

        $('#copycustomurl').on('click', function () {
            copyClipboardInput('generated-url-op')
        })


    }

    /*
    * Eable deep linking till this storylet...
    *
    * If Index is zero, then copy root url
    * Else,
    * we need to make an url, i.e.
    * rootUrl + Selected Choice ID sequences (that lead to this storylet)
    * Starting from Sbi index zero, 
    * till before this index
    */
    function copyLinkTillSbiIndex(index) {
        const { origin, pathname } = window.location
        let url = origin + pathname
        let choices = []

        // Now let's gather all the selected choices
        // that finally leads to this storylet
        for (let i = 0; i < index; ++i) {
            let cid = $('.storyboard-item').eq(i).find('.choice.selected').attr('data-cid')
            choices.push(cid)
        }

        if (choices.length > 0) {
            url += '?choicepath=' + choices.join('a')
        }

        window.rto.copyToClipboard(url, 'Url copied to clipboard ...')
    }

    /*
    * This function will remove any existing rtov2 from url query params
    * This is required if reader is trying to create customizaed url but current
    * url itself is a customized url.
    * 
    * returns clean url minus the passed query-param
    */
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

    /*
    * When current user wants to send a Link-a-Tale Request
    */
    function sendLinkRequest(fromUrl, stID, choiceText, toRtlUrl) {
        const userAuthData = window.rto.getLoggedInUserAuthData()
        // Basic level of security... login for bot-protection
        if (!userAuthData || !userAuthData.user || !userAuthData.user.email) {
            return window.notify('Please login to send a link request')
        }
        else if (userAuthData.user.email === tale.info.authorEmail) {
            return window.notify('You need not send a request to yourself. Just edit and add the choice with link.')
        }
        else {
            window.showLoader('Sending request ...')

            const linkReqObj = {
                fromUrl,
                fromStoryName: tale.info.name,
                fromStoryUrl: tale.info.storyUrl,
                fromStID: stID,
                toUrl: toRtlUrl,
                choiceTxt: choiceText,
                authorEmailEnc: tale.info.authorEmailEnc
            }

            const url = '/rtale/api/v2/requestlinkatale'
            ajaxPost(url, JSON.stringify(linkReqObj))
                .then(r => r.json())
                .then(r => {
                    const { status, msg } = r
                    window.notify(msg)
                })
                .catch(err => window.notify('Some error occurred ...'))
                .finally(() => {
                    window.hideLoader()
                    $('#linkatale').modal('close')  // Close the modal
                })
        }
    }

    function getNewCustomizedVars() {
        let newVars = {};
        $('#giftatale .body .newval').each(function () {
            let v = $(this).val()?.toString().trim()
            if (v) {
                let k = $(this).attr('data-var-name');
                newVars[k] = v;
            }
        })

        console.log(newVars);
        return newVars;
    }

    /**
     * Pass the ID of an Input Element and 
     * this function copies its value to clipboard
     * @param id 
     */
    function copyClipboardInput(id) {
        let el = $('#' + id);
        /* Select the text field */
        el.select();
        el[0].setSelectionRange(0, 99999); /*For mobile devices*/

        /* Copy the text inside the text field */
        document.execCommand("copy");
        alert("Copied ...");
    }

    function makeGiftATaleModal() {
        // console.log(tale.reactos);
        let vars = tale.reactos && tale.reactos.vars ? Object.values(tale.reactos.vars) : null;
        if (!vars || vars.length < 1) return;

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
    `
        },
            '')

        htm = '<ul class="collapsible">' + htm + '</ul>';
        // console.log(htm);
        $('#giftatale .dynamic-accordion').html(htm);
    }

    function setupDisqus() {
        var disqus_config = function () {
            // @ts-ignore
            this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
            // @ts-ignore
            this.page.identifier = "STORY-URL-" + tale.info.storyUrl; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
        };
        (function () { // DON'T EDIT BELOW THIS LINE
            var d = document, s = d.createElement('script');
            s.src = 'https://reactale.disqus.com/embed.js';
            // @ts-ignore
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    }
    ///////////////////////////////////////////////////////////////////////

    /************************************************************************
     * If user is logged in, 
     * And user spends some time on this page
     * push this tale to his history
     * *********************************************************************/
    const MIN_STAY_TIME = 5000
    setTimeout(function () {
        const userAuthData = window.rto.getLoggedInUserAuthData()  // exported from be.js
        if (userAuthData && userAuthData.user) {

            // Don't keep pushing same objects
            if (userAuthData.user.history
                && userAuthData.user.history.length > 0
                && userAuthData.user.history[userAuthData.user.history.length - 1].storyUrl === tale.info.storyUrl
            ) {
                // skip... do nothing
            }

            // Not the last saved history? then update history
            else {
                const url = '/rtale/api/v2/updatemyreadhistory'
                const data = JSON.stringify({
                    "historyObj": {
                        "storyName": tale.info.name,
                        "storyUrl": tale.info.storyUrl
                    },
                    "email": userAuthData.user.email
                })

                ajaxPost(url, data)
                    .then(r => r.json())
                    .then(res => {
                        const { status, history } = res
                        // update the local user object with this new history
                        if (status === 200) {
                            // Update Session Data
                            // const sessionData = JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || '{}')
                            // const userAuthData = sessionData && sessionData[CONST_SESSION_USER]
                            window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({
                                [CONST_SESSION_USER]: {
                                    ...userAuthData,
                                    user: {
                                        ...userAuthData.user,
                                        history
                                    }
                                }
                            }))
                        }
                    })
            }
        }
    },
        MIN_STAY_TIME)


    /************************************************************************
     * FURTHER EVENTS RELATED TO TIMELINE RENDER
     * *********************************************************************/

    /**
     * timelineDidRender  will be called after each render of timeline
     * */
    function timelineDidRender() {
        addForkHTML()
        addSTMenu()
    }

    /**
     * This function will add the "Fork Option to the Choice Box
     **/
    function addForkHTML() {
        $('.choices.component-box').each(function () {
            // Add fork HTML only where it is not already added earlier
            if (!$(this).hasClass('fork-added')) {
                $(this)
                    .addClass('fork-added')
                    .append(`
            <a class="modal-trigger ico-fork icofn-btn btn-link-a-tale" title="Link-a-tale" href="javascript:void(0)">
                <i class="fas fa-code-branch ico"></i>
            </a>
            `)
            }
        })
    }

    /*
    * Add meu to each .storylet.component-box 
    * if not added previously
    */
    function addSTMenu() {
        $('.storylet.component-box').each(function () {
            let el = $(this)
            if (!el.hasClass('stmenu-added')) {
                el.append($('.st-menu').clone().eq(0))
                el.addClass('stmenu-added')
            }
        })
    }


    /*********************************************** */
    function ajaxPost(url, stringifiedData) {
        const userAuthData = window.rto.getLoggedInUserAuthData()  // exported from be.js
        return fetch(url,
            {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json',
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + userAuthData.tok
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: stringifiedData // body data type must match "Content-Type" header
            })
    }

})()
