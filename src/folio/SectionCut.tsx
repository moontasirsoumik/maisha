type Props = {
  label?: string;
};

export function SectionCut({ label = 'A–A' }: Props) {
  return (
    <div className="cut" style={{ ['--cut' as string]: 0 }} aria-hidden="true">
      <div className="cut-line">
        <span className="cut-tag">{label}</span>
        <svg className="cut-svg" viewBox="0 0 1200 80" preserveAspectRatio="none">
          <path className="cut-path" d="M0 40 H1200" />
        </svg>
        <span className="cut-tag cut-tag--end">{label}</span>
      </div>

    </div>
  );
}
