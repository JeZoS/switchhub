"use client";

import { createZinterviewOpening } from "@/actions/opening";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutationData } from "@/hooks/useMutationData";
import useOrgStore from "@/hooks/useOrganization";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
    openingDetails: {
        title: string;
    };
    openingId: string;
}

const GenerateZinterviewOpening = ({ openingDetails, openingId }: Props) => {
    const { register, handleSubmit, setValue } = useForm<{
        JD: string;
        isTechnical: boolean;
        apiKey: string;
    }>({
        defaultValues: { JD: "", isTechnical: false },
    });

    useEffect(() => {
        setValue("JD", openingDetails.title);
    }, [openingDetails.title]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const { mutate, isPending } = useMutationData(
        ["CreateZinterviewOpening"],
        (data) => createZinterviewOpening(data),
        "get-opening-" + openingId,
        () => {
            toast({
                title: "Success",
                description: "Opening created successfully",
            });
            setIsDialogOpen(false);
        }
    );

    const onSubmit = (data: { JD: string; isTechnical: boolean; apiKey: string }) => {
        mutate({
            JD: data.JD,
            isTechnical: data.isTechnical,
            openingId,
            apiKey: data.apiKey,
        });
    };

    const { orgId } = useOrgStore((state) => state);

    const onOpenChange = (isOpen: boolean) => {
        if (!orgId?.ziOrgId) {
            toast({
                title: "Error",
                description: "Integrate Zinterview.ai with your organization first",
            });
            return;
        }
        setIsDialogOpen(isOpen);
    };

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={onOpenChange}
        >
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                    // onClick={() => checkAndOpenDialog()}
                    style={{
                        border: "1px solid #333333",
                    }}
                >
                    Generate Zinterview Opening
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Zinterview.ai</DialogTitle>
                    <DialogDescription>
                        Fill in the details to create a new opening in zinterview.ai
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh]">
                    <div className="grid gap-2">
                        <div className="flex w-full justify-between gap-2 items-center">
                            <Label htmlFor="JD">JD</Label>
                            <Textarea
                                id="JD"
                                placeholder="Enter the job title"
                                {...register("JD")}
                            />
                        </div>
                        <div className="flex w-full gap-4 items-center">
                            <Label htmlFor="isTechnical">Is Technical?</Label>
                            <Input
                                id="isTechnical"
                                type="checkbox"
                                {...register("isTechnical")}
                                className="h-5 w-5"
                            />
                        </div>
                        {/* <div className="flex w-full gap-4 items-center">
                            <Label htmlFor="apiKey">API_KEY</Label>
                            <Input
                                id="apiKey"
                                type="text"
                                {...register("apiKey")}
                            />
                        </div> */}
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending}
                    >
                        {isPending ? "Creating..." : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default GenerateZinterviewOpening;
