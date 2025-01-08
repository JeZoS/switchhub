"use client";

import { createOpening } from "@/actions/opening";
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
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";

const CreateOpening = ({ organizationId }: { organizationId: string }) => {
    const { register, handleSubmit } = useForm<{ title: string; description: string }>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const { mutate, isPending } = useMutationData(
        ["CreateOpening"],
        (data) => createOpening(data),
        "get-openings-" + organizationId,
        () => {
            toast({
                title: "Success",
                description: "Opening created successfully",
            });
            setIsDialogOpen(false);
        }
    );

    const onSubmit = (data: { title: string; description: string }) => {
        if (data.title === "" || data.description === "") {
            toast({
                title: "Error",
                description: "Please fill all the fields",
            });
            return;
        }
        mutate({
            title: data.title,
            description: data.description,
            organizationId: organizationId,
        });
    };

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
        >
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Create New Opening
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Opening</DialogTitle>
                    <DialogDescription>Fill in the details to create a new opening.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-[60vh]">
                    <div className="grid gap-2">
                        <div className="flex w-full justify-between gap-2 items-center">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="JD"
                                placeholder="Enter the job title"
                                required
                                {...register("title")}
                            />
                        </div>
                        <div className="flex w-full gap-4 items-center">
                            <Label htmlFor="Description">Description</Label>
                            <Textarea
                                id="Description"
                                required
                                placeholder="Enter the job description"
                                {...register("description")}
                            />
                        </div>
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

export default CreateOpening;
