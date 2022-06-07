import { FacebookApi } from "@/infra/apis"
import { AxiosHttpClient } from "@/infra/http"
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()

    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: 'EAARQyH7jrzMBAKQoM06cyrvIDy6l3TlOmyheMAk36Ss4DYh9C2E6lAUvAX76HlHvDT5V8B7M302Ao6IoXtRdIe9WETqC7Kl7yZB1FWmKXZAxTYwRgvNE29rZC4cRi5txNhZA4n98fuymIavAMQ1QdPHyuCf0ZCsYXXb5MLeN2fxFoSEgEyTmg86M0EfxwRLo9VlAu7RVlsgu3mE0KkWel' })

    expect(fbUser).toEqual({
      facebookId: '102203215860481',
      email: 'maverick_lakorsc_test@tfbnw.net',
      name: 'Maverick Test'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()

    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret)

    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBeUndefined()
  })
})
