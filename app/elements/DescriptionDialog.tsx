import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck } from "lucide-react";

export default function DescriptionDialog({id}: {id: string}) {
    const { data, isPending, error } = useQuery({
        queryKey: ['tour', id],
        queryFn: () => fetch(`https://85.208.110.41/api/tours/${id}`).then((res) => res.json().then((data) => data.data)),
    })

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"link"} size={"sm"} className="p-0 text-yellow-700">
                    Подробнее
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-2xl max-h-[90vh] overflow-hidden">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-center text-gray-800 text-2xl">{data?.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-y-4 overflow-y-auto">
                    <div className="prose text-gray-800 overflow-y-auto max-h-[67vh]" dangerouslySetInnerHTML={{ __html: data?.description }} />

                    {data?.is_outdoor && <span className="inline-flex items-center text-green-600 mr-2"><CircleCheck className="w-4 h-4 mr-1" /> На улице</span>}
                    {data?.is_for_kids && <span className="inline-flex items-center text-green-600"><CircleCheck className="w-4 h-4 mr-1" /> Для детей</span>}
                </div>
                {/* <DialogFooter className="pb-5 max-w-[90vh] px-2 mt-2">
                    <Button type="button" className="text-black bg-gradient-to-br from-yellow-400 to-orange-400">
                        Забронировать
                    </Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}