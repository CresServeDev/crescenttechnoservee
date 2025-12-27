// GST API Service - Configurable for mock or real API integration
class GSTService {
  constructor() {
    // Configuration for different GST API providers
    this.config = {
      useMock: true, // Set to true for mock data, false for real API
      apiKey: process.env.REACT_APP_GST_API_KEY || '',
      // ClearTax GST API configuration
      clearTax: {
        baseUrl: 'https://cleartax.in',
        searchUrl: 'https://cleartax.in/api/gst/search',
        gstinUrl: 'https://cleartax.in/api/gst/gstin'
      },
      // Alternative GST API providers as fallback
      gstSuvidha: {
        baseUrl: 'https://api.gstsuvidha.com',
        gstinUrl: 'https://api.gstsuvidha.com/gstin'
      },
      // Rate limiting
      rateLimitDelay: 2000, // 2 seconds between requests to avoid rate limits
      lastRequestTime: 0
    };
  }

  /**
   * Fetch company details using GST number
   * @param {string} gstNumber - 15-digit GST number
   * @returns {Promise<Object>} - Company details object
   */
  async fetchCompanyDetails(gstNumber) {
    if (!gstNumber || gstNumber.length !== 15) {
      throw new Error('Invalid GST number format');
    }

    if (this.config.useMock) {
      return this._fetchMockCompanyDetails(gstNumber);
    } else {
      return this._fetchRealCompanyDetails(gstNumber);
    }
  }

  /**
   * Verify GST number validity
   * @param {string} gstNumber - 15-digit GST number
   * @returns {Promise<Object>} - Verification result
   */
  async verifyGST(gstNumber) {
    if (!gstNumber || gstNumber.length !== 15) {
      return { isValid: false, message: 'Invalid GST number format' };
    }

    if (this.config.useMock) {
      return this._verifyMockGST(gstNumber);
    } else {
      return this._verifyRealGST(gstNumber);
    }
  }

  /**
   * Mock implementation for fetching company details
   * @private
   */
  _fetchMockCompanyDetails(gstNumber) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        try {
          const normalizedGst = gstNumber.toUpperCase();

          // Comprehensive mock company details based on GST number patterns
          const mockCompanies = {
            // Maharashtra (State Code 27) - Major Companies
            '27AAACA1234A1Z1': { companyName: 'Mahindra & Mahindra Ltd', status: 'Active' },
            '27AABCB5678B2Z2': { companyName: 'Tata Motors Ltd', status: 'Active' },
            '27AACCC9012C3Z3': { companyName: 'Reliance Industries Ltd', status: 'Active' },
            '27AAADD3456D4Z4': { companyName: 'HDFC Bank Ltd', status: 'Active' },
            '27AAAEE7890E5Z5': { companyName: 'ICICI Bank Ltd', status: 'Active' },
            '27AAFFF1234F6Z6': { companyName: 'Infosys Ltd', status: 'Active' },
            '27AAAGG5678G7Z7': { companyName: 'Wipro Ltd', status: 'Active' },
            '27AAAHH9012H8Z8': { companyName: 'Larsen & Toubro Ltd', status: 'Active' },
            '27AAAII3456I9Z9': { companyName: 'Bajaj Auto Ltd', status: 'Active' },
            '27AAAJJ7890J1ZA': { companyName: 'Hindustan Unilever Ltd', status: 'Active' },
            '27AAAKK1234K1ZB': { companyName: 'Godrej Consumer Products Ltd', status: 'Active' },
            '27AAALL5678L2ZC': { companyName: 'Asian Paints Ltd', status: 'Active' },
            '27AAAMM9012M3ZD': { companyName: 'Maruti Suzuki India Ltd', status: 'Active' },
            '27AAANN3456N4ZE': { companyName: 'NTPC Ltd', status: 'Active' },
            '27AAAOO7890O5ZF': { companyName: 'Power Grid Corporation of India Ltd', status: 'Active' },
            '27ABJFA2736R1ZV': { companyName: 'A-Trac Engineering Co. LLP.', status: 'Active' },
            '27AROPP0671P1ZZ': { companyName: 'Crescent Technoserve', status: 'Active' },
            '27AAHCJ0667L1Z6': { companyName: 'JGP JEWELLERS LTD.', status: 'Active' },

            // Gujarat (State Code 24) - Major Companies
            '24AAACR5055Q1Z0': { companyName: 'Hindustan Unilever Ltd', status: 'Active' },
            '24AAADS6789S2Z1': { companyName: 'Adani Ports & SEZ Ltd', status: 'Active' },
            '24AAADT9012T3Z2': { companyName: 'Adani Enterprises Ltd', status: 'Active' },
            '24AAMFJ3536G1ZE': { companyName: 'jay engineering', status: 'Active' },
            '24AAAEU1234U1Z3': { companyName: 'Nirma Ltd', status: 'Active' },
            '24AAAFV5678V2Z4': { companyName: 'Cadila Healthcare Ltd', status: 'Active' },
            '24AAAGW9012W3Z5': { companyName: 'Zydus Lifesciences Ltd', status: 'Active' },
            '24AAAHX3456X4Z6': { companyName: 'Torrent Pharmaceuticals Ltd', status: 'Active' },
            '24AAAIY7890Y5Z7': { companyName: 'Sun Pharmaceutical Industries Ltd', status: 'Active' },

            // Karnataka (State Code 29) - Major Companies
            '29AACCB2230H1ZL': { companyName: 'Infosys Ltd', status: 'Active' },
            '29AAACC4567C2Z1': { companyName: 'Tata Consultancy Services Ltd', status: 'Active' },
            '29AAADD7890D3Z2': { companyName: 'Wipro Ltd', status: 'Active' },
            '29AAAEE1234E4Z3': { companyName: 'Biocon Ltd', status: 'Active' },
            '29AAAFF5678F5Z4': { companyName: 'MindTree Ltd', status: 'Active' },
            '29AAAGG9012G6Z5': { companyName: 'MphasiS Ltd', status: 'Active' },
            '29AAAHH3456H7Z6': { companyName: 'Oracle Financial Services Software Ltd', status: 'Active' },

            // Tamil Nadu (State Code 33) - Major Companies
            '33AAGCG4998G1Z0': { companyName: 'Wipro Ltd', status: 'Active' },
            '33AAAHH6789H2Z1': { companyName: 'Tamil Nadu Newsprint & Papers Ltd', status: 'Active' },
            '33AAAII1234I3Z2': { companyName: 'TVS Motor Company Ltd', status: 'Active' },
            '33AAAJJ5678J4Z3': { companyName: 'Ashok Leyland Ltd', status: 'Active' },
            '33AAAKK9012K5Z4': { companyName: 'MRF Ltd', status: 'Active' },
            '33AAALL3456L6Z5': { companyName: 'Chennai Petroleum Corporation Ltd', status: 'Active' },

            // Delhi (State Code 07) - Major Companies
            '07AAABC1234A1Z1': { companyName: 'Hindustan Unilever Ltd', status: 'Active' },
            '07AAABD5678B2Z2': { companyName: 'ITC Ltd', status: 'Active' },
            '07AAABE9012C3Z3': { companyName: 'DLF Ltd', status: 'Active' },
            '07AAABF3456D4Z4': { companyName: 'GAIL (India) Ltd', status: 'Active' },
            '07AAABG7890E5Z5': { companyName: 'NTPC Ltd', status: 'Active' },
            '07AAABH1234F6Z6': { companyName: 'Power Grid Corporation of India Ltd', status: 'Active' },

            // Uttar Pradesh (State Code 09) - Major Companies
            '09AAABC1234A1Z1': { companyName: 'Hindustan Unilever Ltd', status: 'Active' },
            '09AAABD5678B2Z2': { companyName: 'ITC Ltd', status: 'Active' },
            '09AAABE9012C3Z3': { companyName: 'Hindustan Aeronautics Ltd', status: 'Active' },
            '09AAABF3456D4Z4': { companyName: 'Bharat Heavy Electricals Ltd', status: 'Active' },
            '09AAABG7890E5Z5': { companyName: 'Indian Oil Corporation Ltd', status: 'Active' },

            // West Bengal (State Code 19) - Major Companies
            '19AAACA1234A1Z1': { companyName: 'Coal India Ltd', status: 'Active' },
            '19AAACB5678B2Z2': { companyName: 'Steel Authority of India Ltd', status: 'Active' },
            '19AAACC9012C3Z3': { companyName: 'NTPC Ltd', status: 'Active' },

            // Rajasthan (State Code 08) - Major Companies
            '08AAACA1234A1Z1': { companyName: 'Hindustan Zinc Ltd', status: 'Active' },
            '08AAACB5678B2Z2': { companyName: 'Shree Cement Ltd', status: 'Active' },
            '08AAACC9012C3Z3': { companyName: 'UltraTech Cement Ltd', status: 'Active' },

            // Telangana (State Code 36) - Major Companies
            '36AAACA1234A1Z1': { companyName: 'Dr. Reddy\'s Laboratories Ltd', status: 'Active' },
            '36AAACB5678B2Z2': { companyName: 'Aurobindo Pharma Ltd', status: 'Active' },
            '36AAACC9012C3Z3': { companyName: 'Divis Laboratories Ltd', status: 'Active' },

            // Kerala (State Code 32) - Major Companies
            '32AAACA1234A1Z1': { companyName: 'Cochin Shipyard Ltd', status: 'Active' },
            '32AAACB5678B2Z2': { companyName: 'Hindustan Newsprint Ltd', status: 'Active' },

            // Madhya Pradesh (State Code 23) - Major Companies
            '23AAACA1234A1Z1': { companyName: 'Bajaj Auto Ltd', status: 'Active' },
            '23AAACB5678B2Z2': { companyName: 'Hindustan Aeronautics Ltd', status: 'Active' },

            // Haryana (State Code 06) - Major Companies
            '06AAACA1234A1Z1': { companyName: 'Hero MotoCorp Ltd', status: 'Active' },
            '06AAACB5678B2Z2': { companyName: 'Maruti Suzuki India Ltd', status: 'Active' },
            '06AAACC9012C3Z3': { companyName: 'Jindal Steel & Power Ltd', status: 'Active' },

            // Punjab (State Code 03) - Major Companies
            '03AAACA1234A1Z1': { companyName: 'Vardhman Textiles Ltd', status: 'Active' },
            '03AAACB5678B2Z2': { companyName: 'Trident Ltd', status: 'Active' },

            // Odisha (State Code 21) - Major Companies
            '21AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },
            '21AAACB5678B2Z2': { companyName: 'National Aluminium Company Ltd', status: 'Active' },

            // Andhra Pradesh (State Code 37) - Major Companies
            '37AAACA1234A1Z1': { companyName: 'Hindustan Aeronautics Ltd', status: 'Active' },
            '37AAACB5678B2Z2': { companyName: 'NTPC Ltd', status: 'Active' },

            // Bihar (State Code 10) - Major Companies
            '10AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },
            '10AAACB5678B2Z2': { companyName: 'Bihar State Power Holding Company Ltd', status: 'Active' },

            // Jharkhand (State Code 20) - Major Companies
            '20AAACA1234A1Z1': { companyName: 'Steel Authority of India Ltd', status: 'Active' },
            '20AAACB5678B2Z2': { companyName: 'Coal India Ltd', status: 'Active' },

            // Chhattisgarh (State Code 22) - Major Companies
            '22AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },
            '22AAACB5678B2Z2': { companyName: 'Bharat Heavy Electricals Ltd', status: 'Active' },

            // Goa (State Code 30) - Major Companies
            '30AAACA1234A1Z1': { companyName: 'Vedanta Ltd', status: 'Active' },
            '30AAACB5678B2Z2': { companyName: 'Goa Shipyard Ltd', status: 'Active' },

            // Himachal Pradesh (State Code 02) - Major Companies
            '02AAACA1234A1Z1': { companyName: 'Hindustan Aeronautics Ltd', status: 'Active' },
            '02AAACB5678B2Z2': { companyName: 'NTPC Ltd', status: 'Active' },

            // Jammu and Kashmir (State Code 01) - Major Companies
            '01AAACA1234A1Z1': { companyName: 'Hindustan Aeronautics Ltd', status: 'Active' },
            '01AAACB5678B2Z2': { companyName: 'NTPC Ltd', status: 'Active' },

            // Uttarakhand (State Code 05) - Major Companies
            '05AAACA1234A1Z1': { companyName: 'Hindustan Aeronautics Ltd', status: 'Active' },
            '05AAACB5678B2Z2': { companyName: 'NTPC Ltd', status: 'Active' },

            // Assam (State Code 18) - Major Companies
            '18AAACA1234A1Z1': { companyName: 'Oil India Ltd', status: 'Active' },
            '18AAACB5678B2Z2': { companyName: 'NTPC Ltd', status: 'Active' },

            // Meghalaya (State Code 17) - Major Companies
            '17AAACA1234A1Z1': { companyName: 'Coal India Ltd', status: 'Active' },
            '17AAACB5678B2Z2': { companyName: 'NTPC Ltd', status: 'Active' },

            // Manipur (State Code 14) - Major Companies
            '14AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Nagaland (State Code 13) - Major Companies
            '13AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Tripura (State Code 16) - Major Companies
            '16AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Mizoram (State Code 15) - Major Companies
            '15AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Arunachal Pradesh (State Code 12) - Major Companies
            '12AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Sikkim (State Code 11) - Major Companies
            '11AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Puducherry (State Code 34) - Major Companies
            '34AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Chandigarh (State Code 04) - Major Companies
            '04AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Dadra and Nagar Haveli and Daman and Diu (State Code 26) - Major Companies
            '26AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Lakshadweep (State Code 31) - Major Companies
            '31AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },

            // Andaman and Nicobar Islands (State Code 35) - Major Companies
            '35AAACA1234A1Z1': { companyName: 'NTPC Ltd', status: 'Active' },
          };

          const companyData = mockCompanies[normalizedGst];

          if (companyData) {
            resolve({
              gstNumber: normalizedGst,
              companyName: companyData.companyName,
              status: companyData.status,
              source: 'Mock API'
            });
          } else {
            // For unknown GST numbers, generate a company name based on the GST pattern
            // This provides a more user-friendly experience while maintaining data integrity
            const stateCode = normalizedGst.substring(0, 2);
            const panNumber = normalizedGst.substring(2, 12);

            // Generate company name based on PAN pattern
            let companyName = 'Business Entity';

            // Check PAN patterns for different entity types
            if (panNumber.match(/^[A-Z]{3}[A-Z]{3}[0-9]{4}[A-Z]$/)) {
              // Company PAN pattern (e.g., ABCDE1234F)
              const prefixes = ['Technologies', 'Solutions', 'Enterprises', 'Industries', 'Corporation', 'Limited', 'Private Limited'];
              const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
              companyName = `${panNumber.substring(0, 3)} ${randomPrefix}`;
            } else if (panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]$/)) {
              // Individual PAN pattern (e.g., ABCDE1234F)
              companyName = `${panNumber.substring(0, 3)} Enterprises`;
            }

            resolve({
              gstNumber: normalizedGst,
              companyName: companyName,
              status: 'Active',
              source: 'Generated (Valid GST Format)'
            });
          }
        } catch (error) {
          reject(new Error('Failed to fetch company details'));
        }
      }, 1000); // 1 second delay to simulate API call
    });
  }

  /**
   * Mock implementation for GST verification
   * @private
   */
  _verifyMockGST(gstNumber) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // GST format validation regex
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const isValidFormat = gstRegex.test(gstNumber);

        if (isValidFormat) {
          resolve({
            isValid: true,
            message: 'GST number is valid and registered',
            status: 'Active'
          });
        } else {
          resolve({
            isValid: false,
            message: 'Invalid GST number format',
            status: 'Invalid'
          });
        }
      }, 1500); // 1.5 second delay
    });
  }

  /**
   * Real API implementation for fetching company details
   * @private
   */
  async _fetchRealCompanyDetails(gstNumber) {
    // Rate limiting to avoid API throttling
    const now = Date.now();
    const timeSinceLastRequest = now - this.config.lastRequestTime;
    if (timeSinceLastRequest < this.config.rateLimitDelay) {
      await new Promise(resolve => setTimeout(resolve, this.config.rateLimitDelay - timeSinceLastRequest));
    }
    this.config.lastRequestTime = Date.now();

    // Try ClearTax API first (similar to their website functionality)
    try {
      const result = await this._tryClearTaxAPI(gstNumber);
      if (result) return result;
    } catch (error) {
      console.log('ClearTax API failed:', error.message);
    }

    // Fallback to other third-party APIs
    try {
      const result = await this._tryThirdPartyAPIs(gstNumber);
      if (result) return result;
    } catch (error) {
      console.log('Third-party APIs failed:', error.message);
    }

    // If all APIs fail, throw error
    throw new Error('GST number not found in any available API services. Please verify the GST number is correct and registered.');
  }

  /**
   * Try ClearTax GST API (Note: ClearTax requires authentication for API access)
   * @private
   */
  async _tryClearTaxAPI(gstNumber) {
    // ClearTax provides GST search functionality on their website but requires authentication for API access
    // This method attempts to use ClearTax's services if API key is configured
    try {
      if (!this.config.apiKey) {
        console.log('ClearTax API key not configured - skipping ClearTax API attempt');
        return null;
      }

      // Try ClearTax's authenticated API endpoint
      const searchUrl = `${this.config.clearTax.baseUrl}/api/gst/search`;
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; GSTLookup/1.0)',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          gstin: gstNumber,
          includeDetails: true
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.success && data.data) {
          return {
            gstNumber: gstNumber,
            companyName: data.data.tradeName || data.data.legalName || data.data.businessName || 'Unknown Company',
            status: data.data.status || data.data.gstStatus || 'Active',
            source: 'ClearTax API'
          };
        }
      } else if (response.status === 401) {
        console.log('ClearTax API authentication failed - invalid API key');
      } else if (response.status === 403) {
        console.log('ClearTax API access forbidden - check API permissions');
      }
    } catch (error) {
      console.log('ClearTax API failed:', error.message);
    }

    // Note: ClearTax's website functionality requires JavaScript execution and session management
    // which cannot be easily replicated with simple HTTP requests. For production use,
    // consider using official GST portal APIs or paid GST data providers.

    return null;
  }

  /**
   * Try official GST Portal APIs
   * @private
   */
  async _tryGSTPortalAPI(gstNumber) {
    // Method 1: GST Portal Public Search API
    try {
      const searchUrl = this.config.gstPortal.searchUrl;
      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; GSTLookup/1.0)',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          gstin: gstNumber,
          action: 'TP' // TP = Taxpayer search
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.result && data.result.length > 0) {
          const company = data.result[0];
          return {
            gstNumber: gstNumber,
            companyName: company.tradeName || company.legalName || company.name || 'Unknown Company',
            status: company.status || company.gstStatus || 'Active',
            source: 'Official GST Portal'
          };
        }
      }
    } catch (error) {
      console.log('GST Portal search API failed:', error.message);
    }

    // Method 2: GST Portal Verify API
    try {
      const verifyUrl = this.config.gstPortal.verifyUrl;
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; GSTLookup/1.0)',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          gstin: gstNumber
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.valid) {
          return {
            gstNumber: gstNumber,
            companyName: data.tradeName || data.legalName || data.name || 'Verified GST Entity',
            status: data.status || 'Active',
            source: 'Official GST Portal'
          };
        }
      }
    } catch (error) {
      console.log('GST Portal verify API failed:', error.message);
    }

    return null;
  }

  /**
   * Try third-party GST APIs as fallback
   * @private
   */
  async _tryThirdPartyAPIs(gstNumber) {
    // Try ClearTax API
    try {
      const clearTaxUrl = `${this.config.clearTax.gstinUrl}/${gstNumber}`;
      const response = await fetch(clearTaxUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; GSTLookup/1.0)'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          return {
            gstNumber: gstNumber,
            companyName: data.tradeName || data.legalName || data.businessName || 'Unknown Company',
            status: data.status || data.gstStatus || 'Active',
            source: 'ClearTax API'
          };
        }
      }
    } catch (error) {
      console.log('ClearTax API failed:', error.message);
    }

    // Try GST Suvidha API
    try {
      const gstSuvidhaUrl = `${this.config.gstSuvidha.gstinUrl}/${gstNumber}`;
      const response = await fetch(gstSuvidhaUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; GSTLookup/1.0)'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          return {
            gstNumber: gstNumber,
            companyName: data.tradeName || data.legalName || data.businessName || 'Unknown Company',
            status: data.status || data.gstStatus || 'Active',
            source: 'GST Suvidha API'
          };
        }
      }
    } catch (error) {
      console.log('GST Suvidha API failed:', error.message);
    }

    return null;
  }

  /**
   * Real API implementation for GST verification
   * @private
   */
  async _verifyRealGST(gstNumber) {
    // Example implementation for GST verification
    const url = `${this.config.baseUrl}/verify`;
    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ gstin: gstNumber })
      });

      if (!response.ok) {
        throw new Error(`Verification API request failed: ${response.status}`);
      }

      const data = await response.json();

      return {
        isValid: data.valid || false,
        message: data.message || 'Verification completed',
        status: data.status || 'Unknown'
      };
    } catch (error) {
      return {
        isValid: false,
        message: `Verification failed: ${error.message}`,
        status: 'Error'
      };
    }
  }
}

// Export a singleton instance
const gstService = new GSTService();
export default gstService;
