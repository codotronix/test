import React, { useEffect } from 'react'
import CreateEditCommon from '../createEditCommon/CreateEditCommon'
import { connect } from 'react-redux'
import {
    actionCreateNewTale
} from '../../../redux/actionCreators/createTaleActions'
import { CONST_TITLE } from '../../../utils/constants'


const CreateTale = props => {
    const { createNewTale, history, _id } = props

    useEffect(() => {
        // console.log("Inside CreateTale useEffect...")

        document.title = 'Create Tale | ' + CONST_TITLE

        // this !_id checking is mandatory, otherwise if user tries to go from
        // from create tale to create tale, then storylets will be blank
        if (!_id) { 
            createNewTale()
        }

        window.hideLoader()

        return (() => {
            console.log("Leaving Story Create Page... Now is a good time to save changes so far...")
        })
    }, [createNewTale, _id])


    return (
        <CreateEditCommon 
            pageTitle = "Create"
            history = {history}
        />
    )
}
const mapStateToProps = state => ({
    _id: state.wipTale.id
})
const mapDispatchToProps = dispatch => ({
    createNewTale: () => dispatch(actionCreateNewTale())
})
export default connect(mapStateToProps, mapDispatchToProps)(CreateTale)