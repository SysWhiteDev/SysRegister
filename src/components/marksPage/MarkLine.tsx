import { Mark } from "@/types";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ChevronUp } from "lucide-react";

export default function MarkLine({
  date,
  value,
  note,
  affectsAverage,
  type,
}: Mark) {
  const [isOpen, setIsOpen] = useState(false);
  const [parent] = useAutoAnimate();

  const markTable: { [key: string]: number } = {
    "1": 1,
    "1+": 1.25,
    "1½": 1.5,
    "2-": 1.75,
    "2": 2,
    "2+": 2.25,
    "2½": 2.5,
    "3-": 2.75,
    "3": 3,
    "3+": 3.25,
    "3½": 3.5,
    "4-": 3.75,
    "4": 4,
    "4+": 4.25,
    "4½": 4.5,
    "5-": 4.75,
    "5": 5,
    "5+": 5.25,
    "5½": 5.5,
    "6-": 5.75,
    "6": 6,
    "6+": 6.25,
    "6½": 6.5,
    "7-": 6.75,
    "7": 7,
    "7+": 7.25,
    "7½": 7.5,
    "8-": 7.75,
    "8": 8,
    "8+": 8.25,
    "8½": 8.5,
    "9-": 8.75,
    "9": 9,
    "9+": 9.25,
    "9½": 9.5,
    "10-": 9.75,
    "10": 10,
  };

  return (
    <div className="">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span
                className={` ${
                  !affectsAverage
                    ? "bg-blue-900"
                    : markTable[value] <= 5.5
                    ? "bg-red-600"
                    : markTable[value] <= 6.0
                    ? "bg-yellow-600"
                    : "bg-green-600"
                } w-14 h-14 text-xl flex rounded-full font-semibold justify-center items-center text-white`}
              >
                {value}
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-md">{type}</span>
                <span className="text-sm opacity-50">{date}</span>
              </div>
            </div>
            <ChevronUp size={20} className={`opacity-45 ${!isOpen ? "rotate-180" : "rotate-0"} transition-transform duration-500`}/>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="!w-full" ref={parent}>
          <div className="relative w-full mb-6">
            <div className=" bg-neutral-900 w-full p-4 rounded-md">
              <p className="text-sm">
                {note.length > 0 ? (
                  <div>
                    <p className="font-semibold text-white text-sm">
                      Commento del docente:
                    </p>
                    <span className="opacity-60">{note}</span>
                  </div>
                ) : (
                  <p className="opacity-60">
                    Il docente non ha inserito nessun commento
                  </p>
                )}
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
