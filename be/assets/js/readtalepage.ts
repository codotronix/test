import { TReactale, TReactoVar, TTimelineConfig } from '../../types/TReactale'
import { TWindow, TCustomReactoVars } from '../../types/other-types'
import { TPostParamLinkATale } from '../../types/TAPIParams'

(function () {
    let tale = (window as any).rto.getTale() as TReactale
    let customizable = false;
    let twindow = window as TWindow
    const SESSION_KEY = 'RTLSESSION'
    // const REDUXPERSIST_KEY = 'persist:rtlroot'
    const CONST_SESSION_USER = 'SESSION_AUTH_DATA';

    // console.log('tale', tale)

    /*
    * Check login info
    */
    const userAuthData = twindow.rto.getLoggedInUserAuthData()  // exported from be.js
    // console.log('userAuthData = ', userAuthData)

    let timelineConfig: TTimelineConfig = {
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
             */
            let vars: TCustomReactoVars = {}
            let customizableVars: { [reactoVarName: string]: TReactoVar } = {}
            Object.values(tale.reactos.vars).map(v => {
                vars[v.name] = v.val

                // also pickup the customizable vars
                if (v.userCustomizable) {
                    customizableVars[v.name] = v
                }
            })
            twindow.rto.setAllVars(vars);
        }

        checkURLForReactos()

        // Incase User has Deeplinked to a storylet
        // thru series of choices
        let preselectCIDs = checkURLForChoicePath()

        twindow.rto.createTimeline('timelineContainer', tale, { ...timelineConfig, preselectCIDs });
    }


    /**
     * Check for any reactos in URL and
     * set all vars in rto memory
     */
    function checkURLForReactos() {
        let customVarsString = getQueryParamValFromUrl('rtov2')

        if (customVarsString) {
            let customVars = JSON.parse(decodeURIComponent(atob(customVarsString))) as TCustomReactoVars
            // customVars = JSON.parse(decodeURIComponent(customVars));
            twindow.rto.setAllVars(customVars);
        }
    }

    /*
    * If URL has a choicepath,
    * then extract the choice IDs
    */
    function checkURLForChoicePath(): string[] {
        let choicepath = getQueryParamValFromUrl('choicepath')
        let choiceIDs: string[] = []
        if(choicepath) {
            choiceIDs = choicepath.split('a')
        }

        return choiceIDs
    }

    /*
    * Get the query param value from the current url
    */
    function getQueryParamValFromUrl (paramName: string) {
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
            const stID = Sbi.find('.storylet').attr('data-stid')!
            const sbIndx = parseInt(Sbi.attr('data-sbindx')!)

            // Get the Choices that lead o the above Storylet
            const sbItems = $('.storyboard-item')
            let selectedChoicesTillLinkST = []
            for(let i=0; i < sbIndx; ++i) {
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
            const stID = $('#linkatale').attr('data-stid')!
            const choicePath = $('#linkatale').attr('data-choice-path')!

            if(!stID) {
                console.log('Error: data-stid not found on #linkatale, which should have been set when user opened the link-a-tale modal')
                twindow.notify('Some error occured. Couldnot find source storylet ID.')
                return
            }
            
            const choiceText = ($('#linkatalecontainer .choicetext').val() as string).trim()
            const toRtlUrl = ($('#linkatalecontainer .tortlurl').val() as string).trim()

            if(!choiceText || !toRtlUrl) {
                twindow.notify('All fields mandatory ...')
                return
            }

            try {
                // Check the domain of the url
                const destURL = new URL(toRtlUrl)
                const validhosts = ['reactale.com', 'localhost:9090', 'reactale.tech']

                if(!validhosts.includes(destURL.host)) throw 'Wrong host in destination url'
            }
            catch(err) {
                twindow.notify('Pleae fix the destination URL. Only Reactale URLs are valid ...')
                return
            }
            

            // Create FromUrl for showing the approver
            // where the link starts from, for convenience
            const fromUrl = window.location.origin + window.location.pathname + '?choicepath=' + choicePath


            sendLinkRequest(fromUrl, stID, choiceText, toRtlUrl)
        })

        //copylinktostorylet item is clicked
        $('body').on('click', '.st-menu .copy-link-to-st', function () {
            let index = parseInt($(this).closest('.storyboard-item').attr('data-sbindx')!)
            copyLinkTillSbiIndex(index)
        })

        $('#applycustomizatn').on('click', function () {
            let newVars: TCustomReactoVars = getNewCustomizedVars();

            if (Object.values(newVars).length > 0) {
                twindow.rto.setAllVars(newVars)
                twindow.rto.createTimeline('timelineContainer', tale, timelineConfig);
                alert('Customization successful ...');
                $("#giftatale").modal('close');
            }
            else {
                alert("Please enter some new values to replace the old ones ...");
            }
        })

        $('#createcustomurl').on('click', function () {
            let newVars: TCustomReactoVars = getNewCustomizedVars();

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
    function copyLinkTillSbiIndex (index: number) {
        const { origin, pathname } = window.location
        let url = origin + pathname
        let choices: string[] = []

        // Now let's gather all the selected choices
        // that finally leads to this storylet
        for(let i=0; i<index; ++i) {
            let cid = $('.storyboard-item').eq(i).find('.choice.selected').attr('data-cid') as string
            choices.push(cid)
        }

        if(choices.length > 0) {
            url += '?choicepath=' + choices.join('a')
        }

        twindow.rto.copyToClipboard(url, 'Url copied to clipboard ...')
    }

    /*
    * This function will remove any existing rtov2 from url query params
    * This is required if reader is trying to create customizaed url but current
    * url itself is a customized url.
    * 
    * returns clean url minus the passed query-param
    */
    function removeQueryParam(url: string, paramName: string) {
        let newUrl = url;
        if (url.indexOf('?') > -1) {
            let temp: (string | string[]) = url.split('?');
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
    function sendLinkRequest (fromUrl: string, stID: string, choiceText: string, toRtlUrl: string) {
        // Basic level of security... login for bot-protection
        if (!userAuthData || !userAuthData.user || !userAuthData.user.email) {
            return twindow.notify('Please login to send a link request')
        }
        else if (userAuthData.user.email === tale.info.authorEmail) {
            return twindow.notify('You need not send a request to yourself. Just edit and add the choice with link.')
        }
        else {
            twindow.showLoader('Sending request ...')

            const linkReqObj: TPostParamLinkATale = {
                fromUrl,
                fromStoryName: tale.info.name,
                fromStoryUrl: tale.info.storyUrl,
                fromStID: stID, 
                toUrl: toRtlUrl, 
                choiceTxt: choiceText, 
                authorEmailEnc: tale.info.authorEmailEnc!
            }

            const url = '/rtale/api/v2/requestlinkatale'
            ajaxPost(url, JSON.stringify(linkReqObj))
            .then(r => r.json())
            .then(r => {
                const { status, msg } = r
                twindow.notify(msg)
            })
            .catch(err => twindow.notify('Some error occurred ...'))
            .finally(() => twindow.hideLoader())
        }
    }

    function getNewCustomizedVars() {
        let newVars: TCustomReactoVars = {};
        $('#giftatale .body .newval').each(function () {
            let v = $(this).val()?.toString().trim()
            if (v) {
                let k = $(this).attr('data-var-name') as string;
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
    function copyClipboardInput(id: string) {
        let el = $('#' + id) as any;
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
 * If user is logged in, push this tale to his history
 * *********************************************************************/


if (userAuthData && userAuthData.user) {

    // Don't keep pushing same objects
    if(userAuthData.user.history 
        && userAuthData.user.history.length > 0 
        && userAuthData.user.history[userAuthData.user.history.length-1].storyUrl === tale.info.storyUrl
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
            if(status === 200) {
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
    function addForkHTML () {
    $('.choices.component-box').each(function(){
        // Add fork HTML only where it is not already added earlier
        if(!$(this).hasClass('fork-added')) {
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
    function addSTMenu () {
    $('.storylet.component-box').each(function(){
        let el = $(this)
        if(!el.hasClass('stmenu-added')) {
            el.append($('.st-menu').clone().eq(0))
            el.addClass('stmenu-added')
        }
    })
    }


    /*********************************************** */
    function ajaxPost (url: string, stringifiedData: string) {
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
