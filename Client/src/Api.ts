/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Contact {
  /** @format uuid */
  contactId?: string;
  /** @minLength 1 */
  firstName: string;
  middleName: string;
  lastName: string;
  notes: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  /** @format uuid */
  organizationId?: string;
  organization?: Organization;
  phoneNumbers?: PhoneNumber[] | null;
}

export interface ContactDTO {
  /** @minLength 1 */
  firstName: string;
  middleName: string;
  lastName: string;
  notes: string;
  phoneNumbers: PhoneNumberDTO[];
  toDelete: string[];
}

export interface Organization {
  /** @format uuid */
  organizationId?: string;
  /** @minLength 1 */
  name: string;
}

export interface PhoneNumber {
  /** @format uuid */
  phoneNumberId?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string;
  isPrimary?: boolean;
  /** @format uuid */
  contactId?: string;
  /** @format uuid */
  phoneNumberTypeId?: string;
  phoneNumberType?: PhoneNumberType;
  value?: string | null;
}

export interface PhoneNumberDTO {
  /** @format uuid */
  contactId?: string | null;
  /** @format uuid */
  phoneNumberId?: string | null;
  /** @format uuid */
  phoneNumberTypeId?: string;
  value?: string | null;
}

export interface PhoneNumberType {
  /** @format uuid */
  phoneNumberTypeId?: string;
  /** @minLength 1 */
  name: string;
  /** @format uuid */
  organizationId?: string | null;
  organization?: Organization;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title API
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Contacts
     * @name OrganizationsContactsDetail
     * @request GET:/api/organizations/{organizationId}/Contacts
     */
    organizationsContactsDetail: (organizationId: string, params: RequestParams = {}) =>
      this.request<Contact[], any>({
        path: `/api/organizations/${organizationId}/Contacts`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contacts
     * @name OrganizationsContactsCreate
     * @request POST:/api/organizations/{organizationId}/Contacts
     */
    organizationsContactsCreate: (organizationId: string, data: ContactDTO, params: RequestParams = {}) =>
      this.request<Contact, any>({
        path: `/api/organizations/${organizationId}/Contacts`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contacts
     * @name OrganizationsContactsDetail2
     * @request GET:/api/organizations/{organizationId}/Contacts/{contactId}
     * @originalName organizationsContactsDetail
     * @duplicate
     */
    organizationsContactsDetail2: (organizationId: string, contactId: string, params: RequestParams = {}) =>
      this.request<Contact, any>({
        path: `/api/organizations/${organizationId}/Contacts/${contactId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contacts
     * @name OrganizationsContactsUpdate
     * @request PUT:/api/organizations/{organizationId}/Contacts/{contactId}
     */
    organizationsContactsUpdate: (
      contactId: string,
      organizationId: string,
      data: ContactDTO,
      params: RequestParams = {},
    ) =>
      this.request<Contact, any>({
        path: `/api/organizations/${organizationId}/Contacts/${contactId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Contacts
     * @name OrganizationsContactsDelete
     * @request DELETE:/api/organizations/{organizationId}/Contacts/{contactId}
     */
    organizationsContactsDelete: (contactId: string, organizationId: string, params: RequestParams = {}) =>
      this.request<Contact, any>({
        path: `/api/organizations/${organizationId}/Contacts/${contactId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsList
     * @request GET:/api/Organizations
     */
    organizationsList: (params: RequestParams = {}) =>
      this.request<Organization[], any>({
        path: `/api/Organizations`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Organizations
     * @name OrganizationsDetail
     * @request GET:/api/Organizations/{organizationId}
     */
    organizationsDetail: (organizationId: string, params: RequestParams = {}) =>
      this.request<Contact, any>({
        path: `/api/Organizations/${organizationId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags PhoneNumberTypes
     * @name OrganizationsPhoneNumberTypesDetail
     * @request GET:/api/organizations/{organizationId}/PhoneNumberTypes
     */
    organizationsPhoneNumberTypesDetail: (organizationId: string, params: RequestParams = {}) =>
      this.request<PhoneNumberType[], any>({
        path: `/api/organizations/${organizationId}/PhoneNumberTypes`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
