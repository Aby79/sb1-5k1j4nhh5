export interface FileValidationError {
  message: string;
  row?: number;
  column?: string;
}

export interface ConversionResult {
  success: boolean;
  xml?: string;
  errors?: FileValidationError[];
}

export interface TabProps {
  isActive: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export interface FileRecord {
  id: string;
  userId: string;
  originalFileName: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  createdAt: Date;
  updatedAt: Date;
  xmlUrl?: string;
  errorDetails?: FileValidationError[];
}