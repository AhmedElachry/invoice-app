import React from "react";
import upArrow from "../assets/icon-arrow-up.png";
import downArrow from "../assets/icon-arrow-down.svg";
import plusIcon from "../assets/icon-plus.svg";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import invoicesSlice from "../redux/invoicesSlice";
import InvoiceCard from "./InvoiceCard";
import CreateInvoice from "./CreateInvoice";

function Invoices() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);

  const [filterValue, setFilterValue] = useState("");
  const filters = ["paid", "pending", "draft"];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      invoicesSlice.actions.getFilteredInvoices({ status: filterValue })
    );
  }, [filterValue, dispatch]);

  const invoices = useSelector((state) => state.invoices.filteredInvoices);

  return (
    <div className="max-w-3xl duration-300  mx-auto">
      <div className="flex justify-between max-w-3xl mx-auto dark:bg-darkBG">
        <div className="flex flex-col dark:text-white">
          <h1 className=" lg:text-4xl md:text-2xl  text-xl  dark:text-white tracking-wide font-semibold">
            Invoices
          </h1>
          <p className=" dark:text-white text-gray-500 font-light">
            There are {invoices.length} total invoices.
          </p>
        </div>
        <div className="flex gap-3">
          <div
            className="flex items-center  cursor-pointer hover:opacity-80"
            onClick={() => {
              setIsDropdownOpen((curr) => !curr);
            }}
          >
            <div>
              <p className=" hidden md:block  dark:text-white font-medium">
                Filter by status
              </p>
              <p className="  md:hidden dark:text-white font-medium">Filter</p>
            </div>
            <div className="ml-2">
              <img className="" src={isDropdownOpen ? upArrow : downArrow} />
            </div>
          </div>
          {isDropdownOpen && (
            <div className="  w-40 bg-white dark:bg-[#1E2139] dark:text-white flex px-6 py-4 flex-col  top-[200px] md:top-[120px]  absolute  shadow-2xl rounded-xl space-y-2    ">
              {filters.map((filter, i) => (
                <div
                  key={i}
                  onClick={() => {
                    filter === filterValue
                      ? setFilterValue("")
                      : setFilterValue(filter);
                  }}
                  className=" items-center cursor-pointer flex space-x-2 "
                >
                  <form>
                    <input
                      value={filter}
                      type="checkbox"
                      checked={filterValue === filter ? true : false}
                      className=" accent-[#7c5dfa] hover:accent-[#7c5dfa] "
                    />
                  </form>
                  <p>{filter}</p>
                </div>
              ))}
            </div>
          )}
          <div>
            <button
              onClick={() => setIsCreateInvoiceOpen(true)}
              className=" hover:opacity-80 ml-4 md:ml-10 flex items-center py-2 px-2 md:space-x-3 space-x-2 bg-[#7c5dfa] rounded-full"
            >
              <div className="flex items-center gap-2">
                <div className=" bg-white  w-9 h-9 flex justify-center items-center rounded-full ">
                  <img className="" src={plusIcon} />
                </div>
                <p className=" md:block hidden text-white font-semibold text-lg">
                  New invoice
                </p>
                <p className=" md:hidden block text-white font-semibold text-base">
                  New
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
      {/* invoices holder */}
      <div className=" mt-10   space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id}>
            <InvoiceCard invoice={invoice} />
          </div>
        ))}
      </div>
      {isCreateInvoiceOpen && (
        <CreateInvoice
          isCreateInvoiceOpen={isCreateInvoiceOpen}
          setIsCreateInvoiceOpen={setIsCreateInvoiceOpen}
        />
      )}
    </div>
  );
}

export default React.memo(Invoices);
