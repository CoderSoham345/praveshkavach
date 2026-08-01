import { DocumentType, ExtractedDocData, FieldWithConfidence } from '../types';

export interface DocTypeSchema {
  type: DocumentType;
  label: string;
  iconName: string;
  fields: {
    key: keyof ExtractedDocData;
    label: string;
    type: 'text' | 'date' | 'select' | 'number';
    options?: string[];
    placeholder?: string;
    validationRegex?: RegExp;
    validationMessage?: string;
    required?: boolean;
  }[];
}

/**
 * Registry of Supported Document Types and their Specific Extraction Schemas
 */
export const DOCUMENT_SCHEMAS: Record<DocumentType, DocTypeSchema> = {
  'Aadhaar Card': {
    type: 'Aadhaar Card',
    label: 'Aadhaar Card (UIDAI)',
    iconName: 'ShieldCheck',
    fields: [
      {
        key: 'documentNumber',
        label: 'Aadhaar Number',
        type: 'text',
        placeholder: '5482 1111 2222',
        validationRegex: /^\d{4}\s?\d{4}\s?\d{4}$/,
        validationMessage: 'Aadhaar Number must be 12 digits (e.g., 5482 1111 2222)',
        required: true,
      },
      { key: 'fullName', label: 'Full Name', type: 'text', required: true },
      { key: 'dob', label: 'Date of Birth', type: 'text', required: true },
      { key: 'age', label: 'Age', type: 'text' },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
      { key: 'fatherName', label: "Father's / Guardian Name", type: 'text' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'pinCode', label: 'PIN Code', type: 'text', validationRegex: /^\d{6}$/, validationMessage: 'PIN code must be 6 digits' },
      { key: 'state', label: 'State', type: 'text' },
      { key: 'aadhaarVersion', label: 'Aadhaar Version', type: 'text' },
      { key: 'uidaiInfo', label: 'UIDAI Security Stamp', type: 'text' },
    ],
  },
  'PAN Card': {
    type: 'PAN Card',
    label: 'PAN Card (Income Tax Dept)',
    iconName: 'CreditCard',
    fields: [
      {
        key: 'documentNumber',
        label: 'PAN Number',
        type: 'text',
        placeholder: 'ABCDE1234F',
        validationRegex: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        validationMessage: 'PAN must be 10 characters in ABCDE1234F format',
        required: true,
      },
      { key: 'fullName', label: 'Full Name', type: 'text', required: true },
      { key: 'fatherName', label: "Father's Name", type: 'text', required: true },
      { key: 'dob', label: 'Date of Birth', type: 'text', required: true },
      { key: 'panType', label: 'PAN Type', type: 'select', options: ['Individual', 'Company', 'Firm', 'HUF', 'Trust'], required: true },
    ],
  },
  'Passport': {
    type: 'Passport',
    label: 'Indian Passport (Republic of India)',
    iconName: 'Globe',
    fields: [
      {
        key: 'documentNumber',
        label: 'Passport Number',
        type: 'text',
        placeholder: 'Z9821034',
        validationRegex: /^[A-Z][0-9]{7}$/,
        validationMessage: 'Passport Number must be 1 letter followed by 7 digits (e.g., Z9821034)',
        required: true,
      },
      { key: 'fullName', label: 'Full Name', type: 'text', required: true },
      { key: 'nationality', label: 'Nationality', type: 'text', required: true },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
      { key: 'dob', label: 'Date of Birth', type: 'text', required: true },
      { key: 'placeOfBirth', label: 'Place of Birth', type: 'text' },
      { key: 'issueDate', label: 'Date of Issue', type: 'text' },
      { key: 'expiryDate', label: 'Date of Expiry', type: 'text', required: true },
      { key: 'issuingAuthority', label: 'Issuing Authority', type: 'text' },
      { key: 'mrzCode', label: 'MRZ (Machine Readable Zone)', type: 'text' },
    ],
  },
  'Driving Licence': {
    type: 'Driving Licence',
    label: 'Driving Licence (RTO)',
    iconName: 'Car',
    fields: [
      {
        key: 'documentNumber',
        label: 'Licence Number',
        type: 'text',
        placeholder: 'DL-0420110012345',
        validationRegex: /^[A-Z]{2}[-\s]?[0-9]{2,13}$/,
        validationMessage: 'Invalid Driving Licence format (e.g. DL-0420110012345)',
        required: true,
      },
      { key: 'fullName', label: 'Full Name', type: 'text', required: true },
      { key: 'dob', label: 'Date of Birth', type: 'text', required: true },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'bloodGroup', label: 'Blood Group', type: 'select', options: ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-'] },
      { key: 'vehicleCategories', label: 'Vehicle Categories', type: 'text' },
      { key: 'issueDate', label: 'Date of Issue', type: 'text' },
      { key: 'expiryDate', label: 'Valid Till', type: 'text', required: true },
      { key: 'issuingAuthority', label: 'Issuing RTO', type: 'text' },
    ],
  },
  'Voter ID': {
    type: 'Voter ID',
    label: 'Voter ID (Election Commission)',
    iconName: 'Vote',
    fields: [
      {
        key: 'documentNumber',
        label: 'EPIC Number',
        type: 'text',
        placeholder: 'ABC1234567',
        validationRegex: /^[A-Z]{3}[0-9]{7}$/,
        validationMessage: 'EPIC Number must be 3 letters followed by 7 numbers',
        required: true,
      },
      { key: 'fullName', label: 'Full Name', type: 'text', required: true },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
      { key: 'dob', label: 'Date of Birth / Age', type: 'text' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'constituency', label: 'Assembly Constituency', type: 'text' },
    ],
  },
  'Employee Card': {
    type: 'Employee Card',
    label: 'Corporate Employee ID',
    iconName: 'Briefcase',
    fields: [
      {
        key: 'documentNumber',
        label: 'Employee ID',
        type: 'text',
        placeholder: 'EMP-9982',
        required: true,
      },
      { key: 'fullName', label: 'Employee Name', type: 'text', required: true },
      { key: 'companyName', label: 'Company Name', type: 'text', required: true },
      { key: 'department', label: 'Department', type: 'text' },
      { key: 'designation', label: 'Designation', type: 'text' },
      { key: 'validTill', label: 'Valid Till', type: 'text' },
    ],
  },
  'Student ID': {
    type: 'Student ID',
    label: 'University Student ID',
    iconName: 'GraduationCap',
    fields: [
      {
        key: 'documentNumber',
        label: 'Student Roll No / ID',
        type: 'text',
        placeholder: 'STU-2024-889',
        required: true,
      },
      { key: 'fullName', label: 'Student Name', type: 'text', required: true },
      { key: 'collegeName', label: 'University / College Name', type: 'text', required: true },
      { key: 'course', label: 'Course / Major', type: 'text' },
      { key: 'academicYear', label: 'Academic Year', type: 'text' },
      { key: 'validTill', label: 'Valid Till', type: 'text' },
    ],
  },
  'Visitor Pass': {
    type: 'Visitor Pass',
    label: 'Temporary Visitor Pass',
    iconName: 'FileCheck',
    fields: [
      { key: 'documentNumber', label: 'Pass Number', type: 'text', required: true },
      { key: 'fullName', label: 'Visitor Name', type: 'text', required: true },
    ],
  },
};

/**
 * Automatically Classifies Document Type based on text keywords & tokens
 */
export function classifyDocumentType(ocrText: string): DocumentType {
  const upper = ocrText.toUpperCase();

  if (upper.includes('GOVERNMENT OF INDIA') || upper.includes('AADHAAR') || upper.includes('UIDAI') || /\d{4}\s\d{4}\s\d{4}/.test(upper)) {
    return 'Aadhaar Card';
  }
  if (upper.includes('INCOME TAX DEPARTMENT') || upper.includes('PERMANENT ACCOUNT NUMBER') || /[A-Z]{5}[0-9]{4}[A-Z]/.test(upper)) {
    return 'PAN Card';
  }
  if (upper.includes('PASSPORT') || upper.includes('REPUBLIC OF INDIA') || upper.includes('P<IND')) {
    return 'Passport';
  }
  if (upper.includes('DRIVING') || upper.includes('LICENCE') || upper.includes('MOTOR VEHICLES') || /DL[- ]?\d+/.test(upper)) {
    return 'Driving Licence';
  }
  if (upper.includes('ELECTION') || upper.includes('COMMISSION') || upper.includes('VOTER') || /[A-Z]{3}[0-9]{7}/.test(upper)) {
    return 'Voter ID';
  }
  if (upper.includes('EMPLOYEE') || upper.includes('CORPORATE') || upper.includes('STAFF')) {
    return 'Employee Card';
  }
  if (upper.includes('STUDENT') || upper.includes('UNIVERSITY') || upper.includes('COLLEGE')) {
    return 'Student ID';
  }

  // Default fallback
  return 'Aadhaar Card';
}

/**
 * Calculate exact age dynamically based on Date of Birth (DD/MM/YYYY or YYYY) and current system date
 */
export function calculateAgeFromDOB(dob: string): string {
  if (!dob || dob.includes('Not Detected')) return '';
  const trimmed = dob.trim();
  const parts = trimmed.split(/[\/\-\.]/);

  let day: number, month: number, year: number;

  if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
    year = parseInt(parts[0], 10);
    const currentYear = new Date().getFullYear();
    const ageYears = currentYear - year;
    return ageYears > 0 ? `${ageYears} Years` : '';
  }

  if (parts.length === 3) {
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
    }

    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && year > 1900 && year <= new Date().getFullYear()) {
      const today = new Date();
      let age = today.getFullYear() - year;
      const m = today.getMonth() - month;
      if (m < 0 || (m === 0 && today.getDate() < day)) {
        age--;
      }
      return age >= 0 ? `${age} Years` : '';
    }
  }

  return '';
}

/**
 * Calculate per-field confidence & format validation
 */
export function validateAndComputeFieldConfidences(
  docData: ExtractedDocData
): ExtractedDocData {
  // Auto-compute dynamic age from DOB if DOB is present
  if (docData.dob) {
    const computedAge = calculateAgeFromDOB(docData.dob);
    if (computedAge) {
      docData.age = computedAge;
    }
  }

  const schema = DOCUMENT_SCHEMAS[docData.documentType] || DOCUMENT_SCHEMAS['Aadhaar Card'];
  const fieldConfidences: Record<string, FieldWithConfidence> = {};
  const lowConfidenceFields: string[] = [];

  schema.fields.forEach((field) => {
    const val = (docData as any)[field.key] || '';
    let confidence = 98; // Base accuracy for extracted text
    let isValid = true;
    let errorMessage: string | undefined = undefined;

    if (!val || val === 'Not Detected – Please Verify Manually') {
      if (field.required) {
        isValid = false;
        confidence = 40;
        errorMessage = 'Not Detected – Please Verify Manually';
      } else {
        confidence = 90; // Optional field empty is acceptable
      }
    } else if (field.validationRegex) {
      const match = field.validationRegex.test(val);
      if (!match) {
        isValid = false;
        confidence = 55;
        errorMessage = field.validationMessage || `Invalid format for ${field.label}`;
      } else {
        confidence = 99;
      }
    }

    if (confidence < 80 || !isValid) {
      lowConfidenceFields.push(field.label);
    }

    fieldConfidences[field.key] = {
      value: val,
      confidence,
      isValid,
      errorMessage,
    };
  });

  // Calculate overall average confidence score
  const total = Object.values(fieldConfidences).reduce((acc, f) => acc + f.confidence, 0);
  const count = Object.keys(fieldConfidences).length || 1;
  const overallScore = Math.round(total / count);

  return {
    ...docData,
    confidenceScore: overallScore,
    lowConfidenceFields,
    fieldConfidences,
  };
}

/**
 * Returns preset sample extraction data for selected document type
 */
export function getSampleExtractionDataForDoc(docType: DocumentType): ExtractedDocData {
  switch (docType) {
    case 'Aadhaar Card':
      return validateAndComputeFieldConfidences({
        fullName: 'RAMESH KUMAR',
        dob: '15/08/1990',
        age: '36',
        gender: 'Male',
        fatherName: 'RAMESH PRASAD',
        address: '', // Front scan of Aadhaar card has NO address! Address is scanned on the back side.
        pinCode: '',
        state: '',
        documentNumber: '5482 1111 2222',
        documentType: 'Aadhaar Card',
        aadhaarVersion: 'v2.0 UIDAI Cryptographic QR',
        uidaiInfo: 'UIDAI Verified Government Identity',
        confidenceScore: 98,
        lowConfidenceFields: [],
      });

    case 'PAN Card':
      return validateAndComputeFieldConfidences({
        fullName: 'SANJAY VERMA',
        fatherName: 'RAMESHWAR VERMA',
        dob: '22/11/1988',
        gender: 'Male',
        address: '', // PAN card has no address printed
        pinCode: '',
        documentNumber: 'ABCDE1234F',
        documentType: 'PAN Card',
        panType: 'Individual',
        confidenceScore: 97,
        lowConfidenceFields: [],
      });

    case 'Passport':
      return validateAndComputeFieldConfidences({
        fullName: 'PRIYA SHARMA',
        dob: '12/04/1995',
        gender: 'Female',
        nationality: 'Indian',
        placeOfBirth: 'New Delhi',
        issueDate: '01/01/2021',
        expiryDate: '31/12/2030',
        issuingAuthority: 'Regional Passport Office, Delhi',
        mrzCode: 'P<INDSHARMA<<PRIYA<<<<<<<<<<<<<<<<<<<<<<<\nZ9821034<4IND9504126F3012313<<<<<<<<<<<<<<02',
        documentNumber: 'Z9821034',
        documentType: 'Passport',
        confidenceScore: 99,
        lowConfidenceFields: [],
      });

    case 'Driving Licence':
      return validateAndComputeFieldConfidences({
        fullName: 'VIKRAM SHAH',
        dob: '10/06/1985',
        gender: 'Male',
        address: 'B-42, Sector 62, Noida, UP - 201301',
        bloodGroup: 'B+',
        vehicleCategories: 'MCWG, LMV',
        issueDate: '10/02/2018',
        expiryDate: '09/02/2038',
        issuingAuthority: 'RTO Noida (UP16)',
        documentNumber: 'DL-0420110012345',
        documentType: 'Driving Licence',
        confidenceScore: 96,
        lowConfidenceFields: [],
      });

    case 'Voter ID':
      return validateAndComputeFieldConfidences({
        fullName: 'ANANYA REDDY',
        dob: '28/09/1992',
        gender: 'Female',
        address: 'Flat 505, Zenith Park, Hyderabad - 500081',
        constituency: 'Jubilee Hills - 048',
        documentNumber: 'XYZ9876543',
        documentType: 'Voter ID',
        confidenceScore: 95,
        lowConfidenceFields: [],
      });

    case 'Employee Card':
      return validateAndComputeFieldConfidences({
        fullName: 'DAVID MILLER',
        dob: '14/02/1988',
        gender: 'Male',
        companyName: 'Apex Technologies Pvt Ltd',
        department: 'Executive Leadership',
        designation: 'Vice President of Product',
        validTill: '31/12/2027',
        documentNumber: 'EMP-9982',
        documentType: 'Employee Card',
        confidenceScore: 96,
        lowConfidenceFields: [],
      });

    case 'Student ID':
      return validateAndComputeFieldConfidences({
        fullName: 'SNEHA KAPOOR',
        dob: '04/05/2003',
        gender: 'Female',
        collegeName: 'National Institute of Technology',
        course: 'B.Tech Computer Science',
        academicYear: '4th Year (2022-2026)',
        validTill: '30/06/2026',
        documentNumber: 'STU-2024-889',
        documentType: 'Student ID',
        confidenceScore: 97,
        lowConfidenceFields: [],
      });

    default:
      return validateAndComputeFieldConfidences({
        fullName: 'RAMESH KUMAR',
        dob: '15/08/1990',
        gender: 'Male',
        documentNumber: '5482 1111 2222',
        documentType: 'Aadhaar Card',
        confidenceScore: 98,
        lowConfidenceFields: [],
      });
  }
}
