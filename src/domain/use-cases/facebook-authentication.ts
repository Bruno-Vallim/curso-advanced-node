import { LoadFacebookUserApi } from "@/domain/contracts/apis"
import { TokenGenerator } from "@/domain/contracts/crypto"
import { LoadUserAccountRepository, SaveFacebookAccountRepository } from "@/domain/contracts/repos"
import { AuthenticationError } from "@/domain/entities/errors"
import { FacebookAuthentication } from "@/domain/features"
import { AccessToken, FacebookAccount } from "@/domain/entities"

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
    constructor (
        private readonly facebookApi: LoadFacebookUserApi,
        private readonly userAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
        private readonly crypto: TokenGenerator
        ) {}

    async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
        const fbData = await this.facebookApi.loadUser(params)
        if (fbData !== undefined) {
            const accountData = await this.userAccountRepo.load({ email: fbData.email })
            const fbAccount = new FacebookAccount(fbData, accountData)
            const { id } = await this.userAccountRepo.saveWithFacebook(fbAccount)
            const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
            return new AccessToken(token)
            }
    return new AuthenticationError()
    }
}