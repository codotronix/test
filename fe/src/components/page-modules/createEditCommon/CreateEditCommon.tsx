import { TWindow, TReactale, TUser, TUserPrefs } from '../../../types'

import React, { Dispatch, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import _ from 'lodash'
import { Paper, Tabs, Tab, Box, Typography } from '@material-ui/core'
import ReactoModal from '../../common/reactos/ReactoModal'
import ExportTaleModal from './ExportTaleModal'
import { ajaxPost } from '../../../utils/ajax'
import { ImportTaleModal, CreateTaleIntro, CreateTaleBody, CreateTaleFinish, Toolbelt, TopButtons} from '.'
import { connect } from 'react-redux'
import { actionSetTaleAsWIP } from '../../../redux/actionCreators/createTaleActions'
import { actionUpdateUserPrefs } from '../../../redux/actionCreators/userActions'
import { LOCAL_TALE_IDENTIFIER } from '../../../utils/constants' 
import { CREATE_TALE } from "../../../utils/urls"
import { downloadAsFile } from "../../../utils/util"
import { saveOneOfflineSavedTales } from '../../../services/offlinesavedtales.service'

import { E_SAVE_TYPES } from '../../../types/enums'

const { notify, LZString, showLoader, hideLoader } = window as TWindow

type Props = RouteComponentProps & {
    pageTitle: string
    isLocalEdit: boolean
    setTaleAsWIP: (tale: TReactale) => Dispatch<any>
    updateUserPrefs: (partialPrefs: TUserPrefs) => Dispatch<any>
    _wipTale: TReactale
    _authorEmail: string,
    _userPrefs: TUserPrefs
}

const CreateEditCommon: React.FC<Props> = (props: Props) => {

    const { pageTitle, isLocalEdit, setTaleAsWIP, history, _wipTale, _authorEmail, _userPrefs, updateUserPrefs } = props

    const [visibleTabIndex, setVisibleTab] = useState(0)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [expTale, setExpTale] = useState('')
    const [isExpTaleModalVisible, setExpTModalVis] = useState(false)
    // const [saveDefault, setSaveDefault] = useState(E_SAVE_TYPES.OFFLINE)   // 'OFFLINE' / 'ONLINE' / 'EXPORT'

    const markSaveDefault = (saveType = E_SAVE_TYPES.OFFLINE) => updateUserPrefs({defaultSave: saveType})

    const handleTabSwitch = (e: React.ChangeEvent<any>, newValue: number | any) => {
        setVisibleTab(newValue)
    }

    const goTo = (url: string) => history.push(url)

    const setImportedTaleForEditing = (tale: TReactale) => {
        setTaleAsWIP(tale)
        setIsImportModalOpen(false)
    }

    const getWIPTale = () => {
        const { storyboard, ...tale } = _wipTale
        return tale
    }

    const exportWIPTale = () => {
        if(!areFieldsValid()) return

        const tale = getWIPTale()
        // console.log(tale)
        // const content = btoa(encodeURIComponent(JSON.stringify(tale)))
        const content = LZString.compressToEncodedURIComponent(JSON.stringify(tale))
        downloadAsFile(`${tale.info.name.replace(/\s+/g, '-')}-${tale.id}.rtl`, content)
        setExpTale(content)
        setExpTModalVis(true)
    }

    const saveTaleLocal = (e?: Event | null, rtl?: TReactale) => {
        if(!areFieldsValid()) return false
        const tale = rtl || getWIPTale()
        saveOneOfflineSavedTales(tale)
        // notify("Saved succesfully. " + getLocalStorageSpace())
        notify('Successfully saved in device memory')
        return true
    }

    const saveTaleOnline = async () => {
        if(!areFieldsValid()) return

        if(!_authorEmail) {
            notify("Please login to save online...")
            return
        }

        let tale = getWIPTale()
        // console.log("WIP Tale = ", tale)
        tale.info.authorEmail = _authorEmail

        // This variable controls whether a redirection is required to /edit-tale/
        // because of creating new unique storyUrl
        // may be because local / offline tales are being saved for the 1st time
        let needsRedirection = false
        // console.log(tale)

        // If StoryUrl has never been set
        if (!tale.info.storyUrl) {
            // let res = await ajaxPost(CREATE_STORYURL, {storyUrl: tale.info.desiredUrl || ''})
            
            // tale.info.storyUrl = res.data.suggestedUrl
            needsRedirection = true
        }

        showLoader()
        ajaxPost(CREATE_TALE, tale)
        .then(res => {
            // console.log(res.data)
            let { status, submittedTale, msg } = res.data
            if(status === 200) {
                notify('Tale saved online successfully...')
                // tale = JSON.parse(tale)
                console.log('Setting as WIP', submittedTale)
                submittedTale.info.tags = submittedTale.info.tags.join(', ')
                setTaleAsWIP(submittedTale)

                // IF online save started from editing a local saved tale
                // Then update that local tale too, for sync
                console.log('isLocalEdit = ', isLocalEdit)
                
                if(isLocalEdit) {
                    console.log('Also saving in local tale =', submittedTale)
                    saveTaleLocal(null, submittedTale)
                }
                if (needsRedirection) {
                    history.push(`/edit-tale/${submittedTale.info.storyUrl}`)
                }
            }
            else {
                console.log("most probably some error occurred")
                notify(msg)
            }
        })
        .catch(err =>{
            console.log(err)
        })
        .finally(() => hideLoader())
    }

    /**
     * Dynamic Save Shortchut which will
     * either online/offline/export depending on 
     * user's preferred selected value
     */
    const doSaveDefault = () => {
        if(_userPrefs.defaultSave === E_SAVE_TYPES.OFFLINE) {
            saveTaleLocal()
        }
        else if (_userPrefs.defaultSave === E_SAVE_TYPES.ONLINE) {
            saveTaleOnline()
        }
        else if(_userPrefs.defaultSave === E_SAVE_TYPES.EXPORT) {
            exportWIPTale()
        }
    }

    /**
     * If user wants to see the full tale while edting
     * he can click on preview button
     * We will save it in local and use it for the preview
     */
    const previewTale = () => {
        if(!saveTaleLocal()) return
        const tale = getWIPTale()
        goTo(`/preview/${LOCAL_TALE_IDENTIFIER}${tale.id}`)
    }

    /**
     * It will check throught all the field validation
     * And show message + return boolean depending on it
     */
    const areFieldsValid = (rtl?: TReactale) => {
        const tale = rtl || getWIPTale()
        const { name, description, genre, lang, tags } = tale.info

        if(!name || !description || !genre || !lang || !tags) {
            notify('Fill all the mandatory fields viz. name, description, genre, language, tags')
            return false
        }
        return true
    }

    
    return (
        <Box py={2}>
            
            <Typography variant="h4" component="h1">
                {pageTitle} Reactale
            </Typography>
            
            <Box mt={2} mb={2} className="flex-space-between">
                <Typography variant="subtitle1">
                    {pageTitle} a Reactale or import one (using the right hand menu) to edit it.
                </Typography>
            </Box>

            {/* The Floating Toolbelt on Right */}
            <Toolbelt 
                openImportModal={() => setIsImportModalOpen(true)}
                previewTale={previewTale}
                doSaveDefault={doSaveDefault}
                goToTalesFlow={() => goTo('/tales-flow')}
            />

            {/* The Fixed TopButtons */}
            <TopButtons 
                openImportModal={() => setIsImportModalOpen(true)}
                previewTale={previewTale}
                doSaveDefault={doSaveDefault}
                goToTalesFlow={() => goTo('/tales-flow')}
            />

            <Paper square>
                <Tabs
                    value={visibleTabIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleTabSwitch}
                    centered
                    aria-label="tabs to create the story"
                >
                    <Tab label="Intro" />
                    <Tab label="Body" />
                    <Tab label="Finish" />
                </Tabs>
            </Paper>
            
            <Box className={visibleTabIndex !== 0 ? 'hide' : ''}>
                <CreateTaleIntro />
            </Box>

            <Box className={visibleTabIndex !== 1 ? 'hide' : ''}>
                <CreateTaleBody />
            </Box>

            <Box className={visibleTabIndex !== 2 ? 'hide' : ''}>
                <CreateTaleFinish 
                    exportWIPTale={exportWIPTale}
                    saveTaleOnline={saveTaleOnline}
                    saveTaleLocal={saveTaleLocal}
                    // expTale={expTale}
                    // isExpTaleModalVisible={isExpTaleModalVisible}
                    // setExpTModalVis={setExpTModalVis}
                    markSaveDefault={markSaveDefault}
                    saveDefault={_userPrefs.defaultSave || E_SAVE_TYPES.OFFLINE}
                />
            </Box>

            {/* Import Tale Modal */}
            <ImportTaleModal 
                isOpen={isImportModalOpen} 
                handleClose = {() => setIsImportModalOpen(false)}
                setForEditing = {setImportedTaleForEditing}
            />

            {/* Export Tale Modal */}
            <ExportTaleModal 
                isOpen = {isExpTaleModalVisible}
                handleClose = {() => setExpTModalVis(false)}
                expTaleContent = {expTale}
            />

            <ReactoModal />
        </Box>
    )
}

const mapStateToProps = (state: {wipTale: TReactale, user: TUser }) => ({
    _wipTale: state.wipTale,
    _authorEmail: state.user.email,
    _userPrefs: state.user.prefs
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setTaleAsWIP: (tale: TReactale) => dispatch(actionSetTaleAsWIP(tale)),
    updateUserPrefs: (partialPrefs: TUserPrefs) => dispatch(actionUpdateUserPrefs(partialPrefs))
})
export default connect(mapStateToProps, mapDispatchToProps)(CreateEditCommon as any)