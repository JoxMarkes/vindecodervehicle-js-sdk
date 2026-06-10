import {
  ApiError,
  AuthenticationError,
  InvalidArgumentError,
} from './exceptions.js';
import { FetchHttpClient } from './http.js';
import {
  mapBrand,
  mapEngine,
  mapFluidCapacity,
  mapOemPartGroup,
  mapRepairTime,
  mapVariant,
  mapVehicle,
  mapVehicleModel,
} from './models.js';

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]+$/;

export class VinDecoderClient {
  static DEFAULT_BASE_URL = 'https://vindecodervehicle.com/api/';

  constructor(user, apiKey, options = {}) {
    this.user = user;
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl ?? VinDecoderClient.DEFAULT_BASE_URL;
    this.http = options.httpClient ?? new FetchHttpClient();
  }

  static create(user, apiKey, baseUrl) {
    return new VinDecoderClient(user, apiKey, { baseUrl });
  }

  async request(params) {
    const { status, body } = await this.http.get(this.baseUrl, {
      user: this.user,
      key: this.apiKey,
      ...params,
    });

    let payload;
    try {
      payload = JSON.parse(body);
    } catch {
      throw new ApiError('Invalid JSON response from VIN Decoder API.', status);
    }

    if (status === 401 || status === 403) {
      throw new AuthenticationError(
        this.#extractError(payload, 'Authentication failed.'),
        status,
        payload,
      );
    }

    if (status >= 400) {
      throw new ApiError(this.#extractError(payload, 'API request failed.'), status, payload);
    }

    if (!payload.success) {
      throw new ApiError(this.#extractError(payload, 'API returned success=false.'), status, payload);
    }

    return payload;
  }

  async decodeVin(vin) {
    const normalized = this.#validateVin(vin);
    const payload = await this.request({ vin: normalized });
    if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
      throw new InvalidArgumentError('Expected a single vehicle in the API response.');
    }
    return mapVehicle(payload.data);
  }

  async decodeVinAll(vin) {
    const normalized = this.#validateVin(vin);
    const payload = await this.request({ vin: normalized, allCars: 1 });
    return Array.isArray(payload.data) ? payload.data.map(mapVehicle) : [];
  }

  async getEngines(vin) {
    const normalized = this.#validateVin(vin);
    const payload = await this.request({ vin: normalized, getEngines: 1 });
    return Array.isArray(payload.data) ? payload.data.map(mapEngine) : [];
  }

  async getVehicle(carId) {
    this.#validateCarId(carId);
    const payload = await this.request({ carId, only: 1 });
    if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) {
      throw new InvalidArgumentError('Expected a single vehicle in the API response.');
    }
    return mapVehicle(payload.data);
  }

  async getFluidCapacities(carId) {
    this.#validateCarId(carId);
    const payload = await this.request({ carId, fluids: 1 });
    return Array.isArray(payload.data) ? payload.data.map(mapFluidCapacity) : [];
  }

  async getOemParts(carId) {
    this.#validateCarId(carId);
    const payload = await this.request({ carId, oemParts: 1 });
    return Array.isArray(payload.data) ? payload.data.map(mapOemPartGroup) : [];
  }

  async getRepairTimes(carId) {
    this.#validateCarId(carId);
    const payload = await this.request({ carId, timeRepair: 1 });
    return Array.isArray(payload.data) ? payload.data.map(mapRepairTime) : [];
  }

  async listBrands() {
    const payload = await this.request({ brands: 1 });
    return Array.isArray(payload.data) ? payload.data.map(mapBrand) : [];
  }

  async listModels(brand) {
    const brandSlug = this.#normalizeSlug(brand, 'brand');
    const payload = await this.request({ brand: brandSlug, models: 1 });
    return Array.isArray(payload.data) ? payload.data.map(mapVehicleModel) : [];
  }

  async listVariants(brand, model) {
    const brandSlug = this.#normalizeSlug(brand, 'brand');
    const modelSlug = this.#normalizeSlug(model, 'model');
    const payload = await this.request({ brand: brandSlug, model: modelSlug, variants: 1 });
    return Array.isArray(payload.data) ? payload.data.map(mapVariant) : [];
  }

  #validateVin(vin) {
    const normalized = vin.trim().toUpperCase();
    if (normalized.length < 8 || normalized.length > 17) {
      throw new InvalidArgumentError(
        `VIN must be between 8 and 17 characters. Got ${normalized.length}.`,
      );
    }
    if (!VIN_PATTERN.test(normalized)) {
      throw new InvalidArgumentError('VIN contains invalid characters.');
    }
    return normalized;
  }

  #validateCarId(carId) {
    if (carId <= 0) {
      throw new InvalidArgumentError('carId must be a positive integer.');
    }
  }

  #normalizeSlug(value, field) {
    const normalized = value.trim().toLowerCase();
    if (!normalized) {
      throw new InvalidArgumentError(`${field} must not be empty.`);
    }
    return normalized;
  }

  #extractError(payload, fallback) {
    for (const key of ['message', 'error', 'detail']) {
      const value = payload[key];
      if (typeof value === 'string' && value) return value;
    }
    return fallback;
  }
}