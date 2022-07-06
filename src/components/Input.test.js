import { render } from "@testing-library/react"
import Input from "./Input.jsx"

describe("Input", () => {

    test("has is-invalid class for input when help is set", ()=>{
       const {container} = render(<Input error="This is invalid" />)
   
        const input = container.querySelector("input")
        expect(input).toHaveClass("is-invalid")
    })

    test("has invalid-feedback class for span when error message is set", ()=>{
        const {container} = render(<Input error="This is invalid" />)
    
        const span = container.querySelector("small")
        expect(span.classList).toContain("invalid-feedback")
    })

    test("does not have is-invalid class for input when error message is not set", ()=>{
        const {container} = render(<Input />)
    
        const input = container.querySelector("input")
        expect(input).not.toHaveClass("is-invalid")
    })
})

