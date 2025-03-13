/* eslint-disable @typescript-eslint/no-explicit-any */

// Types for interceptors and request configuration
interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  mode?: RequestMode;
  cache?: RequestCache;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal;
  [key: string]: any;
}

interface FetchClientConfig {
  baseURL?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// Handler types
type FulfillRequest = (
  config: RequestConfig
) => Promise<RequestConfig> | RequestConfig;
type RejectRequest = (error: any) => Promise<any> | any;
type FulfillResponse = (response: Response) => Promise<Response> | Response;
type RejectResponse = (error: any) => Promise<any> | any;

// Interceptor types
interface Interceptor<Fulfill, Reject> {
  fulfilled: Fulfill;
  rejected?: Reject;
}

interface InterceptorManager<Fulfill, Reject> {
  handlers: Array<Interceptor<Fulfill, Reject> | null>;
  use(fulfilled: Fulfill, rejected?: Reject): number;
  eject(id: number): void;
}

// Main FetchClient class
class FetchClient {
  defaults: FetchClientConfig;
  interceptors: {
    request: InterceptorManager<FulfillRequest, RejectRequest>;
    response: InterceptorManager<FulfillResponse, RejectResponse>;
  };

  constructor(config: FetchClientConfig = {}) {
    this.defaults = {
      baseURL: "",
      headers: {
        "Content-Type": "application/json",
      },
      ...config,
    };

    // Initialize interceptor managers
    this.interceptors = {
      request: this.createInterceptorManager<FulfillRequest, RejectRequest>(),
      response: this.createInterceptorManager<
        FulfillResponse,
        RejectResponse
      >(),
    };
  }

  private createInterceptorManager<Fulfill, Reject>(): InterceptorManager<
    Fulfill,
    Reject
  > {
    const handlers: Array<Interceptor<Fulfill, Reject> | null> = [];

    return {
      handlers,
      use(fulfilled: Fulfill, rejected?: Reject): number {
        const id = handlers.length;
        handlers.push({ fulfilled, rejected });
        return id;
      },
      eject(id: number): void {
        if (handlers[id]) {
          handlers[id] = null;
        }
      },
    };
  }

  private async runRequestInterceptors(
    config: RequestConfig
  ): Promise<RequestConfig> {
    let resultConfig = { ...config };

    for (const handler of this.interceptors.request.handlers) {
      if (handler) {
        try {
          resultConfig = await handler.fulfilled(resultConfig);
        } catch (error) {
          if (handler.rejected) {
            await handler.rejected(error);
          }
          throw error;
        }
      }
    }

    return resultConfig;
  }

  private async runResponseInterceptors(response: Response): Promise<Response> {
    let resultResponse = response;

    for (const handler of this.interceptors.response.handlers) {
      if (handler) {
        try {
          resultResponse = await handler.fulfilled(resultResponse);
        } catch (error) {
          if (handler.rejected) {
            return await handler.rejected(error);
          }
          throw error;
        }
      }
    }

    return resultResponse;
  }

  private handleResponseError(error: any): Promise<any> {
    // Process response errors through interceptors
    for (const handler of this.interceptors.response.handlers) {
      if (handler && handler.rejected) {
        try {
          return Promise.resolve(handler.rejected(error));
        } catch {
          // Continue to next handler
        }
      }
    }
    return Promise.reject(error);
  }

  async request(url: string, config: RequestConfig = {}): Promise<Response> {
    // Merge default config with request config
    const requestConfig: RequestConfig = {
      ...this.defaults,
      ...config,
      headers: {
        ...this.defaults.headers,
        ...(config.headers || {}),
      },
    };

    // Resolve full URL
    let fullUrl = url;
    if (this.defaults.baseURL && !url.startsWith("http")) {
      fullUrl = `${this.defaults.baseURL}${url}`;
    }

    // Run request interceptors
    try {
      const processedConfig = await this.runRequestInterceptors({
        url: fullUrl,
        ...requestConfig,
      });

      // Extract URL from processed config
      const { url: processedUrl, ...finalConfig } = processedConfig;

      // Create AbortController for timeout if needed
      let timeoutId: number | undefined;
      const originalSignal = finalConfig.signal;

      if (this.defaults.timeout) {
        const controller = new AbortController();
        if (originalSignal) {
          // Forward abort from original signal
          originalSignal.addEventListener("abort", () => {
            controller.abort();
          });
        }

        // Set timeout
        timeoutId = window.setTimeout(() => {
          controller.abort();
        }, this.defaults.timeout);

        finalConfig.signal = controller.signal;
      }

      try {
        // Perform the actual fetch
        const response = await fetch(processedUrl, finalConfig);

        // Clear timeout if set
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }

        // Run response interceptors
        return await this.runResponseInterceptors(response);
      } catch (error) {
        // Clear timeout if set
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }

        return await this.handleResponseError(error);
      }
    } catch (error) {
      return await this.handleResponseError(error);
    }
  }

  // Helper method to handle JSON parsing and type safety
  async requestJSON<T = any>(
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const response = await this.request(url, config);
    return (await response.json()) as T;
  }

  // HTTP method implementations
  async get(url: string, config: RequestConfig = {}): Promise<Response> {
    return this.request(url, { ...config, method: "GET" });
  }

  async getJSON<T = any>(url: string, config: RequestConfig = {}): Promise<T> {
    return this.requestJSON<T>(url, { ...config, method: "GET" });
  }

  async post(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<Response> {
    return this.request(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async postJSON<T = any>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.requestJSON<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<Response> {
    return this.request(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async putJSON<T = any>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.requestJSON<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(url: string, config: RequestConfig = {}): Promise<Response> {
    return this.request(url, { ...config, method: "DELETE" });
  }

  async deleteJSON<T = any>(
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.requestJSON<T>(url, { ...config, method: "DELETE" });
  }

  async patch(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<Response> {
    return this.request(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patchJSON<T = any>(
    url: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    return this.requestJSON<T>(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Create and export a default instance
const http = new FetchClient();

export { FetchClient, http };
