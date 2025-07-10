import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface ActivityItemProps {
  icon: ReactNode;
  iconColor: string;
  title: string;
  description: string;
  time: string;
}

const ActivityItem = ({
  icon,
  iconColor,
  title,
  description,
  time,
}: ActivityItemProps) => {
  return (
    <li className="p-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className={`text-${iconColor}`}>
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="text-sm text-gray-500">{time}</div>
      </div>
    </li>
  );
};

export default ActivityItem;
