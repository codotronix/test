import React, { useState, useEffect } from 'react'
import CreateEditCommon from '../createEditCommon/CreateEditCommon'
import { connect } from 'react-redux'
import { actionSetTaleAsWIP } from '../../../redux/actionCreators/createTaleActions'
import { LOCAL_TALE_IDENTIFIER, CONST_TITLE } from '../../../utils/constants' 
import { getOneOfflineSavedTales } from '../../../services/offlinesavedtales.service'
import {  GET_MYSTORY } from "../../../utils/urls"
import { ajaxGetWPathParams } from '../../../utils/ajax'
const notify = window['notify']

const EditTale = props => {
    const [isLocalEdit, setIsLocalEdit] = useState(false)

    const { setTaleAsWIP, _storyUrl, match, history } = props

    useEffect(() => {
        // update title
        document.title = 'Edit Tale | ' + CONST_TITLE

        let storyUrl = match.params.id
        
        if (storyUrl === 'current') {
            //do nothing
            window.hideLoader()
        }
        // If it is a local story
        // Then the ID should start with "local"
        else if (storyUrl.indexOf(LOCAL_TALE_IDENTIFIER) >= 0) {
            setIsLocalEdit(true)
            storyUrl = storyUrl.trim().replace(LOCAL_TALE_IDENTIFIER, "")
            const theTale = getOneOfflineSavedTales(storyUrl)
            // console.log('calling setTaleWIP, offline tale = ', theTale)
            setTaleAsWIP(theTale)
            window.hideLoader()
        }

        // Else fetch it online
        else {
            // If we already have the data, no need to call BE
            if(_storyUrl === storyUrl) {
                return window.hideLoader()
            }

            // else call BE
            window.showLoader()
            ajaxGetWPathParams(GET_MYSTORY, [storyUrl])
            .then(res => {
                console.log(res.data)
                let {status, tale, msg} = res.data
                if(status === 200) {
                    // let tale = wrapperTale.tale
                    // tale = JSON.parse(tale)
                    // tale.isPublished = (wrapperTale.isPublished == 1) ? 1 : 0
                    console.log('calling setTaleAsWIP online tale', tale)
                    setTaleAsWIP(tale)
                }
                else {
                    // console.log("most probably some error occurred")
                    notify(msg)
                }
            })
            .catch(err =>{
                console.log(err)
            })
            .finally(() => window.hideLoader())
        }
        

        return (() => {
            console.log("Leaving Story Edit Page... Now is a good time to save changes so far...")
        })
    }, [setTaleAsWIP, _storyUrl, match])


    return (
        <CreateEditCommon 
            pageTitle = "Edit"
            isLocalEdit={isLocalEdit}
            history = {history}
        />
    )
}

const mapStateToProps = state => ({
    _storyUrl: state.wipTale.info.storyUrl
})
const mapDispatchToProps = dispatch => ({
    setTaleAsWIP: tale => dispatch(actionSetTaleAsWIP(tale))
})
export default connect(mapStateToProps, mapDispatchToProps)(EditTale)
