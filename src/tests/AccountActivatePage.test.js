import { render, screen } from "@testing-library/react"
import AccountActivatePage from "../pages/activate/AccountActivatePage"
import {setupServer} from "msw/node"
import {rest} from "msw"

let counter = 0
const server = setupServer(
    rest.post("/api/1.0/activate/:token", (req, res, ctx) => {
        counter += 1
        if(req.params.token !== "123"){
            return res(ctx.status(400))
        }
        return  res(ctx.status(200))
    })
)

beforeEach(()=>{
    counter = 0
    server.resetHandlers(   )
})

beforeAll(() => server.listen())

afterAll(() => server.close())

describe("Account Activate Page",()=>{

    const setup =(token)=>{
        const match = {params:{token}}
        render(<AccountActivatePage match={match}/>)

    }
    it("displays activation success message when token is valid", async()=>{
        setup("123")    

        const message = await screen.findByText("Your account has been activated")    

        expect(message).toBeInTheDocument() 
    })

    it("sends activations request to backend", async()=>{
        setup("123")

        await screen.findByText("Your account has been activated")

        expect(counter).toBe(1)

    })

    it("displays activation failure message when token is invalid", async()=>{
        setup("12356")

        const message = await screen.findByText("Account activation failed")

        expect(message).toBeInTheDocument()
    })

    it("sends activation request after token is changed", async()=>{
        const match = {params:{token:"123"}}

        const AccountRender = render(<AccountActivatePage match={match}/>)

        const message = await screen.findByText("Your account has been activated")

        match.params.token = "12356"

        AccountRender.rerender(<AccountActivatePage match={match}/>)

        await screen.findByText("Account activation failed")
        expect(counter).toBe(2)

    })

    it("displays spinner during activation api call", async()=>{
        setup("123")

        const spinner = screen.queryByRole("status")

        expect(spinner).toBeInTheDocument()
        await screen.findByText("Your account has been activated")
        expect(spinner).not.toBeInTheDocument()
    })

    it("displays spinner after second api call to the changed token", async()=>{
        const match = {params:{token:"123"}}

        const AccountRender = render(<AccountActivatePage match={match}/>)

        const message = await screen.findByText("Your account has been activated")

        match.params.token = "12356"

        AccountRender.rerender(<AccountActivatePage match={match}/>)
        const spinner = screen.queryByRole("status")

        expect(spinner).toBeInTheDocument()
        await screen.findByText("Account activation failed")
        expect(spinner).not.toBeInTheDocument()

    })
})