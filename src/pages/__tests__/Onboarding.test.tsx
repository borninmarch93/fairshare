import React from "react";
import { createMemoryHistory } from 'history';
import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { Navigate, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { getTestRouter, ThemeWrapper } from "../../testutils";
import UserStep from "../../modules/onboarding/components/UserStep";
import CompanyStep from "../../modules/onboarding/components/CompanyStep";
import ShareholdersStep from "../../modules/onboarding/components/ShareholdersStep";
import ShareholderGrantsStep from "../../modules/onboarding/components/ShareholderGrantsStep";
import { OnboardingContext } from "../../modules/onboarding/context/OnboardingContext";
import { signupReducer } from "../../modules/onboarding/store";
import { OnboardingFields } from "../../modules/onboarding/types";
import SharePriceStep from "../../modules/onboarding/components/SharePriceStep";

const defaultOnboardingState = {
  userName: "",
  email: "",
  companyName: "",
  shareholders: {},
  grants: {},
  shares: {}
};

const Page = ({
  initialState = defaultOnboardingState,
}: {
  initialState?: OnboardingFields;
}) => {
  const [state, dispatch] = React.useReducer(signupReducer, initialState);

  return (
    <OnboardingContext.Provider
      value={{
        ...state,
        dispatch,
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="start/user" replace={true} />} />
        <Route path="/start/user" element={<UserStep />} />
        <Route path="/start/company" element={<CompanyStep />} />
        <Route path="/start/shares" element={<SharePriceStep />} />
        <Route path="/start/shareholders" element={<ShareholdersStep />} />
        <Route
          path="start/grants"
          element={<Navigate to={`/start/grants/0`} replace={true} />}
        />
        <Route
          path="start/grants/:shareholderID"
          element={<ShareholderGrantsStep />}
        />
        <Route path="start/done" element={<div />} />
      </Routes>
    </OnboardingContext.Provider>
  );
};

describe("Onboarding", () => {
  it("should allow configuring user details", async () => {
    const Router = getTestRouter("/");
    render(
      <Router>
        <Page />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const nameField = screen.getByRole("textbox", { name: /who is setting/ });
    await userEvent.click(nameField)
    await userEvent.type(nameField, "Terry");
    expect(nameField).toHaveValue("Terry");

    const emailField = screen.getByRole("textbox", { name: /email/ });
    await userEvent.click(emailField)
    await userEvent.type(emailField, "great@email.com");
    expect(emailField).toHaveValue("great@email.com");

    const nextButton = screen.getByRole("button", { name: "Next" });
    await userEvent.click(nextButton);
    expect(nameField).not.toBeInTheDocument();
  });

  it("should allow configuring company", async () => {
    const Router = getTestRouter("/start/company");
    render(
      <Router>
        <Page initialState={{
            ...defaultOnboardingState,
              userName: 'Aaron',
              email: 'myemail@gmail.com'
          }} />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const companyNameField = screen.getByRole("textbox", {
      name: /company are we/,
    });
    await userEvent.type(companyNameField, "Admiral");
    expect(companyNameField).toHaveValue("Admiral");

    const nextButton = screen.getByRole("button", { name: "Next" });
    await userEvent.click(nextButton);
    expect(companyNameField).not.toBeInTheDocument();
  });

  it("should allow configuring shareholders", async () => {
    const Router = getTestRouter("/start/shareholders");
    render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            companyName: "My Company",
            shareholders: {
              "0": { name: "Jenn", group: "founder", grants: [], id: 0 },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    expect(screen.getByText("Jenn")).toBeInTheDocument();
    expect(screen.queryByText("Anne")).toBeNull();

    const addShareholdersButton = screen.getByRole("button", {
      name: "Add Shareholder",
    });
    await userEvent.click(addShareholdersButton);

    let newShareholderNameField = screen.getByRole("textbox");
    let groupPicker = screen.getByRole("combobox");
    let createButton = screen.getByRole("button", { name: "Save" });

    await waitFor(() => {
      expect(newShareholderNameField).toBeVisible();
    });
    await userEvent.click(newShareholderNameField);
    await userEvent.paste("Anne");
    await userEvent.selectOptions(groupPicker, "founder");
    await userEvent.click(createButton);

    await waitForElementToBeRemoved(newShareholderNameField)
    expect(screen.getByText("Anne")).toBeInTheDocument();

    await userEvent.click(addShareholdersButton);
    newShareholderNameField = screen.getByRole("textbox");
    groupPicker = screen.getByRole("combobox");
    createButton = screen.getByRole("button", { name: "Save" });
    await waitFor(() => {
      expect(newShareholderNameField).toBeVisible();
    });
    expect(newShareholderNameField).toHaveValue("");

    await userEvent.click(newShareholderNameField);
    await userEvent.paste("Byron");
    await userEvent.selectOptions(groupPicker, "employee");
    await userEvent.click(createButton);

    expect(screen.getByText("Byron")).toBeInTheDocument();
  });

  it("should allow for configuring shareholder grants", async () => {
    const Router = getTestRouter("/start/grants");
   render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            companyName: "My Company",
            shareholders: {
              0: { name: "Jenn", group: "founder", grants: [1], id: 0 },
              1: { name: "Aaron", group: "employee", grants: [], id: 1 },
              2: { name: "Sam", group: "investor", grants: [], id: 2 },
            },
            grants: {
              1: {
                id: 1,
                name: "Initial issuance",
                amount: 1000,
                issued: Date.now().toLocaleString(),
                type: "common",
              },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    expect(screen.getByText(/Jenn/)).toBeInTheDocument();
    expect(screen.getByText("Initial issuance")).toBeInTheDocument();

    const addGrantButton = screen.getByRole("button", { name: /Add Grant/ });
    await userEvent.click(addGrantButton);

    let grantNameInput = screen.getByTestId("grant-name");
    let grantAmountInput = screen.getByTestId("grant-amount");
    let grantDateInput = screen.getByTestId("grant-issued");

    await waitFor(() => {
      expect(grantNameInput).toBeVisible();
    });

    await userEvent.click(grantNameInput);
    await userEvent.paste("2020 Incentive");
    await userEvent.click(grantAmountInput);
    await userEvent.paste("2000");
    await userEvent.click(grantDateInput);
    await userEvent.paste('2023-03-08');
  
    const saveButton = screen.getByRole("button", { name: /Save/ });
    await userEvent.click(saveButton);

    expect(screen.getByText("2020 Incentive")).toBeInTheDocument();

    let nextButton = screen.getByRole("link", { name: /Next/ });
    await userEvent.click(nextButton);

    await screen.findAllByText(/Aaron/);
    expect(screen.getByText(/No grants to show/)).toBeInTheDocument();

    await userEvent.click(addGrantButton);

    expect(grantNameInput).toHaveValue("");
    await userEvent.click(grantNameInput);
    await userEvent.paste("Options conversion");
    await userEvent.click(grantAmountInput);
    await userEvent.paste("100");
    await userEvent.click(grantDateInput);
    await userEvent.paste('2023-03-08');

    await userEvent.click(saveButton);

    expect(screen.getByText("Options conversion")).toBeInTheDocument();
    expect(screen.getByText('2023-03-08')).toBeInTheDocument();

    nextButton = screen.getByRole("link", { name: /Next/ });
    await userEvent.click(nextButton);

    await screen.findAllByText(/Sam/);
    expect(screen.getByText(/No grants to show/)).toBeInTheDocument();

    await userEvent.click(addGrantButton);

    expect(grantNameInput).toHaveValue("");
    await userEvent.click(grantNameInput);
    await userEvent.paste("Series A Purchase");
    await userEvent.click(grantAmountInput);
    await userEvent.paste('800')
    await userEvent.click(grantDateInput);
    await userEvent.paste("12/12/2020");

    await userEvent.click(saveButton);

    const textIndicator = screen.getByText(/What grants does/);
    expect(textIndicator).toBeInTheDocument();
    await userEvent.click(nextButton);
    expect(textIndicator).not.toBeInTheDocument();
  }, 10000);

  //Bug 01
  it("should not allow registering without email", async () => {
    const Router = getTestRouter("/");
    render(
      <Router>
        <Page />
      </Router>,
      { wrapper: ThemeWrapper }
    );
    const nameField = screen.getByRole("textbox", { name: /who is setting/ });
    await userEvent.click(nameField)
    await userEvent.type(nameField, "Terry");
    expect(nameField).toHaveValue("Terry");

    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeDisabled();
    await userEvent.click(nextButton);
    expect(nameField).toBeInTheDocument();
  });

  //Bug 02
  it("should not allow registering without company name", async () => {
    const Router = getTestRouter("/start/company");
    render(
      <Router>
        <Page initialState={{
          ...defaultOnboardingState,
            userName: 'Aaron',
            email: 'myemail@gmail.com'
        }} />
        </Router>,
      { wrapper: ThemeWrapper }
    );

    const companyNameField = screen.getByRole("textbox", {
      name: /company are we/,
    });
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeDisabled();
    await userEvent.click(nextButton);
    expect(companyNameField).toBeInTheDocument();
  });

  //Bug 03
  it("should not allow adding shareholder without name", async () => {
    const Router = getTestRouter("/start/shareholders");
    render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            companyName: "My Company",
            shareholders: {
              "0": { name: "Jenn", group: "founder", grants: [], id: 0 },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const addShareholdersButton = screen.getByRole("button", {
      name: "Add Shareholder",
    });
    await userEvent.click(addShareholdersButton);
  
    let newShareholderNameField = screen.getByRole("textbox");
    let createButton = screen.getByRole("button", { name: "Save" });
    await waitFor(() => {
      expect(newShareholderNameField).toBeVisible();
    });
    expect(createButton).toBeDisabled();
    await userEvent.click(createButton);
    expect(newShareholderNameField).toBeInTheDocument();
  });

  //Bug 04
  it("should not allow adding placeholder as type of shareholder", async () => {
    const Router = getTestRouter("/start/shareholders");
    render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            companyName: "My Company",
            shareholders: {
              "0": { name: "Jenn", group: "founder", grants: [], id: 0 },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );
  
    const addShareholdersButton = screen.getByRole("button", {
      name: "Add Shareholder",
    });
    await userEvent.click(addShareholdersButton);
  
    let newShareholderNameField = screen.getByRole("textbox");
    let defaultOption = screen.getByRole('option', { name: "Type of Shareholder" });
    await waitFor(() => {
      expect(newShareholderNameField).toBeVisible();
    });
  
    expect(defaultOption).toBeDisabled();
  });  

  //Bug 05
  it('should not access company step directly',  async () => {
    const Router = getTestRouter("/start/company");
    
    render(
      <Router>
        <Page/>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const history = createMemoryHistory();
    const companyNameField = screen.queryByRole("textbox", {
      name: /company are we/,
    });
    expect(companyNameField).not.toBeInTheDocument();
    expect(history.location.pathname).toBe('/');
  });

  //Bug 06
  it('should not access add shareholders step directly',  async () => {
    const Router = getTestRouter("/start/shareholders");
    
    render(
      <Router>
        <Page/>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const history = createMemoryHistory();
    const addShareholdersButton = screen.queryByRole("button", {
      name: "Add Shareholder",
    });
    expect(addShareholdersButton).not.toBeInTheDocument();
    expect(history.location.pathname).toBe('/');
  });

  //Bug 07
  it("should allow registering with multiple shareholders", async () => {
    const Router = getTestRouter("/start/shareholders");
    render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            userName: 'Aaron',
            email: 'myemail@gmail.com',
            shares: {
              1: {
                type: "common",
                price: 3,
                id: 1
              },
              2: {
                type: "preferred",
                price: 5,
                id: 2
              },
            },
            companyName: "My Company",
            shareholders: {
              0: { name: "Jenn", group: "founder", grants: [], id: 0 },
              1: { name: "Aaron", group: "employee", grants: [], id: 1 },
            }
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );
    const history = createMemoryHistory();

    let nextButton = screen.getByRole("link", { name: /Next/ });
    await userEvent.click(nextButton);

    nextButton = screen.getByRole("link", { name: /Next/ });
    await userEvent.click(nextButton);
    
    nextButton = screen.getByRole("link", { name: /Next/ });
    await userEvent.click(nextButton);

    expect(history.location.pathname).toBe('/');
  })

  //Bug 08
  it('should not allow adding grant without name/amount/date',  async () => {
    const Router = getTestRouter("/start/grants/0");
    render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            shareholders: {
              "0": { name: "Jenn", group: "founder", grants: [], id: 0 },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const addGrantButton = screen.getByRole("button", { name: /Add Grant/ });
    await userEvent.click(addGrantButton);

    let grantNameInput = screen.getByTestId("grant-name");
    let grantAmountInput = screen.getByTestId("grant-amount");
    let grantDateInput = screen.getByTestId("grant-issued");
    const saveButton = screen.getByRole("button", { name: /Save/ });

    await waitFor(() => {
      expect(grantNameInput).toBeVisible();
    });

    // wo name
    await userEvent.click(grantAmountInput);
    await userEvent.paste("2000");
    await userEvent.click(grantDateInput);
    await userEvent.paste('2023-03-08');
    expect(saveButton).toBeDisabled();
    
    // wo shares amount
    await userEvent.click(grantNameInput);
    await userEvent.paste("Anna");
    await userEvent.click(grantAmountInput);
    await userEvent.clear(grantAmountInput);
    expect(saveButton).toBeDisabled();

    // wo date
    await userEvent.click(grantAmountInput);
    await userEvent.paste("2000");
    await userEvent.click(grantDateInput);
    await userEvent.clear(grantDateInput);
    expect(saveButton).toBeDisabled();
  });

  //Bug 09
  it('should be able to add any amount of shares',  async () => {
    const Router = getTestRouter("/start/grants/0");
    render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            shareholders: {
              0: { name: "Jenn", group: "founder", grants: [1], id: 0 },
              1: { name: "Aaron", group: "employee", grants: [2], id: 1 },
            },
            grants: {
              1: {
                id: 1,
                name: "Initial issuance",
                amount: 1000,
                issued: Date.now().toLocaleString(),
                type: "common",
              },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const addGrantButton = screen.getByRole("button", { name: /Add Grant/ });
    await userEvent.click(addGrantButton);

    let grantAmountInput = screen.getByTestId("grant-amount");
    await waitFor(() => {
      expect(grantAmountInput).toBeVisible();
    });

    await userEvent.click(grantAmountInput);
    await userEvent.paste("5");

    expect(grantAmountInput).toHaveValue("5");
  });

  it("should allow add preferred type of grant", async () => {
    const Router = getTestRouter("/start/grants/0");
   render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            companyName: "My Company",
            shares: {
              1: {
                type: "common",
                price: 3,
                id: 1
              },
              2: {
                type: "preferred",
                price: 5,
                id: 2
              },
            },
            shareholders: {
              0: { name: "Jenn", group: "founder", grants: [1], id: 0 },
              1: { name: "Aaron", group: "employee", grants: [2], id: 1 },
            },
            grants: {
              1: {
                id: 1,
                name: "Initial issuance",
                amount: 1000,
                issued: Date.now().toLocaleString(),
                type: "common",
              },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    expect(screen.getByText(/Jenn/)).toBeInTheDocument();
    expect(screen.getByText("Initial issuance")).toBeInTheDocument();

    const addGrantButton = screen.getByRole("button", { name: /Add Grant/ });
    await userEvent.click(addGrantButton);
    let grantTypeInput = screen.getByRole("combobox");

    await waitFor(() => {
      expect(grantTypeInput).toBeVisible();
    });

    await userEvent.selectOptions(grantTypeInput, "preferred");
    expect(grantTypeInput).toBeInTheDocument();
    let preferredOption = screen.getByRole('option', { name: "Preferred" });
    expect(preferredOption.selected).toBe(true);
  });

  it("should show the share type for each grant on the shareholder page", async () => {
    const Router = getTestRouter("/start/grants/0");
   render(
      <Router>
        <Page
          initialState={{
            ...defaultOnboardingState,
            companyName: "My Company",
            shares: {
              1: {
                type: "common",
                price: 3,
                id: 1
              },
              2: {
                type: "preferred",
                price: 5,
                id: 2
              },
            },
            shareholders: {
              0: { name: "Jenn", group: "founder", grants: [1], id: 0 },
              1: { name: "Aaron", group: "employee", grants: [2], id: 1 },
            },
            grants: {
              1: {
                id: 1,
                name: "Initial issuance",
                amount: 1000,
                issued: Date.now().toLocaleString(),
                type: "common",
              },
            },
          }}
        />
      </Router>,
      { wrapper: ThemeWrapper }
    );

    expect(screen.getByText(/Jenn/)).toBeInTheDocument();
    expect(screen.getByText("Initial issuance")).toBeInTheDocument();

    const addGrantButton = screen.getByRole("button", { name: /Add Grant/ });
    await userEvent.click(addGrantButton);

    let grantNameInput = screen.getByTestId("grant-name");
    let grantAmountInput = screen.getByTestId("grant-amount");
    let grantDateInput = screen.getByTestId("grant-issued");
    let grantTypeInput = screen.getByRole("combobox");

    await waitFor(() => {
      expect(grantTypeInput).toBeVisible();
    });

    await userEvent.click(grantNameInput);
    await userEvent.paste("2020 Incentives");
    await userEvent.selectOptions(grantTypeInput, "preferred");
    await userEvent.click(grantAmountInput);
    await userEvent.paste("2000");
    await userEvent.click(grantDateInput);
    await userEvent.paste('2023-03-08');

    const saveButton = screen.getByRole("button", { name: /Save/ });
    await userEvent.click(saveButton);

    expect(grantTypeInput).toBeInTheDocument();
  });

});