import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, addToCart, removeFromCart, getQuantity }) => {
  const navigate = useNavigate();
  const quantity = getQuantity(product._id);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group">

      {/* IMAGE */}
      <div className="overflow-hidden">
        <img
          src={product.image}
          className="h-56 w-full object-cover group-hover:scale-110 transition duration-300 cursor-pointer"
          onClick={() => navigate(`/product/${product._id}`)}
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">

        <h3
          onClick={() => navigate(`/product/${product._id}`)}
          className="font-bold text-lg cursor-pointer hover:text-orange-500"
        >
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {product.description}
        </p>

        <p className="text-orange-500 font-bold mt-2 text-lg">
          PKR {product.price}
        </p>

        {/* CART CONTROLS */}
        <div className="flex items-center justify-between mt-4">

          <button
            onClick={() => removeFromCart(product._id)}
            className="w-8 h-8 bg-gray-200 rounded-full hover:bg-red-200"
          >
            -
          </button>

          <span className="font-semibold">{quantity}</span>

          <button
            onClick={() => addToCart(product)}
            className="w-8 h-8 bg-orange-500 text-white rounded-full hover:bg-orange-600"
          >
            +
          </button>

        </div>

        {/* VIEW DETAILS */}
        <button
          onClick={() => navigate(`/product/${product._id}`)}
          className="w-full mt-4 py-2 bg-gray-100 hover:bg-orange-100 rounded-lg text-sm"
        >
          View Details
        </button>

      </div>
    </div>
  );
};

export default ProductCard;