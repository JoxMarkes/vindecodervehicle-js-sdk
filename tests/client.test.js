import assert from 'node:assert/strict';
import test from 'node:test';
import { VinDecoderClient } from '../src/client.js';
import {
  ApiError,
  AuthenticationError,
  InvalidArgumentError,
} from '../src/exceptions.js';

class MockHttpClient {
  constructor() {
    this.responses = [];
  }

  queue(status, payload) {
    this.responses.push({ status, body: JSON.stringify(payload) });
  }

  async get() {
    const response = this.responses.shift();
    if (!response) throw new Error('No mock response queued.');
    return response;
  }
}

test('decodes a VIN', async () => {
  const http = new MockHttpClient();
  const client = new VinDecoderClient('demo-user', 'demo-key', { httpClient: http });

  http.queue(200, {
    success: true,
    api_version: '2.0',
    data: {
      carId: 55565,
      vin: '',
      make: 'BMW',
      model: '3 Coupe (E92)',
      year: '2007',
      yearEnd: '2013',
      description: '316 i',
      body: 'Coupe',
      fuel: 'Petrol',
      engine: 'Petrol Engine',
      drive: 'Rear Wheel Drive',
      fuelMixtureFormation: 'Direct Injection',
      aspiration: '',
      cylinderDesign: '',
      coolingType: '',
      tonnage: '',
      axleStyle: '',
      axleType: '',
      axleBody: '',
      axleConfiguration: '',
      wheelMounting: '',
      brakeType: '',
      hmdMfrModelName: '',
    },
  });

  const vehicle = await client.decodeVin('WF0GXXGAJ69C71882');
  assert.equal(vehicle.carId, 55565);
  assert.equal(vehicle.make, 'BMW');
});

test('lists brands', async () => {
  const http = new MockHttpClient();
  const client = new VinDecoderClient('demo-user', 'demo-key', { httpClient: http });
  http.queue(200, { success: true, data: [{ name: 'BMW', slug: 'bmw' }] });

  const brands = await client.listBrands();
  assert.equal(brands.length, 1);
  assert.equal(brands[0].slug, 'bmw');
});

test('rejects invalid VIN', async () => {
  const client = new VinDecoderClient('demo-user', 'demo-key', { httpClient: new MockHttpClient() });
  await assert.rejects(() => client.decodeVin('ABC'), InvalidArgumentError);
});

test('throws on authentication failure', async () => {
  const http = new MockHttpClient();
  const client = new VinDecoderClient('demo-user', 'demo-key', { httpClient: http });
  http.queue(401, { success: false, message: 'Invalid credentials' });
  await assert.rejects(() => client.listBrands(), AuthenticationError);
});

test('throws on API failure', async () => {
  const http = new MockHttpClient();
  const client = new VinDecoderClient('demo-user', 'demo-key', { httpClient: http });
  http.queue(200, { success: false, message: 'Quota exceeded' });
  await assert.rejects(() => client.listBrands(), ApiError);
});