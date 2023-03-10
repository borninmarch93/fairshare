import React from "react";
import { createMemoryHistory } from 'history';
import {
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { getTestRouter, server, ThemeWrapper } from "../../testutils";
import { Dashboard } from "../Dashboard";
import { Route, Routes } from "react-router";
import { getHandlers } from "../../handlers";
import userEvent from "@testing-library/user-event";

describe("Dashboard", () => {
  it("should show a row for all shareholders", async () => {
    const Router = getTestRouter("/dashboard");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
          1: { name: "Tony", grants: [3], group: "employee", id: 1 },
          2: { name: "Tiffany", grants: [4, 5], group: "employee", id: 2 },
          3: { name: "Timothy", grants: [6], group: "investor", id: 3 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          2: {
            id: 2,
            name: "Incentive Package 2020",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          3: {
            id: 3,
            name: "Options Conversion 2020",
            amount: 100,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          4: {
            id: 4,
            name: "Options Conversion 2019",
            amount: 90,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          5: {
            id: 5,
            name: "Options Conversion 2020",
            amount: 30,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          6: {
            id: 6,
            name: "Series A Purchase",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
        shares: {
          1: {
            type: "common",
            price: 3,
            id: 1
          },
          2: {
            type: "preferred",
            price: 6,
            id: 2
          }
        }
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    await screen.findAllByText("Tonya");
    expect(screen.getByTestId("shareholder-Tonya-grants")).toHaveTextContent(
      "2"
    );
    expect(screen.getByTestId("shareholder-Tonya-group")).toHaveTextContent(
      "founder"
    );
    expect(screen.getByTestId("shareholder-Tonya-shares")).toHaveTextContent(
      "1500"
    );

    expect(screen.getByTestId("shareholder-Tony-grants")).toHaveTextContent(
      "1"
    );
    expect(screen.getByTestId("shareholder-Tony-group")).toHaveTextContent(
      "employee"
    );
    expect(screen.getByTestId("shareholder-Tony-shares")).toHaveTextContent(
      "100"
    );

    expect(screen.getByTestId("shareholder-Tiffany-grants")).toHaveTextContent(
      "2"
    );
    expect(screen.getByTestId("shareholder-Tiffany-group")).toHaveTextContent(
      "employee"
    );
    expect(screen.getByTestId("shareholder-Tiffany-shares")).toHaveTextContent(
      "120"
    );

    expect(screen.getByTestId("shareholder-Timothy-grants")).toHaveTextContent(
      "1"
    );
    expect(screen.getByTestId("shareholder-Timothy-group")).toHaveTextContent(
      "investor"
    );
    expect(screen.getByTestId("shareholder-Timothy-shares")).toHaveTextContent(
      "500"
    );
  });

  it("should show investors in investors chart", async () => {
    const Router = getTestRouter("/dashboard/investor");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
          1: { name: "Tommy", grants: [3], group: "employee", id: 1 },
          2: { name: "Tiffany", grants: [4, 5], group: "employee", id: 2 },
          3: { name: "Timothy", grants: [], group: "investor", id: 3 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          2: {
            id: 2,
            name: "Incentive Package 2020",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          3: {
            id: 3,
            name: "Options Conversion 2020",
            amount: 100,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          4: {
            id: 4,
            name: "Options Conversion 2019",
            amount: 90,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          5: {
            id: 5,
            name: "Options Conversion 2020",
            amount: 30,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard/:mode" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const chart = await screen.findByRole("img");
    expect(within(chart).getByText(/Tonya/)).toBeInTheDocument();
    expect(within(chart).getByText(/Tommy/)).toBeInTheDocument();
    expect(within(chart).getByText(/Tiffany/)).toBeInTheDocument();
    expect(within(chart).queryByText(/Timothy/)).toBeNull();
  });

  it("should show groups in groups chart", async () => {
    const Router = getTestRouter("/dashboard/investor");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
          3: { name: "Timothy", grants: [6], group: "investor", id: 3 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          2: {
            id: 2,
            name: "Incentive Package 2020",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          6: {
            id: 6,
            name: "Series A Purchase",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard/:mode" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const groupsChartButton = await screen.findByRole("link", {
      name: /by group/i,
    });
    await userEvent.click(groupsChartButton);

    const chart = await screen.findByRole("img");
    expect(within(chart).getByText(/founder/)).toBeInTheDocument();
    expect(within(chart).getByText(/investor/)).toBeInTheDocument();
  });

  it("should allow adding new shareholders", async () => {
    const Router = getTestRouter("/dashboard");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          2: {
            id: 2,
            name: "Incentive Package 2020",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const addShareholderButton = await screen.findByRole("button", {
      name: /add shareholder/i,
    });
    await userEvent.click(addShareholderButton);

    const shareholderNameInput = screen.getByRole("textbox");
    const groupCombo = screen.getByRole("combobox");
    const saveButton = screen.getByRole("button", { name: /Save/ });
    await userEvent.click(shareholderNameInput);
    await userEvent.paste("Mike");
    await userEvent.selectOptions(groupCombo, "investor");

    await userEvent.click(saveButton);

    await waitFor(() => expect(shareholderNameInput).not.toBeVisible());
    expect(
      await screen.findByTestId("shareholder-Mike-group")
    ).toHaveTextContent("investor");
  }, 10000);

  //Bug 10
  it("should not show chart labels for non-existent data", async () => {
    const Router = getTestRouter("/dashboard/group");

    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1], group: "founder", id: 0 },
          3: { name: "Timothy", grants: [6], group: "investor", id: 3 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          6: {
            id: 6,
            name: "Series A Purchase",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard/:mode" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const chart = await screen.findByRole("img");
    expect(within(chart).getByText(/founder/)).toBeInTheDocument();
    expect(within(chart).getByText(/investor/)).toBeInTheDocument();
    expect(within(chart).queryByText(/employee/)).not.toBeInTheDocument();

  });

  //Bug 11
  it("should not allow adding shareholder without name", async () => {
    const Router = getTestRouter("/dashboard/investor");

    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1], group: "founder", id: 0 },
          3: { name: "Timothy", grants: [6], group: "investor", id: 3 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          6: {
            id: 6,
            name: "Series A Purchase",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard/:mode" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const addShareholderButton = await screen.findByRole("button", {
      name: /add shareholder/i,
    });
    await userEvent.click(addShareholderButton);

    let newShareholderNameField = screen.getByRole("textbox");
    let saveButton = screen.getByRole("button", { name: "Save" });
    await waitFor(() => {
      expect(newShareholderNameField).toBeVisible();
    });
    expect(saveButton).toBeDisabled();
    await userEvent.click(saveButton);
    expect(newShareholderNameField).toBeInTheDocument();
  });

  //Bug 12
  it("should be logout button", async () => {
    const Router = getTestRouter("/dashboard/investor");

    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1], group: "founder", id: 0 },
          3: { name: "Timothy", grants: [6], group: "investor", id: 3 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          6: {
            id: 6,
            name: "Series A Purchase",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard/:mode" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );
    const history = createMemoryHistory();
    const logoutButton = await screen.findByRole("button", {
      name: /logout/i,
    });
    await userEvent.click(logoutButton);
    expect(localStorage.getItem('session')).toBeNull();
    expect(history.location.pathname).toBe('/');
  });

  it("should show share types in share type chart", async () => {
    const Router = getTestRouter("/dashboard/investor");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
          3: { name: "Timothy", grants: [6], group: "investor", id: 3 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          2: {
            id: 2,
            name: "Incentive Package 2020",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "preferred",
          },
          6: {
            id: 6,
            name: "Series A Purchase",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "preferred",
          },
        },
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard/:mode" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const shareTypeChartButton = await screen.findByRole("link", {
      name: /by share type/i,
    });
    await userEvent.click(shareTypeChartButton);

    const chart = await screen.findByRole("img");
    expect(within(chart).getByText(/preferred/)).toBeInTheDocument();
    expect(within(chart).getByText(/common/)).toBeInTheDocument();
  });

  it("should show share company market cap", async () => {
    const Router = getTestRouter("/dashboard");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 10,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          2: {
            id: 2,
            name: "Incentive Package 2020",
            amount: 5,
            issued: Date.now().toLocaleString(),
            type: "preferred",
          },
        },
        shares: {
          1: {
            type: "common",
            price: 3,
            id: 1
          },
          2: {
            type: "preferred",
            price: 6,
            id: 2
          }
        }
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );
    
    const marketCap = await screen.findByText("Market Cap");
    expect(marketCap).toBeInTheDocument();
    expect(await screen.findByTestId('marketCap')).toHaveTextContent("$60");
  });

  it("should allow updating share price", async () => {
    const Router = getTestRouter("/dashboard");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1], group: "founder", id: 0 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 10,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
        shares: {
          1: {
            type: "common",
            price: 3,
            id: 1
          },
        }
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );
    
    const editPriceButton = await screen.findByRole("button", {
      name: /edit/i,
    });
    await userEvent.click(editPriceButton);

    const sharePriceInput = screen.getByRole("textbox");
    const saveButton = screen.getByRole("button", { name: /Save/ });
    await userEvent.click(sharePriceInput);
    await userEvent.clear(sharePriceInput);
    await userEvent.paste("5");
    await userEvent.click(saveButton);

    await waitFor(() => expect(sharePriceInput).not.toBeVisible());
    expect(
      await screen.findByTestId("share-common-price")
    ).toHaveTextContent("$5");
  });

  it("should show group by share amount", async () => {
    const Router = getTestRouter("/dashboard/investor");
    const handlers = getHandlers(
      {
        company: { name: "My Company" },
        shareholders: {
          0: { name: "Tonya", grants: [1, 2], group: "founder", id: 0 },
          3: { name: "Timothy", grants: [6], group: "investor", id: 3 },
        },
        grants: {
          1: {
            id: 1,
            name: "Initial Grant",
            amount: 1000,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          2: {
            id: 2,
            name: "Incentive Package 2020",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
          6: {
            id: 6,
            name: "Series A Purchase",
            amount: 500,
            issued: Date.now().toLocaleString(),
            type: "common",
          },
        },
      },
      false
    );
    server.use(...handlers);

    render(
      <Router>
        <Routes>
          <Route path="/dashboard/:mode" element={<Dashboard />} />
        </Routes>
      </Router>,
      { wrapper: ThemeWrapper }
    );

    const sharesNumChartButton = await screen.findByRole("tab", {
      name: /share #/i,
    });
    const equityChartButton = await screen.findByRole("tab", {
      name: /equity/i,
    });
    expect(sharesNumChartButton).toBeInTheDocument();
    expect(equityChartButton).toBeInTheDocument();

    await userEvent.click(equityChartButton);
    const chart = await screen.findByRole("img");
    expect(chart).toBeInTheDocument();
  });
});

