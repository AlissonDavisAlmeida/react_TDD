import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Signup from "../pages/signup/Signup"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { rest } from "msw"
import "../locale/i18n"
import en from "../locale/en_US.json"
import pt from "../locale/pt_BR.json"
import LanguageSelector from "../components/LanguageSelector"
import i18n from "../locale/i18n"



describe("Signup Tests", () => {

    beforeEach(() => {

        render(
            <>

                <Signup />
                <LanguageSelector />
            </>
        )
    })

    describe("Layout", () => {

        test("has a header", () => {
            const header = screen.queryByRole("heading", { name: "Signup" })

            expect(header).toBeInTheDocument()
        })

        test("has usernamme input", async () => {
            const username = screen.getByLabelText("Username")
            expect(username).toBeInTheDocument()
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
        test("has confirm password input", async () => {
            const password = screen.getByLabelText("Confirm Password")
            expect(password).toBeInTheDocument()
        })

        test("has password type for confirm password input", () => {
            const password = screen.getByLabelText("Confirm Password")
            expect(password).toHaveAttribute("type", "password")
        })

        test("has submit button", async () => {
            const submit = screen.getByRole("button", { name: "Signup" })
            expect(submit).toBeInTheDocument()
        })

        test("disables the button initially", () => {
            const submit = screen.getByRole("button", { name: "Signup" })
            expect(submit).toBeDisabled()
        })
    })

    describe("Behavior", () => {
        let button, password, confirmPassword, username, email

        const setup = () => {

            username = screen.getByLabelText("Username")
            email = screen.getByLabelText("Email")
            password = screen.getByLabelText("Password")
            confirmPassword = screen.getByLabelText("Confirm Password")

            userEvent.type(username, "username")
            userEvent.type(email, "email")
            userEvent.type(password, "password")
            userEvent.type(confirmPassword, "password")
            button = screen.getByRole("button", { name: "Signup" })
        }

        let requestBody
        let counter = 0

        const server = setupServer(
            rest.post("/api/1.0/users", (req, res, ctx) => {
                counter += 1
                requestBody = req.body
                return res(ctx.status(200))
            })
        )

        beforeEach(() => {
            server.listen()
        })

        afterEach(() => {
            server.close()
            counter = 0
        })

        test("enables the button when password and confirm password match", async () => {
            setup()

            expect(button).toBeEnabled()
        })

        test("sends username, email and password to backend after clicking the button", async () => {
            setup()

            await act(async () => {

                userEvent.click(button)
            })

            await new Promise(resolve => setTimeout(() => {
                resolve()
            }, 500))

            expect(requestBody).toEqual({
                username: "username",
                email: "email",
                password: "password",
                confirmPassword: "password",
                errors: {}
            })

        })

        test("disables button when there is an ongoing api call", async () => {
            setup()


            await act(async () => {

                userEvent.click(button)

            })

            await act(async () => {

                userEvent.click(button)
            })

            await new Promise(resolve => setTimeout(() => {
                resolve()
            }, 500))

            expect(counter).toBe(1)

        })

        test("displays spinner while the api request in progress", async () => {
            setup();
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
            userEvent.click(button);
            const spinner = screen.getByRole('status');
            expect(spinner).toBeInTheDocument();
            await screen.findByText(
                'Account activation email sent'
            );

        })

        test("displays account activation notification after success sign up request", async () => {
            setup()

            expect(screen.queryByText("Account activation email sent")).not.toBeInTheDocument()

            await act(async () => {

                userEvent.click(button)
            })

            const notification = await screen.findByText("Account activation email sent")

            expect(notification).toBeInTheDocument()
        })

        test("hides sign up form after success sign up request", async () => {
            setup()

            const form = screen.getByTestId("form-sign-up")

            await act(async () => {

                userEvent.click(button)
            })

            await waitFor(() => {
                expect(form).not.toBeInTheDocument()
            })
        })

        test.each`
        fieldName 
        ${'username'}
        ${'email'}
        ${'password'}

        `(`displays $fieldName cannot be bull for $fieldName`, async ({ fieldName }) => {
            server.use(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    counter += 1
                    requestBody = req.body
                    return res(ctx.status(400), ctx.json({
                        validationErrors: {
                            [fieldName]: `${fieldName} cannot be null`
                        }
                    }))
                })
            )

            setup()

            await act(async () => {

                userEvent.click(button)
            })

            const messageError = await screen.findByText(`${fieldName} cannot be null`)

            expect(messageError).toBeInTheDocument()
        })


        test("hides spinner and enables button after response received", async () => {
            server.use(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    counter += 1
                    requestBody = req.body
                    return res(ctx.status(400), ctx.json({
                        validationErrors: {
                            username: "Username cannot be null"
                        }
                    }))
                })
            )

            setup()

            await act(async () => {

                userEvent.click(button)
            }
            )

            await waitFor(() => {
                expect(screen.queryByRole('status')).not.toBeInTheDocument();
                expect(button).toBeEnabled();
            }
            )
        })

        test("displays mismatch message for confirm password input", async () => {
            setup()

            userEvent.type(password, "password")
            userEvent.type(confirmPassword, "password2")

            expect(screen.queryByText(en.passwodMismatchValidation)).toBeInTheDocument()
        })

        test.each`
        field | message | label
        ${'username'} | ${'Username cannot be null'} | ${'Username'}
        ${'email'} | ${'Email cannot be null'} | ${'Email'}
        ${'password'} | ${'Password cannot be null'} | ${'Password'}
        
        `("clears validations errors after typing in the field", async ({ field, message, label }) => {
            server.use(
                rest.post("/api/1.0/users", (req, res, ctx) => {
                    return res(ctx.status(400), ctx.json({
                        validationErrors: {
                            [field]: message
                        }
                    }))
                })
            )
            setup()

            userEvent.click(button)

            const validationError = await screen.findByText(message)
            const fieldInput = screen.getByLabelText(label)
            userEvent.type(fieldInput, field)
            expect(validationError).not.toBeInTheDocument()

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

        beforeEach(() => {
            server.listen()
        })


        afterEach(() => {
            server.close()
            counter = 0
        })

        let button, password, confirmPassword, username, email

        const setup = () => {

            username = screen.getByLabelText(en.username)
            email = screen.getByLabelText(en.email)
            password = screen.getByLabelText(en.password)
            confirmPassword = screen.getByLabelText(en.confirmPassword)

            userEvent.type(username, "username")
            userEvent.type(email, "email@com.br")
            userEvent.type(password, "password")
            userEvent.type(confirmPassword, "password")
            button = screen.getByRole("button", { name: "Signup" })
        }

        afterEach(async () => {
            await act(async () => {

                i18n.changeLanguage("en")
            })
        })

        test("changes text to Portuguese", async () => {

            await act(async () => {
                userEvent.click(screen.getByTitle("Portuguese"))
            })

            expect(screen.getByRole("heading", { name: pt.signup })).toBeInTheDocument()
            expect(screen.getByRole("button", { name: pt.signup })).toBeInTheDocument()
            expect(screen.getByLabelText(pt.username)).toBeInTheDocument()
            expect(screen.getByLabelText(pt.email)).toBeInTheDocument()
            expect(screen.getByLabelText(pt.password)).toBeInTheDocument()
            expect(screen.getByLabelText(pt.confirmPassword)).toBeInTheDocument()
        })
        test("initially displays all text in English", async () => {

            expect(screen.getByRole("heading", { name: en.signup })).toBeInTheDocument()
            expect(screen.getByRole("button", { name: en.signup })).toBeInTheDocument()
            expect(screen.getByLabelText(en.username)).toBeInTheDocument()
            expect(screen.getByLabelText(en.email)).toBeInTheDocument()
            expect(screen.getByLabelText(en.password)).toBeInTheDocument()
            expect(screen.getByLabelText(en.confirmPassword)).toBeInTheDocument()
        })

        test("changes text to English", async () => {

            await act(async () => {
                userEvent.click(screen.getByTitle("Portuguese"))
            })

            await act(async () => {
                userEvent.click(screen.getByTitle("English"))
            })

            expect(screen.getByRole("heading", { name: en.signup })).toBeInTheDocument()
            expect(screen.getByRole("button", { name: en.signup })).toBeInTheDocument()
            expect(screen.getByLabelText(en.username)).toBeInTheDocument()
            expect(screen.getByLabelText(en.email)).toBeInTheDocument()
            expect(screen.getByLabelText(en.password)).toBeInTheDocument()
            expect(screen.getByLabelText(en.confirmPassword)).toBeInTheDocument()
        })

        test("displays password mismatch message in Portuguese", async () => {
            await act(async () => {
                userEvent.click(screen.getByTitle("Portuguese"))
            })

            const passwordInput = screen.getByLabelText(pt.password)

            userEvent.type(passwordInput, "password")

            const validationMessage = screen.queryByText(pt.passwodMismatchValidation)

            expect(validationMessage).toBeInTheDocument()

        })

        test("sends accept language header as en for outgoing request", async () => {
            setup()

            userEvent.type(password, "password")
            userEvent.type(confirmPassword, "password")

            const form = screen.queryByTestId("form-sign-up")
            await act(async () => {
                userEvent.click(button)
            })

            // await waitForElementToBeRemoved(form)


            expect(acceptLanguageHeader).toBe("en")


        })
    })
})