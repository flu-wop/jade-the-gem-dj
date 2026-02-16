interface Props {
  src: string;
  /** visual=true → tall waveform player (300px). false → compact bar (166px) */
  visual?: boolean;
  title?: string;
}

export default function SoundCloudEmbed({
  src,
  visual = false,
  title = "SoundCloud player",
}: Props) {
  const height = visual ? 300 : 166;

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <iframe
        title={title}
        width="100%"
        height={height}
        allow="autoplay"
        src={src}
        className="block w-full"
        style={{ border: "none" }}
      />
    </div>
  );
}
