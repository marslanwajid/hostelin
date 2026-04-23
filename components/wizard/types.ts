export interface Building {
  id: string;
  name: string;
  floors: number;
  gender: string;
}

export interface Room {
  id: string;
  buildingId: string;
  floor: number;
  roomNumber: string;
  beds: number;
}

export interface Pricing {
  roomId: string;
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
  dailyPrice: string | number;
  weeklyPrice: string | number;
  monthlyPrice: string | number;
}

export interface HostelImage {
  id: string;
  file?: File;
  preview: string;
  isCover?: boolean;
}

export interface WizardData {
  hostelName: string;
  city: string;
  town: string;
  registrationNumber: string;
  fullAddress: string;
  registrationCertificate: File | string | null;
  registrationCertificateName: string;
  adminFullName: string;
  adminPhone: string;
  adminEmail: string;
  adminPassword: string;
  buildings: Building[];
  rooms: Room[];
  pricing: Pricing[];
  hostelImages: HostelImage[];
  roomImages: Record<string, HostelImage[]>;
}
