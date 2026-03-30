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
    popbill.config({
      LinkID: this.apiKey,
      SecretKey: this.apiSecret,
      IsTest: false, // Set to false for production
    })

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
          reject(new Error(`Popbill Error [${error.code}]: ${error.message}`))
        },
        userId
      )
    })
  }
}

export const faxClient = new FaxClient()
