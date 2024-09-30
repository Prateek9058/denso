"use client";
import React, { useState } from "react";
import { DialogProps } from "@mui/material";

interface CommonState {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  select: any;
  setSelect: React.Dispatch<React.SetStateAction<string | null>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  searchTerm: string;
  setSeacrhTerm: React.Dispatch<React.SetStateAction<string>>;
  itemId: string | undefined;
  handleClickOpen: () => void;
  handleRadioChange: (
    item: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
}

export const useCommonState = (): CommonState => {
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<null | string>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTerm, setSeacrhTerm] = useState<string>("");
  const [itemId, setItemId] = useState<string | undefined>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleRadioChange = (
    item: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelect((prev: any) => (prev?._id === item._id ? null : item));
    setItemId(item._id);
  };
  return {
    open,
    itemId,
    setOpen,
    select,
    setSelect,
    currentPage,
    totalPages,
    searchTerm,
    setTotalPages,
    setCurrentPage,
    setSeacrhTerm,
    handleClickOpen,
    handleRadioChange,
  };
};
