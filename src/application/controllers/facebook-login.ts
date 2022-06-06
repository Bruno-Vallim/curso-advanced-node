import { badRequest, HttpResponse, unauthorized, serverError, ok } from "@/application/helpers"
import { FacebookAuthentication } from "@/domain/features"
import { AccessToken } from "@/domain/models"
import { ServerError } from "@/application/errors"
import { RequiredStringValidator, ValidationComposite } from "../validation"

type httpRequest = {
    token: string
}

type Model = Error | {
    accessToken: string
}
export class FacebookLoginController {
    constructor(private readonly facebookAuthentication: FacebookAuthentication) {}

    async handle (httpRequest: httpRequest): Promise<HttpResponse<Model>> {
        try {
            const error = this.validate(httpRequest)
            if (error !== undefined) {
                return badRequest(error)
            }
            const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
            if (accessToken instanceof AccessToken) {
                return ok({
                accessToken: accessToken.value
                })
            } else {
                return unauthorized()
            }
        } catch (error) {
            return {
                statusCode: 500,
                data: new ServerError()
                }
        }
    }
    private validate(httpRequest: httpRequest): Error | undefined {
        return new ValidationComposite([
            new RequiredStringValidator(httpRequest.token, 'token')
        ]).validate()
    }
}