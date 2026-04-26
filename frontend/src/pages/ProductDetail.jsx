import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../config";
import { CartContext } from "../context/CartContext";
import ReviewForm from "../components/ReviewForm";
import ReviewItem from "../components/ReviewItem";
import RatingBreakdown from "../components/RatingBreakdown";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [qty, setQty] = useState(0);
  const [added, setAdded] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  /* ================= PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/product/${id}`);
        setProduct(res.data?.product || null);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchProduct();
  }, [id]);

  /* ================= REVIEWS ================= */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/reviews/product/${id}`
        );
        setReviews(res.data?.reviews || []);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchReviews();
  }, [id]);

  /* ================= CART ================= */
  const handleAddToCart = () => {
    if (qty <= 0 || !product) return;

    addToCart({ ...product, qty });
    setAdded(true);
    setShowMiniCart(true);

    setTimeout(() => {
      setAdded(false);
      setShowMiniCart(false);
    }, 2000);
  };

  /* ================= BILL ================= */
  const price = product?.price ?? 0;
  const safeQty = qty ?? 0;

  const subtotal = price * safeQty;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  /* LIVE ANIMATION */
  useEffect(() => {
    let start = 0;

    const animate = () => {
      start += (total - start) * 0.2;
      setAnimatedTotal(start);

      if (Math.abs(total - start) > 0.5) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [total]);

  /* ================= QTY HANDLERS ================= */
  const increaseQty = () => setQty((p) => p + 1);
  const decreaseQty = () =>
    setQty((p) => (p > 0 ? p - 1 : 0));

  /* ================= REVIEWS ================= */
  const handleAddReview = async (data) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/reviews/${id}`,
        data
      );

      if (res.data?.review) {
        setReviews((prev) => [res.data.review, ...prev]);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleLike = async (reviewId) => {
    try {
      const res = await axios.patch(
        `${backendUrl}/api/reviews/${reviewId}/like`
      );

      setReviews((prev) =>
        prev.map((r) =>
          r._id === reviewId ? res.data.review : r
        )
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await axios.delete(
        `${backendUrl}/api/reviews/${reviewId}`
      );

      setReviews((prev) =>
        prev.filter((r) => r._id !== reviewId)
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  if (!product) {
    return (
      <div className="p-10 text-center">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf6ee] p-6">

      <div className="max-w-5xl mx-auto">

        {/* ================= PRODUCT ================= */}
        <div className="bg-white border rounded-2xl grid md:grid-cols-2 overflow-hidden mb-6">

          <img
            src={product.image}
            className="w-full h-full object-cover"
            alt={product.name}
          />

          <div className="p-6 flex flex-col gap-3">

            <h1 className="text-2xl">{product.name}</h1>

            <p className="text-gray-600">
              {product.description}
            </p>

            {/* ================= QTY CONTROL ================= */}
            <div className="flex items-center gap-3 mt-3">

              <button
                onClick={decreaseQty}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                -
              </button>

              <span className="px-3">{qty}</span>

              <button
                onClick={increaseQty}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                +
              </button>

            </div>

            <button
              onClick={handleAddToCart}
              disabled={qty === 0}
              className={`mt-3 px-4 py-2 text-white rounded ${
                qty === 0
                  ? "bg-gray-400"
                  : added
                  ? "bg-green-600"
                  : "bg-orange-500"
              }`}
            >
              {added ? "Added ✔" : "Add to Cart"}
            </button>

          </div>
        </div>

        {/* ================= BILL ================= */}
        <div className="bg-white border rounded-xl p-5 mb-6">

          <h2 className="font-semibold mb-3">Bill Summary</h2>

          <div className="flex justify-between">
            <span>Price</span>
            <span>Rs {price}</span>
          </div>

          <div className="flex justify-between">
            <span>Qty</span>
            <span>{qty}</span>
          </div>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>Rs {tax.toFixed(2)}</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>
              Rs {animatedTotal.toFixed(2)}
            </span>
          </div>

        </div>

        {/* ================= REVIEWS ================= */}
        <h2 className="text-lg mb-2">
          Reviews ({reviews.length})
        </h2>

        <RatingBreakdown reviews={reviews} />

        <div className="space-y-3 mt-4">
          {reviews.map((r) => (
            <ReviewItem
              key={r._id}
              review={r}
              onLike={() => handleLike(r._id)}
              onDelete={() => handleDelete(r._id)}
            />
          ))}
        </div>

        <div className="mt-6">
          <ReviewForm onSubmit={handleAddReview} />
        </div>

      </div>

      {/* ================= MINI CART ================= */}
      {showMiniCart && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg">
          🛒 Added to cart ({qty} items)
        </div>
      )}

    </div>
  );
};

export default ProductDetail;