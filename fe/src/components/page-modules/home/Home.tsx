import React, { Dispatch, useEffect, useState } from 'react'
import { Box } from '@material-ui/core'
import { connect } from 'react-redux'
import { config, getRoot } from '../../../utils/urls'
import { getTalesForHome } from '../../../services/home.service'
import { ComplexCard } from '../../common/cards'
import { UI_LOGIN_MODAL_OPEN, UI_LOGOUT_MODAL_OPEN } from '../../../redux/actionTypes'
import { TReactale, TGroupRtlByGenre, TUser, TWindow } from '../../../types'
import { RouteComponentProps } from 'react-router-dom'
import { CONST_TITLE } from '../../../utils/constants'

const { showLoader, hideLoader }  = window as TWindow

type HomeProps = RouteComponentProps & {
    openLoginModal: Function
    user: TUser
    openLogoutModal: Function
}

const Home: React.FC<HomeProps> = (props: HomeProps) => {
    // const [tales, setTales] = useState([])
    const [groups, setGroups] = useState({} as TGroupRtlByGenre)
    const { history, location, openLoginModal, user, openLogoutModal } = props

    // Update the Page Title    
    useEffect(() => {
        document.title = 'Home | ' + CONST_TITLE
    }, [])

    // get data for home page
    useEffect(() => {
        showLoader()
        getTalesForHome()
        .then((tales: Array<TReactale>) => {
            // Let's group tales by genre
            let groupByGenre = tales.reduce((acc: TGroupRtlByGenre, t: TReactale) => {
                acc[t.info.genre] = acc[t.info.genre] || []
                acc[t.info.genre].push(t)
                return acc
            }, {})
            setGroups(groupByGenre)
        })
        .catch(err => console.log(err))
        .finally(() => hideLoader())
    }, 
    [])
    

    // See if Login Modal needs to be opened ...
    useEffect(() => {
        const params = new URLSearchParams(location.search); 
        const openLogin = params.get('openLogin')
        const openLogout = params.get('openLogout')
        let isChanged = false
        // Logout get higher priority
        // Is it a logout ?
        if(openLogout === 'true') {
            isChanged = true
            setTimeout(() => {
                // Open logoutModal
                openLogoutModal()
            }, 300)
        }
        else if(openLogin === 'true') {
            isChanged = true
            setTimeout(() => {
                // Open autoLoginModal only if user not signed in already
                if(!user || !user.email) openLoginModal()
            }, 300)
        }

        // remove all the search strings, so that it does not get executed again
        if(isChanged) {
            const newSearchString = location.search.replace('openLogout=true', '').replace('openLogin=true', '')
            history.push(`${location.pathname}${newSearchString}`)
        }

    }, [])
    

    const goToTale = (storyUrl: string) => {
        // if it an App, go to preview url i.e. SPA way
        if(config.appType === 'APP') {
            history.push(`/preview/${storyUrl}`)
        }
        // else go to NODE View
        else {
            let url = '//' + getRoot() + '/read/' + storyUrl
            // let url = getRoot() + '/read/' + storyUrl
            window.location.href = url
        }
    }

    return (
        <Box pb={5} className="home-page">
            {
                Object.keys(groups).length <= 0 &&
                <h2 className="mt-25">
                    Oops! looks like an issue. We could not fetch any tales at the moment. :(
                </h2>
            }
            <Box>
            {
                Object.keys(groups).map((g,i) => 
                <Box key={g} mt={i===0 ? 0 : 4}>
                    <h1 className="category mb-5">
                        <span className="name">{g}</span>
                    </h1>
                    <div className="talecards-holder">
                    {
                        groups[g].map(t => 
                        <Box key={t.info.storyUrl} mr={2}>
                            <ComplexCard
                                // id={t.storyUrl}
                                info={t.info} 
                                expandable={false} 
                                pageID='HOME'
                                handleReadTale={() => goToTale(t.info.storyUrl)}
                                // handleEdit={goToEditTale}
                                // handleDelete={deleteTale}  
                            />
                        </Box>)
                    }
                    </div>
                </Box>)
            }
            </Box>
        </Box>
    )
}
const mapStateToProps = (state: { user: TUser }) => ({
    user: state.user
})
const mapDispatchToProps = (dispatch: Dispatch<any>)  => ({
    openLoginModal: () => dispatch({type: UI_LOGIN_MODAL_OPEN}),
    openLogoutModal: () => dispatch({ type: UI_LOGOUT_MODAL_OPEN }),
  })
  
export default connect(mapStateToProps, mapDispatchToProps)(Home)