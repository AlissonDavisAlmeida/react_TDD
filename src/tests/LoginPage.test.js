import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Login from "../pages/login/LoginPage"
// import "../locale/i18n"

describe("Login Page", () => {
    beforeEach(() => {

        render(
            <>

                <Login />
                {/* <LanguageSelector /> */}
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
            const password = screen.getByLabelText("password")
            expect(password).toBeInTheDocument()
        })

        test("has password type for password input", () => {
            const password = screen.getByLabelText("password")
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
        it("enables the button when email and password are filled", async () => {
            const email = screen.getByLabelText("Email")
            const password = screen.getByLabelText("password")

            userEvent.type(email, "a@a.com");
            userEvent.type(password, "password");
            const submit = screen.getByRole("button", { name: "Login" })

            expect(submit).toBeEnabled()

        })
    })
})