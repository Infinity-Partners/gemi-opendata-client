export class GemiOpenDataError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  readonly bodyText: string;
  readonly bodyJson?: unknown;

  constructor(params: {
    message: string;
    status: number;
    statusText: string;
    url: string;
    bodyText: string;
    bodyJson?: unknown;
  }) {
    super(params.message);
    this.name = 'GemiOpenDataError';
    this.status = params.status;
    this.statusText = params.statusText;
    this.url = params.url;
    this.bodyText = params.bodyText;
    this.bodyJson = params.bodyJson;
  }
}
