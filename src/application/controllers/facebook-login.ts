import { HttpResponse, unauthorized, ok } from "@/application/helpers"
import { AccessToken } from "@/domain/entities"
import { ValidationBuilder as Builder, Validator } from "../validation"
import { Controller } from "@/application/controllers"
import { FacebookAuthentication } from "@/domain/use-cases"

type httpRequest = { token: string}
type Model = Error | { accessToken: string}

export class FacebookLoginController extends Controller {
    constructor(private readonly facebookAuthentication: FacebookAuthentication) {
        super()
    }

    async perform ({ token }: httpRequest): Promise<HttpResponse<Model>> {
            const accessToken = await this.facebookAuthentication({ token })
            return accessToken instanceof AccessToken
            ? ok({ accessToken: accessToken.value })
            : unauthorized()
        }

    override buildValidators({ token }: httpRequest): Validator[] {
        return [
        ...Builder.of({ value: token, fieldName: 'token' }).required().build()
        ]
    }
}