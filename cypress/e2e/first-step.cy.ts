describe("first step", () => {
    it("display memo app", () => {
        cy.visit("/");
    });

    it("github login", () => {
        Cypress.Cookies.debug(true);

        cy.visit("/");

        cy.get("button").click();

        cy.get("button[data-test=github").click();

        cy.get("input[name=login]").type("username");
        cy.get("input[name=password").type("password");
        cy.get("input[name=commit]").click();
    });
});
