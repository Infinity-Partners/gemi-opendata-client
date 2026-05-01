export type FetchLike = typeof fetch;

export type QueryPrimitive = string | number | boolean;
export type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined;

export interface RequestOptions {
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export interface ClientConfig {
  apiKey?: string;
  baseUrl?: string;
  fetch?: FetchLike;
  defaultHeaders?: Record<string, string>;
}

export interface ErrorEntry {
  code: string;
  message: string;
}

export interface DescriptorWithId<TId extends string | number = string | number> {
  id: TId;
  descr: string;
  descrEn?: string;
}

export interface Activity {
  id: string;
  descr: string;
  descrEn?: string;
  lastUpdated?: string;
  kadVersion?: string;
}

export interface Prefecture {
  id: string;
  descr: string;
  descrEn?: string;
  lastUpdated?: string;
}

export interface Municipality {
  id: string;
  prefectureId: string;
  descr: string;
  descrEn?: string;
  lastUpdated?: string;
}

export interface CompanyStatus {
  id: number;
  descr: string;
  descrEn?: string;
  isActive?: boolean;
  lastUpdated?: string;
}

export interface LegalType {
  id: number;
  descr: string;
  descrEn?: string;
  lastUpdated?: string;
}

export interface GemiOffice {
  id: number;
  descr: string;
  descrEn?: string;
  lastUpdated?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  phone?: string;
  fax?: string;
  url?: string;
}

export interface AssemblySubject {
  id: string;
  descr: string;
  descrEn?: string;
  lastUpdated?: string;
}

export interface CompanyActivity {
  activity: {
    id: string;
    descr: string;
    kadVersion?: string;
  };
  type?: string;
  dtFrom?: string;
  dtTo?: string;
}

export interface CompanyPerson {
  personName?: string;
  businessName?: string;
  role?: string;
  dtFrom?: string;
  dtTo?: string;
  isRepresentativeAlone?: boolean;
  isRepresentativeInCommon?: boolean;
  percentage?: string;
  category?: string;
}

export interface CompanyCapital {
  capitalStock?: number;
  currency?: string;
  ecsokefalaiikes?: number;
  eggiitikes?: number;
}

export interface CompanyStock {
  stockTypeId?: number;
  amount?: number;
  nominalPrice?: number;
  stockType?: string;
}

export interface Company {
  arGemi: number;
  afm?: string;
  coNameEl?: string;
  coNamesEn?: string[];
  coTitlesEl?: string[];
  coTitlesEn?: string[];
  municipality?: DescriptorWithId<number>;
  prefecture?: DescriptorWithId<number>;
  city?: string;
  street?: string;
  streetNumber?: string;
  zipCode?: string;
  poBox?: string;
  url?: string;
  email?: string;
  isBranch?: boolean;
  objective?: string;
  legalType?: DescriptorWithId<number>;
  gemiOffice?: DescriptorWithId<number>;
  assemblySubjects?: DescriptorWithId<number>;
  incorporationDate?: string;
  lastStatusChange?: string;
  status?: DescriptorWithId<number>;
  autoRegistered?: boolean;
  activities?: CompanyActivity[];
  persons?: CompanyPerson[];
  capital?: CompanyCapital[];
  stocks?: CompanyStock[];
  branch?: number[];
}

export interface CompanyDocumentDecision {
  dateAssemblyDecided?: string;
  assembly?: string;
  summary?: string;
  kak?: string;
  decisionSubject?: string;
  decisionSubjectID?: string;
  dateAnnounced?: string;
  assemblyDecisionUrl?: string;
  dateRegistrated?: string;
  applicationStatusId?: string;
  applicationStatusDescription?: string;
  referenceKak?: string;
}

export interface CompanyDocumentPublication {
  url?: string;
  kad?: string;
}

export interface CompanyDocumentSet {
  decision?: CompanyDocumentDecision[];
  publication?: CompanyDocumentPublication[];
}

export interface CompanySearchMetadata {
  totalCount: number;
  resultsOffset: number;
  resultsSize: string;
}

export interface CompanySearchResponse {
  searchMetadata: CompanySearchMetadata;
  searchResults: Company[];
}

export interface SearchCompaniesParams {
  arGemi?: string;
  afm?: string;
  name?: string;
  legalTypes?: number[];
  gemiOffices?: string[];
  municipalities?: string[];
  prefectures?: number[];
  statuses?: number[];
  isActive?: boolean;
  activities?: string[];
  resultsSortBy?: '+coName' | '-coName' | '+afm' | '-afm' | '+arGemi' | '-arGemi' | '+incorporationDate' | '-incorporationDate';
  resultsOffset?: number;
  resultsSize?: number;
}

export interface DownloadFileParams {
  key: string;
  elementId: number;
}

export interface DownloadedFile {
  data: Uint8Array;
  contentType: string | null;
  contentDisposition: string | null;
  fileName: string | null;
}
