export async function testDBConnection() {
  try {
    const response = await fetch('/api/db-test');
    if (!response.ok) {
      throw new Error(`API エラー: ${response.status}`);
    }
    const data = await response.json();
    console.log("DB接続テスト結果:", data);
    return data;
  } catch (error) {
    console.error("APIリクエストエラー:", error);
    throw error;
  }
}