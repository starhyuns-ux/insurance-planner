/**
 * Fax Client for Popbill (팝빌) Integration
 * Handles sending PDFs to insurance company fax numbers.
 * Supports a MOCK mode if API keys are not provided.
 */
export class FaxClient {
  private corpNum: string | undefined
  private userId: string | undefined
  private apiKey: string | undefined
  private apiSecret: string | undefined
  private isMock: boolean

  constructor() {
    this.corpNum = process.env.POPBILL_CORP_NUM
    this.userId = process.env.POPBILL_USER_ID
    this.apiKey = process.env.POPBILL_API_KEY
    this.apiSecret = process.env.POPBILL_API_SECRET
    
    // If any key is missing, default to MOCK mode
    this.isMock = !this.corpNum || !this.userId || !this.apiKey || !this.apiSecret
  }

  /**
   * Send a fax with multiple files using Popbill SDK
   */
  async sendFax(params: {
    receiverNum: string
    receiverName: string
    senderNum: string
    senderName: string
    title: string
    files: Buffer[]
  }): Promise<{ success: boolean; receiptId: string; status: string }> {
    if (this.isMock) {
      console.log('--- [FAX MOCK MODE] ---')
      console.log(`To: ${params.receiverName} (${params.receiverNum})`)
      console.log(`From: ${params.senderName} (${params.senderNum})`)
      const mockId = `MOCK_FAX_${Date.now()}_${Math.random().toString(36).slice(7)}`
      return { success: true, receiptId: mockId, status: 'SUCCESS_MOCK' }
    }

    const popbill = require('popbill')
    this.configurePopbill(popbill)

    const faxService = popbill.FaxService()
    const corpNum = this.corpNum!
    const userId = this.userId!

    const receivers = [
      {
        receiveNum: params.receiverNum,
        receiveName: params.receiverName,
      },
    ]

    const binaryFiles = params.files.map((data, index) => ({
      fileName: `claim_doc_${index + 1}.pdf`,
      fileData: data,
    }))

    return new Promise((resolve, reject) => {
      // Popbill sendFaxBinary params: (CorpNum, senderNumber, receivers, binaryFiles, sendDT, success, error)
      // Empty string for sendDT means immediate transmission
      faxService.sendFaxBinary(
        corpNum,
        params.senderNum,
        receivers,
        binaryFiles,
        '',
        (receiptId: string) => {
          console.log('[FAX SUCCESS] Receipt ID:', receiptId)
          resolve({ success: true, receiptId, status: 'SENT' })
        },
        (error: any) => {
          console.error('[FAX ERROR]', error)
          let friendlyMessage = error.message
          if (error.code === -11010014) {
            friendlyMessage = '발신번호가 등록되지 않았습니다. 팝빌 설정에서 발신번호를 등록해주세요.'
          } else if (error.code === -11010008) {
            friendlyMessage = '해당 기업번호로 등록된 사용자가 아닙니다.'
          }
          reject(new Error(`Popbill Error [${error.code}]: ${friendlyMessage}`))
        },
        userId
      )
    })
  }

  /**
   * Get the status and result of a sent fax
   */
  async getFaxResult(receiptId: string): Promise<any> {
    if (this.isMock || receiptId.startsWith('MOCK_')) {
      return {
        state: 3, // Finished
        result: 1, // Success
        receiptId: receiptId,
        sendDT: new Date().toISOString(),
        resultDT: new Date().toISOString(),
        sendPageCnt: 1,
        successPageCnt: 1,
        failPageCnt: 0,
      }
    }

    const popbill = require('popbill')
    this.configurePopbill(popbill)

    const faxService = popbill.FaxService()
    const corpNum = this.corpNum!
    const userId = this.userId!

    return new Promise((resolve, reject) => {
      faxService.getFaxResult(
        corpNum,
        receiptId,
        (result: any) => {
          // result is often an array or single object depending on batch
          // Since we send one by one, we'll take the first one if it's an array
          const status = Array.isArray(result) ? result[0] : result
          resolve(status)
        },
        (error: any) => {
          reject(new Error(`Popbill Error [${error.code}]: ${error.message}`))
        },
        userId
      )
    })
  }

  /**
   * Get a temporary URL to preview the fax document
   */
  async getPreviewURL(receiptId: string): Promise<string> {
    if (this.isMock || receiptId.startsWith('MOCK_')) {
      return 'https://example.com/mock-fax-preview'
    }

    const popbill = require('popbill')
    this.configurePopbill(popbill)

    const faxService = popbill.FaxService()
    const corpNum = this.corpNum!
    const userId = this.userId!

    return new Promise((resolve, reject) => {
      faxService.getPreviewURL(
        corpNum,
        receiptId,
        (url: string) => resolve(url),
        (error: any) => {
          reject(new Error(`Popbill Error [${error.code}]: ${error.message}`))
        },
        userId
      )
    })
  }

  /**
   * Helper to configure popbill SDK
   */
  private configurePopbill(popbill: any) {
    popbill.config({
      LinkID: this.apiKey,
      SecretKey: this.apiSecret,
      IsTest: process.env.NODE_ENV !== 'production', 
    })
  }
}

export const faxClient = new FaxClient()
