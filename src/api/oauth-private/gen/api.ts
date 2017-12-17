import * as url from "url";

import * as isomorphicFetch from "isomorphic-fetch";
import * as assign from "core-js/library/fn/object/assign";

interface Dictionary<T> { [index: string]: T; }
export interface FetchAPI { (url: string, init?: any): Promise<any>; }

const BASE_PATH = "http://localhost/api-private/v1/oauth".replace(/\/+$/, "");

export interface FetchArgs {
    url: string;
    options: any;
}

export class BaseAPI {
    basePath: string;
    fetch: FetchAPI;

    constructor(fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) {
        this.basePath = basePath;
        this.fetch = fetch;
    }
}

export interface AuthorizationCode {
    "code"?: string;
    "expiresSeconds"?: number;
}

export interface InlineResponseDefault {
    "status"?: string;
    /**
     * Error code
     */
    "code"?: string;
    /**
     * Error message
     */
    "message"?: string;
    /**
     * Errors
     */
    "errors"?: Array<InlineResponseDefaultErrors>;
}

export interface InlineResponseDefaultErrors {
    /**
     * field name
     */
    "field"?: string;
    /**
     * error code
     */
    "code"?: string;
    /**
     * error message
     */
    "message"?: string;
}



export const DefaultApiFetchParamCreator = {
    authorize(params: {  "accountJwt": string; "responseType": string; "clientId": string; "redirectUri": string; "scope": string; "state": string; }, options?: any): FetchArgs {
        // verify required parameter "accountJwt" is set
        if (params["accountJwt"] == null) {
            throw new Error("Missing required parameter accountJwt when calling authorize");
        }
        // verify required parameter "responseType" is set
        if (params["responseType"] == null) {
            throw new Error("Missing required parameter responseType when calling authorize");
        }
        // verify required parameter "clientId" is set
        if (params["clientId"] == null) {
            throw new Error("Missing required parameter clientId when calling authorize");
        }
        // verify required parameter "redirectUri" is set
        if (params["redirectUri"] == null) {
            throw new Error("Missing required parameter redirectUri when calling authorize");
        }
        // verify required parameter "scope" is set
        if (params["scope"] == null) {
            throw new Error("Missing required parameter scope when calling authorize");
        }
        // verify required parameter "state" is set
        if (params["state"] == null) {
            throw new Error("Missing required parameter state when calling authorize");
        }
        const baseUrl = `/authorize`;
        let urlObj = url.parse(baseUrl, true);
        urlObj.query = assign({}, urlObj.query, {
            "accountJwt": params["accountJwt"],
            "response_type": params["responseType"],
            "client_id": params["clientId"],
            "redirect_uri": params["redirectUri"],
            "scope": params["scope"],
            "state": params["state"],
        });
        let fetchOptions: RequestInit = assign({}, { method: "POST" }, options);

        let contentTypeHeader: Dictionary<string> = {};
        if (contentTypeHeader) {
            fetchOptions.headers = assign({}, contentTypeHeader, fetchOptions.headers);
        }
        return {
            url: url.format(urlObj),
            options: fetchOptions,
        };
    },
};


export const DefaultApiFp = {
    authorize(params: { "accountJwt": string; "responseType": string; "clientId": string; "redirectUri": string; "scope": string; "state": string;  }, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<AuthorizationCode> {
        const fetchArgs = DefaultApiFetchParamCreator.authorize(params, options);
        return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
            return fetch(basePath + fetchArgs.url, fetchArgs.options).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json();
                } else {
                    return response.json().then((data: {}) => {throw data; });
                }
            });
        };
    },
};

export class DefaultApi extends BaseAPI {
    authorize(params: {  "accountJwt": string; "responseType": string; "clientId": string; "redirectUri": string; "scope": string; "state": string; }, options?: any) {
        return DefaultApiFp.authorize(params, options)(this.fetch, this.basePath);
    }
}

export const DefaultApiFactory = function (fetch?: FetchAPI, basePath?: string) {
    return {
        authorize(params: {  "accountJwt": string; "responseType": string; "clientId": string; "redirectUri": string; "scope": string; "state": string; }, options?: any) {
            return DefaultApiFp.authorize(params, options)(fetch, basePath);
        },
    };
};

export interface AuthorizeParams {
    accountJwt: string;
    responseType: string;
    clientId: string;
    redirectUri: string;
    scope: string;
    state: string;
}


export const authorize_REQUEST = "authorize_REQUEST";
export const authorize_FAILURE = "authorize_FAILURE";
export const authorize_SUCCESS = "authorize_SUCCESS";

