import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    id: '',
    email: '',
    description: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_DES: (state, description) => {
    state.description = description
  }

}

const actions = {
  // login
  login({ commit }, loginForm) {
    const { username_or_email, password } = loginForm
    return new Promise((resolve, reject) => {
      login({ username_or_email: username_or_email, password: password }).then(response => {
        const { token,data } = response
        console.log(data)
        commit('SET_TOKEN', token)
        commit('SET_NAME', data.Username)
        commit('SET_ID', data.Id)
        commit('SET_EMAIL', data.Email)
        commit('SET_DES', data.Description)
        setToken(token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // // get user info
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response

  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }

  //       const { name, avatar } = data

  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  setName({ commit }, name) {
    console.log("name", name)
    commit('SET_NAME', name)

  },
  setEmail({ commit }, email) {
    commit('SET_EMAIL', email)
  },
  setDesprition({ commit }, description) {
    commit('SET_DES', description)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

