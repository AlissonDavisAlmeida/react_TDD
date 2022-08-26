import { render, screen, waitForElementToBeRemoved, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Login from "../pages/login/LoginPage"
import LanguageSelector from "../components/LanguageSelector"
import i18n from  "../locale/i18n"
import en from "../locale/en_US.json"
import pt from "../locale/pt_BR.json"

import { setupServer } from "msw/node"
import { rest } from "msw"

let requestBody, count = 0
const server = setupServer(
    rest.post("/api/1.0/auth", (req, res, ctx) => {
        requestBody = req.body
        count++
        return res(ctx.status(401), ctx.json({
            message: "Incorrect credentials"
        }))
    })
)

beforeEach(() => {
    count = 0
    server.resetHandlers()
})

beforeAll(() => server.listen())

afterAll(() => server.close())

describe("Login Page", () => {
    beforeEach(() => {

        render(
            <>

                <Login />
                <LanguageSelector />
            </>
        )
    })


    describe("Layout", () => {

        test("has a header", () => {
            const header = screen.queryByRole("heading", { name: "Login" })

            expect(header).toBeInTheDocument()
        })


        test("has email input", async () => {
            const email = screen.getByLabelText("Email")
            expect(email).toBeInTheDocument()
        }
        )

        test("has password input", async () => {
            const password = screen.getByLabelText("Password")
            expect(password).toBeInTheDocument()
        })

        test("has password type for password input", () => {
            const password = screen.getByLabelText("Password")
            expect(password).toHaveAttribute("type", "password")
        })

        test("has Login button", async () => {
            const submit = screen.getByRole("button", { name: "Login" })
            expect(submit).toBeInTheDocument()
        })

        test("disables the button initially", () => {
            const submit = screen.getByRole("button", { name: "Login" })
            expect(submit).toBeDisabled()
        })
    })


    describe("Behaviour", () => {

        let submit, email, password
        const setup = () => {
            email = screen.getByLabelText("Email")
            password = screen.getByLabelText("Password")

            userEvent.type(email, "a@a.com");
            userEvent.type(password, "password");
            submit = screen.getByRole("button", { name: "Login" })

        }

        it("enables the button when email and password are filled", async () => {
            setup()
            expect(submit).toBeEnabled()

        })

        it("displays spinner during api call", async () => {
            setup()
            expect(screen.queryByRole("status")).not.toBeInTheDocument()
            userEvent.click(submit)
            const spinner = screen.getByRole("status")

            await waitForElementToBeRemoved(spinner)
        })

        it("sends email and password to backend after clicking the button", async () => {
            setup()
            userEvent.click(submit)
            const spinner = screen.getByRole("status")

            await waitForElementToBeRemoved(spinner)

            expect(requestBody).toEqual({
                email: "a@a.com",
                password: "password"
            })
        })

        it("disables the button when there is an api call", async () => {
            setup()
            userEvent.click(submit)
            userEvent.click(submit)

            const spinner = screen.getByRole("status")

            await waitForElementToBeRemoved(spinner)

            expect(count).toBe(1)
        })

        it("displays authenticated fail message", async () => {
            setup()
            userEvent.click(submit)

            const errorMessage = await screen.findByText("Incorrect credentials")

            expect(errorMessage).toBeInTheDocument()
        })

        it("clears authentication error message when email field is changed", async () => {
            setup()
            userEvent.click(submit)

            const errorMessage = await screen.findByText("Incorrect credentials")

            userEvent.type(email, "alissondavis1@gmail.com")

            expect(errorMessage).not.toBeInTheDocument()
        })
        it("clears authentication error message when password field is changed", async () => {
            setup()
            userEvent.click(submit)

            const errorMessage = await screen.findByText("Incorrect credentials")

            userEvent.type(password, "alissondavis1@gmail.com")

            expect(errorMessage).not.toBeInTheDocument()
        })
    })

    describe("Internationalization", () => {


        let requestBody
        let counter = 0
        let acceptLanguageHeader
        const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) => {
                counter += 1
                requestBody = req.body
                acceptLanguageHeader = req.headers.get("accept-language")
                return res(ctx.status(200))
            })
        )

        /* beforeEach(() => {
            server.listen()
        }) */


        afterEach(() => {
            server.close()
            counter = 0
        })

        let portugueseToogle, englishToogle

        const setup = () => {
         
            portugueseToogle = screen.getByTitle("Portuguese")
            englishToogle = screen.getByTitle("English")
        }

        afterEach(async () => {
            await act(async () => {

                i18n.changeLanguage("en")
            })
        })

        test("changes text to Portuguese", async () => {
            setup()
            expect(screen.getByRole("heading", { name: en.login })).toBeInTheDocument()
        })

        test("changes text to Portuguese", async () => {

            setup()
            await act(async () => {
                userEvent.click(portugueseToogle)
            })

            expect(await screen.findByRole("heading", { name: pt.login })).toBeInTheDocument()
            expect(screen.getByRole("button", { name: pt.login })).toBeInTheDocument()
            expect(screen.getByLabelText(pt.email)).toBeInTheDocument()
            expect(screen.getByLabelText(pt.password)).toBeInTheDocument()
        })

    })

    
})