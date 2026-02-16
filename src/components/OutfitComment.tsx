interface OutfitCommentProps {
  comment: string;
}

export function OutfitComment({ comment }: OutfitCommentProps) {
  if (!comment) return null;

  return (
    <div className="glass-light rounded-2xl px-5 py-4 shadow-glass-sm">
      <p className="flex items-center gap-2 text-sm font-medium text-white">
        <span>💬</span>
        <span>{comment}</span>
      </p>
    </div>
  );
}
