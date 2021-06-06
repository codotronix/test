(function(){

    // Declare the RTO Functions
    window.rto.addFn('goto', _rto_goto)
    window.rto.addFn('show', _rto_show)


    /**
     * Go to an URL
     * @param {string } url 
     */
    function _rto_goto (url) {

        // First let's give some time for the timline to update
        setTimeout(function(){

        // if it is a valid url,
        // go to that url
        try {
            // Before reader leaves, change the current url
            // add the choicepath, incase reader comes back ever,
            // he must land from where he left ...
            // Just take in all the seleted choices, except the last one
            // becuase last one is creating this redirection
            let cids = []
            $('.choice.selected').each(function(){
                cids.push($(this).attr('data-cid'))
            })

            cids = cids.slice(0, cids.length-1)

            let choicePathLoc = window.location.origin + window.location.pathname

            if(cids.length > 0) {
                choicePathLoc += '?choicepath=' + cids.join('a')
            }

            // Now, let's push this url in history
            history.pushState({}, document.title, choicePathLoc)

            // Time to leave
            const u = new URL(url)
            window.location.href = u.href
        }
        catch (err) {
            console.log(err)
        }

        }, 500)
    }


    /**
     * To say something to the reader.
     * Later we need to change it to something good looking...
     * And add a 2nd parameters to replace "OK" button
     * @param {string} text 
     */
    function _rto_show (text) {
        alert(text)
    }

})()