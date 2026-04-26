import React, { useContext, useState, useEffect, useMemo } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    removeFromCart,
    clearCart,
    user,
    setCartItems,
  } = useContext(CartContext);

  // ✅ ALWAYS SAFE ARRAY
  const safeCartItems = useMemo(
    () => (Array.isArray(cartItems) ? cartItems : []),
    [cartItems]
  );

  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewInput, setReviewInput] = useState({
    name: user?.name || "",
    comment: "",
    rating: "",
  });
  const [loadingReview, setLoadingReview] = useState(false);

  // ✅ TOTAL (SAFE)
  const totalPricePKR = useMemo(() => {
    return safeCartItems.reduce(
      (acc, item) =>
        acc + (item.price || 0) * (item.quantity || 0),
      0
    );
  }, [safeCartItems]);

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    const productId = safeCartItems[0]?._id;
    if (!productId) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3200/api/reviews/${productId}`
        );
        setReviews(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [safeCartItems]);

  // ================= INPUT HANDLER =================
  const handleReviewChange = (field, value) => {
    setReviewInput((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ================= SUBMIT REVIEW =================
  const submitReview = async () => {
    const productId = safeCartItems[0]?._id;
    if (!productId) return;

    if (!reviewInput.comment || !reviewInput.rating) {
      return alert("Fill all fields!");
    }

    setLoadingReview(true);

    try {
      const res = await axios.post(
        `http://localhost:3200/api/reviews/${productId}`,
        {
          name: reviewInput.name || user?.name || "Anonymous",
          comment: reviewInput.comment,
          rating: Number(reviewInput.rating),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      setReviews((prev) => [res.data, ...(prev || [])]);

      setReviewInput({
        name: user?.name || "",
        comment: "",
        rating: "",
      });

      setShowReviewForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add review");
    } finally {
      setLoadingReview(false);
    }
  };

  // ================= UPDATE QUANTITY =================
  const updateQuantity = (id, newQty) => {
    if (!id || newQty < 1) return;

    setCartItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];

      return safePrev.map((item) =>
        item._id === id
          ? { ...item, quantity: newQty }
          : item
      );
    });
  };

  // ================= EMPTY CART =================
  if (safeCartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">
          Your cart is empty
        </h2>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600"
        >
          Go Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        {safeCartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center mb-4 border-b pb-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              <div>
                <h3 className="font-semibold">{item.name}</h3>

                <input
                  type="number"
                  min="1"
                  value={item.quantity || 1}
                  onChange={(e) =>
                    updateQuantity(
                      item._id,
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="border px-3 py-1 rounded w-20 mt-1"
                />
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="font-bold text-orange-500">
                PKR: {(item.price || 0) * (item.quantity || 0)}
              </span>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mb-6 border-t pt-4">
          <span className="font-bold text-xl">Total:</span>
          <span className="font-bold text-2xl text-orange-500">
            PKR: {totalPricePKR}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-6">
          <button
            onClick={clearCart}
            className="w-full sm:w-auto px-6 py-3 border border-orange-400 text-orange-500 font-medium rounded-xl hover:bg-orange-50"
          >
            🗑️ Clear Cart
          </button>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-gray-100 rounded-2xl relative">
        <h2 className="text-2xl font-bold mb-4">
          Customer Reviews
        </h2>

        {!showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="absolute top-6 right-6 px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-600"
          >
            Add Review
          </button>
        )}

        {showReviewForm && safeCartItems[0] && (
          <div className="flex flex-col gap-2 bg-white p-4 rounded shadow-md mb-4">
            {!user && (
              <input
                type="text"
                placeholder="Your Name"
                value={reviewInput.name}
                onChange={(e) =>
                  handleReviewChange("name", e.target.value)
                }
                className="border px-3 py-2 rounded"
              />
            )}

            <textarea
              placeholder="Your Comment"
              value={reviewInput.comment}
              onChange={(e) =>
                handleReviewChange("comment", e.target.value)
              }
              className="border px-3 py-2 rounded"
            />

            <select
              value={reviewInput.rating}
              onChange={(e) =>
                handleReviewChange("rating", e.target.value)
              }
              className="border px-3 py-2 rounded"
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                onClick={submitReview}
                disabled={loadingReview}
                className="bg-green-500 text-white px-3 py-2 rounded"
              >
                {loadingReview ? "Adding..." : "Submit"}
              </button>

              <button
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-300 px-3 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {reviews.length > 0 ? (
            reviews.map((r, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold">
                    {r.name?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-gray-400 text-xs">
                      {dayjs(r.createdAt).format("DD MMM YYYY")}
                    </p>
                  </div>

                  <div className="ml-auto text-yellow-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < r.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mt-2">
                  {r.comment}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">
              No reviews yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;