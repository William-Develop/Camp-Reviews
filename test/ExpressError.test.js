// Import necessary functions from vitest testing library
import { expect, test } from "vitest";

// Import ExpressError class from utilities directory
import ExpressError from "../utilities/ExpressError";

// Define a new test for the ExpressError class
test("ExpressError", () => {
    // Arrange: Set up the data for the test. Message and status code.
    const message = "Test Error";
    const statusCode = 400;

    // Act: Perform the action to be tested. Create a new ExpressError.
    const error = new ExpressError(message, statusCode)

    // Assert: Check that the results are as expected. Error's message and status code should match the input.
    expect(error.message).toBe(message)
    expect(error.statusCode).toBe(statusCode)
})