import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/ScrollReveal";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  profile?: { display_name: string | null };
}

function StarRating({
  value,
  onChange,
  readonly = false,
  size = "h-5 w-5",
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
  size?: string;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${readonly ? "cursor-default" : "cursor-pointer"} transition-transform ${
            !readonly ? "hover:scale-110 active:scale-95" : ""
          }`}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => onChange?.(star)}
        >
          <Star
            className={`${size} transition-colors ${
              star <= (hover || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const name = review.profile?.display_name || "Anonymous";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const date = new Date(review.created_at).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start gap-3 mb-3">
        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm truncate">{name}</span>
            <span className="text-xs text-muted-foreground shrink-0">{date}</span>
          </div>
          <StarRating value={review.rating} readonly size="h-3.5 w-3.5" />
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}

export function ReviewSection({ roomId }: { roomId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [existingReview, setExistingReview] = useState<Review | null>(null);

  const fetchReviews = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch reviews error:", error);
        setReviews([]);
        setExistingReview(null);
        setRating(0);
        setComment("");
        return;
      }

      if (!data) {
        setReviews([]);
        setExistingReview(null);
        setRating(0);
        setComment("");
        return;
      }

      const userIds = [...new Set(data.map((review) => review.user_id))];
      const profilesResult = userIds.length
        ? await supabase.from("profiles").select("user_id, display_name").in("user_id", userIds)
        : { data: [] as Array<{ user_id: string; display_name: string | null }>, error: null };

      if (profilesResult.error) {
        console.error("Fetch reviewer profiles error:", profilesResult.error);
      }

      const profileMap = new Map<string, { display_name: string | null }>(
        (profilesResult.data ?? []).map(
          (profile): [string, { display_name: string | null }] => [
            profile.user_id,
            { display_name: profile.display_name },
          ]
        )
      );

      const enriched: Review[] = data.map((review) => ({
        ...review,
        profile: profileMap.get(review.user_id) ?? { display_name: null },
      }));

      setReviews(enriched);

      const mine = user ? enriched.find((review) => review.user_id === user.id) ?? null : null;
      setExistingReview(mine);
      setRating(mine?.rating ?? 0);
      setComment(mine?.comment ?? "");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setExistingReview(null);
    setRating(0);
    setComment("");
    fetchReviews();
  }, [roomId, user]);

  const withTimeout = async <T,>(promiseFactory: () => Promise<T>, ms = 12000): Promise<T> => {
    let timeoutId: number | undefined;

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => {
        reject(new Error("Request timed out. Please try again."));
      }, ms);
    });

    try {
      return await Promise.race([promiseFactory(), timeoutPromise]);
    } finally {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    }
  };

  const handleSubmit = async () => {
    if (!user || submitting) {
      if (!user) {
        toast.error("Please sign in to leave a review");
      }
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const trimmed = comment.trim();
    if (trimmed.length > 500) {
      toast.error("Review must be under 500 characters");
      return;
    }

    setSubmitting(true);
    console.log("Starting review submit", {
      existingReviewId: existingReview?.id ?? null,
      roomId,
      userId: user.id,
      rating,
      comment: trimmed || null,
    });

    try {
      if (existingReview) {
        const response = await withTimeout(async () =>
          await supabase
            .from("reviews")
            .update({ rating, comment: trimmed || null })
            .eq("id", existingReview.id)
            .select()
        );

        console.log("Review update response:", response);

        if (response.error) {
          toast.error("Failed to update review: " + response.error.message);
          return;
        }

        toast.success("Review updated!");
        await fetchReviews();
        return;
      }

      const response = await withTimeout(async () =>
        await supabase
          .from("reviews")
          .insert({
            room_id: roomId,
            user_id: user.id,
            rating,
            comment: trimmed || null,
          })
          .select()
      );

      console.log("Review insert response:", response);

      if (response.error) {
        if (response.error.code === "23505") {
          toast.error("You've already reviewed this room");
          await fetchReviews();
          return;
        }

        toast.error("Failed to submit review: " + response.error.message);
        return;
      }

      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      setExistingReview(null);
      await fetchReviews();
    } catch (err) {
      console.error("Review submission failed:", err);
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      console.log("Review submit finished");
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  return (
    <div className="mt-10">
      <ScrollReveal>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">
            Reviews{" "}
            <span className="text-muted-foreground font-normal">
              ({reviews.length})
            </span>
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              <span className="text-lg font-bold">{avgRating}</span>
              <span className="text-sm text-muted-foreground">avg</span>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Review Form */}
      <ScrollReveal delay={100}>
        <div className="bg-secondary/50 rounded-xl p-5 mb-6 border border-border/50">
          {user ? (
            <>
              <h3 className="text-sm font-semibold mb-3">
                {existingReview ? "Update your review" : "Write a review"}
              </h3>
              <div className="mb-3">
                <StarRating value={rating} onChange={setRating} />
              </div>
              <Textarea
                placeholder="Share your experience (optional, max 500 chars)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                className="mb-3 bg-background"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {comment.length}/500
                </span>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || rating === 0}
                  size="sm"
                >
                  {submitting
                    ? "Submitting…"
                    : existingReview
                    ? "Update Review"
                    : "Submit Review"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground mb-2">
                Sign in to leave a review — only verified users can rate
              </p>
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Reviews List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <ScrollReveal>
          <p className="text-center text-muted-foreground py-8 text-sm">
            No reviews yet — be the first to share your experience!
          </p>
        </ScrollReveal>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, i) => (
            <ScrollReveal key={review.id} delay={i * 60}>
              <ReviewCard review={review} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
