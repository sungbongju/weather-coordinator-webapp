/** 네이버 이미지 검색 API 응답 아이템 */
export interface NaverImageItem {
  title: string;
  link: string;
  thumbnail: string;
  sizeheight: string;
  sizewidth: string;
}

export interface NaverImageResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverImageItem[];
}

/** 앱 내부에서 사용하는 이미지 타입 */
export interface ClothingImage {
  title: string;
  link: string;
  thumbnail: string;
  width: number;
  height: number;
}
