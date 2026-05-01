import {GemiOpenDataError} from './errors';
import {
  Activity,
  AssemblySubject,
  ClientConfig,
  Company,
  CompanyDocumentSet,
  CompanySearchResponse,
  CompanyStatus,
  DownloadedFile,
  DownloadFileParams,
  FetchLike,
  GemiOffice,
  LegalType,
  Municipality,
  Prefecture,
  QueryValue,
  RequestOptions,
  SearchCompaniesParams,
} from './types';

const DEFAULT_BASE_URL = 'https://opendata-api.businessportal.gr/api/opendata/v1';

function normalizeBaseUrl(value?: string): string {
  return String(value || DEFAULT_BASE_URL).replace(/\/+$/, '');
}

function buildQueryString(params?: Record<string, QueryValue>): string {
  if (!params) return '';

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      if (!value.length) continue;
      query.set(key, value.map((item) => String(item)).join(','));
      continue;
    }

    query.set(key, String(value));
  }

  const serialized = query.toString();
  return serialized ? `?${serialized}` : '';
}

function normalizeQuery<T extends object>(params?: T): Record<string, QueryValue> | undefined {
  if (!params) return undefined;
  return params as unknown as Record<string, QueryValue>;
}

function parseFileName(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return basicMatch?.[1] || null;
}

export class GemiOpenDataClient {
  readonly apiKey?: string;
  readonly baseUrl: string;
  readonly fetchImpl: FetchLike;
  readonly defaultHeaders: Record<string, string>;

  constructor(config: ClientConfig = {}) {
    if (typeof config.fetch === 'function') {
      this.fetchImpl = config.fetch;
    } else if (typeof fetch === 'function') {
      this.fetchImpl = fetch;
    } else {
      throw new Error('Global fetch is not available. Provide a fetch implementation in the client config.');
    }

    this.apiKey = config.apiKey;
    this.baseUrl = normalizeBaseUrl(config.baseUrl);
    this.defaultHeaders = {...(config.defaultHeaders || {})};
  }

  async health(options?: RequestOptions): Promise<void> {
    await this.requestRaw('/health', undefined, options);
  }

  listActivities(options?: RequestOptions): Promise<Activity[]> {
    return this.requestJson<Activity[]>('/metadata/activities', undefined, options);
  }

  listPrefectures(options?: RequestOptions): Promise<Prefecture[]> {
    return this.requestJson<Prefecture[]>('/metadata/prefectures', undefined, options);
  }

  listMunicipalities(options?: RequestOptions): Promise<Municipality[]> {
    return this.requestJson<Municipality[]>('/metadata/municipalities', undefined, options);
  }

  listCompanyStatuses(options?: RequestOptions): Promise<CompanyStatus[]> {
    return this.requestJson<CompanyStatus[]>('/metadata/companyStatuses', undefined, options);
  }

  listLegalTypes(options?: RequestOptions): Promise<LegalType[]> {
    return this.requestJson<LegalType[]>('/metadata/legalTypes', undefined, options);
  }

  listGemiOffices(options?: RequestOptions): Promise<GemiOffice[]> {
    return this.requestJson<GemiOffice[]>('/metadata/gemiOffices', undefined, options);
  }

  listAssemblySubjects(options?: RequestOptions): Promise<AssemblySubject[]> {
    return this.requestJson<AssemblySubject[]>('/metadata/assemblySubjects', undefined, options);
  }

  getCompanyByArGemi(arGemi: number, options?: RequestOptions): Promise<Company> {
    return this.requestJson<Company>(`/companies/${encodeURIComponent(String(arGemi))}`, undefined, options);
  }

  searchCompanies(params: SearchCompaniesParams, options?: RequestOptions): Promise<CompanySearchResponse> {
    return this.requestJson<CompanySearchResponse>('/companies', normalizeQuery(params), options);
  }

  getCompanyDocumentsByArGemi(arGemi: number, options?: RequestOptions): Promise<CompanyDocumentSet> {
    return this.requestJson<CompanyDocumentSet>(`/companies/${encodeURIComponent(String(arGemi))}/documents`, undefined, options);
  }

  async downloadFile(params: DownloadFileParams, options?: RequestOptions): Promise<DownloadedFile> {
    const response = await this.requestRaw('/downloadFile', normalizeQuery(params), options);
    const arrayBuffer = await response.arrayBuffer();
    const contentDisposition = response.headers.get('content-disposition');

    return {
      data: new Uint8Array(arrayBuffer),
      contentType: response.headers.get('content-type'),
      contentDisposition,
      fileName: parseFileName(contentDisposition),
    };
  }

  private async requestJson<T>(
    path: string,
    query?: Record<string, QueryValue>,
    options?: RequestOptions
  ): Promise<T> {
    const response = await this.requestRaw(path, query, options);
    return await response.json() as T;
  }

  private async requestRaw(
    path: string,
    query?: Record<string, QueryValue>,
    options?: RequestOptions
  ): Promise<Response> {
    const url = `${this.baseUrl}${path}${buildQueryString(query)}`;
    const headers = {
      Accept: 'application/json',
      ...(this.apiKey ? {api_key: this.apiKey} : {}),
      ...this.defaultHeaders,
      ...(options?.headers || {}),
    };

    const response = await this.fetchImpl(url, {
      method: 'GET',
      headers,
      signal: options?.signal,
    });

    if (response.ok) {
      return response;
    }

    const bodyText = await response.text();
    let bodyJson: unknown;
    try {
      bodyJson = bodyText ? JSON.parse(bodyText) : undefined;
    } catch {
      bodyJson = undefined;
    }

    throw new GemiOpenDataError({
      message: `GEMI OpenData request failed: ${response.status} ${response.statusText}`,
      status: response.status,
      statusText: response.statusText,
      url,
      bodyText,
      bodyJson,
    });
  }
}
