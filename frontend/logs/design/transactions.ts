export const transactionsDesign = {
  /**
   * Transactions Page Design & Functionality Specification
   * Last Updated: [current_date]
   */

  layout: {
    width: "Full-width page with padding (px-4 sm:px-6 lg:px-8)",
    bottomPadding: "pb-24 to account for mobile nav",
  },

  filterBar: {
    gridLayout: {
      mobile: "Single column",
      tablet: "Two columns (sm)",
      desktop: "Four columns (lg)",
      gap: "gap-4",
    },

    components: {
      dateRangePicker: {
        defaultText: "Dates",
        features: [
          "Shows selected range when active",
          "Clear button (X) appears when range selected",
          "Opens double calendar with year/month selector",
          "Quick range options at bottom",
        ],
        quickRanges: [
          "This tax year",
          "Last tax year",
          "Last 12 months",
          "Current year",
          "Previous year",
          "Two years ago",
        ],
      },

      accountSelect: {
        type: "Multi-select dropdown",
        features: [
          "Search functionality",
          "Shows selected accounts as chips",
          "Width: w-64",
        ],
      },

      sortDropdown: {
        status: "Options TBD",
        default: "Default sort TBD",
      },

      viewOptions: {
        features: [
          "Controls for archived items",
          "Items per page selector",
        ],
      },
    },
  },

  functionality: {
    dateRangeFilter: {
      persistence: [
        "Persists between sessions",
        "Updates URL params",
        "Triggers transaction reload",
      ],
    },

    accountFilter: {
      persistence: [
        "Persists between sessions",
        "Updates URL params",
        "Triggers transaction reload",
        "Allows multiple selections",
      ],
    },

    sortOptions: {
      status: "TBD: Need sort options defined",
    },

    viewOptions: {
      features: [
        "Show/hide archived",
        "Items per page (10/25/50)",
        "Persists user preferences",
      ],
    },
  },

  urlParameters: {
    params: {
      startDate: "ISO date string",
      endDate: "ISO date string",
      accounts: "Comma-separated account IDs",
      sort: "Sort option",
      perPage: "Items per page",
      showArchived: "Boolean",
    },
  },
}; 