import Modal from "@/components/layouts/Modal";
import Button from "@/components/layouts/UI/Button";
import Input from "@/components/layouts/UI/Input";
import Select from "@/components/layouts/UI/Select/indext";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { products } from "@/types/products.type";
import productServices from "@/Services/products";

// Simple helper: append a new size/qty to current stock and return new array
export function addSizeToStock(
  currentStock?: Array<{ size: string; qty: number }>,
  size?: string,
  qty?: number
) {
  const s = (size || "").toString().trim();
  const q = typeof qty === "number" ? qty : Number(qty) || 0;
  const base = Array.isArray(currentStock) ? [...currentStock] : [];
  if (!s) return base;
  return [...base, { size: s, qty: q }];
}

type ModalUpdateUserProps = {
  updateData: Partial<products> | null;
  setUpdateData: (v: Partial<products> | null) => void;
  setUserData: (data: products[]) => void;
  setToaster?: (
    toaster: { variant: "success" | "error"; message?: string } | null
  ) => void;
};

const ModalUpdateUser = (props: ModalUpdateUserProps) => {
  const { updateData, setUpdateData, setUserData, setToaster } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStockIndex, setSelectedStockIndex] = useState(0);
  const [editQuantity, setEditQuantity] = useState<number | null>(null);
  const [newSize, setNewSize] = useState<string>("");
  const [newQty, setNewQty] = useState<number | "">("");
  const session = useSession();
  const selectedStock =
    updateData?.stock && Array.isArray(updateData.stock)
      ? (updateData.stock as unknown as Array<{ size: string; qty: number }>)[
          selectedStockIndex
        ]
      : null;
  const selectedQuantity = editQuantity ?? selectedStock?.qty ?? 0;

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const form = event.target as HTMLFormElement;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const categoryInput = form.elements.namedItem(
      "category"
    ) as HTMLInputElement;
    const descriptionInput = form.elements.namedItem(
      "description"
    ) as HTMLInputElement;

    // Build updated stock array - only modify selected item, keep others intact
    const updatedStock = [...(updateData?.stock || [])];
    if (selectedStock && updatedStock[selectedStockIndex]) {
      updatedStock[selectedStockIndex] = {
        ...updatedStock[selectedStockIndex],
        qty: selectedQuantity,
      };
    }

    const data: Partial<products> = {
      name: nameInput?.value,
      category: categoryInput?.value,
      description: descriptionInput?.value,
      stock: updatedStock as unknown as products["stock"],
    };

    const result = await productServices.updateServices(
      updateData?.id || "",
      data,
      (session.data as unknown as { accessToken: string })
        ?.accessToken as string
    );

    if (result.status === 200) {
      setIsLoading(false);
      setEditQuantity(null);
      setSelectedStockIndex(0);
      setUpdateData(null);
      setToaster?.({
        variant: "success",
        message: "Product updated successfully",
      });
      const response = await productServices.getAllProducts();
      setUserData(response.data.data);
    } else {
      setIsLoading(false);
      setToaster?.({
        variant: "error",
        message: "Failed to update product",
      });
    }
  };

  const handleAddSize = () => {
    // Validate inputs
    const size = (newSize || "").toString().trim();
    const qty = typeof newQty === "number" ? newQty : Number(newQty) || 0;
    if (!size) {
      setToaster?.({ variant: "error", message: "Size is required" });
      return;
    }

    // Build updated stock using helper and update local product data
    const currentStock =
      (updateData?.stock as unknown as Array<{ size: string; qty: number }>) ||
      [];
    const updatedStock = addSizeToStock(currentStock, size, qty);
    setUpdateData({
      ...(updateData || {}),
      stock: updatedStock,
    } as Partial<products>);

    // Reset add inputs and notify user
    setNewSize("");
    setNewQty("");
    setToaster?.({ variant: "success", message: "Size added" });
  };
  const sizeOptions =
    updateData?.stock && Array.isArray(updateData.stock)
      ? (
          updateData.stock as unknown as Array<{ size: string; qty: number }>
        ).map((item, idx: number) => ({
          label: `Size ${item.size} (Qty: ${item.qty ?? 0})`,
          value: String(idx),
        }))
      : [];

  return (
    <Modal onClose={() => setUpdateData(null)}>
      <h1>Update Product</h1>
      <form onSubmit={handleRegister}>
        <Input label="Name" name="name" deafultValue={updateData?.name} />
        <Input
          label="Category"
          name="category"
          deafultValue={updateData?.category}
        />
        <Input
          label="Description"
          name="description"
          deafultValue={updateData?.description}
        />
        <Input
          label="Price"
          name="price"
          type="number"
          deafultValue={updateData?.price}
        />
        {sizeOptions.length > 0 && (
          <>
            <Select
              label="Select Size"
              name="stock-select"
              value={String(selectedStockIndex)}
              options={sizeOptions}
              onChange={(e) => setSelectedStockIndex(Number(e.target.value))}
            />
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
                alignItems: "center",
              }}
            >
              <Input
                label="Size"
                name="size"
                value={selectedStock?.size}
                disabled
              />
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={String(selectedQuantity)}
                onChange={(e) => setEditQuantity(Number(e.target.value))}
              />
              <Input
                label="New Size"
                name="new-size"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
              />
              <Input
                label="New Quantity"
                name="new-quantity"
                type="number"
                value={newQty === "" ? "" : String(newQty)}
                onChange={(e) =>
                  setNewQty(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
              <Button type="button" onClick={() => handleAddSize()}>
                Add
              </Button>
            </div>
          </>
        )}
        <Button type="submit" variant="primary">
          {isLoading ? "Loading..." : "Update"}
        </Button>
      </form>
    </Modal>
  );
};

export default ModalUpdateUser;
