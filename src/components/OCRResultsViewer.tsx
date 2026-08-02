import React, { useState } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Edit2, Save, X } from 'lucide-react';
import { getConfidenceColor, getConfidenceLabel } from '../utils/documentExtraction';

interface OCRField {
  value: string;
  confidence: number;
  verified: boolean;
  pattern: string;
}

interface OCRResultsViewerProps {
  documentType: string;
  fields: { [key: string]: OCRField };
  overallConfidence: number;
  lowConfidenceFields: string[];
  onFieldsUpdate?: (updatedFields: { [key: string]: OCRField }) => void;
  editable?: boolean;
}

export function OCRResultsViewer({
  documentType,
  fields,
  overallConfidence,
  lowConfidenceFields,
  onFieldsUpdate,
  editable = false,
}: OCRResultsViewerProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedFields, setEditedFields] = useState(fields);

  const handleFieldChange = (fieldName: string, newValue: string) => {
    setEditedFields({
      ...editedFields,
      [fieldName]: {
        ...editedFields[fieldName],
        value: newValue,
        verified: true,
      },
    });
  };

  const handleSave = () => {
    if (onFieldsUpdate) {
      onFieldsUpdate(editedFields);
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedFields(fields);
    setEditMode(false);
  };

  const confidenceColor = getConfidenceColor(overallConfidence);
  const confidenceLabel = getConfidenceLabel(overallConfidence);

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{documentType}</h2>
          <p className="text-sm text-gray-600 mt-1">OCR Extraction Results</p>
        </div>
        {editable && (
          <button
            onClick={() => (editMode ? handleCancel() : setEditMode(true))}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              editMode
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {editMode ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                Edit Fields
              </>
            )}
          </button>
        )}
      </div>

      {/* Overall Confidence Score */}
      <div
        className={`p-4 rounded-lg border-2 ${
          confidenceColor === 'green'
            ? 'bg-green-50 border-green-200'
            : confidenceColor === 'yellow'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-900">Overall Confidence</span>
          <span
            className={`text-2xl font-bold ${
              confidenceColor === 'green'
                ? 'text-green-700'
                : confidenceColor === 'yellow'
                  ? 'text-yellow-700'
                  : 'text-red-700'
            }`}
          >
            {overallConfidence}%
          </span>
        </div>
        <p
          className={`text-sm ${
            confidenceColor === 'green'
              ? 'text-green-700'
              : confidenceColor === 'yellow'
                ? 'text-yellow-700'
                : 'text-red-700'
          }`}
        >
          {confidenceLabel} extraction quality
          {lowConfidenceFields.length > 0 && ` - ${lowConfidenceFields.length} field(s) need review`}
        </p>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(editedFields).map(([fieldName, field]) => {
          const isLowConfidence = lowConfidenceFields.includes(fieldName);
          const fieldColor = getConfidenceColor(field.confidence);

          return (
            <div
              key={fieldName}
              className={`p-4 rounded-lg border-2 transition ${
                fieldColor === 'green'
                  ? 'bg-green-50 border-green-200'
                  : fieldColor === 'yellow'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
              } ${editable && editMode ? 'cursor-pointer hover:shadow-md' : ''}`}
            >
              {/* Field Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 capitalize">
                    {fieldName.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    {field.verified ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : isLowConfidence ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="text-xs font-medium text-gray-600">
                      {getConfidenceLabel(field.confidence)} ({field.confidence}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Field Value */}
              {editMode && editable ? (
                <input
                  type="text"
                  value={editedFields[fieldName].value}
                  onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-sm font-mono text-gray-900 break-words bg-white/50 p-2 rounded">
                  {field.value || '(No value extracted)'}
                </p>
              )}

              {/* Confidence Bar */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    fieldColor === 'green'
                      ? 'bg-green-500'
                      : fieldColor === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  }`}
                  style={{ width: `${field.confidence}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Confidence Alert */}
      {lowConfidenceFields.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900">Manual Review Required</h4>
              <p className="text-sm text-yellow-800 mt-1">
                The following fields have low confidence scores and should be manually verified:
              </p>
              <ul className="list-disc list-inside text-sm text-yellow-800 mt-2 ml-2">
                {lowConfidenceFields.map((field) => (
                  <li key={field}>
                    <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                    {' '}
                    ({editedFields[field]?.confidence}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Edit Mode Actions */}
      {editMode && editable && (
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Extraction Details */}
      <details className="cursor-pointer">
        <summary className="text-sm font-medium text-gray-600 hover:text-gray-900 select-none">
          Show extraction details
        </summary>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs">
          <p className="text-gray-600 font-mono whitespace-pre-wrap break-words">
            {Object.entries(editedFields)
              .map(([name, field]) => `${name}: ${field.pattern}`)
              .join('\n')}
          </p>
        </div>
      </details>
    </div>
  );
}
