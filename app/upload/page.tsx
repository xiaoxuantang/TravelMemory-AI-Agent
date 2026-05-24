import { PhotoUploader } from "../components/ui/PhotoUploader";

const moods = ["松弛", "浪漫", "治愈", "冒险"];

export default function UploadPage() {
  return (
    <main className="min-h-screen text-tm-text">
      <section className="tm-page">
        <header className="space-y-2">
          <p className="text-sm font-medium text-tm-muted">TravelMemory</p>
          <h1 className="text-2xl font-bold">上传一张你喜欢的旅行照片</h1>
          <p className="text-sm leading-6 text-tm-muted">
            默认使用第一张照片作为主图。你的照片只用于生成本次旅行记忆。
          </p>
        </header>

        <PhotoUploader />

        <section className="tm-card space-y-4 p-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-tm-text">城市</span>
            <input
              name="city"
              type="text"
              placeholder="例如：厦门"
              className="tm-input"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-tm-text">旅行日期</span>
            <input
              name="travelDate"
              type="date"
              className="tm-input"
            />
          </label>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-tm-text">旅行情绪</legend>
            <div className="grid grid-cols-2 gap-3">
              {moods.map((mood) => (
                <label
                  key={mood}
                  className="tm-chip"
                >
                  <input type="radio" name="mood" value={mood} className="sr-only" />
                  {mood}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <button
          type="button"
          className="tm-button-primary"
        >
          生成旅行记忆海报
        </button>
      </section>
    </main>
  );
}
