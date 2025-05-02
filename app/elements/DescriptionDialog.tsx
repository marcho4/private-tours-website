import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

export default function DescriptionDialog({id}: {id: string}) {
    const { data, isPending, error } = useQuery({
        queryKey: ['tour', id],
        queryFn: () => fetch(`http://localhost:8080/tours/${id}`).then((res) => res.json().then((data) => data.data)),
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