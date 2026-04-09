import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import styles from "./AddAdress.module.scss";
import { FormEvent, useContext } from "react";
import { ToasterContext } from "@/context/ToasterContexts";
import userServices from "@/Services/user";
import { ProfileType } from "@/types/profile.type";
import { nanoid } from "nanoid";

type Propstype = {
    setAddAddress: React.Dispatch<React.SetStateAction<boolean>>;
    inMain?: boolean;
    profile: ProfileType | null;
    setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
}

const options = [
    { name: "Home", value: "home" },
    { name: "Work", value: "work" },
];

const AddAddressView = (props: Propstype) => {
    const { setAddAddress, inMain, profile, setProfile } = props;
    const { setToaster } = useContext(ToasterContext);

    const handleFormAddress = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const addressData = {
            id: nanoid(),
            reciptien: form.reciptien.value,
            phone: form.phone.value,
            addressLine: form.addressLine.value,
            isMain: inMain || false,
        };
        try {
            const newAddress = [...(profile?.address || []), addressData];
            const result = await userServices.addAddress({ address: newAddress });
            if (result?.status === 200) {
                form.reset();
                const { data } = await userServices.getProfile();
                setProfile(data.data);
                setToaster?.({ variant: "success", message: "Address added successfully." });
                setAddAddress(false);
            } else {
                setToaster?.({
                    variant: "error",
                    message: result?.data?.message || "Failed to add address.",
                });
            }
        } catch {
            setToaster?.({
                variant: "error",
                message: "Failed to add address.",
            });
        }
    };

    return (
        <Modal onClose={() => {
            setAddAddress(false);
        }}>
            <form onSubmit={handleFormAddress} className={styles.container}>
                <p className={styles.title}>New Address</p>
                <div className={styles.form}>
                    <Input type="text" name="reciptien" label="Recipient Name" placeholder="Enter recipient name" />
                    <Input type="number" name="phone" label="Phone Number" placeholder="Enter phone number" />
                    <Input type="text" name="addressLine" label="Address Line" placeholder="Enter address line" />
                    <p>Mark as: </p>
                    <div className={styles.radioGroup}>
                        {options.map((opt) => (
                            <div key={opt.value} className={styles.productStock__sizeOption}>
                                <input
                                    type="radio"
                                    name="addressType"
                                    id={opt.value}
                                    value={opt.value}
                                />
                                <label htmlFor={opt.value}>{opt.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={() => setAddAddress(false)}>Cancel</Button>
                    <Button type="submit">Save</Button>
                </div>
            </form>
        </Modal>
    );
}
export default AddAddressView;