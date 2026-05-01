# GEMI OpenData Client

Typed Node.js client for the GEMI OpenData API.

This package contains only the client implementation. It does not ship credentials, and consumers must provide their own legitimate GEMI OpenData API key.

Current upstream API docs:
- Swagger UI: https://opendata-api.businessportal.gr/opendata/docs/
- Swagger spec: https://opendata-api.businessportal.gr/api-docs

The current live spec exposes:
- company search
- company details by `arGemi`
- company public documents
- metadata endpoints for legal types, statuses, municipalities, prefectures, activities, GEMI offices, and assembly subjects
- file download by `key` and `elementId`
- health check

## Install

```bash
npm install @infinitypartners/gemi-opendata-client
```

Node `18+` is required because the client uses the standard Fetch API.

## Usage

```ts
import {GemiOpenDataClient} from '@infinitypartners/gemi-opendata-client';

const gemi = new GemiOpenDataClient({
  apiKey: process.env.GEMI_OPENDATA_API_KEY,
});

const company = await gemi.getCompanyByArGemi(123456789000);
const results = await gemi.searchCompanies({
  afm: '099999999',
  resultsSize: 25,
});
```

## Auth

The live Swagger spec currently declares header-based API key auth. The client sends the key through the documented `api_key` header:

```http
api_key: <your key>
```

Pass it through the client constructor:

```ts
const gemi = new GemiOpenDataClient({apiKey: '...'});
```

Keep credentials outside source control, for example in an environment variable or secret manager.

## Endpoints

### Metadata

- `listActivities()`
- `listPrefectures()`
- `listMunicipalities()`
- `listCompanyStatuses()`
- `listLegalTypes()`
- `listGemiOffices()`
- `listAssemblySubjects()`

### Companies

- `getCompanyByArGemi(arGemi)`
- `searchCompanies(params)`
- `getCompanyDocumentsByArGemi(arGemi)`

### Files and health

- `downloadFile({ key, elementId })`
- `health()`

## Search behavior

The upstream Swagger spec currently documents:
- at least one search criterion is required
- multiple criteria are combined with logical `AND`
- array criteria are sent as comma-separated query values
- `resultsSize` maximum is `200`

The client preserves that wire format.

## Download behavior

`downloadFile(...)` returns:

```ts
type DownloadedFile = {
  data: Uint8Array;
  contentType: string | null;
  contentDisposition: string | null;
  fileName: string | null;
}
```

This leaves persistence decisions to the consumer.

## Notes

- This package was shaped against the live Swagger 2.0 spec fetched on April 27, 2026.
- Real authenticated integration verification requires a valid GEMI OpenData API key.
- License is currently `UNLICENSED`; do not treat this package as open source unless the repository license is changed.
