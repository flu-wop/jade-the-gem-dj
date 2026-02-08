interface SoundCloudPlayerProps {
  embedUrl: string;
  height?: number;
}

export default function SoundCloudPlayer({
  embedUrl,
  height = 166,
}: SoundCloudPlayerProps) {
  return (
    <div className="w-full">
      <iframe
        width="100%"
        height={height}
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={embedUrl}
        className="rounded-lg"
      ></iframe>
    </div>
  );
}
