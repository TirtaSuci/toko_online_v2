import { Dispatch, SetStateAction } from "react";

export type ToasterType = {
    toaster?: {
        variant?: "success" | "error" | "info";
        message?: string;
    }
    setToaster: Dispatch<SetStateAction<{ variant?: string; message?: string }>>;
};