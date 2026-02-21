import { ReportMessage as ReportMessageType } from "../types/report";

type Props = {
  message: ReportMessageType;
};

export function ReportMessage({ message }: Props) {
  if (!message) return null;

  return (
    <div
      className={`rounded-xl border px-4 py-3 text-sm font-medium ${
        message.type === "success"
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-700"
      }`}
    >
      {message.text}
    </div>
  );
}
