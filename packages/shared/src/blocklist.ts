// Domains that are obviously not a B2B-manufacturer reference candidate.
// Discovery filters these out at intake; the Scorer (later milestone) refines
// the gray-zone cases per PLAN.md D13.
export const BLOCKED_DOMAINS = new Set<string>([
  // Portals / blog hosts / wikis
  "naver.com", "daum.net", "kakao.com", "google.com", "bing.com",
  "tistory.com", "blogspot.com", "blogger.com", "wordpress.com",
  "brunch.co.kr", "medium.com", "velog.io", "notion.so", "notion.site",
  "wikipedia.org", "namu.wiki", "wikiwand.com",

  // Social / video
  "youtube.com", "youtu.be", "facebook.com", "instagram.com",
  "twitter.com", "x.com", "linkedin.com", "tiktok.com",
  "threads.net", "pinterest.com", "reddit.com",

  // Recruitment / company-info aggregators (not the company themselves)
  "jobkorea.co.kr", "saramin.co.kr", "wanted.co.kr", "rocketpunch.com",
  "indeed.com", "kr.indeed.com", "jobplanet.co.kr", "catch.co.kr",
  "incruit.com", "jasoseol.com",

  // Shopping / commerce
  "coupang.com", "gmarket.co.kr", "11st.co.kr", "auction.co.kr",
  "ssg.com", "tmon.co.kr", "wemakeprice.com", "interpark.com",
  "amazon.com", "alibaba.com", "aliexpress.com", "taobao.com",

  // News / press outlets (frequent in Naver search but not company sites)
  "chosun.com", "joongang.co.kr", "donga.com", "hani.co.kr",
  "khan.co.kr", "mk.co.kr", "edaily.co.kr", "etnews.com",
  "hankyung.com", "fnnews.com", "yna.co.kr", "yonhapnews.co.kr",
  "newsis.com", "newdaily.co.kr", "ohmynews.com", "pressian.com",
  "kmib.co.kr", "munhwa.com", "seoul.co.kr", "asiae.co.kr",
  "ajunews.com", "businesspost.co.kr", "biz.chosun.com",
  "zdnet.co.kr", "ddaily.co.kr", "itworld.co.kr", "ithome.com",
  "newsen.com", "sportsworldi.com", "sportsseoul.com", "sportschosun.com",
  "mt.co.kr", "moneys.co.kr", "biz.heraldcorp.com", "heraldcorp.com",
  "nocutnews.co.kr", "sbs.co.kr", "kbs.co.kr", "mbc.co.kr", "ytn.co.kr",
  "tvchosun.com", "ichannela.com", "jtbc.co.kr",

  // Government / public agencies
  "go.kr", "gov.kr", "kotra.or.kr", "kita.net", "kosa.or.kr",
  "kbiz.or.kr", "fki.or.kr", "smes.go.kr",

  // Misc
  "github.com", "gitlab.com", "stackoverflow.com",
  "slideshare.net", "scribd.com", "issuu.com",
  "kr.linkedin.com",
]);

export function isBlockedDomain(domain: string): boolean {
  if (BLOCKED_DOMAINS.has(domain)) return true;
  // Block any *.go.kr / *.gov.kr (government) and any *.ac.kr (academic).
  if (domain.endsWith(".go.kr") || domain.endsWith(".gov.kr")) return true;
  if (domain.endsWith(".ac.kr")) return true;
  return false;
}
