import { HttpResponse, unauthorized, ok } from "@/application/helpers"
import { FacebookAuthentication } from "@/domain/features"
import { AccessToken } from "@/domain/models"
import { ValidationBuilder as Builder, Validator } from "../validation"
import { Controller } from "@/application/controllers"

type httpRequest = {
    token: string
}

type Model = Error | {
    accessToken: string
}
export class FacebookLoginController extends Controller {
    constructor(private readonly facebookAuthentication: FacebookAuthentication) {
        super()
    }

    async perform (httpRequest: httpRequest): Promise<HttpResponse<Model>> {
            const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
            return accessToken instanceof AccessToken
            ? ok({ accessToken: accessToken.value })
            : unauthorized()
        }
    override buildValidators(httpRequest: httpRequest): Validator[] {
        return [
        ...Builder.of({ value: httpRequest.token, fieldName: 'token' }).required().build()
        ]
    }
}