// Replace YOUTUBE_VIDEO_ID with your real YouTube video ID when ready
const YOUTUBE_VIDEO_ID = "PLACEHOLDER_ID";

export default function VideoSection() {
  const isPlaceholder = YOUTUBE_VIDEO_ID === "PLACEHOLDER_ID";

  return (
    <section className="py-24 px-6 bg-surface border-y border-plum/10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label">Feel the Energy</p>
          <h2 className="section-title">
            Watch <span className="text-holo">Live</span>
          </h2>
        </div>

        {isPlaceholder ? (
          <div className="aspect-video bg-surface-2 border border-plum/20 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 border border-jade/30 bg-jade/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-jade-light ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-mist/30 text-sm font-body tracking-wider">Live set video coming soon</p>
          </div>
        ) : (
          <div className="aspect-video border border-plum/20 overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
              title="DJ Jade the Gem Live Set"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </section>
  );
}
