import React from 'react'

const Wrapper = props => {
    const { children } = props
    
    
    return (
        // <ReusableContext.Provider value={reusbales}>
        <div>
            {children}
        </div>
            
        // </ReusableContext.Provider>
    )
}
export default Wrapper