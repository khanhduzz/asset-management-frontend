import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./Home";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the necessary modules
jest.mock("@/services/apis/assignment.api", () => ({
  AssignmentAPICaller: {
    getMyAssignments: jest.fn().mockResolvedValue({
      data: {
        result: {
          data: [
            {
              id: 1,
              assignedDate: "2024-06-26",
              note: "None",
              state: "WAITING",
              assignTo: "duynh17",
              assignBy: "admin@local.com",
              asset: {
                id: "1",
                assetCode: "A-001",
                name: "Laptop",
                category: "Electronics",
                state: "Available",
              },
              returnDate: null,
            },
            {
              id: 2,
              assignedDate: "2024-06-26",
              note: "None",
              state: "ACCEPTED",
              assignTo: "duynh18",
              assignBy: "admin@local.com",
              asset: {
                id: "2",
                assetCode: "A-002",
                name: "Mouse",
                category: "Devices",
                state: "Available",
              },
              returnDate: null,
            },
            {
              id: 3,
              assignedDate: "2024-06-26",
              note: "None",
              state: "DECLINED",
              assignTo: "duynh19",
              assignBy: "admin@local.com",
              asset: {
                id: "3",
                assetCode: "A-003",
                name: "Printer",
                category: "Devices",
                state: "Available",
              },
              returnDate: null,
            },
          ],
        },
      },
    }),
  },
  changeState: jest.fn().mockResolvedValue({}),
}));

jest.mock("@/services/apis/asset.api", () => ({
  AssetAPICaller: {
    getSearchAssets: jest.fn().mockResolvedValue({
      data: {
        result: {
          data: [
            {
              id: "1",
              assetCode: "A-001",
              name: "Laptop",
              category: "Electronics",
              state: "Available",
            },
            {
              id: "2",
              assetCode: "A-002",
              name: "Mouse",
              category: "Devices",
              state: "Available",
            },
            {
              id: "3",
              assetCode: "A-003",
              name: "Printer",
              category: "Devices",
              state: "Available",
            },
          ],
        },
      },
    }),
  },
}));

jest.mock("@/services/apis/category.api", () => ({
  CategoryAPICaller: {
    getAll: jest.fn().mockResolvedValue({
      data: {
        result: [
          { id: "1", name: "Electronics" },
          { id: "2", name: "Devices" },
        ],
      },
    }),
  },
}));

// Helper function to wrap component with react-query's QueryClientProvider
const renderWithClient = () => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <Router>
        <Home />
      </Router>
    </QueryClientProvider>
  );
};

describe("Home", () => {
  test("renders without crashing", () => {
    renderWithClient();
    expect(screen.getByText("My Assignment")).toBeInTheDocument();
  });

  test("clicking Accept button opens confirmation modal", async () => {
    renderWithClient();

    await waitFor(() => {
      fireEvent.click(
        screen.getAllByRole("button", {
          name: /accepted/i,
        })[0]
      );
    });
  });

  test("clicking Decline button opens confirmation modal", async () => {
    renderWithClient();

    await waitFor(() => {
      fireEvent.click(
        screen.getAllByRole("button", {
          name: /declined/i,
        })[0]
      );
    });
  });

  test("clicking Returning Request button opens confirmation modal", async () => {
    renderWithClient();

    await waitFor(() => {
      fireEvent.click(
        screen.getAllByRole("button", {
          name: /returning-request/i,
        })[1]
      );
    });
  });

  test("sorting functionality updates search parameters correctly", async () => {
    renderWithClient();
    const assetCodeHeader = screen.getByText("Asset Code");
    fireEvent.click(assetCodeHeader);

    await waitFor(() => {
      expect(screen.getByText("A-001")).toBeInTheDocument();
      expect(global.window.location.search).toContain("orderBy=assetCode");
      expect(global.window.location.search).toContain("sortDir=asc");
    });

    fireEvent.click(assetCodeHeader);

    await waitFor(() => {
      expect(global.window.location.search).toContain("orderBy=assetCode");
      expect(global.window.location.search).toContain("sortDir=desc");
    });

    fireEvent.click(assetCodeHeader);

    await waitFor(() => {
      expect(global.window.location.search).not.toContain("orderBy=assetCode");
      expect(global.window.location.search).not.toContain("sortDir=asc");
      expect(global.window.location.search).not.toContain("sortDir=desc");
    });
  });

  test('opens the assignment details modal on row click', async () => {
    renderWithClient();

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Laptop'));

    await waitFor(() => {
      expect(screen.getByText('Detailed Assignment Information')).toBeInTheDocument();
    });
  });

});
