import { badRequest, HttpResponse } from "@/application/helpers"
import { FacebookAuthentication } from "@/domain/features"
import { AccessToken } from "@/domain/models"
import { ServerError } from "@/application/errors"
import { RequiredStringValidator, ValidationBuilder, ValidationComposite, Validator } from "../validation"

export abstract class Controller {
    abstract perform (httpRequest: any): Promise<HttpResponse>

    buildValidators (httpRequest: any): Validator [] {
        return []
    }

    async handle (httpRequest: any): Promise<HttpResponse> {
        const error = this.validate(httpRequest)
        if (error !== undefined) {
            return badRequest(error)
        }
        try {
            return await this.perform(httpRequest)
        } catch (error) {
            return {
                statusCode: 500,
                data: new ServerError()
                }
        }
    }
    private validate (httpRequest: any): Error | undefined {
        const validators = this.buildValidators(httpRequest)
        return new ValidationComposite(validators).validate()
    }
}