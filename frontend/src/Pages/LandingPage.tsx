import { ErrorNotificationHandler, SuccessNotificationHandler } from "../utils/NotificationHandler";

export const LandingPage = () => {
  return (
    <div
      className="text-2xl flex flex-col flex-1"
    >
      this is the landing page
      <button
      className="p-2 px-6 bg-slate-800 rounded-full"
      onClick={(e) => {
        e.preventDefault();
        SuccessNotificationHandler("itachi");
        ErrorNotificationHandler("Uchiha");
      }}
      >
        click me
      </button>
    </div>
  );
}