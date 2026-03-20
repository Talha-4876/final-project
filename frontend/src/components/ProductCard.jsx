import React from "react";

const ProductCard = ({
  product,
  addToCart,
  removeFromCart,
  getQuantity,
  exchangeRate,
  onNavigate,
}) => {
  const quantity = getQuantity(product._id);

  // Use live exchange rate
  const priceInPkr = Math.round(product.price * exchangeRate);

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:scale-105 transition flex flex-col">
      <img
        src={product.image}
        alt={product.name}
        onClick={onNavigate ? () => onNavigate(product._id) : null}
        className="h-56 w-full object-cover cursor-pointer"
      />

      <div className="p-5 flex flex-col flex-1">
        <h3
          onClick={onNavigate ? () => onNavigate(product._id) : null}
          className="font-bold text-xl mb-2 cursor-pointer hover:text-orange-500"
        >
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mb-2 flex-1">
          {product.description}
        </p>

       <p className="text-orange-500 font-bold text-lg mb-2">
  PKR {product.price}
</p>

        <div className="flex justify-between items-center mt-auto mb-2">
          <div className="flex gap-3 items-center">
            <button
              onClick={() => removeFromCart(product._id)}
              disabled={quantity === 0}
              className="w-10 h-10 border-2 border-red-500 rounded-full flex justify-center items-center hover:bg-red-200 transition"
            >
              -
            </button>
            <span className="font-semibold">{quantity}</span>
            <button
              onClick={() => addToCart(product)}
              className="w-10 h-10 border-2 border-green-500 rounded-full flex justify-center items-center hover:bg-green-200 transition"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;