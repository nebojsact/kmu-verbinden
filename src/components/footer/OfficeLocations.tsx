import { Mail, Phone, Clock, MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const offices = [
  {
    city: "Zürich",
    phone: "044 / 797 89 24",
    email: "zuerich@kmu-verein.ch",
    isHeadOffice: true,
    address: [
      "Geschäftsstelle und Rechtsdienst",
      "c/o meinJurist GmbH",
      "Richtistrasse 2",
      "8304 Wallisellen"
    ]
  },
  {
    city: "Genf",
    phone: "022 / 518 05 09",
    email: "genf@kmu-verein.ch"
  },
  {
    city: "Luzern",
    phone: "041 / 588 22 49",
    email: "luzern@kmu-verein.ch"
  },
  {
    city: "Bern",
    phone: "031 / 528 05 51",
    email: "bern@kmu-verein.ch"
  }
];

export const OfficeLocations = () => {
  return (
    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
      <TooltipProvider>
        {offices.map((office) => (
          <Tooltip key={office.city}>
            <TooltipTrigger className="hover:text-swiss-red transition-colors">
              {office.city}
            </TooltipTrigger>
            <TooltipContent className="bg-swiss-darkblue border-swiss-red p-3">
              <div className="space-y-2">
                {office.isHeadOffice && office.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-swiss-red mt-1" />
                    <div className="flex flex-col">
                      {office.address.map((line, index) => (
                        <span key={index}>{line}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-swiss-red" />
                  <span>{office.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-swiss-red" />
                  <a href={`mailto:${office.email}`} className="hover:text-swiss-red">
                    {office.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-swiss-red" />
                  <span>Mo-Fr: 08:00-18:00 Uhr</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};