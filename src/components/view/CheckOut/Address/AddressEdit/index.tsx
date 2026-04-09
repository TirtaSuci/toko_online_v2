import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import styles from "./AddressEdit.module.scss";
import { Dispatch, FormEvent, SetStateAction, useContext } from "react";
import { ToasterContext } from "@/context/ToasterContexts";
import userServices from "@/Services/user";
import { ProfileType } from "@/types/profile.type";


type Propstype = {
    profile: ProfileType | null;
    setProfile: Dispatch<SetStateAction<ProfileType | null>>;
    // index of address being edited, null to close
    setAddressEdit: Dispatch<SetStateAction<number | null>>;
    addressIndex: number;
};

const options = [
    { name: "Home", value: "home" },
    { name: "Work", value: "work" },
];

const AddressEditView = (props: Propstype) => {
    const { setAddressEdit, profile, setProfile, addressIndex } = props;
    const { setToaster } = useContext(ToasterContext);
    const address = profile?.address?.[addressIndex];

    const handleFormAddress = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const addressData = {
            id: address?.id || "",
            reciptien: form.reciptien.value,
            phone: form.phone.value,
            addressLine: form.addressLine.value,
            isMain: address?.isMain || false,
        };
        try {
            const newAddress = (profile?.address || []).map((addr, idx) =>
                idx === addressIndex ? addressData : addr
            );
            const result = await userServices.updateAddress(address?.id || "", { address: newAddress });
            if (result?.status === 200) {
                form.reset();
                const { data } = await userServices.getProfile();
                setProfile(data.data);
                setToaster?.({ variant: "success", message: "Address updated successfully." });
                setAddressEdit(null);
            } else {
                setToaster?.({
                    variant: "error",
                    message: result?.data?.message || "Failed to update address.",
                });
            }
        } catch {
            setToaster?.({
                variant: "error",
                message: "Failed to update address.",
            });
        }
    };

    const handleDeleteAddress = async () => {
        try {
            const result = await userServices.deleteAddress(address?.id || "");
            if (result?.status === 200) {
                const { data } = await userServices.getProfile();
                setProfile(data.data);
                setToaster?.({ variant: "success", message: "Address deleted successfully." });
                setAddressEdit(null);
            } else {
                setToaster?.({
                    variant: "error",
                    message: result?.data?.message || "Failed to delete address.",
                });
            }
        } catch {
            setToaster?.({
                variant: "error",
                message: "Failed to delete address.",
            });
        }
    };

    return (
        <Modal onClose={() => {
            setAddressEdit(null);
        }}>
            <form onSubmit={handleFormAddress} className={styles.container}>
                <p className={styles.title}>Edit Address</p>
                <div className={styles.form}>
                    <Input
                        type="text"
                        name="reciptien"
                        label="Recipient Name"
                        placeholder="Enter recipient name"
                        defaultValue={address?.reciptien}
                    />
                    <Input
                        type="number"
                        name="phone"
                        label="Phone Number"
                        placeholder="Enter phone number"
                        defaultValue={address?.phone || ""}
                    />
                    <Input
                        type="text"
                        name="addressLine"
                        label="Address Line"
                        placeholder="Enter address line"
                        defaultValue={address?.addressLine || ""}
                    />
                    <p>Mark as: </p>
                    <div className={styles.radioGroup}>
                        {options.map((opt) => (
                            <div key={opt.value} className={styles.productStock__sizeOption}>
                                <input
                                    type="radio"
                                    name="addressType"
                                    id={opt.value}
                                    value={opt.value}
                                    defaultChecked={address?.isMain && opt.value === "home" /* or some logic */}
                                />
                                <label htmlFor={opt.value}>{opt.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.actions}>
                    <Button onClick={handleDeleteAddress} >Delete</Button>
                    <div className={styles.actions__buttons}>
                        <Button onClick={() => setAddressEdit(null)}>Cancel</Button>
                        <Button type="submit">Save</Button>
                    </div>

                </div>
            </form>
        </Modal>
    );
}
export default AddressEditView;