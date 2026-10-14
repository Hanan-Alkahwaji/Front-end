import loadingGif from "../assets/loading.gif";

export const Loader = ({ label = "Loading..." }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex flex-col items-center justify-center gap-1 py-10"
  >
    <img src={loadingGif} alt="" className="h-28 w-auto mix-blend-multiply" />
    <span className="text-sm font-medium text-navy/70">{label}</span>
  </div>
);
