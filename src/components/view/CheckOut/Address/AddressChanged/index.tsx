import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import { Dispatch, SetStateAction, useState } from "react";
import AddAddressView from "../AddAddress";
import { ProfileType } from "@/types/profile.type";
import style from "./AddressChanged.module.scss";
import AddressEditView from "../AddressEdit";

type Propstype = {
    setAddressChanged: Dispatch<SetStateAction<boolean>>;
    profile: ProfileType | null;
    setProfile: Dispatch<SetStateAction<ProfileType | null>>
    setSelectedAddress: Dispatch<SetStateAction<number>>
    selectedAddress: number
}

const AddressChangedView = (props: Propstype) => {
    const { setAddressChanged, profile, setProfile, selectedAddress, setSelectedAddress } = props;
    const [addAddress, setAddAddress] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    return (
        <Modal onClose={() => {
            setAddressChanged(false);
        }}>
            <div className={style.addressChanged}>
                <p className={style.addressChanged__title}>Address</p>
                <hr />
                <div className={style.addressChanged__content}>
                    {profile?.address?.map((item: { addressLine: string; phone: string; reciptien: string; }, id: number) => (
                        <div
                            key={id}
                            className={`${style.addressChanged__content__item} ${id === selectedAddress && style[`addressChanged__content__item--active`]}`}
                        >
                            <div className={style.addressChanged__content__item__data}
                                onClick={() => { setSelectedAddress(id); setAddressChanged(false); }}
                            >
                                <div className={style.addressChanged__content__item__data__header}>
                                    <p>{item.reciptien}</p>
                                    <p>| {item.phone}</p>
                                </div>
                                <p>{item.addressLine}</p>
                            </div>
                            <Button onClick={() => { setEditIndex(id) }} className={style.addressChanged__content__item__button}>
                                Edit
                            </Button>
                        </div>
                    ))}
                </div>
                <hr />
                <Button
                    className={style.addressChanged__button}
                    onClick={() => setAddAddress(true)}
                >
                    Add Address
                </Button>
            </div>

            {
                addAddress &&
                <AddAddressView
                    setAddAddress={setAddAddress}
                    setProfile={setProfile}
                    profile={profile}
                />
            }

            {
                editIndex !== null && (
                    <AddressEditView
                        setAddressEdit={setEditIndex}
                        setProfile={setProfile}
                        profile={profile}
                        addressIndex={editIndex}
                    />
                )
            }
        </Modal >
    );
};

export default AddressChangedView;