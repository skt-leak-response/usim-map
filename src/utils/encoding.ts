export function encodeIds(ids: number[]): string {
  // ID 배열을 JSON 문자열로 변환 후 Base64 인코딩
  const jsonString = JSON.stringify(ids);
  return btoa(jsonString);
}

export function decodeIds(encodedIds: string): number[] {
  try {
    // Base64 디코딩 후 JSON 파싱
    const jsonString = atob(encodedIds);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error decoding IDs:', error);
    return [];
  }
}
