export interface Event {
  id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  state: string;
  flyerImage: string;
  ticketLink?: string;
  isPast?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface SoundCloudTrack {
  id: string;
  title: string;
  embedUrl: string;
}
