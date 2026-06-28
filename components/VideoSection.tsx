const YOUTUBE_VIDEO_ID = "kyzQXSANPmo";

export default function VideoSection() {
  return (
    <section className="py-24 px-6 bg-surface/70 border-y border-plum/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label">Media</p>
          <h2 className="section-title">
            Featured <span className="text-holo">In</span>
          </h2>
        </div>

        <div className="aspect-video border border-plum/20 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
            title="DJ Jade the Gem — Featured Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
