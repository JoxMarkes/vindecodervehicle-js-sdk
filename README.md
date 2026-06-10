# VIN Decoder Vehicle — JavaScript SDK (Browser)

[![CI](https://github.com/JoxMarkes/vindecodervehicle-js-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/JoxMarkes/vindecodervehicle-js-sdk/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@vindecodervehicle/browser.svg)](https://www.npmjs.com/package/@vindecodervehicle/browser)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Official browser JavaScript SDK for the **[VIN Decoder Vehicle API](https://vindecodervehicle.com)**.

Works in modern browsers, React, Vue, Angular, and any bundler that supports ES modules.

## Features

- Zero dependencies
- Pure ES modules
- Native `fetch`
- All API endpoints supported
- Works with Vite, Webpack, Parcel, etc.

## Installation

```bash
npm install @vindecodervehicle/browser
```

Or import directly in the browser (if CORS is enabled):

```html
<script type="module">
  import { VinDecoderClient } from 'https://esm.sh/@vindecodervehicle/browser';
</script>
```

> **Note:** Browser requests may require CORS support on the API or a backend proxy to protect your API key.

## Quick Start

```javascript
import { VinDecoderClient, getVehicleFullName } from '@vindecodervehicle/browser';

const client = VinDecoderClient.create('YOUR_USER', 'YOUR_API_KEY');

const vehicle = await client.decodeVin('WF0GXXGAJ69C71882');
console.log(getVehicleFullName(vehicle)); // BMW 3 Coupe (E92) 316 i
```

## API Reference

### VIN

```javascript
const vehicle = await client.decodeVin('WF0GXXGAJ69C71882');
const vehicles = await client.decodeVinAll('WF0GXXGAJ69C71882');
const engines = await client.getEngines('WF0GXXGAJ69C71882');
```

### Vehicle by carId

```javascript
const vehicle = await client.getVehicle(55565);
const fluids = await client.getFluidCapacities(55565);
const parts = await client.getOemParts(55565);
const repairs = await client.getRepairTimes(55565);
```

### Catalog

```javascript
const brands = await client.listBrands();
const models = await client.listModels('bmw');
const variants = await client.listVariants('bmw', '3-series');
```

## Recommended: use a backend proxy

For production browser apps, proxy API calls through your server to keep credentials secret:

```javascript
// Frontend calls your backend
const response = await fetch('/api/decode-vin?vin=WF0GXXGAJ69C71882');
const vehicle = await response.json();
```

## Links

- [API Documentation](https://vindecodervehicle.com/api/doc/)
- [PHP SDK](https://github.com/JoxMarkes/vindecodervehicle-php-sdk)
- [Python SDK](https://github.com/JoxMarkes/vindecodervehicle-python-sdk)
- [Node.js SDK](https://github.com/JoxMarkes/vindecodervehicle-node-sdk)

## License

MIT