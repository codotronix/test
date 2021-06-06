import { 
    Home, 
    CreateTale,
    EditTale, 
    TalesFlow, 
    MyTales, 
    PreviewTale,
    MyProfile,
    Notifications 
} from '../components/page-modules'

const routes = [
    {
        path: "/home",
        component: Home,
        exact: true
    },
    {
        path: "/my-profile",
        component: MyProfile,
        exact: true
    },
    {
        path: "/create-tale",
        component: CreateTale,
        exact: true
    },
    {
        path: "/preview/:id",
        component: PreviewTale,
        exact: true
    },
    {
        path: "/edit-tale/:id",
        component: EditTale,
        exact: true
    },
    {
        path: "/tales-flow",
        component: TalesFlow,
        exact: true
    },
    {
        path: "/my-tales",
        component: MyTales,
        exact: true
    },
    {
        path: "/notifications",
        component: Notifications,
        exact: true
    }
]

export default routes