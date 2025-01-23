import { getBookAPI } from "@/services/api/book/book.api";
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { App, Button, Col, InputNumber, Rate, Row } from "antd";
import { InputNumberProps } from "antd/lib";
import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import { useParams } from "react-router-dom";
import BookLoading from "./book.loading";
import { useCurrentApp } from "@/components/context/app.context";

interface IProps {
  item: IBookTable | null;
}
interface IImage {
  original: string;
  thumbnail: string;
}
const BookDetail = (props: IProps) => {
  const { id } = useParams();
  const [item, setItem] = useState<IBookTable>();
  const [total, setTotal] = useState<number>(1);
  const [images, setImages] = useState<IImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {carts, setCarts} = useCurrentApp()
  const {message} = App.useApp()
  useEffect(() => {
    const fetchABook = async () => {
      if (id) {
        setIsLoading(true);
        const res = await getBookAPI(id);
        if (res) {
          setItem(res.data);
          const imagesBook = [];
          if (res.data?.thumbnail) {
            imagesBook.push({
              original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                res.data.thumbnail
              }`,
              thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${
                res.data.thumbnail
              }`,
            });
          }
          if (res.data?.slider) {
            res.data.slider.map((item: string) => {
              imagesBook.push({
                original: `${
                  import.meta.env.VITE_BACKEND_URL
                }/images/book/${item}`,
                thumbnail: `${
                  import.meta.env.VITE_BACKEND_URL
                }/images/book/${item}`,
              });
            });
          }
          setImages(imagesBook);
          
        }
      }
      setIsLoading(false);
    };
    fetchABook();
  },[]);

  const onChange: InputNumberProps["onChange"] = (value) => {
    setTotal(value as number);
    console.log(total);
  };
  const handleAddToCart = () => {
    const cartStorage = localStorage.getItem("carts")
    if(cartStorage && item){
        const carts = JSON.parse(cartStorage) as ICart[]
        let isExistIndex = carts.findIndex(c => c._id === item._id)
        if(isExistIndex > -1){
            carts[isExistIndex].quantity = carts[isExistIndex].quantity + total
        }else{
            carts.push({
                quantity: total,
                _id: item._id,
                detail: item
            })
        }
        localStorage.setItem("carts", JSON.stringify(carts))
        setCarts(carts)
    }else{
        const data = [{
            _id: item?._id!,
            quantity: total,
            detail: item!
        }]
        localStorage.setItem("carts", JSON.stringify(data))

        setCarts(data)
    }
    message.success('Thêm vào giỏ hàng thành công!')
  }

  return (
    <div
      style={{ maxWidth: "1440px", height: "100vh" }}
      className="container mx-auto mt-3 "
    >
      {isLoading ? (
        <BookLoading />
      ) : (
        <div className="container rounded-md bg-white p-4 ">
          <Row gutter={[20, 20]}>
            <Col md={10} sm={24} xs={24}>
              <ImageGallery
                items={images}
                showPlayButton={false}
                showFullscreenButton={false}
                renderLeftNav={() => <></>}
                renderRightNav={() => <></>}
                slideOnThumbnailOver={true}
              />
            </Col>
            <Col md={10} sm={24} xs={24}>
              <div>
                <span className="text-xs font-medium">
                  Tác giả: <span className="text-blue-600">{item?.author}</span>
                </span>

                <div className="text-xl mt-3 font-normal">
                  <span>{item?.mainText}</span>
                </div>
                <div>
                  <Rate className="text-xs mr-2" disabled value={5} />
                  <span className="text-xs font-medium">
                    Đã bán {item?.sold}
                  </span>
                </div>
                <div className="bg-[#f7f7f7] text-2xl font-medium text-blue-600 p-6 mt-3">
                  {item?.price
                    .toString()
                    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + " đ̲"}
                </div>
                <div className="mt-6 flex gap-10">
                  <span className="font-medium opacity-60 ">Vận Chuyển</span>
                  <span>Miễn phí vận chuyển</span>
                </div>
                <div className="mt-6 flex gap-10 ">
                  <span className="font-medium opacity-60">Số Lượng</span>
                  <span className="ml-4">
                    <InputNumber
                      onChange={onChange}
                      className="text-center"
                      min={1}
                      defaultValue={1}
                      max={item?.quantity}
                    />
                  </span>
                </div>
                <div className="mt-6">
                  <Button
                    className="text-blue-500 border-blue-500 p-5"
                    color="default"
                    variant="outlined"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart()}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button className="ml-4 p-5" color="default" type="primary">
                    Mua hàng
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
