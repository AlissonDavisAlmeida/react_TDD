import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Signup from "../pages/signup/Signup"
import { setupServer } from "msw/node"
import { act } from "react-dom/test-utils"
import { rest } from "msw"

describe("Signup Tests", () => {

    beforeEach(() => {

        render(<Signup />)
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
        let button

        const setup = () => {

            const username = screen.getByLabelText("Username")
            const email = screen.getByLabelText("Email")
            const password = screen.getByLabelText("Password")
            const confirmPassword = screen.getByLabelText("Confirm Password")

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
                confirmPassword: "password"
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


    })
})