import BookDetail from "@/components/client/book/book.detail";
import { useState } from "react";

const BookPage = () => {
    const [item, setItem] = useState<IBookTable | null>(null)
    
  return (
    <BookDetail item={item} />
  );
};

export default BookPage;
