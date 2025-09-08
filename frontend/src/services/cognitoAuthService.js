import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'
import { getConfig } from '../config/app.config'

class CognitoAuthService {
  constructor() {
    this.currentUser = null
    this.config = getConfig()
    this.adminCredentials = {
      email: this.config.admin.email,
      password: this.config.admin.password
    }
  }

  // Login com email e senha
  async authenticateUser(email, password) {
    return new Promise((resolve, reject) => {
      // Simular delay de rede
      setTimeout(() => {
        try {
          // Verificar se é o admin fixo
          if (email === this.adminCredentials.email && password === this.adminCredentials.password) {
            // Criar token JWT mock para admin
            const adminToken = this.createMockJWT({
              email: email,
              sub: 'admin-user-id',
              'cognito:groups': ['admin'],
              email_verified: true,
              exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 horas
            })

            // Configurar usuário admin
            this.currentUser = {
              id: 'admin-user-id',
              email: email,
              name: 'Luis Paulo de Oliveira',
              isAdmin: true,
              groups: ['admin'],
              sub: 'admin-user-id',
              email_verified: true
            }

            // Salvar token nos cookies
            this.setAuthCookies(adminToken, adminToken, 'refresh-token-admin')

            resolve({
              success: true,
              user: this.currentUser,
              isAdmin: true,
              tokens: {
                accessToken: adminToken,
                idToken: adminToken,
                refreshToken: 'refresh-token-admin'
              }
            })
          } else {
            // Usuário comum - verificar se email existe (simulação)
            if (email && password && password.length >= 6) {
              // Criar token JWT mock para usuário comum
              const userToken = this.createMockJWT({
                email: email,
                sub: 'user-' + Date.now(),
                'cognito:groups': ['user'],
                email_verified: true,
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 horas
              })

              // Configurar usuário comum
              this.currentUser = {
                id: 'user-' + Date.now(),
                email: email,
                name: email.split('@')[0], // Usar parte do email como nome
                isAdmin: false,
                groups: ['user'],
                sub: 'user-' + Date.now(),
                email_verified: true
              }

              // Salvar token nos cookies
              this.setAuthCookies(userToken, userToken, 'refresh-token-user')

              resolve({
                success: true,
                user: this.currentUser,
                isAdmin: false,
                tokens: {
                  accessToken: userToken,
                  idToken: userToken,
                  refreshToken: 'refresh-token-user'
                }
              })
            } else {
              reject({
                success: false,
                message: 'Email ou senha incorretos',
                code: 'NotAuthorizedException'
              })
            }
          }
        } catch (error) {
          reject({
            success: false,
            message: 'Erro interno do sistema',
            code: 'InternalError'
          })
        }
      }, 1000); // Simular delay de 1 segundo
    })
  }

  // Verificar se o usuário está autenticado
  async checkAuthStatus() {
    return new Promise(resolve => {
      try {
        const accessToken = Cookies.get(this.config.auth.cookieName)

        if (!accessToken) {
          resolve({ isAuthenticated: false, user: null, isAdmin: false })
          return
        }

        // Verificar se o token é válido
        if (this.isTokenValid(accessToken)) {
          // Decodificar token para obter informações do usuário
          const decodedToken = jwtDecode(accessToken)
          const isAdmin = decodedToken['cognito:groups']?.includes('admin') || false

          this.currentUser = {
            id: decodedToken.sub,
            email: decodedToken.email,
            name: decodedToken.email.split('@')[0], // Usar parte do email como nome
            isAdmin: isAdmin,
            groups: decodedToken['cognito:groups'] || [],
            sub: decodedToken.sub,
            email_verified: decodedToken.email_verified
          }

          resolve({
            isAuthenticated: true,
            user: this.currentUser,
            isAdmin: isAdmin
          })
        } else {
          // Token expirado
          this.clearAuthCookies()
          resolve({ isAuthenticated: false, user: null, isAdmin: false })
        }
      } catch (error) {
        console.error('Erro ao verificar status de autenticação:', error)
        this.clearAuthCookies()
        resolve({ isAuthenticated: false, user: null, isAdmin: false })
      }
    })
  }

  // Logout
  async logout() {
    return new Promise(resolve => {
      this.clearAuthCookies()
      this.currentUser = null
      resolve({ success: true })
    })
  }

  // Renovar token
  async refreshToken() {
    return new Promise((resolve, reject) => {
      try {
        const refreshToken = Cookies.get('agrosync_refresh_token')

        if (!refreshToken) {
          reject(new Error('Refresh token não encontrado'))
          return
        }

        // Simular renovação de token
        const newToken = this.createMockJWT({
          email: this.currentUser?.email || 'unknown@email.com',
          sub: this.currentUser?.sub || 'unknown-user',
          'cognito:groups': this.currentUser?.groups || ['user'],
          email_verified: true,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24 horas
        })

        // Atualizar cookies
        this.setAuthCookies(newToken, newToken, refreshToken)

        resolve({ success: true, token: newToken })
      } catch (error) {
        reject(error)
      }
    })
  }

  // Verificar se o token é válido
  isTokenValid(token) {
    if (!token) return false

    try {
      const decoded = jwtDecode(token)
      const currentTime = Date.now() / 1000

      return decoded.exp > currentTime
    } catch (error) {
      return false
    }
  }

  // Verificar se o usuário é admin
  isUserAdmin(user) {
    return user && user.isAdmin === true
  }

  // Configurar cookies de autenticação
  setAuthCookies(accessToken, idToken, refreshToken) {
    Cookies.set(this.config.auth.cookieName, accessToken, {
      expires: this.config.auth.cookieExpiry,
      secure: this.config.auth.secure,
      sameSite: this.config.auth.sameSite
    })

    Cookies.set('agrosync_id_token', idToken, {
      expires: this.config.auth.cookieExpiry,
      secure: this.config.auth.secure,
      sameSite: this.config.auth.sameSite
    })

    Cookies.set('agrosync_refresh_token', refreshToken, {
      expires: this.config.auth.cookieExpiry,
      secure: this.config.auth.secure,
      sameSite: this.config.auth.sameSite
    })
  }

  // Limpar cookies de autenticação
  clearAuthCookies() {
    Cookies.remove(this.config.auth.cookieName)
    Cookies.remove('agrosync_id_token')
    Cookies.remove('agrosync_refresh_token')
  }

  // Obter token atual dos cookies
  getCurrentToken() {
    return Cookies.get(this.config.auth.cookieName)
  }

  // Obter usuário atual
  getCurrentUser() {
    return this.currentUser
  }

  // Criar JWT mock para simulação
  createMockJWT(payload) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    }

    const encodedHeader = btoa(JSON.stringify(header))
    const encodedPayload = btoa(JSON.stringify(payload))

    // Simular assinatura (em produção seria uma assinatura real)
    const signature = btoa('mock-signature-' + Date.now())

    return `${encodedHeader}.${encodedPayload}.${signature}`
  }

  // Mensagens de erro personalizadas
  getErrorMessage(code) {
    const errorMessages = {
      UserNotFoundException: 'Usuário não encontrado',
      NotAuthorizedException: 'Email ou senha incorretos',
      UserNotConfirmedException: 'Usuário não confirmado',
      PasswordResetRequiredException: 'Redefinição de senha necessária',
      TooManyRequestsException: 'Muitas tentativas. Tente novamente em alguns minutos',
      UserLambdaValidationException: 'Erro de validação',
      InvalidPasswordException: 'Senha inválida',
      UsernameExistsException: 'Usuário já existe',
      CodeMismatchException: 'Código de verificação incorreto',
      ExpiredCodeException: 'Código de verificação expirado',
      LimitExceededException: 'Limite excedido',
      InvalidParameterException: 'Parâmetro inválido',
      ResourceNotFoundException: 'Recurso não encontrado',
      NetworkError: 'Erro de conexão. Verifique sua internet',
      InternalError: 'Erro interno do sistema',
      default: 'Erro inesperado. Tente novamente'
    }

    return errorMessages[code] || errorMessages.default
  }

  // Verificar se o usuário está em um grupo específico
  isUserInGroup(user, groupName) {
    return user && user.groups && user.groups.includes(groupName)
  }

  // Obter todos os grupos do usuário
  getUserGroups(user) {
    return user ? user.groups || [] : []
  }
}

const cognitoAuthService = new CognitoAuthService()
export default cognitoAuthService
