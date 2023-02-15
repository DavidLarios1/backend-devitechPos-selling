/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/naming-convention */
import fetch, { RequestInit, Response } from 'node-fetch';

export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(this.baseUrl + url, { method: 'GET', ...options });
    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, body: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(this.baseUrl + url, {
      method  : 'POST',
      body    : JSON.stringify(body),
      headers : { 'Content-Type': 'application/json' },
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`[ :: HTTP Error :: ] ${response.status}:> ${errorBody}`);
    }
    console.log('[ :: HTTP Response :: ]', response.json());
    return response.json() as Promise<T>;
  }
}
