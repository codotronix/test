(function () {
    // Add notfication container to body
    $('#bx-ntfn').remove()
    const notifStayTime = 4000  // how long notification will remain on screen
    $('body').append(`
        <style>
            #bx-ntfn {
                position: fixed;
                bottom: 15px;
                left: 0;
                right: 0;
                z-index: 99999;
            }
            #bx-ntfn .ic {
                width: 300px;
                margin: 0 auto;
            }
            #bx-ntfn .ic .notis {
                padding: 10px 15px;
                margin: 7px 0;
                border-radius: 4px;
                color: #fff;
                background: var(--secondary-color);
                box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 3px -2px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 1px 8px 0px;
                transition: all 500ms ease;
                transform: translateY(100px);
                position: relative;
            }
            #bx-ntfn .ic .notis.appear {
                opacity: 1;
                transform: translateY(0);
            }
            #bx-ntfn .ic .notis.appear.disappear {
                opacity: 0;
                transform: translateY(100px);
            }
            #bx-ntfn .ic .notis:after {
                content: '';
                display: block;
                background: var(--secondary-color-dark);
                background: #fff;
                position: absolute;
                bottom: 1px;
                height: 5px;
                width: 100%;
                left: 0;
                right: 0;
                animation: notifcountdown ${notifStayTime}ms;
                transform: scaleX(0);
            }
            @keyframes notifcountdown {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
        </style>
        <div id="bx-ntfn">
            <div class="ic"></div>
        </div>
    `)

    window.notify = (txt = "", type = "INFO") => {
        let id = 'note-' + (new Date()).getTime()
        let note = `<div id="${id}" class="notis appear">${txt}</div>`

        // ADD THIS NOTE TO DOM
        $('#bx-ntfn .ic').append(note)
        let el = '#' + id

        //ALSO DELETE IT AFTER CERTAIN PERIOD
        setTimeout(() => {
            $(el).addClass('disappear')
            setTimeout(() => {
                $(el).remove()
            }, 500)
        }, notifStayTime)
    }
})()