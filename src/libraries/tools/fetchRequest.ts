/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/naming-convention */
import colors from 'colors';
import fetch, { RequestInit, Response } from 'node-fetch';

export class FetchRequest {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(options?: RequestInit): Promise<T> {
    const response = await fetch(this.baseUrl, { method: 'get', ...options });
    return this.handleResponse<T>(response);
  }

  async post<T>(body: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method  : 'post',
      body    : JSON.stringify(body),
      headers : { 'Content-Type': 'application/json' },
      ...options,
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(path: string, data: Record<string, unknown>, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method : 'put',
      headers,
      body   : JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(path: string, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'delete',
      headers,
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`[ :: HTTP Error :: ] ${response.status}:> ${errorBody}`);
    }

    const res = (await response.text()) === '' ? { response: 'NO RESPONSE' } : (await response.json());
    console.log(colors.green('[ :: HTTP Response :: ]'), res);
    return res as T;
  }

  public setBaseUrl(baseURL : string) {
    this.baseUrl = baseURL;
  }
}
