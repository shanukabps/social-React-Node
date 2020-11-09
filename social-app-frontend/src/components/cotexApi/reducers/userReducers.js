

export const initialState = {//inirial data layer

    user: null
}



const reducer = (state, action) => {
    console.log(action)
    switch (action.type) {

        case "SET_USER":
            return {
                ...state,
                user: action.user
            }

        case "CLEAR":
            return {

                user: null
            }

               case "UPDATE":
            return {

                ...state,
               user:{
                   ...state.user,
                   followers:action.user.followers,
                   following:action.user.following
                }
             
            }

               case "UPDATEPIC":
            return {

                ...state,
               user:{
                   ...state.user,
                  pic:action.user.pic
                }
             
            }






        default:
            return state
    }
}

export default reducer