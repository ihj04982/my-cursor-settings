interface SectionHeaderProps {
  title: string;
  count: number;
  itemLabel: string;
}

export default function SectionHeader({ title, count, itemLabel }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold mb-2">{title}</h2>
      <p className="text-slate-400">
        총 {count}개의 {itemLabel}이(가) 설정되어 있습니다.
      </p>
    </div>
  );
}
