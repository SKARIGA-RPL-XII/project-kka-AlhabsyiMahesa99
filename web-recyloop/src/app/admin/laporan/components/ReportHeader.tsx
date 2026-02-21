type Props = {
  title: string;
  subtitle: string;
};

export function ReportHeader({ title, subtitle }: Props) {
  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-gray-500">{subtitle}</p>
    </div>
  );
}
