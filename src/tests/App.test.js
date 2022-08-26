const { render, screen } = require("@testing-library/react")
import userEvent from "@testing-library/user-event"
import App from "../App"
import { setupServer } from "msw/node"
import { rest } from "msw"

const server = setupServer(
    rest.get("/api/1.0/users/:id", (req, res, ctx) => {
        const id = + req.params.id
        return res(ctx.status(200),
            ctx.json({
                data: {

                    content: [
                        {
                            id,
                            username: "user" + id,
                            email: "user" + id + "@email.com",
                            image: null
                        }
                    ],
                    page: 0,
                    size: 0,
                    totalPages: 0
                }

            }))

    }),

    rest.post("/api/1.0/auth", (req, res, ctx) => {
        return res(ctx.status(200),
            ctx.json({
                id: 5,
                username: "user5",
                data: {
                    token: "token"
                }
            }))
    })
)

beforeEach(() => {
    server.resetHandlers()
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
    `("displays $name after clicking $clickInTo link", ({ initialPath, clickInTo, name }) => {
        setup(initialPath)

        const link = screen.getByRole("link", { name: clickInTo })

        userEvent.click(link)

        expect(screen.getByTestId(name)).toBeInTheDocument()
    })



})


describe.only("Login", () => {

    const setup = (path) => {
        window.history.pushState({}, "", path)

        render(<App />)

        const email = screen.getByLabelText("Email")
        const password = screen.getByLabelText("Password")

        userEvent.type(email, "user5@mail.com");
        userEvent.type(password, "password");

        const button = screen.getByRole("button", { name: "Login" })

        userEvent.click(button)

    }
    it("redirects to homepage after login", async () => {
        setup("/login")



        const page = await screen.findByTestId("home-page")
        expect(page).toBeInTheDocument()
    })

    it("hides login and Sign Up from navbar after successful login", async () => {
        setup("/login")


        await screen.findByTestId("home-page")

        const loginLink = screen.queryByRole("link", { name: "Login" })
        const signupLink = screen.queryByRole("link", { name: "Signup" })

        expect(loginLink).not.toBeInTheDocument()
        expect(signupLink).not.toBeInTheDocument()
    })

    it("displays my profile link on navbar after successful login", async () => {
        setup("/login")

        await screen.findByTestId("home-page")

        const myProfileLink = screen.getByRole("link", { name: "My Profile" })

        expect(myProfileLink).toBeInTheDocument()
    })

    it("displays user page with logged in user id in url after clicking My Profile", async () => {
        setup("/login")

        await screen.findByTestId("home-page")

        const myProfileLink = screen.getByRole("link", { name: "My Profile" })

        userEvent.click(myProfileLink)

        const currentUser = await screen.findByText("user5")

        expect(currentUser).toBeInTheDocument()
    })
})