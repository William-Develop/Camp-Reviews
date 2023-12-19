// Import the Builder and By modules from the selenium-webdriver package
const { Builder, By } = require("selenium-webdriver");

// Define an asynchronous function to test the campgrounds page
async function testCampgroundsPage() {
    // Create a new instance of a Selenium WebDriver for Chrome
    let driver = await new Builder().forBrowser("chrome").build();

    try {
        // Navigate to the campgrounds page
        await driver.get("http://localhost:3000/campgrounds");

        // Find the first h1 element on the page and get its text
        let tittle = await driver.findElement(By.tagName("h1")).getText();

        // Check if the title is "All Campgrounds"
        if (tittle === "All Campgrounds") {
            // If it is, log "Test Passed" to the console
            console.log("Test Passed")
        } else {
            // If it's not, log "Test Failed" to the console
            console.log("Test Failed")
        }
    } finally {
        await driver.quit();
    }
}

// Call the testCampgroundsPage function to run the test
testCampgroundsPage();