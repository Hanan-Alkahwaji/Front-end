import Button from "./Button";

export const ActionButtons = ({ onEdit, onDelete, actions = [] }) => {
  const defaultActions = [
    onEdit && { label: "Edit", variant: "soft", onClick: onEdit },
    onDelete && { label: "Delete", variant: "softDanger", onClick: onDelete },
  ].filter(Boolean);

  const allActions = [...defaultActions, ...actions];

  return (
    <div className="flex items-center gap-2">
      {allActions.map((action) => (
        <Button
          key={action.label}
          size="sm"
          variant={action.variant || "soft"}
          icon={action.icon}
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};