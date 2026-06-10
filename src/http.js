import { NetworkError } from './exceptions.js';

export class FetchHttpClient {
  constructor(timeoutMs = 30_000) {
    this.timeoutMs = timeoutMs;
  }

  async get(url, params) {
    const query = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    );
    const fullUrl = `${url}?${query.toString()}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'vindecodervehicle-browser-sdk/1.0',
        },
        signal: controller.signal,
      });

      return {
        status: response.status,
        body: await response.text(),
      };
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new NetworkError('Request timed out while calling VIN Decoder API.');
      }
      throw new NetworkError(
        `Network error while calling VIN Decoder API: ${error?.message ?? String(error)}`,
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}