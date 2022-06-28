import { Middleware } from "@/application/middlewares"
import { getMockReq, getMockRes } from "@jest-mock/express"
import { NextFunction, RequestHandler, Request, Response } from "express"
import { mock, MockProxy } from "jest-mock-extended"
import { adaptExpressMiddleware } from "@/main/adapters"

describe('ExpressMidleware', () => {
    let req: Request
    let res: Response
    let next: NextFunction
    let middleware: MockProxy<Middleware>
    let sut: RequestHandler

    beforeAll(() => {
        req = getMockReq({ headers: { any: 'any' } })
        res = getMockRes().res
        next = getMockRes().next
        middleware = mock<Middleware>()
        sut = adaptExpressMiddleware(middleware)
        middleware.handle.mockResolvedValue({
            statusCode: 200,
            data: {
                prop: 'any_value',
                emptyProp: '',
                undefinedProp: undefined,
                nullProp: null
            }
        })
    })

    beforeEach(() => {
        sut = adaptExpressMiddleware(middleware)
    })

    it('should call handle with correct request', async () => {
        await sut(req, res, next)

        expect(middleware.handle).toHaveBeenCalledWith({ any: 'any' })
        expect(middleware.handle).toHaveBeenCalledTimes(1)
    })

    it('should call handle with empty request', async () => {
        const req = getMockReq()

        await sut(req, res, next)

        expect(middleware.handle).toHaveBeenCalledWith({})
        expect(middleware.handle).toHaveBeenCalledTimes(1)
    })

    it('should respond with correct error and statusCode', async () => {
        middleware.handle.mockResolvedValueOnce({
            statusCode: 500,
            data: new Error('any_error')
        })
        await sut(req, res, next)

        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({ error: 'any_error' })
        expect(res.json).toHaveBeenCalledTimes(1)
    })

    it('should add valid data to req.locals', async () => {
        middleware.handle.mockResolvedValueOnce({
            statusCode: 200,
            data: {
                prop: 'any_value',
                emptyProp: '',
                undefinedProp: undefined,
                nullProp: null
            }
        })
        await sut(req, res, next)

        expect(req.locals).toEqual({ prop: 'any_value' })
        expect(next).toHaveBeenCalledTimes(1)
    })
})
function adaptExpressMidleware(middleware: MockProxy<Middleware>): RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> {
    throw new Error("Function not implemented.")
}
