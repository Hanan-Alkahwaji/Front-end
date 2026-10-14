const PageHeader = ({ title, subtitle, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-navy/70 mt-1">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button
          onClick={onAction}
          className="w-full sm:w-auto bg-navy hover:bg-navy/85 text-white font-medium px-4 py-2.5 
          rounded-xl shadow-sm transition active:scale-95 text-sm flex items-center justify-center gap-2"
        >
           {actionLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
