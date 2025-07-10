import { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconBgColor: string;
  linkText?: string;
  linkHref?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  linkText = "View all",
  linkHref = "#",
}: StatsCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref}>
            <span className="font-medium text-primary hover:text-primary-dark">
              {linkText}
            </span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StatsCard;
