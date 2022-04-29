import error from "../../error";
import { BaseRequest, BaseResponse } from "../../framework";
import NormalisedURLPath from "../../normalisedURLPath";
import RecipeModule from "../../recipeModule";
import { APIHandled, HTTPMethod, NormalisedAppinfo, RecipeListFunction } from "../../types";
import { APIInterface, RecipeInterface, TypeInput, TypeNormalisedInput } from "./types";
export default class Recipe extends RecipeModule {
    static RECIPE_ID: string;
    private static instance;
    config: TypeNormalisedInput;
    recipeInterfaceImpl: RecipeInterface;
    apiImpl: APIInterface;
    isInServerlessEnv: boolean;
    constructor(recipeId: string, appInfo: NormalisedAppinfo, isInServerlessEnv: boolean, config?: TypeInput);
    static getInstanceOrThrowError(): Recipe;
    static init(config?: TypeInput): RecipeListFunction;
    static reset(): void;
    getAPIsHandled(): APIHandled[];
    handleAPIRequest: (_: string, req: BaseRequest, res: BaseResponse, __: NormalisedURLPath, ___: HTTPMethod) => Promise<boolean>;
    handleError(error: error, _: BaseRequest, __: BaseResponse): Promise<void>;
    getAllCORSHeaders(): string[];
    isErrorFromThisRecipe(err: any): err is error;
}
