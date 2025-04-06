import React from 'react';
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useCart } from "../../CartContext";

const CartPopup = ({ show }) => {
  const { t } = useTranslation();
  const [nbrArticle, setNbrArticle] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const { state: cart, dispatch } = useCart([]);

  useEffect(() => {
    SetNbrArticle();
    SetSubTotal();
}, [cart]);

  const SetNbrArticle = () => {
    let nbr = 0;

    cart.map((item) => (nbr += item.itemQty));
    setNbrArticle(nbr);
};

const SetSubTotal = () => {
  let total = 0;
  cart.map(
      (item) =>
      (total +=
          item.product.price * item.itemQty -
          (
              item.product.price *
              item.itemQty *
              ((item.product.promotion.id != 1
                  ? item.product.promotion.pourcentage
                  : 0) /
                  100)
          ).toFixed())
  );
  setSubTotal(total);
};


  if (!show) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 mt-2 p-4 pr-16 bg-white dark:bg-dark-purple dark:text-gold rounded-lg shadow-lg sm:w-72 border border-gold z-50 animate-fadeIn">
      <div className="text-xl font-extrabold mb-4 font-primary text-black">{t("popup.basket")}</div>
      <div className="mb-2 text-lg font-semibold font-primary text-black">{t("popup.articles")}&nbsp;{nbrArticle}</div>
      <div className="mb-4 text-lg font-semibold font-primary text-black">{t("popup.subPrice")}&nbsp;{subTotal}€</div>
    </div>
  );
};

export default CartPopup;
