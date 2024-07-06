import { url } from "inspector";

interface InputObject {
  link: string;
  timestamp: number;
}

interface OutputObject {
  link: string;
  timetsamp: number;
  type: "video" | "article" | "podcast" | "research-paper";
  status: "todo" | "in-progress" | "done";
  domain: string;
  progress: number;
  imgUrl?: string;
  videoLength?: number; // microseconds?
}

// future content types for support: instagram reels / tiktok, spotify music?
// TODO: might need to refactor so that the type is visible before it is submitted?

const classifier = (obj: InputObject) => {
  let type = null;
  let thumbnailURL = null;

  const extractDomainPattern = new RegExp(
    "https?:\\/\\/(www\\.)?([^\\/]+)|www\\.([^\\/]+)"
  );

  const match = obj.link.match(extractDomainPattern);
  const domain = match ? match[2] || match[3] : null;
  console.log(domain);

  if (domain?.includes("youtube")) {
    type = "video"; // can be a video podcast too
    thumbnailURL = getYTThumbnail(obj.link);
  } else if (
    domain?.includes("podcasts.google") ||
    (domain?.includes("open.spotify") && obj.link.includes("/episode/"))
  ) {
    type = "podcast";
    // need to set icon color depending on google podcast or spotify
  } else if (domain?.includes("medium") || domain?.includes("substack")) {
    // could include an array of news domains
    // what if there's a domain called mediumfurniture&more.inc or smthn??
    type = "article";
  }
  return {
    link: obj.link,
    timestamp: obj.timestamp,
    domain: domain,
    status: "todo", // "in-progress" // "done"
    imgURL: thumbnailURL,
  };
};

const getYTThumbnail = (url: string) => {
  const videoIdMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );

  if (videoIdMatch && videoIdMatch[1]) {
    const videoId = videoIdMatch[1];
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/default.jpg`;
    return thumbnailUrl;
  }

  return null;
};

export default classifier;
