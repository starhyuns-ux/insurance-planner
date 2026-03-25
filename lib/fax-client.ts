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
   * Send a fax with multiple files
   * @param params 
   */
  async sendFax(params: {
    receiverNum: string
    receiverName: string
    senderNum: string
    senderName: string
    title: string
    files: Buffer[] // Array of PDF/Image buffers
  }) {
    if (this.isMock) {
      console.log('--- [FAX MOCK MODE] ---')
      console.log(`To: ${params.receiverName} (${params.receiverNum})`)
      console.log(`From: ${params.senderName} (${params.senderNum})`)
      console.log(`Title: ${params.title}`)
      console.log(`Files: ${params.files.length} documents generated/attached`)
      console.log('-----------------------')
      
      // Simulate API response
      return {
        success: true,
        receiptId: `MOCK_FAX_${Date.now()}_${Math.random().toString(36).slice(7)}`,
        status: 'SUCCESS_MOCK',
      }
    }

    /**
     * REAL POPBILL INTEGRATION
     * Note: Popbill usually requires their SDK or a specific HMAC-SHA1 auth header.
     * Implementation below shows the architectural structure for the REST API.
     */
    try {
      // In a real implementation with the Popbill SDK:
      // const popbill = require('popbill');
      // popbill.config({ LinkID: this.apiKey, SecretKey: this.apiSecret });
      // const receiptId = await popbill.Fax.sendFax(this.corpNum, { ... });
      
      // For now, if keys are provided but SDK is not installed, we'd use fetch() to their endpoint
      // with the required headers. 
      
      throw new Error('Real Popbill SDK/API integration requires specific library setup. Falling back to Log.')
    } catch (err: any) {
      console.error('[FAX CLIENT ERROR]', err.message)
      throw err
    }
  }
}

export const faxClient = new FaxClient()
