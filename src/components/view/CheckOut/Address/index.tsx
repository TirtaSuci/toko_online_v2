import { Dispatch, SetStateAction, useEffect, useState } from "react";
import style from "./Address.module.scss";
import AddressChangedView from "./AddressChanged";
import Button from "@/components/layouts/UI/Button";
import { ProfileType } from "@/types/profile.type";
import AddAddressView from "./AddAddress";
import userServices from "@/Services/user";

type Propstype = {
    setSelectedAddress: Dispatch<SetStateAction<number>>
};

const AddressView = (props: Propstype) => {
    const { setSelectedAddress } = props;
    const [addressChanged, setAddressChanged] = useState(false);
    const [mainAddress, setMainAddress] = useState(0);
    const [addAddress, setAddAddress] = useState(false);
    const [inMain, setInMain] = useState<boolean>(false);
    const [profile, setProfile] = useState<ProfileType | null>(null);

    const getProfile = async () => {
        const response = await userServices.getProfile();
        setProfile(response.data.data);
    };

    useEffect(() => {
        getProfile();
    }, []);

    useEffect(() => {
        if (!profile?.address || profile.address.length === 0) return;

        if (!Array.isArray(profile.address)) {
            setMainAddress(0);
        } else {
            profile.address.filter((address: { isMain: boolean }, id: number) => {
                if (address.isMain) {
                    setMainAddress(id);
                }
            });
        }
    }, [profile?.address]);

    useEffect(() => {
        if (typeof setSelectedAddress === "function") {
            setSelectedAddress(mainAddress);
        }
    }, [mainAddress, setSelectedAddress]);


    return (
        <>
            <div className={style.addressView}>
                {profile?.address?.[mainAddress] ? (
                    <>
                        <p className={style.addressView__title}>Address</p>
                        <div className={style.addressView__content}>
                            <div className={style.addressView__content__data}>
                                <p>{profile?.address?.[mainAddress]?.reciptien} | {profile?.address?.[mainAddress]?.phone}</p>
                                <p>{profile?.address?.[mainAddress]?.addressLine}</p>
                            </div>
                            <Button
                                className={style.Button}
                                onClick={() => setAddressChanged(true)}
                            >
                                Change Address
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p>No address available</p>
                        <Button
                            onClick={() => {
                                setAddAddress(true);
                                setInMain(true);
                            }}
                        >
                            Add Address
                        </Button>
                    </>
                )}
            </div>

            {addressChanged && (
                <AddressChangedView
                    setAddressChanged={setAddressChanged}
                    setProfile={setProfile}
                    profile={profile}
                    selectedAddress={mainAddress}
                    setSelectedAddress={setMainAddress}
                />
            )}
            {addAddress &&
                <AddAddressView
                    setAddAddress={setAddAddress}
                    setProfile={setProfile}
                    inMain={inMain}
                    profile={profile}
                />
            }
        </>
    );
};

export default AddressView;
