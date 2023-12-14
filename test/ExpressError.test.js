import { expect, test } from "vitest";
import ExpressError from "../utilities/ExpressError";

test("ExpressError", () => {
    // Arrange
    const message = "Test Error";
    const statusCode = 400;

    // Act
    const error = new ExpressError(message, statusCode)

    // Assert
    expect(error.message).toBe(message)
    expect(error.statusCode).toBe(statusCode)
})