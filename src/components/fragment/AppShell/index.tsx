import Toaster from "@/components/layouts/Toaster";
import { AnimatePresence } from "motion/react";
import { Roboto } from "next/font/google";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import Navbar from "../Navbar";
import { ToasterContext } from "@/context/ToasterContexts";
import { ToasterType } from "@/types/toaster.type";

const roboto = Roboto({
    weight: ["100", "300", "400", "500", "700", "900"],
    subsets: ["latin"],
});

const disableNavbar = [`auth`, `admin`, `user`];

type AppShellProps = {
    children: React.ReactNode;
};

const AppShell = (props: AppShellProps) => {
    const { children } = props;
    const router = useRouter();
    const { toaster, setToaster }: ToasterType = useContext(ToasterContext);

    useEffect(() => {
        setToaster({
            // variant: "info",
            // message: "Welcome to our online shop! Explore our wide range of products and enjoy a seamless shopping experience."
        });
    }, [setToaster]);

    return (
        <>
            <div className={roboto.className}>
                {!disableNavbar.includes(router.pathname.split("/")[1]) && <Navbar />}
                {children}
                <AnimatePresence initial={false}>
                    {Object.keys(toaster || {}).length > 0 && (
                        <Toaster
                        />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default AppShell;