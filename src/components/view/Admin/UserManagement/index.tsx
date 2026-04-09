import AdminLayout from "@/components/layouts/AdminLayout";
import style from "./UserManagement.module.scss";
import { useEffect, useMemo, useState } from "react";
import ModalUpdateUser from "./ModalUpdateUSer";
import ModalDeleteUser from "./ModalDeleteUser";
import { user } from "@/types/user.type";

type Propstype = {
  users: user[] | [];
};

const UsersAdminView = (props: Propstype) => {
  const { users } = props;
  const [updateData, setUpdateData] = useState<Partial<user> | null>(null);
  const [usersData, setUserData] = useState<user[]>([]);
  const [deletedUser, setDeletedUser] = useState<Partial<user> | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    setUserData(users);
  }, [users]);

  const filtered = useMemo(() => {
    return usersData.filter((u) => {
      const matchSearch =
        !search ||
        u.fullname?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [usersData, search, roleFilter]);

  const totalUsers = usersData.length;
  const totalAdmin = usersData.filter((u) => u.role === "admin").length;
  const totalMember = usersData.filter((u) => u.role === "member").length;

  return (
    <>
      <AdminLayout>
        <div className={style.users}>
          <header className={style.users__header}>
            <div>
              <h1 className={style.users__title}>Manajemen User</h1>
              <p className={style.users__subtitle}>Kelola seluruh pengguna terdaftar di sistem</p>
            </div>
          </header>

          <section className={style.users__stats}>
            <div className={style.users__stats__card}>
              <div className={`${style.users__stats__card__icon} ${style["icon--primary"]}`}>
                <i className="bx bx-group" />
              </div>
              <div>
                <p>Total User</p>
                <h3>{totalUsers}</h3>
              </div>
            </div>
            <div className={style.users__stats__card}>
              <div className={`${style.users__stats__card__icon} ${style["icon--info"]}`}>
                <i className="bx bx-shield" />
              </div>
              <div>
                <p>Admin</p>
                <h3>{totalAdmin}</h3>
              </div>
            </div>
            <div className={style.users__stats__card}>
              <div className={`${style.users__stats__card__icon} ${style["icon--success"]}`}>
                <i className="bx bx-user" />
              </div>
              <div>
                <p>Member</p>
                <h3>{totalMember}</h3>
              </div>
            </div>
          </section>

          <div className={style.users__toolbar}>
            <div className={style.users__search}>
              <i className="bx bx-search" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className={style.users__filter}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>

          <div className={style.users__tableWrap}>
            <table className={style.users__table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className={style.users__empty}>
                      <i className="bx bx-user-x" />
                      <p>Tidak ada user ditemukan</p>
                    </td>
                  </tr>
                )}
                {filtered.map((u, index) => {
                  const initial = (u.fullname || "?").charAt(0).toUpperCase();
                  const roleClass =
                    u.role === "admin" ? style["badge--admin"] : style["badge--member"];
                  const userImage = (u as { image?: string }).image;
                  return (
                    <tr key={u.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className={style.users__userCell}>
                          <div className={style.users__userCell__avatar}>
                            {userImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={userImage} alt={u.fullname} />
                            ) : (
                              <span>{initial}</span>
                            )}
                          </div>
                          <div className={style.users__userCell__info}>
                            <p className={style.users__userCell__name}>{u.fullname}</p>
                            <p className={style.users__userCell__id}>ID: {u.id?.slice(0, 10)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className={style.users__email}>{u.email}</td>
                      <td>
                        <span className={`${style.users__badge} ${roleClass}`}>{u.role}</span>
                      </td>
                      <td>
                        <div className={style.users__actions}>
                          <button
                            type="button"
                            className={`${style.users__actions__btn} ${style["btn--edit"]}`}
                            onClick={() => setUpdateData(u)}
                            title="Edit"
                          >
                            <i className="bx bxs-edit" />
                          </button>
                          <button
                            type="button"
                            className={`${style.users__actions__btn} ${style["btn--delete"]}`}
                            onClick={() => setDeletedUser(u)}
                            title="Hapus"
                          >
                            <i className="bx bxs-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
      {updateData && Object.keys(updateData).length > 0 && (
        <ModalUpdateUser
          updateData={updateData}
          setUpdateData={setUpdateData}
          setUserData={setUserData}
        />
      )}
      {deletedUser && Object.keys(deletedUser).length > 0 && (
        <ModalDeleteUser
          deletedUser={deletedUser}
          setDeletedUser={setDeletedUser}
          setUserData={setUserData}
        />
      )}
    </>
  );
};

export default UsersAdminView;
