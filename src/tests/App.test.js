const { render, screen } = require("@testing-library/react")
import userEvent from "@testing-library/user-event"
import App from "../App"
import {setupServer} from "msw/node"
import {rest} from "msw"

const server = setupServer(
    rest.get("/api/1.0/users", (req, res, ctx) => {
        return  res(ctx.status(200),
                    ctx.json({
                        data:{

                            content:[
                                {
                                    id: 1,
                                    username: "user1",
                                    email: "user1@email.com",
                                    image: null
                                }
                            ],
                            page:0,
                            size:0, 
                            totalPages:0
                        }
                    
                    }))
    })
)

beforeEach(()=>{
    server.resetHandlers(   )
})

beforeAll(() => server.listen())

afterAll(() => server.close())


describe("Routing", () => {

    const setup = (path) => {
        window.history.pushState({}, "", path)

        render(<App />)
    }

    it.each`
    path | pageTestId
    ${"/"} | ${"home-page"}
    ${"/signup"} | ${"signup-page"}
    ${"/login"} | ${"login-page"}
    ${"/activate/123"} | ${"activate-page"}
    ${"/activate/1234"} | ${"activate-page"}
    `("displayes $pageTestId when path is $path", ({ path, pageTestId }) => {

        setup(path)

        const page = screen.queryByTestId(pageTestId)

        expect(page).toBeInTheDocument()
    })

    it.each`
    path | pageTestId
    ${"/"} | ${"signup-page"}
    ${"/"} | ${"login-page"}
    ${"/"} | ${"activate-page"}
    ${"/signup"} | ${"login-page"}
    ${"/signup"} | ${"home-page"}
    ${"/signup"} | ${"activate-page"}
    ${"/login"} | ${"home-page"}
    ${"/login"} | ${"signup-page"}
    ${"/login"} | ${"activate-page"}
    `("does not displays $pageTestId when path is $path", ({ path, pageTestId }) => {

        setup(path)

        const page = screen.queryByTestId(pageTestId)

        expect(page).not.toBeInTheDocument()
    })

    it.each`
    path | name
    ${"/"} | ${"Home"}
    ${"/signup"} | ${"Signup"}
    ${"/login"} | ${"Login"}
    `

        ("has link to $name on navbar", ({ path, name }) => {
            setup(path)

            const link = screen.getByRole("link", { name: name })

            expect(link).toBeInTheDocument()
        })

    it.each`
    initialPath | clickInTo | name
    ${"/"} | ${"Signup"} | ${"signup-page"}
    ${"/signup"} | ${"Home"} | ${"home-page"}
    ${"/signup"} | ${"Login"} | ${"login-page"}
    `("displays $name after clicking $clickInTo link", ({initialPath, clickInTo, name}) => {
        setup(initialPath)

        const link = screen.getByRole("link", { name: clickInTo })

        userEvent.click(link)

        expect(screen.getByTestId(name)).toBeInTheDocument()
    })

    
    
})