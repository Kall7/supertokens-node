/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { BaseRequest, BaseResponse } from "../../framework";
import NormalisedURLPath from "../../normalisedURLPath";
import { RecipeInterface as JWTRecipeInterface, APIInterface as JWTAPIInterface } from "../jwt/types";
import OverrideableBuilder from "supertokens-js-override";
import { RecipeInterface as OpenIdRecipeInterface, APIInterface as OpenIdAPIInterface } from "../openid/types";
import { Awaitable } from "../../types";

export type KeyInfo = {
    publicKey: string;
    expiryTime: number;
    createdAt: number;
};

export type AntiCsrfType = "VIA_TOKEN" | "VIA_CUSTOM_HEADER" | "NONE";
export type StoredHandshakeInfo = {
    antiCsrf: AntiCsrfType;
    accessTokenBlacklistingEnabled: boolean;
    accessTokenValidity: number;
    refreshTokenValidity: number;
} & (
    | {
          // Stored after 2.9
          jwtSigningPublicKeyList: KeyInfo[];
      }
    | {
          // Stored before 2.9
          jwtSigningPublicKeyList: undefined;
          jwtSigningPublicKey: string;
          jwtSigningPublicKeyExpiryTime: number;
      }
);

export type CreateOrRefreshAPIResponse = {
    session: {
        handle: string;
        userId: string;
        userDataInJWT: any;
        grants: GrantPayloadType;
    };
    accessToken: {
        token: string;
        expiry: number;
        createdTime: number;
    };
    refreshToken: {
        token: string;
        expiry: number;
        createdTime: number;
    };
    idRefreshToken: {
        token: string;
        expiry: number;
        createdTime: number;
    };
    antiCsrfToken: string | undefined;
};

const TypeString = {
    type: "string",
};

const TypeBoolean = {
    type: "boolean",
};

const TypeNumber = {
    type: "number",
};

const TypeAny = {
    type: "any",
};

export const InputSchemaErrorHandlers = {
    type: "object",
    properties: {
        onUnauthorised: TypeAny,
        onTokenTheftDetected: TypeAny,
        onMissingGrant: TypeAny,
    },
    additionalProperties: false,
};

export interface ErrorHandlers {
    onUnauthorised?: ErrorHandlerMiddleware;
    onTokenTheftDetected?: TokenTheftErrorHandlerMiddleware;
    onMissingGrant: ErrorHandlerMiddleware;
}

export type TypeInput = {
    cookieSecure?: boolean;
    cookieSameSite?: "strict" | "lax" | "none";
    sessionExpiredStatusCode?: number;
    cookieDomain?: string;
    errorHandlers?: ErrorHandlers;
    antiCsrf?: "VIA_TOKEN" | "VIA_CUSTOM_HEADER" | "NONE";
    // TODO(grants): The docs originally suggested 2 separate grant lists but I don't think it's necessary
    defaultRequiredGrants?: Grant<any>[];
    missingGrantStatusCode?: number;
    jwt?:
        | {
              enable: true;
              propertyNameInAccessTokenPayload?: string;
              issuer?: string;
          }
        | { enable: false };
    override?: {
        functions?: (
            originalImplementation: RecipeInterface,
            builder?: OverrideableBuilder<RecipeInterface>
        ) => RecipeInterface;
        apis?: (originalImplementation: APIInterface, builder?: OverrideableBuilder<APIInterface>) => APIInterface;
        openIdFeature?: {
            functions?: (
                originalImplementation: OpenIdRecipeInterface,
                builder?: OverrideableBuilder<OpenIdRecipeInterface>
            ) => OpenIdRecipeInterface;
            apis?: (
                originalImplementation: OpenIdAPIInterface,
                builder?: OverrideableBuilder<OpenIdAPIInterface>
            ) => OpenIdAPIInterface;
            jwtFeature?: {
                functions?: (
                    originalImplementation: JWTRecipeInterface,
                    builder?: OverrideableBuilder<JWTRecipeInterface>
                ) => JWTRecipeInterface;
                apis?: (
                    originalImplementation: JWTAPIInterface,
                    builder?: OverrideableBuilder<JWTAPIInterface>
                ) => JWTAPIInterface;
            };
        };
    };
};

export const InputSchema = {
    type: "object",
    properties: {
        cookieSecure: TypeBoolean,
        cookieSameSite: TypeString,
        sessionExpiredStatusCode: TypeNumber,
        cookieDomain: TypeString,
        errorHandlers: InputSchemaErrorHandlers,
        antiCsrf: TypeString,
        jwt: TypeAny,
        override: TypeAny,
    },
    additionalProperties: false,
};

export type TypeNormalisedInput = {
    refreshTokenPath: NormalisedURLPath;
    cookieDomain: string | undefined;
    cookieSameSite: "strict" | "lax" | "none";
    cookieSecure: boolean;
    sessionExpiredStatusCode: number;
    errorHandlers: NormalisedErrorHandlers;
    antiCsrf: "VIA_TOKEN" | "VIA_CUSTOM_HEADER" | "NONE";
    defaultRequiredGrants: Grant<any>[];
    missingGrantStatusCode: number;
    jwt: {
        enable: boolean;
        propertyNameInAccessTokenPayload: string;
        issuer?: string;
    };
    override: {
        functions: (
            originalImplementation: RecipeInterface,
            builder?: OverrideableBuilder<RecipeInterface>
        ) => RecipeInterface;
        apis: (originalImplementation: APIInterface, builder?: OverrideableBuilder<APIInterface>) => APIInterface;
        openIdFeature?: {
            functions?: (
                originalImplementation: OpenIdRecipeInterface,
                builder?: OverrideableBuilder<OpenIdRecipeInterface>
            ) => OpenIdRecipeInterface;
            apis?: (
                originalImplementation: OpenIdAPIInterface,
                builder?: OverrideableBuilder<OpenIdAPIInterface>
            ) => OpenIdAPIInterface;
            jwtFeature?: {
                functions?: (
                    originalImplementation: JWTRecipeInterface,
                    builder?: OverrideableBuilder<JWTRecipeInterface>
                ) => JWTRecipeInterface;
                apis?: (
                    originalImplementation: JWTAPIInterface,
                    builder?: OverrideableBuilder<JWTAPIInterface>
                ) => JWTAPIInterface;
            };
        };
    };
};

export interface SessionRequest extends BaseRequest {
    session?: SessionContainerInterface;
}

export interface ErrorHandlerMiddleware {
    (message: string, request: BaseRequest, response: BaseResponse): Promise<void>;
}

export interface TokenTheftErrorHandlerMiddleware {
    (sessionHandle: string, userId: string, request: BaseRequest, response: BaseResponse): Promise<void>;
}

export interface MissingGrantErrorHandlerMiddleware {
    (grantId: string, request: BaseRequest, response: BaseResponse): Promise<void>;
}

export interface NormalisedErrorHandlers {
    onUnauthorised: ErrorHandlerMiddleware;
    onTryRefreshToken: ErrorHandlerMiddleware;
    onTokenTheftDetected: TokenTheftErrorHandlerMiddleware;
    onMissingGrant: MissingGrantErrorHandlerMiddleware;
}

export interface VerifySessionOptions {
    antiCsrfCheck?: boolean;
    sessionRequired?: boolean;
    requiredGrants?: Grant<any>[];
}

export type RecipeInterface = {
    createNewSession(input: {
        res: any;
        userId: string;
        accessTokenPayload?: any;
        sessionData?: any;
        grantsToCheck?: Grant<any>[];
        userContext: any;
    }): Promise<SessionContainerInterface>;

    getSession(input: {
        req: any;
        res: any;
        options?: VerifySessionOptions;
        userContext: any;
    }): Promise<SessionContainerInterface | undefined>;

    refreshSession(input: { req: any; res: any; userContext: any }): Promise<SessionContainerInterface>;
    /**
     * Used to retrieve all session information for a given session handle. Can be used in place of:
     * - getSessionData
     * - getAccessTokenPayload
     */
    getSessionInformation(input: { sessionHandle: string; userContext: any }): Promise<SessionInformation>;

    revokeAllSessionsForUser(input: { userId: string; userContext: any }): Promise<string[]>;

    getAllSessionHandlesForUser(input: { userId: string; userContext: any }): Promise<string[]>;

    revokeSession(input: { sessionHandle: string; userContext: any }): Promise<boolean>;

    revokeMultipleSessions(input: { sessionHandles: string[]; userContext: any }): Promise<string[]>;

    updateSessionData(input: { sessionHandle: string; newSessionData: any; userContext: any }): Promise<void>;
    updateSessionGrants(input: { sessionHandle: string; grants: GrantPayloadType; userContext: any }): Promise<void>;

    updateAccessTokenPayload(input: {
        sessionHandle: string;
        newAccessTokenPayload: any;
        userContext: any;
    }): Promise<void>;

    regenerateAccessToken(input: {
        accessToken: string;
        newAccessTokenPayload?: any;
        newGrants?: GrantPayloadType;
        userContext: any;
    }): Promise<{
        status: "OK";
        session: {
            handle: string;
            userId: string;
            userDataInJWT: any;
            grants: GrantPayloadType;
        };
        accessToken?: {
            token: string;
            expiry: number;
            createdTime: number;
        };
    }>;

    getAccessTokenLifeTimeMS(input: { userContext: any }): Promise<number>;

    getRefreshTokenLifeTimeMS(input: { userContext: any }): Promise<number>;
};

export interface SessionContainerInterface {
    revokeSession(userContext?: any): Promise<void>;

    getSessionData(userContext?: any): Promise<any>;

    updateSessionData(newSessionData: any, userContext?: any): Promise<any>;

    getUserId(userContext?: any): string;

    getAccessTokenPayload(userContext?: any): any;
    getSessionGrants(userContext?: any): any;

    getHandle(userContext?: any): string;

    getAccessToken(userContext?: any): string;

    updateAccessTokenPayload(newAccessTokenPayload: any, userContext?: any): Promise<void>;

    // TODO(grants): I'm not sure if I'd want this to be on the user interface
    // Ideally this is only used internally and the devs use the fetch/add/removeGrant methods.
    updateSessionGrants(newAccessTokenPayload: any, userContext?: any): Promise<void>;

    getTimeCreated(userContext?: any): Promise<number>;

    getExpiry(userContext?: any): Promise<number>;

    // TODO(grants): These 3 could be merged into a single function
    // e.g.: checkGrant with a param setting if we should refetch the value
    shouldRefetchGrant(grant: Grant<any>, userContext?: any): Awaitable<boolean>;
    fetchGrant(grant: Grant<any>, userContext?: any): Awaitable<void>;
    checkGrantInToken(grant: Grant<any>, userContext?: any): Awaitable<boolean>;

    addGrant<T>(grant: Grant<T>, value: T, userContext?: any): Promise<void>;
    removeGrant<T>(grant: Grant<T>, userContext?: any): Promise<void>;
}

export type APIOptions = {
    recipeImplementation: RecipeInterface;
    config: TypeNormalisedInput;
    recipeId: string;
    isInServerlessEnv: boolean;
    req: BaseRequest;
    res: BaseResponse;
};

export type APIInterface = {
    refreshPOST: undefined | ((input: { options: APIOptions; userContext: any }) => Promise<void>);

    signOutPOST:
        | undefined
        | ((input: {
              options: APIOptions;
              userContext: any;
          }) => Promise<{
              status: "OK";
          }>);

    verifySession(input: {
        verifySessionOptions: VerifySessionOptions | undefined;
        options: APIOptions;
        userContext: any;
    }): Promise<SessionContainerInterface | undefined>;
};

export type SessionInformation = {
    sessionHandle: string;
    userId: string;
    sessionData: any;
    grants: GrantPayloadType;
    expiry: number;
    accessTokenPayload: any;
    timeCreated: number;
};

// TODO: This could use JSONObject instead of any (defined in the usermetadata PR)
export type GrantPayloadType = Record<string, any>;

export abstract class Grant<T> {
    constructor(public readonly id: string) {}

    /**
     * This methods fetches the current value of this grant for an arbitrary session of the user based on a DB or whatever outside source.
     * The undefined return value signifies that we don't want to update the grant payload. This can happen for example with MFA where
     * we don't want to add the grant to the session
     */
    abstract fetchGrant(userId: string, userContext: any): Awaitable<T | undefined>;

    /**
     * Decides if we need to refetch the grant value before checking the payload with `isGrantValid`.
     * E.g.: if the information in the payload is expired, or is not sufficient for this check.
     */
    abstract shouldRefetchGrant(grantPayload: any, userContext: any): Awaitable<boolean>;

    /**
     * Decides if the grant is valid based on the grant payload (and not checking DB or anything else)
     */
    abstract isGrantValid(grantPayload: any, userContext: any): Awaitable<boolean>;

    /**
     * Saves the provided value into the grantPayload, by cloning and updating the payload object.
     *
     * @returns The modified payload object
     */
    abstract addToGrantPayload(grantPayload: GrantPayloadType, value: T, userContext: any): GrantPayloadType;

    /**
     * Removes the grant from the grantPayload, by cloning and updating the payload object.
     *
     * @returns The modified payload object
     */
    abstract removeFromGrantPayload(grantPayload: GrantPayloadType, userContext: any): GrantPayloadType;
}
