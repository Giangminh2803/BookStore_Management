import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Divider, Badge, Drawer, Avatar, Popover, Empty, Button, Modal } from "antd";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router";
import "./app.header.scss";
import { Link } from "react-router-dom";
import { useCurrentApp } from "components/context/app.context";
import { AntDesignOutlined } from "@ant-design/icons";
import { logoutAPI } from "@/services/api/auth/auth.api";
import ManageAccount from "../client/user/manage.account";

const AppHeader = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const {
    isAuthenticated,
    user,
    setUser,
    setIsAuthenticated,
    carts,
    setCarts,
  } = useCurrentApp();
  const [openModalAcc, setOpenModalAcc] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logoutAPI();
    if (res.data) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
    }
  };

  let items = [
    {
      label: (
        <label
          style={{ cursor: "pointer" }}
          onClick={() => setOpenModalAcc(true)}
        >
          Quản lý tài khoản
        </label>
      ),
      key: "account",
    },
    {
      label: <Link to="/history">Lịch sử mua hàng</Link>,
      key: "history",
    },
    {
      label: (
        <label style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
          Đăng xuất
        </label>
      ),
      key: "logout",
    },
  ];
  if (user?.role === "ADMIN") {
    items.unshift({
      label: <Link to="/admin">Trang quản trị</Link>,
      key: "admin",
    });
  }

  const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${
    user?.avatar
  }`;

  const contentPopover = () => {
    return (
      <div className="pop-cart-body ">
        <div className="pop-cart-content min-h-32">
          {carts?.map((book, index) => {
            return (
              <div
                className="book mb-3  text-xs gap-1 flex justify-between"
                key={`book-${index}`}
              >
                <img
                  className="max-w-12 max-h-12"
                  src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                    book?.detail?.thumbnail
                  }`}
                />
                <div className="line-clamp-2 min-h-12">
                  {book?.detail?.mainText}
                </div>
                <div className="price text-blue-600 font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(book?.detail?.price ?? 0)}
                </div>
              </div>
            );
          })}
        </div>
        {carts.length > 0 ? (
          <div className="pop-cart-footer flex justify-end">
            <Button
              className=""
              type="primary"
              onClick={() => navigate("/order")}
            >
              Xem giỏ hàng
            </Button>
          </div>
        ) : (
          <Empty description="Không có sản phẩm trong giỏ hàng" />
        )}
      </div>
    );
  };
  return (
    <>
      <div className="header-container bg-white ">
        <header className="page-header justify-center">
          <div className="page-header__top">
            <div
              className="page-header__toggle"
              onClick={() => {
                setOpenDrawer(true);
              }}
            >
              ☰
            </div>
            <div className="page-header__logo">
              <AntDesignOutlined
                style={{ fontSize: "32px" }}
                className="my-auto"
              />
              <span className="logo font-semibold ">
                <span onClick={() => navigate("/")}>Box Store</span>
              </span>
              <input
                className="input-search"
                type={"text"}
                placeholder="Bạn tìm gì hôm nay"
                // value={props.searchTerm}
                // onChange={(e) => props.setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <nav className="page-header__bottom">
            <ul id="navigation" className="navigation">
              <li className="navigation__item">
                <Popover
                  className="popover-carts"
                  placement="topRight"
                  rootClassName="popover-carts"
                  title={"Sản phẩm mới thêm"}
                  content={contentPopover}
                  arrow={true}
                >
                  <Badge
                    // count={carts?.length ?? 0}
                    count={carts?.length ?? 0}
                    size={"small"}
                    showZero
                  >
                    <FiShoppingCart className="icon-cart" />
                  </Badge>
                </Popover>
              </li>
              <li className="navigation__item mobile">
                <Divider type="vertical" />
              </li>
              <li className="navigation__item mobile">
                {!isAuthenticated ? (
                  <span onClick={() => navigate("/login")}> Tài Khoản</span>
                ) : (
                  <Dropdown menu={{ items }} trigger={["click"]}>
                    <Space>
                      <Avatar src={urlAvatar} />
                      {user?.fullName}
                    </Space>
                  </Dropdown>
                )}
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <Drawer
        title="Menu chức năng"
        placement="left"
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
      >
        <p>Quản lý tài khoản</p>
        <Divider />

        <p onClick={() => handleLogout()}>Đăng xuất</p>
        <Divider />
      </Drawer>
      <Modal footer width={'100vh'} title="Quản lí tài khoản" open={openModalAcc} onCancel={() => setOpenModalAcc(false)}>
       <ManageAccount/>
      </Modal>
    </>
  );
};

export default AppHeader;
