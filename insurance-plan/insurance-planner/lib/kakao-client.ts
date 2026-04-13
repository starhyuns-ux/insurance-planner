/**
 * Kakao SDK Helper Utility
 */

declare global {
  interface Window {
    Kakao: any;
  }
}

export const initKakao = () => {
  if (typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
    // 제공해주신 키를 우선 사용하거나 환경 변수에서 가져옴
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY || '074e249b7b54cce3d65bb23f4c02c177'
    if (key) {
      window.Kakao.init(key)
      console.log('Kakao SDK Initialized with key:', key.slice(0, 5) + '...')
    } else {
      console.warn('Kakao JavaScript Key is missing')
    }
  }
}

export const loginWithKakao = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) return reject('Kakao SDK not loaded')

    window.Kakao.Auth.login({
      scope: 'friends,talk_message',
      success: (authObj: any) => {
        console.log('Kakao Login Success', authObj)
        resolve(authObj)
      },
      fail: (err: any) => {
        console.error('Kakao Login Fail', err)
        reject(err)
      }
    })
  })
}

export const getKakaoToken = () => {
  if (typeof window !== 'undefined' && window.Kakao) {
    return window.Kakao.Auth.getAccessToken()
  }
  return null
}

export const fetchKakaoFriends = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) return reject('Kakao SDK not loaded')

    window.Kakao.API.request({
      url: '/v1/api/talk/friends',
      success: (res: any) => {
        console.log('Fetch Friends Success', res)
        resolve(res.elements || [])
      },
      fail: (err: any) => {
        console.error('Fetch Friends Fail', err)
        reject(err)
      }
    })
  })
}

export const sendKakaoTemplate = (receiverUuids: string[], templateId: number, templateArgs: any) => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) return reject('Kakao SDK not loaded')

    window.Kakao.API.request({
      url: '/v1/api/talk/friends/message/send',
      data: {
        receiver_uuids: JSON.stringify(receiverUuids),
        template_id: templateId,
        template_args: JSON.stringify(templateArgs)
      },
      success: (res: any) => {
        console.log('Message Send Success', res)
        resolve(res)
      },
      fail: (err: any) => {
        console.error('Message Send Fail', err)
        reject(err)
      }
    })
  })
}

/**
 * Alternative: Simple Default Message
 */
export const sendKakaoDefault = (receiverUuids: string[], text: string, link: string) => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao) return reject('Kakao SDK not loaded')

    window.Kakao.API.request({
      url: '/v1/api/talk/friends/message/default/send',
      data: {
        receiver_uuids: JSON.stringify(receiverUuids),
        template_object: JSON.stringify({
          object_type: 'text',
          text: text,
          link: {
            mobile_web_url: link,
            web_url: link
          },
          button_title: '자세히 보기'
        })
      },
      success: (res: any) => {
        console.log('Default Message Send Success', res)
        resolve(res)
      },
      fail: (err: any) => {
        console.error('Default Message Send Fail', err)
        reject(err)
      }
    })
  })
}
