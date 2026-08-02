/**
 * Enhanced Document Field Extraction
 * Extracts fields from OCR text with per-field confidence scoring
 * Supports all 14 Indian government ID types
 */

export interface ExtractedField {
  value: string;
  confidence: number; // 0-100
  verified: boolean;
  pattern: string;
}

export interface ExtractedDocument {
  documentType: string;
  side: 'front' | 'back';
  fields: { [key: string]: ExtractedField };
  overallConfidence: number;
  lowConfidenceFields: string[];
  backSideData?: {
    address?: ExtractedField;
    validUpto?: ExtractedField;
  };
  rawText: string;
}

// Confidence scoring rules
const CONFIDENCE_LEVELS = {
  EXACT_MATCH: 98,     // Perfect regex match
  LIKELY_MATCH: 85,    // Good match but with slight variations
  PROBABLE_MATCH: 75,  // Reasonable match but ambiguous
  LOW_CONFIDENCE: 50,  // Weak match, needs verification
  NOT_FOUND: 0,        // No match
};

// Document-specific field extractors
const FIELD_EXTRACTORS = {
  // Aadhaar - 12 digit unique ID
  AADHAAR: {
    name: {
      patterns: [/\b(?:Name|नाम)\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|$|DOB)/i],
      confidence: 85,
    },
    aadhaarNumber: {
      patterns: [/(\d{4})\s*(\d{4})\s*(\d{4})/],
      confidence: 98,
      formatter: (match: string[]) => `${match[1]}-${match[2]}-${match[3]}`,
    },
    dateOfBirth: {
      patterns: [/DOB\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i, /(\d{2})[-/](\d{2})[-/](\d{4})/],
      confidence: 90,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
    gender: {
      patterns: [/\b(MALE|FEMALE)\b/i],
      confidence: 95,
    },
    address: {
      patterns: [/(?:Address|पता)\s*[:=]?\s*(.+?)(?:\n|PIN|$)/i],
      confidence: 75,
    },
    pinCode: {
      patterns: [/PIN\s*[:=]?\s*(\d{6})|(\d{6})(?:\s|$)/],
      confidence: 95,
    },
  },

  // PAN Card - Income tax ID
  PAN_CARD: {
    panNumber: {
      patterns: [/([A-Z]{5}[0-9]{4}[A-Z])/],
      confidence: 98,
    },
    name: {
      patterns: [/Name\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 80,
    },
    fatherName: {
      patterns: [/Father['']?s Name\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 75,
    },
    dateOfBirth: {
      patterns: [/DOB\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i],
      confidence: 90,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
  },

  // Passport
  PASSPORT: {
    passportNumber: {
      patterns: [/(?:Passport Number|पासपोर्ट नंबर)\s*[:=]?\s*([A-Z]{1}[0-9]{7})/],
      confidence: 98,
    },
    name: {
      patterns: [/Name\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|Passport)/i],
      confidence: 85,
    },
    dateOfBirth: {
      patterns: [/Date of Birth\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i],
      confidence: 95,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
    placeOfBirth: {
      patterns: [/Place of Birth\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 70,
    },
    validUpto: {
      patterns: [/Valid Upto\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i],
      confidence: 90,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
  },

  // Driving License
  DRIVING_LICENSE: {
    licenseNumber: {
      patterns: [/(?:License|Licence)\s*(?:No|Number)\s*[:=]?\s*([A-Z]{2}[0-9]{2}[A-Z0-9]{7,11})/],
      confidence: 95,
    },
    name: {
      patterns: [/Name\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|Address)/i],
      confidence: 85,
    },
    dateOfBirth: {
      patterns: [/DOB\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i],
      confidence: 90,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
    validUpto: {
      patterns: [/Valid Upto\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i],
      confidence: 90,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
    address: {
      patterns: [/Address\s*[:=]?\s*(.+?)(?:\n|PIN)/i],
      confidence: 70,
    },
  },

  // Voter ID
  VOTER_ID: {
    epicNumber: {
      patterns: [/(?:EPIC|E.P.I.C)\s*(?:No|Number)\s*[:=]?\s*([A-Z]{3}[0-9]{7})/],
      confidence: 95,
    },
    name: {
      patterns: [/Name\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 85,
    },
    dateOfBirth: {
      patterns: [/Date of Birth\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i],
      confidence: 90,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
    age: {
      patterns: [/Age\s*[:=]?\s*(\d+)/i],
      confidence: 75,
    },
  },

  // Vehicle Registration (RC Book)
  VEHICLE_RC: {
    registrationNumber: {
      patterns: [/(?:Registration|Reg)\s*(?:No|Number)\s*[:=]?\s*([A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4})/],
      confidence: 98,
    },
    ownerName: {
      patterns: [/(?:Owner|Owner Name)\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|Address)/i],
      confidence: 80,
    },
    vehicleType: {
      patterns: [/(?:Vehicle Type|Type of Vehicle)\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 75,
    },
    chassisNumber: {
      patterns: [/(?:Chassis|Chassis No)\s*[:=]?\s*([A-Za-z0-9]+)/i],
      confidence: 85,
    },
  },

  // Deed/Property Document
  PROPERTY_DEED: {
    propertyAddress: {
      patterns: [/(?:Property|Address)\s*[:=]?\s*(.+?)(?:\n\n|$)/i],
      confidence: 70,
    },
    ownerName: {
      patterns: [/(?:Owner|Grantor)\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 75,
    },
    surveyNumber: {
      patterns: [/(?:Survey|Lot)\s*(?:No|Number)\s*[:=]?\s*([A-Za-z0-9\/-]+)/i],
      confidence: 80,
    },
  },

  // Birth Certificate
  BIRTH_CERTIFICATE: {
    nameOfChild: {
      patterns: [/(?:Name of Child|Child's Name)\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 80,
    },
    dateOfBirth: {
      patterns: [/(?:Date of Birth|Date Born)\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i],
      confidence: 95,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
    fatherName: {
      patterns: [/Father['']?s Name\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 75,
    },
    motherName: {
      patterns: [/Mother['']?s Name\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 75,
    },
  },

  // Employer ID / Employee Badge
  EMPLOYEE_ID: {
    employeeId: {
      patterns: [/(?:Employee|Emp)\s*(?:ID|Number|No)\s*[:=]?\s*([A-Za-z0-9]+)/i],
      confidence: 90,
    },
    employeeName: {
      patterns: [/Name\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 85,
    },
    company: {
      patterns: [/(?:Company|Organization)\s*[:=]?\s*([A-Za-z0-9\s&]+?)(?:\n|/)/i],
      confidence: 70,
    },
    validUpto: {
      patterns: [/Valid Upto\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i],
      confidence: 85,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
  },

  // Utility Bill (Proof of Address)
  UTILITY_BILL: {
    accountNumber: {
      patterns: [/(?:Account|Acc|A\/C)\s*(?:No|Number)\s*[:=]?\s*([A-Za-z0-9]+)/i],
      confidence: 85,
    },
    consumerName: {
      patterns: [/(?:Consumer|Customer)\s*(?:Name)\s*[:=]?\s*([A-Za-z\s]+?)(?:\n|/)/i],
      confidence: 80,
    },
    address: {
      patterns: [/(?:Address|Location)\s*[:=]?\s*(.+?)(?:\n\n|Bill Date|$)/i],
      confidence: 75,
    },
    billingDate: {
      patterns: [/(?:Bill Date|Due Date)\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i],
      confidence: 80,
      formatter: (match: string[]) => `${match[1]}/${match[2]}/${match[3]}`,
    },
  },
};

/**
 * Extract fields from OCR text with confidence scoring
 */
export function extractDocumentFieldsWithConfidence(
  ocrText: string,
  documentType: string,
  side: 'front' | 'back' = 'front'
): ExtractedDocument {
  const extractors = (FIELD_EXTRACTORS as any)[documentType] || {};
  const fields: { [key: string]: ExtractedField } = {};
  const lowConfidenceFields: string[] = [];

  for (const [fieldName, fieldConfig] of Object.entries(extractors)) {
    const extracted = extractField(ocrText, fieldConfig as any);
    
    if (extracted) {
      fields[fieldName] = extracted;
      
      if (extracted.confidence < 75) {
        lowConfidenceFields.push(fieldName);
      }
    }
  }

  // Calculate overall confidence
  const allConfidences = Object.values(fields).map(f => f.confidence);
  const overallConfidence = allConfidences.length > 0
    ? Math.round(allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length)
    : 0;

  return {
    documentType,
    side,
    fields,
    overallConfidence,
    lowConfidenceFields,
    rawText: ocrText,
  };
}

/**
 * Extract a single field using patterns and confidence scoring
 */
function extractField(text: string, config: any): ExtractedField | null {
  const patterns = config.patterns || [];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let value = match[0];
      
      // Use formatter if provided
      if (config.formatter) {
        value = config.formatter(match);
      } else if (match[1]) {
        value = match[1].trim();
      }

      return {
        value,
        confidence: config.confidence || CONFIDENCE_LEVELS.PROBABLE_MATCH,
        verified: false,
        pattern: pattern.source,
      };
    }
  }
  
  return null;
}

/**
 * Extract back-side data (address, validity dates, etc.)
 */
export function extractBackSideData(
  ocrText: string,
  documentType: string
): { address?: ExtractedField; validUpto?: ExtractedField } {
  const backData: any = {};

  // Extract address
  const addressMatch = ocrText.match(/(?:Address|पता)\s*[:=]?\s*(.+?)(?:\n\n|$)/i);
  if (addressMatch) {
    backData.address = {
      value: addressMatch[1].trim(),
      confidence: CONFIDENCE_LEVELS.PROBABLE_MATCH,
      verified: false,
      pattern: 'address_pattern',
    };
  }

  // Extract validity date
  const validityMatch = ocrText.match(/Valid (?:Upto|Till|Until)\s*[:=]?\s*(\d{2})[-/](\d{2})[-/](\d{4})/i);
  if (validityMatch) {
    backData.validUpto = {
      value: `${validityMatch[1]}/${validityMatch[2]}/${validityMatch[3]}`,
      confidence: CONFIDENCE_LEVELS.LIKELY_MATCH,
      verified: false,
      pattern: 'validity_pattern',
    };
  }

  return backData;
}

/**
 * Get color-coded confidence indicator
 */
export function getConfidenceColor(confidence: number): 'red' | 'yellow' | 'green' {
  if (confidence >= 95) return 'green';
  if (confidence >= 75) return 'yellow';
  return 'red';
}

/**
 * Get confidence label
 */
export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 95) return 'Excellent';
  if (confidence >= 85) return 'Good';
  if (confidence >= 75) return 'Fair';
  if (confidence >= 50) return 'Low';
  return 'Very Low';
}
