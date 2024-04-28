import React, { useState } from "react";
import { motion } from "framer-motion";
import AddItem from "./AddItem";
import { useDispatch } from "react-redux";
import invoicesSlice from "../redux/invoicesSlice";
import { useFormik } from "formik";

import {
  validateItemCount,
  validateItemName,
  validateItemPrice,
} from "../utils/createInvoiceValidator";
import getTodayDate from "../utils/getTodayDate";
import getForwardDate from "../utils/forwardDate";

function CreateInvoice({ setIsCreateInvoiceOpen, invoice, type }) {
  const dispatch = useDispatch();

  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isValidatorActive, setIsValidatorActive] = useState(false);

  const deliveryTimes = [
    { text: "please select a payment range", value: 0 },
    { text: "Next 1 day", value: 2 },
    { text: "Next 7 day", value: 7 },
    { text: "Next 14 day", value: 14 },
    { text: "Next 30 day", value: 30 },
  ];

  const [items, setItems] = useState([
    {
      name: "",
      quantity: 1,
      price: 0,
      total: 0,
      id: crypto.randomUUID().slice(0, 6),
    },
  ]);
  const onItemDelete = (id) => {
    setItems((pervState) => pervState.filter((el) => el.id !== id));
  };

  const handelOnChange = (id, e) => {
    let data = [...items];
    let foundData = data.find((el) => el.id === id);
    if (e.target.name === "quantity" || "price") {
      foundData[e.target.name] = e.target.value;
      foundData["total"] = (
        Number(foundData.quantity) * Number(foundData.price)
      ).toFixed(2);
    } else {
      foundData[e.target.name] = e.target.value;
    }
    setItems(data);
  };

  function totalOfInvoice(itemsArr) {
    return itemsArr.reduce((acc, curr) => {
      return acc + Number(curr.total);
    }, 0);
  }

  if (type === "edit" && isFirstLoad) {
    const updatedItemsArray = invoice?.items?.map((obj, index) => {
      return { ...obj, id: index + 1 };
    });
    setItems(updatedItemsArray);
    setIsFirstLoad(false);
  }

  function itemsValidator() {
    const itemName = items.map((i) => validateItemName(i.name));
    const itemCount = items.map((i) => validateItemCount(i.quantity));
    const itemPrice = items.map((i) => validateItemPrice(i.price));
    const allItemsElement = itemCount.concat(itemPrice, itemName);
    return allItemsElement.includes(false) === true ? false : true;
  }

  // form validation schema
  const validate = (values) => {
    // if (!isValidatorActive) return {};
    const errors = {};

    if (!values.senderAddress || !values.senderAddress.street) {
      errors.senderAddress = {
        ...errors.senderAddress,
        street: "*Required",
      };
    }

    if (!values.senderAddress || !values.senderAddress.city) {
      errors.senderAddress = {
        ...errors.senderAddress,
        city: "*Required",
      };
    }
    if (!values.senderAddress || !values.senderAddress.postCode) {
      errors.senderAddress = {
        ...errors.senderAddress,
        postCode: "*Required",
      };
    }
    if (!values.senderAddress || !values.senderAddress.country) {
      errors.senderAddress = {
        ...errors.senderAddress,
        country: "*Required",
      };
    }
    if (!values.clientName) {
      errors.clientName = "*Required";
    }
    if (!values.clientEmail) {
      errors.clientEmail = "*Required";
    }
    if (!values.clientAddress || !values.clientAddress.street) {
      errors.clientAddress = {
        ...errors.clientAddress,
        street: "*Required",
      };
    }
    if (!values.clientAddress || !values.clientAddress.city) {
      errors.clientAddress = {
        ...errors.clientAddress,
        city: "*Required",
      };
    }
    if (!values.clientAddress || !values.clientAddress.postCode) {
      errors.clientAddress = {
        ...errors.clientAddress,
        postCode: "*Required",
      };
    }
    if (!values.clientAddress || !values.clientAddress.country) {
      errors.clientAddress = {
        ...errors.clientAddress,
        country: "*Required",
      };
    }
    if (!values.createdAt) {
      errors.createdAt = "*Required";
    }
    if (!values.paymentTerms) {
      errors.paymentTerms = "*Required";
    }
    if (!values.description) {
      errors.description = "*Required";
    }

    return errors;
  };

  // form initial values in case of edit
  const initialValues = {
    createdAt: invoice?.createdAt || getTodayDate(),
    paymentDue: invoice?.paymentDue || "",
    description: invoice?.description || "",
    paymentTerms: invoice?.paymentTerms || "",
    clientName: invoice?.clientName || "",
    clientEmail: invoice?.clientEmail || "",
    senderAddress: {
      street: invoice?.senderAddress?.street || "",
      city: invoice?.senderAddress?.city || "",
      postCode: invoice?.senderAddress?.postCode || "",
      country: invoice?.senderAddress?.country || "",
    },
    clientAddress: {
      street: invoice?.clientAddress?.street || "",
      city: invoice?.clientAddress?.city || "",
      postCode: invoice?.clientAddress?.postCode || "",
      country: invoice?.clientAddress?.country || "",
    },
  };

  const onSubmit = (values) => {
    setIsValidatorActive(true);
    if (type === "edit") {
      dispatch(
        invoicesSlice.actions.editInvoice({
          id: invoice.id,
          ...values,
          status: invoice.status,
          items,
        })
      );
      dispatch(invoicesSlice.actions.getFilteredInvoices({ status: "" }));
      setIsCreateInvoiceOpen(false);
    } else {
      if (itemsValidator()) {
        dispatch(
          invoicesSlice.actions.addInvoice({
            id: crypto.randomUUID().slice(0, 6),
            ...values,
            status: "pending",
            items,
            paymentDue: getForwardDate(values.paymentTerms),
            total: totalOfInvoice(items),
          })
        );
        dispatch(invoicesSlice.actions.getFilteredInvoices({ status: "" }));
        setIsCreateInvoiceOpen(false);
      }
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormik({
    initialValues,
    validateOnChange: false,
    validate,
    onSubmit,
  });

  const onSaveDraft = (formValues) => {
    dispatch(
      invoicesSlice.actions.addDraftInvoice({
        id: crypto.randomUUID().slice(0, 6),
        ...formValues,
        status: "draft",
        items,
        paymentDue: getForwardDate(values.paymentTerms),
        total: totalOfInvoice(items),
      })
    );
    setIsCreateInvoiceOpen(false);
    dispatch(invoicesSlice.actions.getFilteredInvoices({ status: "" }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        onClick={(e) => {
          if (e.target !== e.currentTarget) {
            return;
          }
          setIsCreateInvoiceOpen(false);
        }}
        className=" fixed top-0 bottom-0 left-0 right-0  bg-[#000005be]"
      >
        <motion.div
          key="createInvoice-sidebar"
          initial={{ x: -500, opacity: 0 }}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 40,
              duration: 0.4,
            },
          }}
          exit={{ x: -700, transition: { duration: 0.2 } }}
          className="  scrollbar-hide flex flex-col dark:text-white dark:bg-[#141625] bg-white  md:pl-[150px] py-16 px-6 h-screen md:w-[768px] md:rounded-r-3xl"
        >
          <h1 className=" font-semibold dark:text-white text-3xl">
            {type == "edit" ? "Edit" : "Create"} Invoice
          </h1>

          <div className=" overflow-y-scroll scrollbar-hide my-14">
            <h1 className=" text-[#7c5dfa] mb-4 font-medium">Bill From</h1>

            <div className=" grid grid-cols-3 mx-1  space-y-4 ">
              <div className=" flex flex-col col-span-3">
                <label className=" text-gray-400 font-light">
                  Street Address
                </label>
                <input
                  value={values.senderAddress.street}
                  id="senderAddress.street"
                  name="senderAddress.street"
                  onChange={handleChange}
                  type="text"
                  className={` ${
                    errors?.senderAddress?.street ? "input-error" : ""
                  }
                   dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg  focus:outline-purple-400 border-gray-300 focus:outline-none  dark:border-gray-800 `}
                />
                {errors?.senderAddress?.street && (
                  <span className="error">{errors?.senderAddress?.street}</span>
                )}
              </div>

              <div className=" flex flex-col mr-4 col-span-1">
                <label className=" text-gray-400 font-light">City</label>
                <input
                  type="text"
                  name="senderAddress.city"
                  id="senderAddress.city"
                  value={values.senderAddress.city}
                  onChange={handleChange}
                  className={` ${
                    errors?.senderAddress?.city ? "input-error" : ""
                  }
                   dark:bg-[#1e2139] py-2 px-4 border-[.2px] focus:outline-none  rounded-lg  focus:outline-purple-400 border-gray-300 `}
                />
                {errors?.senderAddress?.city && (
                  <span className="error">{errors?.senderAddress?.city}</span>
                )}
              </div>
              <div className=" flex flex-col mr-4 col-span-1">
                <label className=" text-gray-400 font-light">Post Code</label>
                <input
                  type="text"
                  name="senderAddress.postCode"
                  id="senderAddress.postCode"
                  value={values.senderAddress.postCode}
                  onChange={handleChange}
                  className={`  ${
                    errors?.senderAddress?.postCode ? "input-error" : ""
                  }
                  dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-none  focus:outline-purple-400 border-gray-300 `}
                />
                {errors?.senderAddress?.postCode && (
                  <span className="error">
                    {errors?.senderAddress?.postCode}
                  </span>
                )}
              </div>
              <div className=" flex flex-col col-span-1">
                <label className=" text-gray-400 font-light">Country</label>
                <input
                  type="text"
                  name="senderAddress.country"
                  id="senderAddress.country"
                  value={values.senderAddress.country}
                  onChange={handleChange}
                  className={` ${
                    errors?.senderAddress?.country ? "input-error" : ""
                  } dark:bg-[#1e2139] py-2 px-4 border-[.2px] focus:outline-none  rounded-lg  focus:outline-purple-400 `}
                />
                {errors?.senderAddress?.country && (
                  <span className="error">
                    {errors?.senderAddress?.country}
                  </span>
                )}
              </div>
            </div>

            {/* Bill to Section */}

            <h1 className=" text-[#7c5dfa] my-4 mt-10 font-medium">Bill To</h1>

            <div className=" grid grid-cols-3 mx-1   space-y-4 ">
              <div className=" flex flex-col col-span-3">
                <label className=" text-gray-400 font-light">Client Name</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={values.clientName}
                  onChange={handleChange}
                  className={`  ${
                    errors.clientName ? "input-error" : ""
                  } dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg  focus:outline-purple-400 border-gray-300 focus:outline-none`}
                />
                {errors.clientName && (
                  <span className="error">{errors.clientName}</span>
                )}
              </div>

              <div className=" flex flex-col   col-span-3">
                <label className=" text-gray-400 font-light">
                  Client Email
                </label>
                <input
                  type="text"
                  id="clientEmail"
                  name="clientEmail"
                  value={values.clientEmail}
                  onChange={handleChange}
                  className={`${errors.clientEmail ? "input-error" : ""}
                  dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg  focus:outline-purple-400 border-gray-300 focus:outline-none`}
                />
                {errors.clientEmail && (
                  <span className="error">{errors.clientEmail}</span>
                )}
              </div>

              <div className=" flex flex-col col-span-3">
                <label className=" text-gray-400 font-light">
                  Street Address
                </label>
                <input
                  type="text"
                  name="clientAddress.street"
                  id="clientAddress.street"
                  value={values.clientAddress.street}
                  onChange={handleChange}
                  className={` ${
                    errors?.clientAddress?.street ? "input-error" : ""
                  } dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg  focus:outline-purple-400 border-gray-300 focus:outline-none`}
                />
                {errors?.clientAddress?.street && (
                  <span className="error">{errors?.clientAddress?.street}</span>
                )}
              </div>

              <div className=" flex flex-col mr-4 col-span-1">
                <label className=" text-gray-400 font-light">City</label>
                <input
                  type="text"
                  name="clientAddress.city"
                  id="clientAddress.city"
                  value={values.clientAddress.city}
                  onChange={handleChange}
                  className={`${
                    errors?.clientAddress?.city ? "input-error" : ""
                  }
                  dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg  focus:outline-purple-400 border-gray-300 focus:outline-none`}
                />
                {errors?.clientAddress?.city && (
                  <span className="error">{errors?.clientAddress?.city}</span>
                )}
              </div>
              <div className=" flex flex-col mr-4 col-span-1">
                <label className=" text-gray-400 font-light">Post Code</label>
                <input
                  type="text"
                  name="clientAddress.postCode"
                  id="clientAddress.postCode"
                  value={values.clientAddress.postCode}
                  onChange={handleChange}
                  className={`${
                    errors?.clientAddress?.postCode ? "input-error" : ""
                  }
                  dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg  focus:outline-purple-400 border-gray-300 focus:outline-none `}
                />
                {errors?.clientAddress?.postCode && (
                  <span className="error">
                    {errors?.clientAddress?.postCode}
                  </span>
                )}
              </div>
              <div className=" flex flex-col col-span-1">
                <label className=" text-gray-400 font-light">Country</label>
                <input
                  type="text"
                  name="clientAddress.country"
                  id="clientAddress.country"
                  value={values.clientAddress.country}
                  onChange={handleChange}
                  className={`${
                    errors?.clientAddress?.country ? "input-error" : ""
                  }
                  dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg  focus:outline-purple-400 border-gray-300 focus:outline-none `}
                />
                {errors?.clientAddress?.country && (
                  <span className="error">
                    {errors?.clientAddress?.country}
                  </span>
                )}
              </div>
            </div>

            <div className=" grid mx-1 grid-cols-2 mt-8 ">
              <div className=" flex flex-col ">
                <label className=" text-gray-400 font-light">
                  Invoice Date
                </label>
                <input
                  type="date"
                  name="createdAt"
                  id="createdAt"
                  value={values.createdAt}
                  onChange={handleChange}
                  className={` ${errors?.createdAt ? "input-error" : ""}
                  dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg  focus:outline-purple-400 border-gray-300 focus:outline-none  dark:border-gray-800 dark:text-white  mr-4`}
                />
                {errors?.createdAt && (
                  <span className="error">{errors?.createdAt}</span>
                )}
              </div>

              <div className=" mx-auto w-full">
                <label className=" text-gray-400 font-light">
                  Payment Terms
                </label>
                <select
                  name="paymentTerms"
                  id="paymentTerms"
                  value={values.paymentTerms}
                  onChange={handleChange}
                  className={`${errors?.paymentTerms ? "input-error" : ""}
                  appearance-none w-full py-2 px-4 border-[.2px] rounded-lg focus:outline-none  dark:bg-[#1e2139] dark:text-white dark:border-gray-800  focus:outline-purple-400 border-gray-300 select-status`}
                >
                  {deliveryTimes.map((time, idx) => (
                    <option key={idx} value={time.value}>
                      {time.text}
                    </option>
                  ))}
                </select>
                {errors?.paymentTerms && (
                  <span className="error">{errors?.paymentTerms}</span>
                )}
              </div>
            </div>

            <div className=" mx-1 mt-4 flex flex-col ">
              <label className=" text-gray-400 font-light">Description</label>
              <input
                name="description"
                id="description"
                value={values.description}
                onChange={handleChange}
                type="text"
                className={`${errors?.description ? "input-error" : ""}
                dark:bg-[#1e2139] py-2 px-4 border-[.2px] rounded-lg focus:outline-none   focus:outline-purple-400 border-gray-300 dark:border-gray-800 dark:text-white`}
              />
              {errors?.description && (
                <span className="error">{errors?.description}</span>
              )}
            </div>

            {/* Item List Section */}

            <h2 className=" text-2xl text-gray-500 mt-10 ">Item List</h2>
            {items?.map((itemDetails, index) => (
              <div key={index} className=" border-b pb-2 border-gray-300 mb-4">
                <AddItem
                  key={index}
                  handelOnChange={handelOnChange}
                  setItems={setItems}
                  onDelete={onItemDelete}
                  itemDetails={itemDetails}
                  isValidatorActive={isValidatorActive}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                setItems((state) => [
                  ...state,
                  {
                    name: "",
                    quantity: 1,
                    price: 0,
                    total: 0,
                    id: crypto.randomUUID().slice(0, 6),
                  },
                ]);
              }}
              className=" bg-gray-200  hover:opacity-80 mx-auto py-2 items-center dark:text-white dark:bg-[#252945] justify-center rounded-xl  w-full mt-6"
            >
              + Add New Item
            </button>
          </div>

          <div className=" flex  justify-between">
            <div>
              <button
                onClick={() => {
                  setIsCreateInvoiceOpen(false);
                }}
                className=" bg-gray-200  hover:opacity-80 mx-auto py-4 items-center dark:text-white  dark:bg-[#252945] justify-center  px-8 rounded-full "
              >
                Discard
              </button>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onSaveDraft()}
                className={`${type === "edit" ? "hidden" : ""}
                text-white mr-1 bg-[rgb(54,59,83)]  hover:opacity-80 mx-auto py-4 items-center  justify-center  px-8 rounded-full `}
              >
                Save draft
              </button>
              <button
                className=" text-white  hover:opacity-80 mx-auto py-4 items-center bg-[#7c5dfa] justify-center  px-8 rounded-full "
                type="submit"
              >
                Save & Send
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </form>
  );
}

export default CreateInvoice;
