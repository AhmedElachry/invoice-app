import { createSlice } from "@reduxjs/toolkit";
import data from "../assets/data/data.json";

const initialState = {
  allInvoices: data,
  filteredInvoices: [],
  selectedInvoiceById: null,
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    getFilteredInvoices(state, action) {
      const { allInvoices } = state;
      if (action.payload.status === "") {
        state.filteredInvoices = allInvoices;
      } else {
        const filteredData = allInvoices.filter((invoice) => {
          return invoice.status === action.payload.status;
        });
        state.filteredInvoices = filteredData;
      }
    },
    addInvoice(state, action) {
      state.allInvoices.push(action.payload);
    },
    addDraftInvoice(state, action) {
      state.allInvoices.push(action.payload);
    },
    getOneInvoice(state, action) {
      const requestedInvoice = state.allInvoices.find(
        (inv) => inv.id === action.payload.id
      );
      state.selectedInvoiceById = requestedInvoice;
    },
    deleteInvoice(state, action) {
      state.allInvoices = state.filteredInvoices.filter(
        (inv) => inv.id !== action.payload.id
      );
    },
    updateInvoiceStatus: (state, action) => {
      const invoiceToUpdate = state.allInvoices.find(
        (inv) => inv.id === action.payload.id
      );
      if (invoiceToUpdate) {
        invoiceToUpdate.status = action.payload.status;
      }
    },
    editInvoice(state, action) {
      const invoiceIndexToEdit = state.allInvoices.findIndex(
        (invoice) => invoice.id === action.payload.id
      );
      if (invoiceIndexToEdit !== -1) {
        state.allInvoices[invoiceIndexToEdit] = action.payload;
      }
    },
  },
});

export default invoicesSlice;
